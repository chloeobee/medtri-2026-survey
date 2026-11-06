// 將本檔貼到正式回覆試算表的綁定 Apps Script 專案。
var SATISFACTION_REPORT_TAB = '年度滿意度';

function setupSatisfactionReport() {
  var props = PropertiesService.getScriptProperties();
  var productionSheetId = props.getProperty('ENVIRONMENT') === 'production' && props.getProperty('SHEET_ID');
  var spreadsheet = productionSheetId
    ? SpreadsheetApp.openById(productionSheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet || spreadsheet.getSpreadsheetTimeZone() !== 'Asia/Taipei') {
    throw new Error('請在正式試算表的 Apps Script 執行，並將試算表時區設為台北。');
  }
  var source = spreadsheet.getSheetByName('網站回覆');
  var ratings = ['整體服務滿意度', '產品滿意度', '物流服務滿意度'];
  if (!source || source.getRange('A1').getValue() !== '接收時間' ||
      source.getRange('C1').getValue() !== '環境' ||
      source.getRange('G1').getValue() !== '產品使用情況' ||
      JSON.stringify(source.getRange('J1:L1').getValues()[0]) !== JSON.stringify(ratings)) {
    throw new Error('網站回覆工作表的欄位與問卷格式不符。');
  }

  var report = spreadsheet.getSheetByName(SATISFACTION_REPORT_TAB) ||
    spreadsheet.insertSheet(SATISFACTION_REPORT_TAB);
  var sourceName = "'網站回覆'!";
  var criteria = [
    sourceName + 'C2:C,"production"',
    sourceName + 'G2:G,"有使用"',
    sourceName + 'A2:A,">="&DATE(YEAR(TODAY()),1,1)',
    sourceName + 'A2:A,"<"&DATE(YEAR(TODAY())+1,1,1)'
  ].join(',');

  var metrics = ratings.map(function(label, index) {
    var row = index + 4;
    var col = ['J', 'K', 'L'][index];
    function count(score) {
      return 'COUNTIFS(' + criteria + ',' + sourceName + col + '2:' + col + ',' + score + ')';
    }
    return [
      label,
      '=' + [1, 2, 3, 4, 5].map(count).join('+'),
      '=' + [4, 5].map(count).join('+'),
      '=IF(B' + row + '=0,"",C' + row + '/B' + row + ')',
      '=IF(B' + row + '=0,"尚無評分",IF(C' + row + '*100>B' + row + '*94,"已超過",IF(C' + row + '*100=B' + row + '*94,"等於目標","低於目標")))'
    ];
  });

  report.getRange('A1').setValue('醫兆年度滿意度');
  report.getRange('A2').setFormula('=YEAR(TODAY())&" 年正式回覆｜4 或 5 分占有效評分比例｜目標超過 94%"');
  report.getRange('A3:E3').setValues([['項目', '有效評分', '給 4 或 5 分', '滿意度', '目標狀態']]);
  report.getRange('A4:E6').setValues(metrics);
  report.getRange('D4:D6').setNumberFormat('0.00%');
  report.getRange('A3:E3').setBackground('#007a42').setFontColor('#ffffff').setFontWeight('bold');
  report.setColumnWidth(1, 190);
  report.setFrozenRows(3);
  props.setProperty('SATISFACTION_REPORT_SHEET_ID', spreadsheet.getId());
}

function installHourlySatisfactionEmail() {
  var config = satisfactionEmailConfig_();
  if (!SpreadsheetApp.openById(config.sheetId).getSheetByName(SATISFACTION_REPORT_TAB)) {
    throw new Error('請先建立年度滿意度工作表。');
  }
  if (ScriptApp.getProjectTriggers().some(function(trigger) {
    return trigger.getHandlerFunction() === 'sendHourlySatisfactionEmail';
  })) return;
  ScriptApp.newTrigger('sendHourlySatisfactionEmail').timeBased().everyHours(1).create();
}

function sendHourlySatisfactionEmail() {
  var config = satisfactionEmailConfig_();
  var report = SpreadsheetApp.openById(config.sheetId).getSheetByName(SATISFACTION_REPORT_TAB);
  if (!report) throw new Error('找不到年度滿意度工作表。');
  var rows = report.getRange('A4:E6').getValues();
  var lines = rows.map(function(row) {
    if (!Number.isInteger(row[1]) || !Number.isInteger(row[2]) ||
        (row[1] !== 0 && !Number.isFinite(row[3]))) {
      throw new Error('年度滿意度報表計算異常。');
    }
    var rate = row[1] ? (row[3] * 100).toFixed(2) + '%' : '—';
    return row[0] + '　' + rate + '（' + row[2] + '／' + row[1] + '）　' + row[4];
  });
  var timestamp = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm');
  MailApp.sendEmail({
    to: config.recipient,
    subject: '醫兆年度滿意度摘要｜' + timestamp,
    body: [report.getRange('A2').getDisplayValue(), '統計時間 ' + timestamp + '（台北）']
      .concat(lines, ['', '查看報表 https://docs.google.com/spreadsheets/d/' + config.sheetId + '/edit#gid=' + report.getSheetId()])
      .join('\n')
  });
}

function satisfactionEmailConfig_() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('SATISFACTION_REPORT_SHEET_ID');
  var recipient = (props.getProperty('SATISFACTION_REPORT_EMAIL') || '').trim();
  if (!sheetId) throw new Error('請先執行 setupSatisfactionReport。');
  if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(recipient)) {
    throw new Error('請在指令碼屬性 SATISFACTION_REPORT_EMAIL 設定一個收件地址。');
  }
  return { sheetId: sheetId, recipient: recipient };
}

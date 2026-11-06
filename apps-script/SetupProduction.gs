function setupProduction() {
  var props = PropertiesService.getScriptProperties();
  var environment = props.getProperty('ENVIRONMENT');
  var sheetId = props.getProperty('SHEET_ID');
  if ((environment && environment !== 'production') || (sheetId && environment !== 'production') ||
      !SURVEY_CONFIG.environments.production.enabled || !SURVEY_CONFIG.version.endsWith('-prod')) {
    throw new Error('請在獨立的正式版 Apps Script 專案初始化。');
  }
  if (!sheetId) {
    var spreadsheet = SpreadsheetApp.create(SURVEY_CONFIG.title + '｜正式回覆');
    spreadsheet.setSpreadsheetTimeZone('Asia/Taipei');
    spreadsheet.setSpreadsheetLocale('zh_TW');
    var tab = spreadsheet.getSheets()[0];
    tab.setName('網站回覆');
    tab.appendRow(HEADERS);
    tab.setFrozenRows(1);
    props.setProperties({ ENVIRONMENT: 'production', SHEET_ID: spreadsheet.getId(), ACCEPTING: 'false' });
  }
  setupSatisfactionReport();
  console.log('正式試算表 https://docs.google.com/spreadsheets/d/' + props.getProperty('SHEET_ID') + '/edit');
}

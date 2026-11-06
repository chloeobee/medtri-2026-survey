/** 先執行 setupTest()，僅建立測試試算表；不會建立正式環境或 Google 表單。 */
var HEADERS = ['接收時間', '回覆ID', '環境', '問卷版本', '醫療院所', '所屬單位', '產品使用情況', '使用產品', '其他產品', '整體服務滿意度', '產品滿意度', '物流服務滿意度', '其他意見', '產品興趣', '其他產品興趣', '用戶端提交時間', '內容摘要'];

function setupTest() {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('ENVIRONMENT') && props.getProperty('ENVIRONMENT') !== 'test') throw new Error('此專案不是測試環境。');
  props.setProperty('ENVIRONMENT', 'test');
  props.setProperty('ACCEPTING', 'false');
  if (!props.getProperty('SHEET_ID')) {
    var ss = SpreadsheetApp.create(SURVEY_CONFIG.title + '｜長官測試資料（非正式）');
    var tab = ss.getSheets()[0]; tab.setName('網站回覆'); tab.appendRow(HEADERS); tab.setFrozenRows(1);
    tab.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    props.setProperty('SHEET_ID', ss.getId());
  }
  console.log('測試試算表：https://docs.google.com/spreadsheets/d/' + props.getProperty('SHEET_ID') + '/edit');
  console.log('確認後將指令碼屬性 ACCEPTING 設為 true；DAILY_LIMIT 可選，預設 500。');
}

function doGet() {
  // 僅公開不含資料的健康狀態，不提供回覆查詢 API。
  var props = PropertiesService.getScriptProperties();
  return json_({ service: 'MedTri Survey', version: SURVEY_CONFIG.version, environment: props.getProperty('ENVIRONMENT'), accepting: props.getProperty('ACCEPTING') === 'true' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json_({ ok: false, code: 'BUSY' });
  try { return json_(receive_(e)); }
  catch (ex) { console.error('接收失敗：' + (ex.code || 'INTERNAL')); return json_({ ok: false, code: ex.code || 'INTERNAL' }); }
  finally { lock.releaseLock(); }
}

function reject_(code) { var ex = new Error(code); ex.code = code; throw ex; }
function json_(body) { return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON); }
function safeCell_(value) {
  var text = String(value == null ? '' : value);
  return /^[\s]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text) ? "'" + text : text;
}

function receive_(e) {
  var raw = e && e.postData && e.postData.contents;
  if (typeof raw !== 'string' || raw.length > 16000) reject_('INVALID_REQUEST');
  var p; try { p = JSON.parse(raw); } catch (_) { reject_('INVALID_REQUEST'); }
  if (!p || typeof p !== 'object' || Array.isArray(p)) reject_('INVALID_REQUEST');
  var props = PropertiesService.getScriptProperties(), env = props.getProperty('ENVIRONMENT');
  // 每個 Apps Script 專案僅接收自己的環境；環境與表單版本均由伺服器核對。
  if (!['test', 'production'].includes(env) || p.environment !== env || !SURVEY_CONFIG.environments[env].enabled) reject_('ENVIRONMENT_MISMATCH');
  if (p.version !== SURVEY_CONFIG.version || p.schemaVersion !== SURVEY_CONFIG.schemaVersion) reject_('VERSION_MISMATCH');
  if (typeof p.responseId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(p.responseId)) reject_('INVALID_ID');
  if (p.website !== '' || !Number.isFinite(p.startedAt) || Date.now() - p.startedAt < 2000 || p.startedAt > Date.now()) reject_('INVALID_REQUEST');
  if (typeof p.submittedAt !== 'string' || !Number.isFinite(Date.parse(p.submittedAt))) reject_('INVALID_REQUEST');
  if (!p.answers || typeof p.answers !== 'object' || Array.isArray(p.answers)) reject_('INVALID_FIELDS');
  // 先驗證原始資料型別，再正規化。避免數字、物件或缺漏陣列被默默接受。
  if (SurveyCore.validate(SURVEY_CONFIG, p.answers).length) reject_('INVALID_FIELDS');
  var answers = SurveyCore.normalize(SURVEY_CONFIG, p.answers);
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(answers)).map(function(b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join('');
  var sheetId = props.getProperty('SHEET_ID'); if (!sheetId) reject_('NOT_CONFIGURED');
  var tab = SpreadsheetApp.openById(sheetId).getSheetByName('網站回覆'); if (!tab) reject_('NOT_CONFIGURED');
  if (JSON.stringify(tab.getRange(1, 1, 1, HEADERS.length).getValues()[0]) !== JSON.stringify(HEADERS)) reject_('SCHEMA_MISMATCH');
  // 在鎖內查詢永久回覆 ID；逾時或斷線後重試，只回傳既有收據，不再新增。
  var last = tab.getLastRow();
  var match = last > 1 ? tab.getRange(2, 2, last - 1, 1).createTextFinder(p.responseId).matchEntireCell(true).findNext() : null;
  if (match) {
    var existing = tab.getRange(match.getRow(), 1, 1, HEADERS.length).getValues()[0];
    if (existing[HEADERS.length - 1] !== digest) reject_('ID_CONFLICT');
    return { ok: true, duplicate: true, responseId: p.responseId, environment: env, receivedAt: new Date(existing[0]).toISOString() };
  }
  if (props.getProperty('ACCEPTING') !== 'true') reject_('CLOSED');
  var now = new Date(), day = Utilities.formatDate(now, 'Asia/Taipei', 'yyyy-MM-dd');
  // 以實際資料列計數，避免屬性計數器與寫入結果不同步。
  var todayCount = last > 1 ? tab.getRange(2, 1, last - 1, 1).getValues().filter(function(row) { return Utilities.formatDate(new Date(row[0]), 'Asia/Taipei', 'yyyy-MM-dd') === day; }).length : 0;
  var configuredLimit = props.getProperty('DAILY_LIMIT');
  var limit = configuredLimit ? Number(configuredLimit) : SURVEY_CONFIG.environments[env].dailyLimit;
  if (!Number.isInteger(limit) || limit < 1) reject_('NOT_CONFIGURED');
  if (todayCount >= limit) reject_('DAILY_LIMIT');
  var row = [now, p.responseId, env, p.version, answers.hospital, answers.unit, answers.usage, (answers.products || []).join('、'), answers.otherProduct, answers.serviceRating, answers.productRating, answers.logisticsRating, answers.comment, (answers.interests || []).join('、'), answers.otherInterest, p.submittedAt, digest];
  // 接收時間保留 Date，其餘文字皆防止試算表公式注入。
  tab.appendRow([row[0]].concat(row.slice(1).map(safeCell_)));
  SpreadsheetApp.flush();
  return { ok: true, duplicate: false, responseId: p.responseId, environment: env, receivedAt: now.toISOString() };
}

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const c = require('../config.js'), core = require('../core.js');
const using = () => ({ hospital: '測試醫院', unit: '檢驗科', usage: '有使用', products: ['ARKRAY Urine'], serviceRating: '5', productRating: '4', logisticsRating: '3', comment: '' });
const notUsing = usage => ({ hospital: '自填診所', unit: '其他', usage, interests: [] });
test('三種使用情況各走正確分支', () => {
  assert.deepEqual(core.steps(c, using()).map(s => s.id), ['profile', 'usage', 'products', 'ratings']);
  for (const usage of ['沒有使用', '不確定']) assert.deepEqual(core.steps(c, notUsing(usage)).map(s => s.id), ['profile', 'usage', 'interests']);
});
test('未預選單位與使用情況；所有基本必填都需完成', () => {
  assert.deepEqual(core.validate(c, { hospital: '', unit: '', usage: '' }).map(e => e.field), ['hospital', 'unit', 'usage']);
  assert.equal(core.validate(c, { ...notUsing('沒有使用'), hospital: '  ' }).length, 1);
});
test('搜尋清單以外的院所可以填寫', () => assert.equal(core.validate(c, notUsing('沒有使用')).length, 0));
test('使用者必選產品與全部三項 1–5 分評分', () => {
  assert.equal(core.validate(c, using()).length, 0);
  for (const field of ['serviceRating', 'productRating', 'logisticsRating']) {
    for (const value of ['', '0', '6', '無法評價', 5]) assert.ok(core.validate(c, { ...using(), [field]: value }).some(e => e.field === field));
  }
  assert.ok(core.validate(c, { ...using(), products: [] }).length);
});
test('複選拒絕未列出、重複或錯誤格式的選項', () => {
  for (const products of [['不存在'], ['Liaison', 'Liaison'], 'Liaison', null]) assert.ok(core.validate(c, { ...using(), products }).length);
});
test('其他產品與興趣選取後必須補充文字', () => {
  for (const [base, id, otherId] of [[using(), 'products', 'otherProduct'], [notUsing('沒有使用'), 'interests', 'otherInterest']]) {
    assert.ok(core.validate(c, { ...base, [id]: ['其他'] }).length);
    assert.equal(core.validate(c, { ...base, [id]: ['其他'], [otherId]: '自訂產品' }).length, 0);
    assert.ok(core.validate(c, { ...base, [id]: ['其他'], [otherId]: '長'.repeat(201) }).length);
  }
});
test('興趣題可略過，無興趣與其餘選項雙向互斥', () => {
  const none = c.fields.find(f => f.id === 'interests').exclusive;
  assert.equal(core.validate(c, notUsing('不確定')).length, 0);
  assert.deepEqual(core.toggle(['CBC'], none, true, none), [none]);
  assert.deepEqual(core.toggle([none], 'CBC', true, none), ['CBC']);
  assert.ok(core.validate(c, { ...notUsing('沒有使用'), interests: [none, 'CBC'] }).length);
});
test('切換分流後剔除另一分支資料與未勾選其他的文字', () => {
  const clean = core.normalize(c, { ...using(), usage: '沒有使用', interests: ['CBC'], otherInterest: '殘留', otherProduct: '殘留' });
  assert.equal(clean.serviceRating, undefined); assert.equal(clean.products, undefined); assert.equal(clean.comment, undefined); assert.equal(clean.otherInterest, undefined);
  assert.deepEqual(clean.interests, ['CBC']);
});
test('文字長度及單位白名單驗證', () => {
  assert.ok(core.validate(c, { ...using(), hospital: '字'.repeat(151) }).length);
  assert.ok(core.validate(c, { ...using(), unit: '未授權值' }).length);
  assert.ok(core.validate(c, { ...using(), comment: '字'.repeat(2001) }).length);
});

function backend(options = {}) {
  const rows = [], props = { ENVIRONMENT: 'test', ACCEPTING: 'true', SHEET_ID: 'test-sheet', ...options.props };
  let failWrite = false;
  const tab = {
    getLastRow: () => rows.length,
    getRange(row, col, height = 1, width = 1) {
      return {
        getValues: () => rows.slice(row - 1, row - 1 + height).map(r => r.slice(col - 1, col - 1 + width)),
        createTextFinder: value => ({ matchEntireCell() { return this; }, findNext() { const i = rows.findIndex((r, index) => index >= row - 1 && r[col - 1] === value); return i < 0 ? null : { getRow: () => i + 1 }; } })
      };
    },
    appendRow(row) { if (failWrite) throw new Error('write failed'); rows.push(row); }
  };
  const context = vm.createContext({
    console: { error() {} }, SURVEY_CONFIG: c, SurveyCore: core,
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => props[key] || null }) },
    LockService: { getScriptLock: () => ({ tryLock: () => options.lock !== false, releaseLock() {} }) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
    SpreadsheetApp: { openById: id => { assert.equal(id, 'test-sheet'); return { getSheetByName: name => name === '網站回覆' ? tab : null }; }, flush() {} },
    Utilities: { DigestAlgorithm: { SHA_256: 'sha256' }, computeDigest: (_, text) => Array.from(crypto.createHash('sha256').update(text).digest()), formatDate: date => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date) }
  });
  vm.runInContext(fs.readFileSync('apps-script/Code.gs', 'utf8'), context);
  rows.push(Array.from(context.HEADERS));
  const payload = answers => ({ responseId: crypto.randomUUID(), environment: 'test', version: c.version, schemaVersion: c.schemaVersion, startedAt: Date.now() - 10000, submittedAt: new Date().toISOString(), website: '', answers: answers || using() });
  return { rows, props, payload, context, failWrites: v => failWrite = v, post: p => context.doPost({ postData: { contents: typeof p === 'string' ? p : JSON.stringify(p) } }) };
}
test('寫入後才回傳成功；包含伺服器時間、ID、環境與完整欄位', () => {
  const b = backend(), p = b.payload(); const r = b.post(p);
  assert.equal(r.ok, true); assert.equal(r.responseId, p.responseId); assert.equal(r.environment, 'test'); assert.ok(Date.parse(r.receivedAt));
  assert.equal(b.rows.length, 2); assert.equal(b.rows[1].length, b.rows[0].length); assert.equal(b.rows[1][4], '測試醫院');
});
test('相同 ID 重試只新增一筆，收據時間不變；同 ID 異內容拒絕', () => {
  const b = backend(), p = b.payload(), first = b.post(p); const retry = b.post(p);
  assert.equal(retry.ok, true); assert.equal(retry.duplicate, true); assert.equal(retry.receivedAt, first.receivedAt); assert.equal(b.rows.length, 2);
  p.answers.hospital = '已變更醫院'; assert.equal(b.post(p).code, 'ID_CONFLICT'); assert.equal(b.rows.length, 2);
});
test('正式環境或版本不符不寫入測試表', () => {
  const b = backend(); assert.equal(b.post({ ...b.payload(), environment: 'production' }).code, 'ENVIRONMENT_MISMATCH');
  assert.equal(b.post({ ...b.payload(), version: 'old' }).code, 'VERSION_MISMATCH'); assert.equal(b.rows.length, 1);
});
test('異常 ID、過快填答、蜜罐、錯誤時間與過大內容拒絕', () => {
  const b = backend();
  for (const override of [{ responseId: '123' }, { startedAt: Date.now() }, { website: 'spam' }, { submittedAt: 'x' }, { answers: [] }]) assert.equal(b.post({ ...b.payload(), ...override }).ok, false);
  assert.equal(b.post('{bad').code, 'INVALID_REQUEST'); assert.equal(b.post('x'.repeat(16001)).code, 'INVALID_REQUEST'); assert.equal(b.rows.length, 1);
});
test('伺服器拒絕非法選項與未完成評分', () => {
  const b = backend(); for (const answers of [{ ...using(), products: ['偽造'] }, { ...using(), productRating: '' }, { ...using(), unit: '偽造' }]) assert.equal(b.post(b.payload(answers)).code, 'INVALID_FIELDS');
  assert.equal(b.rows.length, 1);
});
test('關閉收件或達日上限不寫入；既有 ID 仍可確認', () => {
  const b = backend({ props: { DAILY_LIMIT: '1' } }), p = b.payload(); assert.equal(b.post(p).ok, true);
  assert.equal(b.post(b.payload()).code, 'DAILY_LIMIT'); b.props.ACCEPTING = 'false';
  assert.equal(b.post(b.payload()).code, 'CLOSED'); assert.equal(b.post(p).duplicate, true); assert.equal(b.rows.length, 2);
});
test('資料寫入失敗與鎖競爭不回傳假成功', () => {
  const b = backend(); b.failWrites(true); assert.equal(b.post(b.payload()).code, 'INTERNAL'); assert.equal(b.rows.length, 1);
  const busy = backend({ lock: false }); assert.equal(busy.post(busy.payload()).code, 'BUSY');
});
test('防止前置空白公式注入；伺服器剔除隱藏分支', () => {
  const b = backend(); assert.equal(b.context.safeCell_('  =IMPORTXML("x")'), "'  =IMPORTXML(\"x\")");
  const p = b.payload({ ...using(), hospital: '=1+1', usage: '不確定', interests: ['CBC'] });
  assert.equal(b.post(p).ok, true); assert.equal(b.rows[1][4], "'=1+1"); assert.equal(b.rows[1][7], ''); assert.equal(b.rows[1][9], ''); assert.equal(b.rows[1][13], 'CBC');
});
test('資料表標題變動時停止寫入，避免欄位錯置', () => {
  const b = backend(); b.rows[0][0] = '已被變更'; assert.equal(b.post(b.payload()).code, 'SCHEMA_MISMATCH'); assert.equal(b.rows.length, 1);
});

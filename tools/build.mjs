import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), c = require('../config.js');
const root = path.resolve(import.meta.dirname, '..');
const production = process.argv.includes('--production');
const productionPreview = process.argv.includes('--production-preview');
const localCustomerList = productionPreview || process.argv.includes('--local-customer-list');
if (localCustomerList && (production || process.env.CI)) {
  throw new Error('客戶名單預覽只能在本機建立。');
}
const previewHospitals = localCustomerList
  ? JSON.parse(fs.readFileSync(path.join(root, 'qa/customer-hospitals.json'), 'utf8'))
  : null;
if (production) {
  const t = c.environments.test, p = c.environments.production;
  if (!p.enabled || !p.endpoint || p.endpoint === t.endpoint || !c.version.includes('prod')) throw new Error('正式建置已封鎖：須啟用獨立正式端點及 prod 版本。請先閱讀正式發布檢查表。');
}
const files = ['index.html', 'style.css', 'script.js', 'core.js', 'logo.png'];
const dist = path.join(root, 'dist');
// 只移除已驗證位於專案內的產出目錄，原始碼與使用者檔案不受影響。
if (path.dirname(dist) !== root || path.basename(dist) !== 'dist') throw new Error('不安全的產出路徑');
if (!productionPreview) fs.rmSync(dist, { recursive: true, force: true });
const env = production || productionPreview ? 'production' : 'test';
const out = path.join(dist, productionPreview ? 'production-preview' : env);
fs.mkdirSync(out, { recursive: true });
for (const file of files) fs.copyFileSync(path.join(root, file), path.join(out, file));
const deployed = structuredClone(c); deployed.runtime.environment = env;
// 發布檔僅包含目前環境設定，不含另一環境的入口。
deployed.environments = { [env]: c.environments[env] };
if (localCustomerList) {
  deployed.hospitals = previewHospitals;
  deployed.environments[env].endpoint = '';
  deployed.environments[env].googleFormUrl = '';
  deployed.environments[env].enabled = true;
  deployed.environments[env].label = productionPreview ? '正式版預覽' : '院所名單本機預覽';
}
if (productionPreview) deployed.version = '1.0.0-prod';
fs.writeFileSync(path.join(out, 'config.js'), 'var SURVEY_CONFIG = ' + JSON.stringify(deployed, null, 2) + ';\n');
if (productionPreview) {
  console.log('已建置正式版預覽 → dist/production-preview');
  process.exit(0);
}
fs.writeFileSync(path.join(dist, 'index.html'), '<!doctype html><html lang="zh-Hant-TW"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=./' + env + '/"><title>醫兆問卷</title><a href="./' + env + '/">開啟醫兆問卷</a></html>');
fs.writeFileSync(path.join(dist, '.nojekyll'), '');
const schema = fs.readFileSync(path.join(root, 'config.js'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'core.js'), 'utf8');
fs.writeFileSync(path.join(root, 'apps-script', 'Schema.gs'), '// 自動產生，請勿直接編輯。來源：config.js + core.js\n' + schema);
console.log('已建置 ' + env + ' → dist/' + env + '；已同步 apps-script/Schema.gs');

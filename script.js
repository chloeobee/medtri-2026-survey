(() => {
  'use strict';
  const c = SURVEY_CONFIG, core = SurveyCore, $ = id => document.getElementById(id);
  const env = c.runtime.environment, settings = c.environments[env];
  const storageKey = 'medtri-survey:' + env + ':' + c.version;
  const store = { get() { try { return JSON.parse(sessionStorage.getItem(storageKey)); } catch { return null; } }, set(v) { try { sessionStorage.setItem(storageKey, JSON.stringify(v)); } catch { /* 無儲存權限仍可填答；重新整理後將無法自動恢復。 */ } } };
  let data = {}, step = 0, busy = false, pending = null, startedAt = Date.now();
  const hospitalKey = value => value.normalize('NFKC').toLowerCase().replace(/\s+/gu, '').replace(/台/g, '臺');
  const hospitals = c.hospitals.map(entry => {
    const { name, aliases = [] } = typeof entry === 'string' ? { name: entry } : entry;
    return { name, key: hospitalKey(name), aliases: aliases.map(hospitalKey) };
  });
  c.fields.forEach(f => data[f.id] = f.type === 'checkbox' ? [] : '');
  function el(tag, className, text) { const n = document.createElement(tag); if (className) n.className = className; if (text !== undefined) n.textContent = text; return n; }
  function error(message) { $('error').textContent = message; if (message) $('error').focus(); }
  $('company').textContent = $('footerCompany').textContent = c.company;
  $('title').textContent = document.title = c.title; $('intro').textContent = c.intro;
  $('privacy').textContent = c.privacy; $('version').textContent = c.version; $('logo').src = c.logo;
  $('edition').textContent = settings.label;
  document.documentElement.style.setProperty('--primary', c.colors.primary);
  document.documentElement.style.setProperty('--accent', c.colors.accent);
  $('modeNotice').textContent = settings.endpoint ? '目前為長官測試環境，回覆僅寫入測試資料表。' : '目前為流程預覽：尚未連接 Google Sheets，送出不會儲存資料。';
  if (env === 'production' && settings.endpoint) $('modeNotice').textContent = '請確認填寫內容後送出。';
  if (/^https:\/\/docs\.google\.com\/forms\//.test(settings.googleFormUrl)) { $('alternative').hidden = false; $('nativeLink').href = settings.googleFormUrl; }
  if (!settings.enabled) { $('survey').hidden = true; $('progressArea').hidden = true; $('modeNotice').textContent = '此環境尚未開放。'; return; }
  const saved = store.get();
  if (saved?.receipt) { finish(saved.receipt); return; }
  if (saved?.pending && saved.pending.version === c.version && saved.pending.environment === env) { pending = saved.pending; data = { ...data, ...pending.answers }; startedAt = pending.startedAt; step = core.steps(c, data).length - 1; }
  function render() {
    const steps = core.steps(c, data); step = Math.min(step, steps.length - 1);
    const current = steps[step]; $('screen').replaceChildren(); $('error').textContent = '';
    updateNavigation();
    $('stepLabel').textContent = current.label;
    if (current.description) $('screen').append(el('p', 'help', current.description));
    current.fields.forEach(id => renderField(c.fields.find(f => f.id === id)));
    if (pending) { $('screen').querySelectorAll('input,textarea').forEach(n => n.disabled = true); $('modeNotice').textContent = '正在確認上次提交的結果。重試會沿用同一回覆 ID，避免重複寫入。'; }
  }
  function updateNavigation() {
    const total = core.steps(c, data).length + (data.usage ? 0 : 1);
    $('back').hidden = step === 0 || !!pending;
    $('next').textContent = pending ? '重新確認並送出' : step === total - 1 ? (settings.endpoint ? (env === 'production' ? '送出問卷' : '送出測試問卷') : '完成流程預覽') : '下一步';
    $('stepCount').textContent = (step + 1) + ' / ' + total;
    $('progress').value = (step + 1) / total * 100;
  }
  function renderField(f) {
    const group = el('fieldset'); group.id = 'group-' + f.id;
    const legend = el('legend', '', f.title); legend.id = 'label-' + f.id;
    legend.append(el('span', 'required', f.required ? '必填' : '選填')); group.append(legend);
    if (f.hint) { const hint = el('p', 'help', f.hint); hint.id = 'hint-' + f.id; group.append(hint); }
    if (f.type === 'hospital' || f.type === 'textarea') {
      const input = el(f.type === 'textarea' ? 'textarea' : 'input');
      if (f.type !== 'textarea') { input.type = 'text'; input.autocomplete = 'off'; input.placeholder = '請輸入醫療院所名稱'; }
      else { input.rows = 4; input.placeholder = '歡迎分享您的意見或建議'; }
      input.id = f.id; input.name = f.id; input.setAttribute('aria-labelledby', legend.id); input.setAttribute('aria-required', String(f.required));
      if (f.hint) input.setAttribute('aria-describedby', 'hint-' + f.id);
      input.maxLength = f.maxLength; input.value = data[f.id] || '';
      let updateHospitals = () => {};
      input.addEventListener('input', () => { data[f.id] = input.value; if (f.type === 'hospital') updateHospitals(input.value); });
      group.append(input);
      if (f.type === 'hospital') {
        const list = el('div', 'hospital-suggestions');
        list.setAttribute('role', 'group');
        list.setAttribute('aria-label', '符合的醫療院所');
        group.append(list);
        updateHospitals = function(query) {
          const key = hospitalKey(query);
          list.replaceChildren();
          if (!key || hospitals.some(entry => entry.name === query)) return;
          const matches = hospitals.filter(entry =>
            entry.key.includes(key) || entry.aliases.some(alias => alias.includes(key)));
          for (const { name } of matches.slice(0, 30)) {
            const option = el('button', 'back', name);
            option.type = 'button';
            option.addEventListener('click', () => {
              input.value = data[f.id] = name;
              input.focus();
              list.replaceChildren();
            });
            list.append(option);
          }
        };
        input.addEventListener('focus', () => list.replaceChildren());
      }
    } else {
      const area = el('div', f.type === 'rating' ? 'ratings' : 'choices');
      const options = f.type === 'rating' ? c.ratingOptions : f.options.map(value => ({ value, label: value === f.other ? value + '（可自行填寫）' : value }));
      options.forEach((option, index) => {
        const label = el('label', 'option'), input = el('input');
        input.type = f.type === 'checkbox' ? 'checkbox' : 'radio'; input.name = f.id; input.id = f.id + '-' + index; input.value = option.value;
        input.checked = f.type === 'checkbox' ? data[f.id].includes(option.value) : data[f.id] === option.value;
        input.addEventListener('change', () => {
          if (f.type === 'checkbox') {
            data[f.id] = core.toggle(data[f.id], option.value, input.checked, f.exclusive);
            if (!data[f.id].includes(f.other) && f.otherId) data[f.otherId] = '';
            area.querySelectorAll('input').forEach(n => n.checked = data[f.id].includes(n.value));
            if (f.otherId) otherLabel.hidden = !data[f.id].includes(f.other);
          } else {
            data[f.id] = option.value;
            // 變更分流時立即清除隱藏分支，避免殘留資料混入統計。
            const clean = core.normalize(c, data);
            c.fields.forEach(field => { if (!(field.id in clean)) { data[field.id] = field.type === 'checkbox' ? [] : ''; if (field.otherId) data[field.otherId] = ''; } });
            updateNavigation();
          }
        });
        label.append(input);
        if (f.type === 'rating') label.append(el('span', 'rating-number', option.value), el('span', 'rating-word', option.label)); else label.append(el('span', '', option.label));
        area.append(label);
      });
      group.append(area);
      var otherLabel;
      if (f.otherId) {
        otherLabel = el('label', 'other', '請補充其他內容（必填）'); otherLabel.hidden = !data[f.id].includes(f.other);
        const other = el('input'); other.type = 'text'; other.id = f.otherId; other.maxLength = f.otherMaxLength; other.value = data[f.otherId] || '';
        other.addEventListener('input', () => data[f.otherId] = other.value); otherLabel.append(other); group.append(otherLabel);
      }
    }
    $('screen').append(group);
  }
  function moveFocus() { window.scrollTo(0, 0); const first = $('screen').querySelector('legend'); first.tabIndex = -1; first.focus(); }
  $('back').addEventListener('click', () => { if (busy || pending) return; step--; render(); moveFocus(); });
  $('survey').addEventListener('submit', async event => {
    if (!pending && core.steps(c, data)[step].fields.includes('hospital')) {
      const key = hospitalKey(data.hospital);
      const names = hospitals.filter(entry => entry.key === key);
      const matches = names.length ? names : hospitals.filter(entry => entry.aliases.includes(key));
      if (matches.length === 1) data.hospital = $('hospital').value = matches[0].name;
    }
    event.preventDefault(); if (busy) return;
    const errors = core.validate(c, data, core.steps(c, data)[step].fields);
    if (errors.length) { error(errors.map(e => c.fields.find(f => f.id === e.field).title + '：' + e.message).join('\n')); return; }
    if (step < core.steps(c, data).length - 1) { step++; render(); moveFocus(); return; }
    const clean = core.normalize(c, data), allErrors = core.validate(c, clean);
    if (allErrors.length) { error('資料尚未完整，請返回確認。'); return; }
    if (!settings.endpoint) { finish({ demo: true }); return; }
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(settings.endpoint)) { error('資料接收網址設定有誤，請洽管理人員。'); return; }
    if (!pending) {
      pending = { responseId: crypto.randomUUID(), environment: env, version: c.version, schemaVersion: c.schemaVersion, startedAt, submittedAt: new Date().toISOString(), website: $('website').value, answers: clean };
      store.set({ pending });
    }
    busy = true; render(); $('back').disabled = $('next').disabled = true; $('next').textContent = '傳送中，請稍候…'; error('');
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), c.runtime.submitTimeoutMs || 45000);
    try {
      const response = await fetch(settings.endpoint, { method: 'POST', credentials: 'omit', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(pending), signal: controller.signal });
      if (!response.ok) throw new Error('HTTP');
      const result = await response.json();
      if (!result.ok || result.responseId !== pending.responseId || result.environment !== env) throw new Error(result.code || 'UNCONFIRMED');
      const receipt = { responseId: result.responseId, receivedAt: result.receivedAt, duplicate: result.duplicate };
      store.set({ receipt }); finish(receipt);
    } catch (ex) {
      console.warn('[MedTri] submission unconfirmed:', ex.name, ex.message);
      error('尚未確認儲存成功。請檢查網路後按「重新確認並送出」，系統將使用同一回覆 ID，避免重複寫入。若持續失敗，請洽現場人員。\n回覆 ID：' + pending.responseId + (ex.message === 'CLOSED' ? '\n目前暫停收件。' : ex.message === 'DAILY_LIMIT' ? '\n測試環境已達今日收件上限。' : ''));
    } finally { clearTimeout(timer); busy = false; $('next').disabled = false; $('back').disabled = false; $('next').textContent = '重新確認並送出'; }
  });
  function finish(receipt) {
    $('survey').hidden = $('progressArea').hidden = true; const done = $('done'); done.hidden = false; done.replaceChildren();
    if (!receipt.demo) $('modeNotice').textContent = env === 'test' ? '測試回覆已確認儲存；本頁不會再次自動提交。' : '回覆已確認儲存。';
    done.append(el('h2', '', receipt.demo ? '流程預覽完成' : c.thanks.title));
    done.append(el('p', '', receipt.demo ? '這次僅測試問卷流程，沒有儲存或傳送任何回覆。啟用 Google Sheets 串接後，才會顯示實際儲存結果。' : c.thanks.text));
    if (!receipt.demo) done.append(el('p', 'receipt', (env === 'test' ? '測試回覆 ID：' : '回覆 ID：') + receipt.responseId + '\n接收時間：' + new Date(receipt.receivedAt).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })));
    const restart = el('button', 'back', '開始另一份' + (receipt.demo ? '預覽' : env === 'test' ? '測試問卷' : '問卷'));
    restart.type = 'button'; restart.addEventListener('click', () => { store.set(null); location.reload(); }); done.append(restart); done.focus();
  }
  render();
})();

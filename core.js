/* 前後端共用：分流、正規化與驗證。修改題目請優先修改 config.js。 */
var SurveyCore = (() => {
  function steps(c, data) {
    return c.steps.filter(s => !s.when || (s.when.in ? s.when.in.includes(data[s.when.field]) : data[s.when.field] === s.when.equals));
  }
  function activeFields(c, data) { return steps(c, data).flatMap(s => s.fields); }
  function normalize(c, raw) {
    const data = {};
    activeFields(c, raw).forEach(id => {
      const f = c.fields.find(x => x.id === id);
      if (f.type === 'checkbox') {
        data[id] = Array.isArray(raw[id]) ? raw[id].slice() : [];
        if (f.otherId && data[id].includes(f.other)) data[f.otherId] = typeof raw[f.otherId] === 'string' ? raw[f.otherId].trim() : '';
      } else data[id] = typeof raw[id] === 'string' ? raw[id].trim() : '';
    });
    return data;
  }
  function validate(c, data, only) {
    const errors = [];
    const ids = only || activeFields(c, data);
    ids.forEach(id => {
      const f = c.fields.find(x => x.id === id), v = data[id];
      const fail = message => errors.push({ field: id, message });
      if (f.type === 'checkbox') {
        if (!Array.isArray(v)) { fail('請確認複選欄位格式。'); return; }
        if (f.required && !v.length) fail('請至少選擇一個項目。');
        if (new Set(v).size !== v.length || v.some(x => !f.options.includes(x))) fail('含有無效或重複的選項。');
        if (f.exclusive && v.includes(f.exclusive) && v.length > 1) fail('「目前沒有特別感興趣的產品」不可與其他選項同時選取。');
        if (f.otherId && v.includes(f.other) && (typeof data[f.otherId] !== 'string' || !data[f.otherId].trim() || data[f.otherId].length > f.otherMaxLength)) fail('請填寫「其他」內容（最多 ' + f.otherMaxLength + ' 字）。');
      } else {
        if (typeof v !== 'string') { fail('請確認欄位格式。'); return; }
        if (f.required && !v.trim()) fail('請完成此必填項目。');
        if (f.maxLength && v.length > f.maxLength) fail('文字不可超過 ' + f.maxLength + ' 字。');
        const options = f.type === 'rating' ? c.ratingOptions.map(x => x.value) : f.options;
        if (options && v && !options.includes(v)) fail('請選擇有效的選項。');
      }
    });
    return errors;
  }
  function toggle(values, option, checked, exclusive) {
    if (!checked) return values.filter(x => x !== option);
    if (option === exclusive) return [option];
    return [...new Set(values.filter(x => x !== exclusive).concat(option))];
  }
  return { steps, activeFields, normalize, validate, toggle };
})();
if (typeof module !== 'undefined') module.exports = SurveyCore;

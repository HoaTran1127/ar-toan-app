//verify.mjs — kiem dinh tinh nhat quan cua giao an AR Toan (headless, khong can trinh duyet).
//Chay: node scripts/verify.mjs   (thoat voi ma != 0 neu phat hoi loi)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.argv[2] || '.';
const FILES = ['00-core.js', '10-models-1.js', '11-models-2.js', '12-models-3.js', '13-models-4.js', '14-models-5.js', '15-models-6.js', '30-render.js'];

const mkEl = () => {
  const el = {
    innerHTML: '', textContent: '', value: '', checked: false, disabled: false, style: {}, dataset: {},
    children: [], clientWidth: 320, clientHeight: 300, readyState: 4,
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    addEventListener() {}, removeEventListener() {}, appendChild() {}, remove() {}, setAttribute() {}, focus() {}, click() {},
    closest: () => null, querySelector: () => mkEl(), querySelectorAll: () => Object.assign([], { forEach() {} }),
  };
  return el;
};
const anyObj = () => new Proxy(function () {}, {
  get(t, k) {
    if (k === Symbol.toPrimitive || k === 'valueOf') return () => 0;
    if (k === 'length') return 0;
    if (k === Symbol.iterator) return function* () {};
    if (k === 'isTexture' || k === 'then') return false;
    return anyObj();
  },
  set: () => true, apply: () => anyObj(), construct: () => anyObj(), has: () => true,
});

function boot() {
  const els = new Map();
  const $ = (id) => { if (!els.has(id)) els.set(id, mkEl()); return els.get(id); };
  const sandbox = {
    console, Math, JSON, Object, Array, String, Number, Boolean, Date, RegExp, Error, isNaN, parseFloat, parseInt, Set, Map, Promise, Symbol,
    $, THREE: new Proxy({}, { get: () => anyObj() }),
    document: { getElementById: $, querySelector: () => null, querySelectorAll: () => Object.assign([], { forEach() {} }), createElement: () => mkEl(), addEventListener() {}, body: mkEl(), documentElement: mkEl() },
    window: { addEventListener() {}, devicePixelRatio: 1, print() {}, location: { href: '' } },
    fetch: async () => ({ ok: true }), requestAnimationFrame: () => 0, cancelAnimationFrame() {},
    performance: { now: () => 0 }, localStorage: { getItem: () => null, setItem() {} },
    navigator: { mediaDevices: undefined }, location: { href: '' },
  };
  sandbox.globalThis = sandbox;
  const ctx = vm.createContext(sandbox);
  for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', f), 'utf8'), ctx, { filename: f });
  return { MODELS: vm.runInContext('MODELS', ctx), LESSONS: vm.runInContext('LESSONS', ctx), EX: vm.runInContext('EX', ctx), EXKEY: vm.runInContext('EXKEY', ctx), state: vm.runInContext('state', ctx) };
}

const fail = [];
const warn = [];
const app = boot();
const { MODELS, LESSONS, EX, EXKEY, state } = app;
const host = mkEl();

// 1) Bao phu: moi model co it nhat mot bai, moi bai tro den model ton tai
const modelIds = new Set(Object.keys(MODELS)), lessonIds = Object.keys(LESSONS);
for (const [id, L] of Object.entries(LESSONS)) if (!modelIds.has(L.model)) fail.push(`bai "${id}" tro den model khong ton tai: ${L.model}`);
for (const m of modelIds) if (!lessonIds.some(k => LESSONS[k].model === m)) warn.push(`model "${m}" khong co bai nao`);

// 2) Bao phu bai tap: moi bai phai co lien ket den mot khoa EX ( truc tiep hoac qua EXKEY )
for (const id of lessonIds) { const k = EXKEY[id] || id; if (!EX[k] || !EX[k].length) fail.push(`bai "${id}" khong co cau luyen tap`); }

// 3) Doi chieu cau truc tung model
for (const [id, m] of Object.entries(MODELS)) {
  for (const fn of ['defaults', 'geomSig', 'params', 'draw2d', 'caption', 'value', 'build3d', 'paint3d']) {
    if (typeof m[fn] !== 'function') fail.push(`model "${id}" thieu ${fn}()`);
  }
  const canHand = typeof m.hand === 'function' || m.usesPalm || m.twoHands;
  if (!canHand) fail.push(`model "${id}" khong co kieu dieu khien bang tay (hand/usesPalm/twoHands)`);
}

// 4) Quet toan bo to hop tham so: ve 2D, sinh 3D, caption, value, geomSig
let combos = 0;
for (const id of Object.keys(MODELS)) {
  const lid = lessonIds.find(k => LESSONS[k].model === id);
  if (!lid) continue;
  const m = MODELS[id];
  let ps = [];
  try { ps = m.params(state) || []; } catch (e) { fail.push(`${id}.params(): ${e.message}`); continue; }
  for (const p of ps) {
    const lo = typeof p.min === 'number' ? p.min : 0, hi = typeof p.max === 'number' ? p.max : 12;
    for (let v = lo; v <= hi; v++) {
      combos++;
      state.lesson = lid; state.step = 2;
      try { m.defaults(state, LESSONS[lid]); } catch (e) { fail.push(`${id}.defaults(): ${e.message}`); break; }
      state[p.key] = v;
      try {
        m.draw2d(host, state);
        if (/NaN|Infinity|undefined/.test(host.innerHTML)) fail.push(`${id}.${p.key}=${v}: SVG chua ${host.innerHTML.match(/NaN|Infinity|undefined/)[0]}`);
      } catch (e) { fail.push(`${id}.${p.key}=${v} draw2d: ${e.message}`); continue; }
      try { const val = String(m.value(state)); if (/NaN|undefined/.test(val)) fail.push(`${id}.${p.key}=${v}: value() = ${val}`); } catch (e) { fail.push(`${id}.${p.key}=${v} value(): ${e.message}`); }
      try { const c = m.caption(state, LESSONS[lid]); if (!c || !String(c.cap || '').trim()) fail.push(`${id}.${p.key}=${v}: caption trong`); } catch (e) { fail.push(`${id}.${p.key}=${v} caption(): ${e.message}`); }
      try { m.build3d(state); } catch (e) { fail.push(`${id}.${p.key}=${v} build3d(): ${e.message}`); }
    }
  }
}

// 5) Kiem tra de bai: dap an phai nam trong choices, khong trung phuong an, tag ASCII
let qn = 0, dupChoices = 0, missingAnswer = 0, badTag = 0, noDiag = 0;
const pos = {};
for (const [k, arr] of Object.entries(EX)) for (const q of arr) {
  qn++;
  if (q.choices && q.choices.length > 1) {
    const p = q.choices.indexOf(q.answer);
    if (p < 0) missingAnswer++; else pos[p] = (pos[p] || 0) + 1;
    if (new Set(q.choices).size !== q.choices.length) dupChoices++;
  }
  if (!q.explanation || q.explanation.length < 15) noDiag++;
  if (q.errorTag && (/[^\x00-\x7F]/.test(q.errorTag) || /[-\s]/.test(q.errorTag))) badTag++;
}
const qWithChoices = Object.values(pos).reduce((a, b) => a + b, 0);
if (missingAnswer) fail.push(`${missingAnswer} cau co dap an nam ngoai danh sach phuong an`);
if (dupChoices) fail.push(`${dupChoices} cau co phuong an bi trung lap`);
if (noDiag) fail.push(`${noDiag} cau thieu giai thích (explanation)`);
if (badTag) fail.push(`${badTag} errorTag chua dau / gao noi / khoang trang`);
if (qWithChoices) {
  const firstPct = Math.round((pos[0] || 0) / qWithChoices * 100);
  if (firstPct > 40) fail.push(`dap an dung dung o dau ${firstPct}% — can xao tron vi tri phuong an`);
}

const summary = {
  model: modelIds.size, bai: lessonIds.length, cauLuyenTap: qn, toHopQuet: combos,
  viTriDapAn: pos, soBaiKhongCoBaiTap: lessonIds.filter(id => !(EX[EXKEY[id] || id])).length,
};
console.log(JSON.stringify(summary, null, 1));
if (warn.length) console.log('CANH BAO:\n' + warn.map(w => '  - ' + w).join('\n'));
if (fail.length) { console.log('FAIL:\n' + fail.slice(0, 30).map(f => '  - ' + f).join('\n') + (fail.length > 30 ? `\n  ... (${fail.length - 30} nua)` : '')); process.exit(1); }
console.log('OK: toan bo kiem dinh deu pass');

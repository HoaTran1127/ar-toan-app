// ======================= Chọn bài =======================
function applyLesson(id) {
  state.lesson = id; state.step = 0; state.boardWiped = false; state.handApplied = -1; state.twoApplied = '-1/-1';
  state.vote = { correct: 0, wrong: 0 };
  state.exIdx = 0; state.exPick = null; state.exReveal = false;
  MDL().defaults(state, LESSONS[id]);
  render();
  if (threeReady()) rebuild3D();
}
function buildLessonSelect() {
  const sel = $('lessonSel');
  sel.innerHTML = Object.entries(LESSONS).map(([id, L]) => `<option value="${id}">${L.ten}</option>`).join('');
  sel.value = state.lesson;
  sel.addEventListener('change', () => applyLesson(sel.value));
}

// ======================= Điều khiển nút =======================
$('btnNext').addEventListener('click', () => { state.step = Math.min(4, state.step + 1); render(); });
$('btnPrev').addEventListener('click', () => { state.step = Math.max(0, state.step - 1); render(); });
$('classSize').addEventListener('input', (e) => {
  const v = parseInt(e.target.value, 10);
  state.M = (Number.isFinite(v) && v >= 1 && v <= 60) ? v : null;
  render();
});
document.querySelectorAll('button[data-vote]').forEach(b => b.addEventListener('click', () => {
  const k = b.dataset.vote, add = k.endsWith('5') ? 5 : 1, side = k.startsWith('correct') ? 'correct' : 'wrong';
  state.vote[side] = Math.min(60, state.vote[side] + add);
  render();
}));
$('btnResetVote').addEventListener('click', () => { state.vote = { correct: 0, wrong: 0 }; render(); });
$('btnWipe').addEventListener('click', () => { state.boardWiped = true; render(); });
$('btnPrint').addEventListener('click', () => window.print());
$('btnCover').addEventListener('click', stopCam);
$('exSec').addEventListener('click', (e) => {
  const ch = e.target.closest('[data-ex]'), rev = e.target.closest('[data-exrev]'), nav = e.target.closest('[data-exnav]');
  if (ch) { state.exPick = ch.dataset.ex; state.exReveal = true; renderEx(); }
  else if (rev) { state.exReveal = true; renderEx(); }
  else if (nav) { const a = exOf() || []; state.exIdx = clamp(state.exIdx + (nav.dataset.exnav === 'next' ? 1 : -1), 0, a.length - 1); state.exPick = null; state.exReveal = false; state.handApplied = -1; renderEx(); }
});


// ======================= Khởi động =======================
buildLessonSelect();
applyLesson('phan-so-dau');
init3D();


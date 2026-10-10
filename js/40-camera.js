// ======================= Camera + MediaPipe (tuỳ chọn, lùi về chuột) =======================
let handLandmarker = null, stream = null, rafId = 0, camStarting = false, camGen = 0;
async function tryHandModel() {
  try {
    const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.1/vision_bundle.mjs");
    handLandmarker = await vision.HandLandmarker.createFromOptions(vision.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.1/wasm"), {
      baseOptions: { modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task" },
      runningMode: "VIDEO", numHands: 2 });
    return true;
  } catch (e) { $('handStat').textContent = "không tải được mô hình nhận diện tay → cô dùng +1/+5."; return false; }
}
async function startCam() {
  if (camStarting) return; // đang bật dở → bỏ qua lần bấm tiếp (chống bấm đúp tạo 2 vòng detect)
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { $('handStat').textContent = "máy không có quyền camera — dùng +1/+5."; return; }
  camStarting = true; $('btnCam').disabled = true;
  const myGen = ++camGen;
  try {
    const s = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
    if (myGen !== camGen) { s.getTracks().forEach(t => t.stop()); return; } // đã bị stop giữa chừng → dọn stream mới
    stream = s;
    $('cam').srcObject = stream; $('videoWrap').classList.add('show');
    state.camOn = true; $('camLed').classList.add('cam'); $('btnCam').classList.add('on'); $('btnCam').textContent = "Đang bật";
    if (!handLandmarker) await tryHandModel();
    if (myGen !== camGen) { stopCam(); return; }
    loopDetect();
  } catch (e) { $('handStat').textContent = "không bật được camera (" + e.name + ") → dùng +1/+5."; }
  finally { if (myGen === camGen) { camStarting = false; $('btnCam').disabled = false; } }
}
function stopCam() {
  camGen++; camStarting = false; $('btnCam').disabled = false; // vô hiệu hoá mọi startCam đang pending
  if (stream) stream.getTracks().forEach(t => t.stop());
  stream = null; if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  const v = $('cam'); if (v) v.srcObject = null; // xoá khung hình đông cứng khỏi DOM
  $('videoWrap').classList.remove('show');
  state.camOn = false; $('camLed').classList.remove('cam'); $('btnCam').classList.remove('on'); $('btnCam').textContent = "Bật camera";
}
function loopDetect() {
  const v = $('cam');
  const tick = () => {
    if (state.camOn && handLandmarker && v.readyState >= 2) {
      try {
        const res = handLandmarker.detectForVideo(v, performance.now());
        const n = res.landmarks ? res.landmarks.length : 0;
        let stat = `camera thấy ${n} bàn tay (cận dưới số em — cộng tay nếu máy bỏ sót)`;
        if ($('handDrive').checked && state.step >= 1 && n > 0) {
          const lm = res.landmarks[0], m = MDL();
          if (m.twoHands) {
            const hands = res.landmarks.map(h => ({ f: countFingers(h), x: h[0].x }));
            let l = null, r = null;
            for (const h of hands) { const sx = 1 - h.x; if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
            const sig = (l === null ? -1 : l) + '/' + (r === null ? -1 : r);
            m.hand2(state, hands);
            stat += ` · hai tay → trái ${l === null ? '—' : l} phải ${r === null ? '—' : r}`;
            if (sig !== state.twoApplied) { state.twoApplied = sig; state.handApplied = -1; drawVisual(); render(); }
          } else if (m.usesPalm) {
            const palmBefore = m.palmLabel(state);
            m.palmToValue(state, lm[9].x); state.handApplied = -1;
            const palmAfter = m.palmLabel(state);
            stat += ` · ${palmAfter}`;
            if (palmAfter !== palmBefore) renderPalmFrame(m);
          } else {
            const f = countFingers(lm);
            const exs = (state.step === 4 && $('exSec').style.display !== 'none') ? exOf() : null;
            const q = exs ? exs[clamp(state.exIdx, 0, exs.length - 1)] : null;
            if (q && q.choices && q.choices.length) {
              stat += ` · ${f} ngón → chọn phương án ${f}`;
              if (f >= 1 && f <= q.choices.length && f !== state.handApplied) {
                state.handApplied = f; state.exPick = q.choices[f - 1]; state.exReveal = true; renderEx();
              }
            } else {
              stat += ` · ${f} ngón ${m.handLabel(f, state)}`;
              if (f !== state.handApplied) { state.handApplied = f; m.hand(state, f); drawVisual(); render(); }
              if (threeReady()) rotTargetFromHand(0.5 - lm[9].x);
            }
          }
        } else state.handApplied = -1;
        $('handStat').textContent = stat;
      } catch (_) {}
    }
    rafId = requestAnimationFrame(tick);
  };
  tick();
}
function countFingers(lm) {
  const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), w = lm[0];
  let c = 0; const tips = [8,12,16,20], pips = [6,10,14,18];
  for (let k = 0; k < 4; k++) if (d(lm[tips[k]], w) > d(lm[pips[k]], w) * 1.05) c++;
  if (d(lm[4], lm[17]) > d(lm[3], lm[17]) * 1.1) c++;
  return c;
}
$('btnCam').addEventListener('click', () => (state.camOn ? stopCam() : startCam()));

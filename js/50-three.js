
// ======================= Mô hình 3D (Three.js nạp ĐỘNG — 2D vẫn chạy khi 3D lỗi) =======================
let THREE = null, scene = null, camera = null, renderer = null, group3d = null;
let rotY = 0, rotYTarget = 0, dragging = false, lastPX = 0;
const threeReady = () => !!renderer && !!group3d;
function rotTargetFromHand(nx) { rotYTarget = nx * 2.4; }

async function init3D() {
  const host = $('stage3d');
  try { THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"); }
  catch (e) { host.innerHTML = '<div class="fallback">Mạng chưa tải được mô hình 3D.<br>Màn 2D và chuột vẫn dùng bình thường.</div>'; return; }
  const W = host.clientWidth || 320, H = host.clientHeight || 300;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, W/H, 0.1, 100);
  camera.position.set(0, 3.4, 3.6); camera.lookAt(0, 0, 0);
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch (e) { host.innerHTML = '<div class="fallback">Máy không mở được WebGL (3D).<br>Màn 2D và chuột vẫn dùng bình thường.</div>'; return; }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(W, H); host.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x334433, 1.15));
  const dir = new THREE.DirectionalLight(0xffffff, 1.2); dir.position.set(3, 6, 4); scene.add(dir);
  const el = renderer.domElement; el.style.touchAction = 'none';
  el.addEventListener('pointerdown', e => { dragging = true; lastPX = e.clientX; });
  window.addEventListener('pointerup', () => { dragging = false; });
  window.addEventListener('pointermove', e => { if (dragging) { rotYTarget += (e.clientX - lastPX) * 0.01; lastPX = e.clientX; } });
  rebuild3D();
  animate();
}
// Dispose ĐỆ QUY toàn cây: geometry + material (kể cả mảng material) + texture.
// Fix rò rỉ GPU ở các group lồng nhau (balance pivot, clock mkHand, goc mkRay).
// dispose() của Three.js là idempotent nên gọi trùng cũng an toàn.
function disposeGroup(g) {
  g.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    const mats = Array.isArray(o.material) ? o.material : (o.material ? [o.material] : []);
    for (const mt of mats) {
      for (const k in mt) { const v = mt[k]; if (v && v.isTexture) v.dispose(); }
      mt.dispose();
    }
  });
}
function rebuild3D() {
  if (!THREE || !scene) return;
  if (group3d) { scene.remove(group3d); disposeGroup(group3d); group3d = null; }
  group3d = MDL().build3d(state);
  group3d.userData.sig = MDL().geomSig(state);
  scene.add(group3d);
  MDL().paint3d(group3d, state);
}
function sync3D() {
  if (!threeReady()) return;
  if (group3d.userData.sig !== MDL().geomSig(state)) { rebuild3D(); return; }
  MDL().paint3d(group3d, state);
}
function animate() {
  requestAnimationFrame(animate);
  if (!group3d || !renderer) return;
  if (!dragging) rotYTarget += 0.0016;
  rotY += (rotYTarget - rotY) * 0.12;
  group3d.rotation.y = rotY;
  renderer.render(scene, camera);
}

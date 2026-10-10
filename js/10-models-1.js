// ======================= Model: pie (phân số) =======================
const MODELS = {
  pie: {
    defaults(st, L) { st.den = 4; st.shaded = [true, false, false, false]; },
    geomSig(st) { return 'den:' + st.den; },
    params() { return [{ key:'den', label:'Số phần bằng nhau', min:2, max:12 }]; },
    ctlHint() { return 'Bấm từng miếng trên màn 2D để tô / bỏ tô.'; },
    draw2d(host, st) {
      const { den, shaded } = st; const R = 118, c = 148, gap = 0.02;
      let paths = '';
      for (let i = 0; i < den; i++) {
        const a0 = (i/den)*2*Math.PI - Math.PI/2 + gap, a1 = ((i+1)/den)*2*Math.PI - Math.PI/2 - gap;
        const x0 = c + R*Math.cos(a0), y0 = c + R*Math.sin(a0), x1 = c + R*Math.cos(a1), y1 = c + R*Math.sin(a1);
        const big = (a1 - a0) > Math.PI ? 1 : 0;
        const fill = shaded[i] ? 'var(--accent)' : 'rgba(255,255,255,.08)';
        const stroke = shaded[i] ? '#d9a520' : 'var(--chalk)';
        paths += `<path data-sect="${i}" d="M ${c} ${c} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 ${big} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${fill}" stroke="${stroke}" stroke-width="2" style="cursor:pointer"></path>`;
      }
      host.innerHTML = `<svg width="296" height="296" viewBox="0 0 296 296">${paths}<circle cx="${c}" cy="${c}" r="3" fill="var(--chalk)"/></svg>`;
      host.querySelectorAll('path[data-sect]').forEach(p => p.addEventListener('click', () => toggleSect(+p.dataset.sect)));
    },
    caption(st) {
      const L = cur(), n = st.shaded.filter(Boolean).length, s = st.step;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: một cái được chia ${st.den} phần bằng nhau, đang tô ${n} phần.`, hint: 'Bấm miếng để tô — hoặc giơ số ngón tay = số phần muốn tô.' };
      if (s === 2) return { cap: `Sơ đồ: ${n}/${st.den} — tử số ${n} là số phần lấy, mẫu số ${st.den} là tổng số phần bằng nhau.`, hint: 'Các phần phải bằng nhau tuyệt đối.' };
      if (s === 3) return { cap: L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: hình đã tô màu mấy phần? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const n = st.shaded.filter(Boolean).length; return `${n}<span class="bar"></span>${st.den}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const { den } = st, R = 1.15, gap = 0.025, depth = 0.4, g = new THREE.Group();
      for (let i = 0; i < den; i++) {
        const a0 = (i/den)*2*Math.PI + gap, a1 = ((i+1)/den)*2*Math.PI - gap;
        const sh = new THREE.Shape();
        sh.moveTo(0,0); sh.lineTo(R*Math.cos(a0), R*Math.sin(a0)); sh.absarc(0,0,R,a0,a1,false); sh.lineTo(0,0);
        const geo = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled:false });
        geo.rotateX(-Math.PI/2); geo.translate(0, -depth/2, 0);
        const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ roughness:.7, metalness:.05 }));
        mesh.userData.sect = i; g.add(mesh);
      }
      return g;
    },
    paint3d(g, st) { for (const m of g.children) m.material.color.set(st.shaded[m.userData.sect] ? 0xffd166 : 0x4d635a); },
    hand(st, f) { const k = Math.min(f, Math.min(st.den, 5)); st.shaded = Array.from({length: st.den}, (_, i) => i < k); },
    handLabel(f, st) { return `→ tử số ${Math.min(f, Math.min(st.den,5))}`; },
  },

  // ======================= Model: array (mảng chấm / ô vuông) =======================
  array: {
    defaults(st, L) { st.rows = L.rows; st.cols = L.cols; },
    geomSig(st) { return st.rows + 'x' + st.cols; },
    params() { return [{ key:'cols', label:'Số cái mỗi hàng', min:1, max:9 }, { key:'rows', label:'Số hàng', min:1, max:9 }]; },
    ctlHint() { return 'Giơ số ngón tay để đặt số hàng (tối đa 5), hoặc bấm +/−.'; },
    draw2d(host, st) {
      const { rows, cols } = st, L = cur(), cell = L.cell === 'square' ? 34 : 26, gap = 10, pad = 16;
      const W = pad*2 + cols*cell + (cols-1)*gap, H = pad*2 + rows*cell + (rows-1)*gap;
      let s = '';
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const x = pad + c*(cell+gap), y = pad + r*(cell+gap);
        s += L.cell === 'square'
          ? `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="rgba(255,255,255,.16)" stroke="var(--accent)" stroke-width="1.6"></rect>`
          : `<circle cx="${(x+cell/2)}" cy="${(y+cell/2)}" r="${cell/2}" fill="var(--accent)"></circle>`;
      }
      if (L.cell === 'square') s += `<rect x="${pad-5}" y="${pad-5}" width="${W-2*pad+10}" height="${H-2*pad+10}" fill="none" stroke="var(--chalk)" stroke-dasharray="7 5" stroke-width="2"></rect>`;
      host.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${s}</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, { rows, cols } = st, tot = rows*cols, o = L.obj;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: mỗi hàng có ${cols} ${o}. Có ${rows} hàng như thế.`, hint: 'Giơ ngón tay (1–5) để đặt số hàng, hoặc bấm +/− Số hàng.' };
      if (s === 2) return { cap: `Sơ đồ: ${Array(rows).fill(cols).join(' + ')} = ${tot}.`, hint: 'Mảng ô/dots có khung nét đứt — đếm theo hàng trước khi nhân.' };
      if (s === 3) return { cap: `Phép tính: ${cols} × ${rows} = ${tot}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: có tất cả bao nhiêu ${o}? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `${st.cols} × ${st.rows} = ${st.rows*st.cols}`; },
    showFromStep() { return 3; },
    build3d(st) {
      const { rows, cols } = st, s = 0.82, gp = 0.16, g = new THREE.Group();
      const tw = (cols-1)*(s+gp), td = (rows-1)*(s+gp);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(s, s*0.6, s),
          new THREE.MeshStandardMaterial({ color: 0xffd166, roughness:.65, metalness:.05 }));
        mesh.position.set(-tw/2 + c*(s+gp), 0, -td/2 + r*(s+gp));
        g.add(mesh);
      }
      return g;
    },
    paint3d() {}, // đồng màu — không cần đổi khi tô
    hand(st, f) { st.rows = clamp(f, 1, 5); },
    handLabel(f, st) { return `→ ${clamp(f,1,5)} hàng`; },
  },

  // ======================= Model: numline (tia số — làm tròn) =======================
  numline: {
    usesPalm: true,
    defaults(st, L) { st.nlMax = L.nlMax; st.nlBase = L.nlBase; st.nlValue = L.nlValue; },
    palmToValue(st, x) { st.nlValue = clamp(Math.round((1 - x) * st.nlMax), 0, st.nlMax); },
    palmLabel(st) { return `cờ ở ${st.nlValue} → ${roundTo(st.nlValue, st.nlBase)}`; },
    geomSig(st) { return 'nl' + st.nlMax + ':' + st.nlBase; },
    params() { return [{ key:'nlValue', label:'Số đang xét', min:0, max:cur().nlMax, step:5 }]; },
    ctlHint() { return 'Bấm vào tia số để dời cờ, hoặc bật camera rồi đưa bàn tay ngang.'; },
    NLGEO() { return { W:520, H:150, x0:34, x1:486, y:96 }; },
    draw2d(host, st) {
      const g = this.NLGEO(), { nlValue, nlMax, nlBase } = st, pos = v => g.x0 + (v/nlMax)*(g.x1-g.x0);
      let ticks = '';
      for (let m = 0; m <= nlMax; m += nlBase) {
        const x = pos(m).toFixed(1);
        ticks += `<line x1="${x}" y1="${g.y-9}" x2="${x}" y2="${g.y+9}" stroke="var(--chalk)" stroke-width="2"></line>`
              + `<text x="${x}" y="${g.y+27}" fill="rgba(242,240,230,.65)" font-size="13" text-anchor="middle">${m}</text>`;
      }
      const lo = Math.floor(nlValue/nlBase)*nlBase, hi = lo + nlBase, fx = pos(nlValue).toFixed(1);
      const flag = `<line x1="${fx}" y1="${g.y-42}" x2="${fx}" y2="${g.y}" stroke="var(--warn)" stroke-width="3"></line>`
        + `<path d="M ${fx} ${g.y-42} L ${(pos(nlValue)+16).toFixed(1)} ${g.y-34} L ${fx} ${g.y-26} Z" fill="var(--warn)"></path>`
        + `<text x="${fx}" y="${g.y-50}" fill="var(--warn)" font-size="17" font-weight="700" text-anchor="middle">${nlValue}</text>`;
      host.innerHTML = `<svg id="numline" width="${g.W}" height="${g.H}" viewBox="0 0 ${g.W} ${g.H}" style="cursor:pointer">`
        + `<line x1="${g.x0}" y1="${g.y}" x2="${g.x1}" y2="${g.y}" stroke="var(--chalk)" stroke-width="2"></line>`
        + `<text x="${pos(hi).toFixed(1)}" y="${g.y-14}" fill="var(--accent)" font-size="12" text-anchor="middle">mốc ${hi}</text>`
        + ticks + flag + `</svg>`;
      const svg = host.querySelector('#numline');
      svg.addEventListener('pointerdown', (e) => {
        const r = svg.getBoundingClientRect();
        const vbX = (e.clientX - r.left) / r.width * g.W;
        state.nlValue = clamp(Math.round((vbX - g.x0)/(g.x1 - g.x0) * nlMax), 0, nlMax);
        drawVisual(); render();
      });
    },
    caption(st) {
      const L = cur(), s = st.step, v = st.nlValue, b = st.nlBase, lo = Math.floor(v/b)*b, hi = lo + b;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: lá cờ đang chỉ ${v} trên tia số từ 0 đến ${st.nlMax}.`, hint: 'Bấm vào tia số hoặc đưa tay ngang để dời cờ.' };
      if (s === 2) return { cap: `Sơ đồ: ${v} nằm giữa hai mốc tròn ${lo} và ${hi}.`, hint: 'Cờ ngã về mốc nào gần hơn thì làm tròn mốc đó.' };
      if (s === 3) return { cap: `Làm tròn ${v} → ${roundTo(v,b)}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: ${v} làm tròn ra mốc nào? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `${st.nlValue} → ${roundTo(st.nlValue, st.nlBase)}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const { nlMax, nlBase } = st, g = new THREE.Group(), len = 6.2, x0 = -len/2;
      const px = v => x0 + (v/nlMax)*len;
      g.add(new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 0.12), new THREE.MeshStandardMaterial({ color:0x9fb0bd, roughness:.6 })));
      for (let m = 0; m <= nlMax; m += nlBase) {
        const t = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 0.05), new THREE.MeshStandardMaterial({ color:0x7f8f9c }));
        t.position.set(px(m), 0.26, 0); g.add(t);
      }
      const flag = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.9, 4), new THREE.MeshStandardMaterial({ color:0xff8f6b, roughness:.5 }));
      flag.position.set(px(st.nlValue), 0.9, 0); flag.rotation.z = -Math.PI/2; // mũi chỉ sang phải
      g.add(flag); g.userData.flag = flag; g.userData.px = px;
      return g;
    },
    paint3d(g, st) { if (g.userData.flag) g.userData.flag.position.x = g.userData.px(st.nlValue); },
    hand() {},
    handLabel() { return ''; },
  },

  // ======================= Model: sticks (bó chục + que lẻ — giá trị theo hàng) =======================
  sticks: {
    defaults(st, L) { st.tens = L.tens; st.ones = L.ones; },
    geomSig(st) { return 'stk' + st.tens + ':' + st.ones; },
    params() { return [{ key:'ones', label:'Que lẻ (đơn vị)', min:0, max:9 }, { key:'tens', label:'Bó chục', min:0, max:9 }]; },
    ctlHint() { return 'Giơ số ngón tay để đặt số que lẻ, hoặc bấm +/− cho chục/đơn vị.'; },
    draw2d(host, st) {
      const { tens, ones } = st, bx = 26, by = 30, bw = 42, bgap = 16, sy = 158;
      const bundle = (x) => { let s = ''; for (let k = 0; k < 10; k++) s += `<rect x="${(x+k*4).toFixed(1)}" y="${by}" width="2.6" height="90" rx="1" fill="rgba(255,255,255,.5)"></rect>`; return s + `<rect x="${x-2}" y="${by+38}" width="${bw}" height="12" rx="3" fill="var(--accent)"></rect>`; };
      let bundles = ''; for (let i = 0; i < tens; i++) bundles += bundle(bx + i*(bw+bgap));
      let singles = ''; for (let i = 0; i < ones; i++) singles += `<rect x="${bx + i*22}" y="${sy}" width="7" height="52" rx="3" fill="var(--accent)"></rect>`;
      host.innerHTML = `<svg width="600" height="225" viewBox="0 0 600 225">`
        + `<text x="${bx}" y="20" fill="var(--chalk)" font-size="15">Hàng chục — mỗi bó 10 que: ${tens} bó</text>`
        + `<text x="${bx}" y="${sy-8}" fill="var(--chalk)" font-size="15">Hàng đơn vị — que lẻ: ${ones}</text>`
        + bundles + singles + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, val = st.tens*10 + st.ones;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${st.tens} bó chục và ${st.ones} que lẻ.`, hint: 'Giơ ngón tay (0–5) để đặt số que lẻ, hoặc bấm +/−.' };
      if (s === 2) return { cap: `Sơ đồ: ${st.tens} bó × 10 = ${st.tens*10}, thêm ${st.ones} que lẻ.`, hint: 'Một bó bên trái luôn gấp 10 lần một que bên phải.' };
      if (s === 3) return { cap: `Số đó là ${val}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: có tất cả bao nhiêu que tính? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `${st.tens} chục + ${st.ones} = ${st.tens*10 + st.ones}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const g = new THREE.Group();
      const bm = new THREE.MeshStandardMaterial({ color:0xffd166, roughness:.6 });
      const sm = new THREE.MeshStandardMaterial({ color:0xcfe8ff, roughness:.5 });
      for (let i = 0; i < st.tens; i++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,1.1,12), bm); m.position.set((i-(st.tens-1)/2)*0.6, 0, -0.7); g.add(m); }
      for (let i = 0; i < st.ones; i++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,0.9,8), sm); m.position.set((i-(st.ones-1)/2)*0.28, 0, 0.7); g.add(m); }
      return g;
    },
    paint3d() {},
    hand(st, f) { st.ones = clamp(f, 0, 9); },
    handLabel(f, st) { return `→ ${clamp(f,0,9)} que lẻ`; },
  },

  // ======================= Model: shear (hình bình hành — cắt/dán thành chữ nhật) =======================
  shear: {
    usesPalm: true,
    defaults(st, L) { st.shBase = L.b; st.shHeight = L.h; st.shShear = L.shear; st.asRect = false; },
    palmToValue(st, x) { st.shShear = clamp(Math.round((1 - x) * st.shBase), 0, st.shBase); },
    palmLabel(st) { return `độ nghiêng ${st.shShear}`; },
    geomSig(st) { return 'sh' + st.shShear + (st.asRect ? ':R' : ':P'); },
    params() { return [{ key:'shShear', label:'Độ nghiêng (trượt đỉnh)', min:0, max:cur().b }]; },
    toggles() { return [{ key:'asRect', label:'Cắt–ghép thành hình chữ nhật' }]; },
    ctlHint() { return 'Đưa tay ngang để nghiêng hình; hoặc kéo stepper Độ nghiêng và bật "Cắt–ghép".'; },
    draw2d(host, st) {
      const k = 38, m = 34, b = st.shBase, h = st.shHeight, s = st.shShear, ar = st.asRect;
      const X = u => m + u*k, Yv = v => (m + h*k) - v*k;
      const W = m*2 + (b + s)*k, Hh = m*2 + h*k + 10;
      const P = (arr) => arr.map(p => `${X(p[0]).toFixed(1)},${Yv(p[1]).toFixed(1)}`).join(' ');
      const para = [[0,0],[b,0],[b+s,h],[s,h]];
      const cut = `polygon points="${P(para)}" fill="rgba(255,255,255,.14)" stroke="var(--chalk)" stroke-width="2"`;
      let body = '';
      if (!ar) {
        body = `<polygon ${cut}></polygon>`
          + `<line x1="${X(s)}" y1="${Yv(h)}" x2="${X(s)}" y2="${Yv(0)}" stroke="var(--warn)" stroke-width="2" stroke-dasharray="6 4"></line>`;
      } else {
        const rect = [[s,0],[b+s,0],[b+s,h],[s,h]];
        body = `<polygon ${cut} opacity="0.35" stroke-dasharray="6 4"></polygon>`
          + `<polygon points="${P(rect)}" fill="var(--accent)" stroke="#d9a520" stroke-width="2"></polygon>`
          + `<polygon points="${P([[b,0],[b+s,0],[b+s,h]])}" fill="rgba(255,143,107,.85)" stroke="var(--warn)"></polygon>`
          + `<polygon points="${P([[0,0],[s,0],[s,h]])}" fill="none" stroke="var(--warn)" stroke-width="2" stroke-dasharray="4 3"></polygon>`
          + `<text x="${X(s+ (b-s)/2)}" y="${Yv(h)-8}" fill="var(--ok)" font-size="14" text-anchor="middle">→ ghép thành chữ nhật ${b} × ${h}</text>`;
      }
      host.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">${body}`
        + `<line x1="${X(0)}" y1="${Yv(0)+8}" x2="${X(b)}" y2="${Yv(0)+8}" stroke="var(--accent)" stroke-width="2"></line>`
        + `<text x="${X(b/2)}" y="${Yv(0)+24}" fill="var(--accent)" font-size="14" text-anchor="middle">đáy = ${b}</text>`
        + `<text x="${X(s)+ -14}" y="${Yv(h/2)}" fill="var(--warn)" font-size="14" text-anchor="end">cao ${h}</text></svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, b = st.shBase, h = st.shHeight;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: một hình bình hành có đáy ${b} và đường cao ${h}.`, hint: 'Đưa tay ngang để nghiêng hình — hoặc chỉnh stepper Độ nghiêng.' };
      if (s === 2) return { cap: `Sơ đồ: cắt mảnh tam giác theo đường cao rồi ghép sang bên kia → hình chữ nhật ${b} × ${h}.`, hint: 'Bật "Cắt–ghép" để xem mảnh được dời đi.' };
      if (s === 3) return { cap: `Diện tích = đáy × cao = ${b} × ${h} = ${b*h}. ` + L.chot, hint: 'Nghiêng bao nhiêu thì diện tích vẫn không đổi.' };
      return { cap: `Cả lớp trả lời: hình này có diện tích bao nhiêu ô vuông? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `${st.shBase} × ${st.shHeight} = ${st.shBase*st.shHeight}`; },
    showFromStep() { return 3; },
    build3d(st) {
      const { shBase:b, shHeight:h, shShear:s, asRect } = st, g = new THREE.Group();
      const pts = asRect ? [[s,0],[b+s,0],[b+s,h],[s,h]] : [[0,0],[b,0],[b+s,h],[s,h]];
      const shp = new THREE.Shape(); shp.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) shp.lineTo(pts[i][0], pts[i][1]); shp.closePath();
      const geo = new THREE.ExtrudeGeometry(shp, { depth: 0.5, bevelEnabled: false });
      const midX = (pts[0][0] + pts[2][0]) / 2;
      geo.translate(-midX, -h/2, -0.25);
      g.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color:0xffd166, roughness:.55, metalness:.05 })));
      return g;
    },
    paint3d() {},
    hand() {},
    handLabel() { return ''; },
  },

  // ======================= Model: balance (cân hai đĩa — HAI TAY, hai vế) =======================
  // Lấy thật từ repo: "cân hai đĩa, mỗi đĩa chở một vế"; "đĩa nặng hơn hạ xuống và kim lệch khỏi vạch giữa";
  // "cân thăng bằng thì viết dấu = ở giữa hai vế". Cô giơ hai tay: tay trái = vế trái, tay phải = vế phải.
  balance: {
    twoHands: true,
    defaults(st, L) { st.balL = L.balL; st.balR = L.balR; },
    geomSig(st) { return 'bal' + st.balL + ':' + st.balR; },
    params() { return [{ key:'balL', label:'Vế trái (đĩa trái)', min:0, max:9 }, { key:'balR', label:'Vế phải (đĩa phải)', min:0, max:9 }]; },
    ctlHint() { return 'Bật camera rồi giơ HAI tay: tay trái đặt số khối đĩa trái, tay phải đặt đĩa phải. hoặc bấm +/−.'; },
    tiltDeg(st) { return clamp((st.balL - st.balR) * 5, -22, 22); }, // L nặng → đĩa trái hạ
    verdict(st) { return st.balL === st.balR ? '=' : (st.balL > st.balR ? '>' : '<'); },
    draw2d(host, st) {
      const cx = 260, cy = 92, HL = 168, SL = 60, q = 17, W = 520, H = 300;
      const rad = this.tiltDeg(st) * Math.PI / 180, v = this.verdict(st);
      const lx = cx - HL*Math.cos(rad), ly = cy + HL*Math.sin(rad);
      const rx = cx + HL*Math.cos(rad), ry = cy - HL*Math.sin(rad);
      const stack = (px, py, n) => { let s = ''; for (let k = 0; k < n; k++) { const yy = py - (k+1)*q - 2;
        s += `<rect x="${(px-q/2).toFixed(1)}" y="${yy.toFixed(1)}" width="${q}" height="${q-2}" rx="3" fill="var(--accent)" stroke="#d9a520"></rect>`; } return s; };
      const pan = (px, py) => `<path d="M ${px-30} ${py} Q ${px} ${py+22} ${px+30} ${py} Z" fill="rgba(255,255,255,.12)" stroke="var(--chalk)" stroke-width="2"></path>`;
      // kim lệch khỏi vạch giữa
      const nTip = { x: cx + 46*Math.sin(rad), y: cy - 46*Math.cos(rad) };
      host.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
        + `<line x1="${cx}" y1="${cy-6}" x2="${cx}" y2="${cy-58}" stroke="rgba(242,240,230,.35)" stroke-width="2" stroke-dasharray="4 4"></line>` // vạch giữa
        + `<line x1="${lx}" y1="${ly}" x2="${rx}" y2="${ry}" stroke="var(--chalk)" stroke-width="5" stroke-linecap="round"></line>` // thanh cân
        + `<line x1="${lx.toFixed(1)}" y1="${ly.toFixed(1)}" x2="${lx.toFixed(1)}" y2="${(ly+SL).toFixed(1)}" stroke="var(--chalk)" stroke-width="1.5"></line>`
        + `<line x1="${rx.toFixed(1)}" y1="${ry.toFixed(1)}" x2="${rx.toFixed(1)}" y2="${(ry+SL).toFixed(1)}" stroke="var(--chalk)" stroke-width="1.5"></line>`
        + pan(lx, ly+SL) + stack(lx, ly+SL, st.balL)
        + pan(rx, ry+SL) + stack(rx, ry+SL, st.balR)
        + `<polygon points="${cx-14},${cy+18} ${cx+14},${cy+18} ${cx},${cy}" fill="var(--chalk)"></polygon>` // trụ
        + `<line x1="${cx}" y1="${cy}" x2="${nTip.x.toFixed(1)}" y2="${nTip.y.toFixed(1)}" stroke="var(--warn)" stroke-width="3"></line>` // kim
        + `<text x="${lx.toFixed(1)}" y="${(ly+SL+42).toFixed(1)}" fill="var(--chalk)" font-size="20" text-anchor="middle">trái ${st.balL}</text>`
        + `<text x="${rx.toFixed(1)}" y="${(ry+SL+42).toFixed(1)}" fill="var(--chalk)" font-size="20" text-anchor="middle">phải ${st.balR}</text>`
        + `<text x="${cx}" y="${H-10}" fill="var(--accent)" font-size="30" font-weight="700" text-anchor="middle">${st.balL} ${v} ${st.balR}</text>`
        + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, v = this.verdict(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: đĩa trái chở ${st.balL} khối, đĩa phải chở ${st.balR} khối. ${v === '=' ? 'Cân thăng bằng.' : 'Đĩa ' + (v === '>' ? 'trái' : 'phải') + ' nặng hơn nên hạ xuống.'}`, hint: 'Giơ HAI tay (trái/phải) để đặt số khối mỗi đĩa, hoặc bấm +/−.' };
      if (s === 2) return { cap: `Sơ đồ: hai vế ${st.balL} ${v} ${st.balR}. Thêm (hay bớt) cùng một số khối vào CẢ HAI đĩa thì dấu ${v} không đổi.`, hint: 'Cân thăng bằng ⟺ hai vế bằng nhau.' };
      if (s === 3) return { cap: `Ghi nhớ: ${st.balL} ${v} ${st.balR}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: muốn cân thăng bằng thì phải làm thế nào? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `${st.balL} ${this.verdict(st)} ${st.balR}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; // màn chiếu mirror qua CSS → đảo trục
        if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.balL = clamp(l, 0, 5);
      if (r !== null) st.balR = clamp(r, 0, 5);
    },
    build3d(st) {
      const g = new THREE.Group(), pivot = new THREE.Group();
      pivot.rotation.z = this.tiltDeg(st) * Math.PI / 180;
      g.add(pivot); g.userData.pivot = pivot;
      const chalk = new THREE.MeshStandardMaterial({ color:0xf2f0e6, roughness:.6 });
      const HL = 2.0;
      const beam = new THREE.Mesh(new THREE.BoxGeometry(HL*2, 0.12, 0.12), chalk); pivot.add(beam);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.9, 12), chalk); post.position.set(0, -0.5, 0); pivot.add(post);
      const drop = (side, n) => {
        const x = side*HL;
        const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.55, 0.14, 20), new THREE.MeshStandardMaterial({ color:0x9fb0bd, roughness:.55 }));
        pan.position.set(x, -0.9, 0); pivot.add(pan);
        for (let k = 0; k < n; k++) {
          const c = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.44), new THREE.MeshStandardMaterial({ color:0xffd166, roughness:.6 }));
          c.position.set(x, -0.72 + 0.46*(k+1), 0); pivot.add(c);
        }
      };
      drop(-1, st.balL); drop(1, st.balR);
      return g;
    },
    paint3d(g, st) { if (g.userData.pivot) g.userData.pivot.rotation.z = this.tiltDeg(st) * Math.PI / 180; },
  },

  // ======================= Model: clock (đồng hồ — giờ/phút) =======================
  // Text lấy thật từ repo: khoi_dong "Kim dài chỉ số 6. Đó là 6 phút hay 30 phút?",
  // chot "mỗi số = 5 phút; kim ngắn chỉ giờ, kim dài chỉ phút"; error "nhầm 1 giờ = 100 phút".
  clock: {
    defaults(st, L) { st.hour = L.hour; st.minute = L.minute; },
    geomSig() { return 'clock'; },
    params() { return [{ key:'hour', label:'Giờ', min:1, max:12 }, { key:'minute', label:'Phút', min:0, max:59, step:5 }]; },
    ctlHint() { return 'Bấm/kéo trên mặt đồng hồ để quay KIM PHÚT (thuận chiều); giờ chỉnh bằng +/−. 1 giờ = 60 phút.'; },
    ang(st) { return { min: st.minute/60*2*Math.PI, hr: (((st.hour%12) + st.minute/60)/12)*2*Math.PI }; }, // góc quay thuận chiều từ số 12
    hourLabel(st) { return `${st.hour%12===0?12:st.hour%12} giờ ${st.minute} phút`; },
    draw2d(host, st) {
      const cx = 150, cy = 150, R = 138, a = this.ang(st);
      const tip = (ang, len) => [(cx+len*Math.sin(ang)), (cy-len*Math.cos(ang))];
      let ticks = '';
      for (let m = 0; m < 60; m++) { const A = m/60*2*Math.PI, maj = m%5===0, r0 = maj?116:126, r1 = 138;
        ticks += `<line x1="${(cx+r0*Math.sin(A)).toFixed(1)}" y1="${(cy-r0*Math.cos(A)).toFixed(1)}" x2="${(cx+r1*Math.sin(A)).toFixed(1)}" y2="${(cy-r1*Math.cos(A)).toFixed(1)}" stroke="${maj?'var(--chalk)':'rgba(242,240,230,.35)'}" stroke-width="${maj?3:1}"></line>`; }
      let nums = '';
      for (let n = 1; n <= 12; n++) { const A = n/12*2*Math.PI;
        nums += `<text x="${(cx+96*Math.sin(A)).toFixed(1)}" y="${(cy-96*Math.cos(A)+6).toFixed(1)}" fill="var(--accent)" font-size="19" font-weight="700" text-anchor="middle">${n}</text>`; }
      const hEnd = tip(a.hr,64), mEnd = tip(a.min,102), mLab = tip(a.min,120);
      host.innerHTML = `<svg id="clock" width="300" height="300" viewBox="0 0 300 300" style="cursor:pointer">`
        + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="rgba(0,0,0,.22)" stroke="var(--chalk)" stroke-width="3"></circle>`
        + ticks + nums
        + `<line x1="${cx}" y1="${cy}" x2="${hEnd[0].toFixed(1)}" y2="${hEnd[1].toFixed(1)}" stroke="var(--chalk)" stroke-width="7" stroke-linecap="round"></line>`
        + `<line x1="${cx}" y1="${cy}" x2="${mEnd[0].toFixed(1)}" y2="${mEnd[1].toFixed(1)}" stroke="var(--warn)" stroke-width="4" stroke-linecap="round"></line>`
        + `<text x="${mLab[0].toFixed(1)}" y="${mLab[1].toFixed(1)}" fill="var(--warn)" font-size="12" text-anchor="middle">${st.minute}′</text>`
        + `<circle cx="${cx}" cy="${cy}" r="6" fill="var(--chalk)"></circle></svg>`;
      const svg = host.querySelector('#clock');
      const setFrom = (e) => { const r = svg.getBoundingClientRect();
        const px = (e.clientX-r.left)/r.width*300, py = (e.clientY-r.top)/r.height*300;
        let A = Math.atan2(px-cx, cy-py); if (A < 0) A += 2*Math.PI;
        state.minute = Math.round(A/(2*Math.PI)*60) % 60; drawVisual(); render(); };
      svg.addEventListener('pointerdown', setFrom);
    },
    caption(st) {
      const L = cur(), s = st.step, idx = Math.round(st.minute/5)%12, numShown = idx===0?12:idx, minAt = idx*5;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: đồng hồ đang chỉ ${this.hourLabel(st)}. Kim dài màu cam chỉ PHÚT, kim ngắn chỉ GIỜ.`, hint: 'Bấm/kéo trên mặt đồng hồ để quay kim phút — kim giờ tự nhích theo.' };
      if (s === 2) return { cap: `Sơ đồ: mỗi số = 5 phút. Kim phút chỉ số ${numShown} → ${minAt} phút, KHÔNG phải ${numShown} phút. Vòng kim phút = 60 phút = 1 giờ.`, hint: 'Đừng nhầm 1 giờ = 100 phút.' };
      if (s === 3) return { cap: `Đọc: ${this.hourLabel(st)}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: đồng hồ chỉ mấy giờ, mấy phút? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return this.hourLabel(st); },
    showFromStep() { return 2; },
    build3d(st) {
      const g = new THREE.Group();
      const face = new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,0.12,48), new THREE.MeshStandardMaterial({ color:0x24372f, roughness:.85 }));
      face.rotation.x = Math.PI/2; g.add(face);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.4,0.05,8,48), new THREE.MeshStandardMaterial({ color:0xf2f0e6 })); rim.position.z = 0.02; g.add(rim);
      for (let n = 0; n < 12; n++) { const A = n/12*2*Math.PI;
        const mk = new THREE.Mesh(new THREE.BoxGeometry(0.08,0.24,0.06), new THREE.MeshStandardMaterial({ color: n%3===0?0xffd166:0x9fb0bd }));
        mk.position.set(1.18*Math.sin(A), 1.18*Math.cos(A), 0.1); mk.rotation.z = -A; g.add(mk); }
      const mkHand = (len,wid,col) => { const grp = new THREE.Group();
        const m = new THREE.Mesh(new THREE.BoxGeometry(wid,len,0.06), new THREE.MeshStandardMaterial({ color:col, roughness:.5 }));
        m.position.y = len/2; grp.add(m); grp.position.z = 0.14; g.add(grp); return grp; };
      g.userData.hr = mkHand(0.72,0.14,0xf2f0e6); g.userData.min = mkHand(1.12,0.08,0xff8f6b);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.34,16), new THREE.MeshStandardMaterial({ color:0xffffff }));
      hub.rotation.x = Math.PI/2; hub.position.z = 0.18; g.add(hub);
      return g;
    },
    paint3d(g, st) { if (!g.userData.hr) return; const a = this.ang(st); g.userData.hr.rotation.z = -a.hr; g.userData.min.rotation.z = -a.min; },
    hand() {},
    handLabel() { return ''; },
  },

  // ======================= Model: goc (góc — thước nửa tròn) =======================
  // Repo: khoi_dong "cánh cửa mở hé vs mở toang", chot "vuông 90° / nhọn <90 / tù 90–180 / bẹt 180";
  // ngon_tay "quẹt để quay cạnh thứ hai; quạt tô đậm theo độ mở"; error "đọc thang đo ngược".
  goc: {
    usesPalm: true,
    defaults(st, L) { st.goc = L.goc; },
    palmToValue(st, x) { st.goc = clamp(Math.round((1 - x) * 180), 0, 180); },
    palmLabel(st) { return `góc ${st.goc}°`; },
    geomSig(st) { return 'goc' + st.goc; },
    type(deg) { return deg === 90 ? 'vuông' : deg === 180 ? 'bẹt' : deg < 90 ? 'nhọn' : 'tù'; },
    params() { return [{ key:'goc', label:'Số đo góc (độ)', min:0, max:180, step:5 }]; },
    ctlHint() { return 'Đưa tay ngang để mở rộng góc (quay cạnh thứ hai), hoặc bấm trên cung; chỉnh số đo bằng +/−.'; },
    draw2d(host, st) {
      const cx = 54, cy = 198, R = 150, W = 250, H = 232, deg = st.goc;
      const P = (th, r) => [cx + r*Math.cos(th), cy - r*Math.sin(th)];
      let ticks = '';
      for (let a = 0; a <= 180; a += 5) { const th = a*Math.PI/180, maj = a%10 === 0, r0 = maj?R-13:R-7, r1 = R;
        const p0 = P(th, r0), p1 = P(th, r1);
        ticks += `<line x1="${p0[0].toFixed(1)}" y1="${p0[1].toFixed(1)}" x2="${p1[0].toFixed(1)}" y2="${p1[1].toFixed(1)}" stroke="var(--chalk)" stroke-width="${maj?1.8:0.8}" opacity="${maj?0.9:0.5}"></line>`;
        if (maj) { const pl = P(th, R+11); ticks += `<text x="${pl[0].toFixed(1)}" y="${(pl[1]+3).toFixed(1)}" fill="rgba(242,240,230,.7)" font-size="9" text-anchor="middle">${a}</text>`; } }
      let sector = `M ${cx} ${cy}`;
      for (let a = 0; a <= deg; a += 6) { const p = P(a*Math.PI/180, R*0.6); sector += ` L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`; }
      const pe = P(deg*Math.PI/180, R*0.6); sector += ` L ${pe[0].toFixed(1)} ${pe[1].toFixed(1)} Z`;
      const b = P(0, R), e2 = P(deg*Math.PI/180, R);
      const sq = deg === 90 ? `<path d="M ${cx+15} ${cy} L ${cx+15} ${cy-15} L ${cx} ${cy-15}" fill="none" stroke="var(--ok)" stroke-width="2"></path>` : '';
      const lb = P(deg*Math.PI/180/2, R*0.78);
      host.innerHTML = `<svg id="goc" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="cursor:pointer">`
        + `<path d="M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}" fill="none" stroke="rgba(242,240,230,.4)" stroke-width="2"></path>`
        + ticks
        + `<path d="${sector}" fill="var(--accent)" opacity="0.32" stroke="none"></path>`
        + `<line x1="${cx}" y1="${cy}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="var(--chalk)" stroke-width="3"></line>`
        + `<line x1="${cx}" y1="${cy}" x2="${e2[0].toFixed(1)}" y2="${e2[1].toFixed(1)}" stroke="var(--warn)" stroke-width="3"></line>`
        + sq
        + `<text x="${lb[0].toFixed(1)}" y="${lb[1].toFixed(1)}" fill="var(--accent)" font-size="16" font-weight="700" text-anchor="middle">${deg}°</text>`
        + `<circle cx="${cx}" cy="${cy}" r="4.5" fill="var(--chalk)"></circle>`
        + `<text x="${(b[0]+2).toFixed(1)}" y="${(b[1]+14).toFixed(1)}" fill="rgba(242,240,230,.6)" font-size="11">cạnh góc</text></svg>`;
      const svg = host.querySelector('#goc');
      svg.addEventListener('pointerdown', (e) => { const r = svg.getBoundingClientRect();
        const px = (e.clientX-r.left)/r.width*W, py = (e.clientY-r.top)/r.height*H;
        let th = Math.atan2(cy-py, px-cx)*180/Math.PI; if (th < 0) th += 360;
        if (th > 180) th = th < 270 ? 180 : 0; // dưới cạnh góc → kẹp về 0/180
        state.goc = clamp(Math.round(th), 0, 180); drawVisual(); render(); });
    },
    caption(st) {
      const L = cur(), s = st.step, d = st.goc, tp = this.type(d);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hai cạnh chung một đỉnh mở ra ${d}°. Phần quạt tô đậm cho thấy độ lớn của góc.`, hint: 'Đưa tay ngang để mở rộng góc, hoặc bấm trên cung.' };
      if (s === 2) return { cap: `Sơ đồ: thước nửa tròn — vạch mỗi 10° có số. Góc ${d}° = ${d/10} vạch 10°. Đọc theo thang trùng cạnh gốc (bên phải).`, hint: `Đừng đọc thang ngược: ${d}° ≠ ${180-d}°.` };
      if (s === 3) return { cap: `Góc ${d}° là góc ${tp}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: góc này là góc nhọn, vuông, tù hay bẹt? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `${st.goc}° — góc ${this.type(st.goc)}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const g = new THREE.Group(), rad = st.goc*Math.PI/180;
      const col = (c) => new THREE.MeshStandardMaterial({ color:c, roughness:.6 });
      const sector = new THREE.Mesh(new THREE.CircleGeometry(1.35, 44, 0, rad),
        new THREE.MeshStandardMaterial({ color:0xffd166, roughness:.6, side:THREE.DoubleSide }));
      sector.position.z = 0.001; g.add(sector);
      const mkRay = (rot) => { const grp = new THREE.Group();
        const m = new THREE.Mesh(new THREE.BoxGeometry(1.75,0.09,0.06), col(0xf2f0e6)); m.position.x = 0.875; grp.add(m);
        grp.rotation.z = rot; grp.position.z = 0.03; g.add(grp); return grp; };
      mkRay(0); mkRay(rad);
      const hub = new THREE.Mesh(new THREE.SphereGeometry(0.11,12,12), col(0xffffff)); hub.position.z = 0.05; g.add(hub);
      return g;
    },
    paint3d() {},
    hand() {},
    handLabel() { return ''; },
  },

  // ======================= Model: cube (thể tích — xếp khối 1 cm³) =======================
  // Repo: "hộp trong suốt + khay khối 1 cm³"; "xếp kín một lớp đáy rồi nhân lớp lên một tầng";
  // dài × rộng × cao, đơn vị cm³. Ngón tay = số TẦNG (nhân lớp đáy lên).
  cube: {
    defaults(st, L) { st.cL = L.cL; st.cW = L.cW; st.cH = L.cH; },
    geomSig(st) { return 'cube' + st.cL + 'x' + st.cW + 'x' + st.cH; },
    params() { return [{ key:'cL', label:'Dài (khối)', min:1, max:4 }, { key:'cW', label:'Rộng (khối)', min:1, max:4 }, { key:'cH', label:'Cao (số tầng)', min:1, max:4 }]; },
    ctlHint() { return 'Giơ 1–4 ngón = số TẦNG, hoặc bấm +/− cho dài/rộng/cao. cm³ = dài × rộng × cao.'; },
    draw2d(host, st) {
      const { cL:L, cW:W, cH:H } = st, u = 24, Dx = 11, Dy = -7, pad = 16;
      const X0 = pad, Y0 = pad + (-Dy)*W;
      const Wpx = pad*2 + L*u + W*Dx, Hpx = pad*2 + H*u + (-Dy)*W;
      const cubeAt = (sx, sy) =>
        `<polygon points="${sx},${sy} ${sx+u},${sy} ${sx+u+Dx},${sy+Dy} ${sx+Dx},${sy+Dy}" fill="#ffe6a0" stroke="#c99a2a" stroke-width="1"></polygon>`
        + `<polygon points="${sx+u},${sy} ${sx+u},${sy+u} ${sx+u+Dx},${sy+u+Dy} ${sx+Dx},${sy+Dy}" fill="#d9a520" stroke="#b8891a" stroke-width="1"></polygon>`
        + `<rect x="${sx}" y="${sy}" width="${u}" height="${u}" fill="var(--accent)" stroke="#c99a2a" stroke-width="1"></rect>`;
      let s = '';
      for (let k = 0; k < H; k++) for (let j = W-1; j >= 0; j--) for (let i = 0; i < L; i++) {
        s += cubeAt(X0 + i*u + j*Dx, Y0 + (H-1-k)*u + j*Dy);
      }
      host.innerHTML = `<svg width="${Wpx}" height="${Hpx}" viewBox="0 0 ${Wpx} ${Hpx}">${s}</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, { cL, cW, cH } = st, lop = cL*cW, tot = cL*cW*cH;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: mỗi lớp đáy xếp ${cL} × ${cW} = ${lop} khối 1 cm³. Hộp cao ${cH} tầng.`, hint: 'Giơ 1–4 ngón để đặt số tầng, hoặc bấm +/− cho dài/rộng/cao.' };
      if (s === 2) return { cap: `Sơ đồ: 1 lớp đáy = ${lop} cm³. Có ${cH} lớp như thế → ${lop} × ${cH}.`, hint: 'Xếp kín một lớp đáy rồi nhân số lớp.' };
      if (s === 3) return { cap: `Thể tích = ${cL} × ${cW} × ${cH} = ${tot} cm³. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: hộp này chứa bao nhiêu khối 1 cm³? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `${st.cL} × ${st.cW} × ${st.cH} = ${st.cL*st.cW*st.cH} cm³`; },
    showFromStep() { return 3; },
    hand(st, f) { st.cH = clamp(f, 1, 4); },
    handLabel(f, st) { return `→ ${clamp(f,1,4)} tầng`; },
    build3d(st) {
      const { cL:L, cW:W, cH:H } = st, g = new THREE.Group(), sp = 1.0, r = 0.46;
      for (let k = 0; k < H; k++) for (let j = 0; j < W; j++) for (let i = 0; i < L; i++) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(r*2, r*2, r*2),
          new THREE.MeshStandardMaterial({ color: k === H-1 ? 0xffd166 : 0xd9a520, roughness:.6, metalness:.04 }));
        m.position.set((i-(L-1)/2)*sp, (k-(H-1)/2)*sp, (j-(W-1)/2)*sp);
        g.add(m);
      }
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: grid100 (lưới 100 ô — số thập phân & phần trăm) =======================
  // Repo: "hình vuông đơn vị phủ lưới 100 ô + vạch trượt"; "kéo vạch trượt tô dần số ô; vượt 10 ô gộp thành 1 phần mười";
  // phan-tram: "kéo thanh trượt %, lưới tô đúng số ô, bảng giá tự tính". MỘT model cho HAI bài.
  grid100: {
    usesPalm: true,
    defaults(st, L) { st.g100 = L.g100; },
    palmToValue(st, x) { st.g100 = clamp(Math.round((1 - x) * 100), 0, 100); },
    palmLabel(st) { return `đã tô ${st.g100}/100 ô`; },
    geomSig() { return 'g100'; },
    fmt() { return cur().fmt || 'decimal'; },
    dec(g) { return g >= 100 ? '1' : (g === 0 ? '0' : '0,' + (g < 10 ? '0' : '') + g); },
    params() { return [{ key:'g100', label:'Số ô đã tô', min:0, max:100, step:5 }]; },
    ctlHint() { return this.fmt() === 'percent'
      ? 'Kéo thanh trượt / đưa tay ngang để chọn % giảm; hoặc bấm vào ô.'
      : 'Đưa tay ngang kéo vạch trượt tô dần ô; hoặc bấm vào ô. Mỗi hàng 10 ô = 1 phần mười.'; },
    draw2d(host, st) {
      const cs = 22, gp = 2, pad = 14, N = 10, W = pad*2 + N*cs + (N-1)*gp, Hh = W;
      let s = '';
      for (let idx = 0; idx < 100; idx++) { const r = Math.floor(idx/N), c = idx%N;
        const x = pad + c*(cs+gp), y = pad + r*(cs+gp), on = idx < st.g100;
        s += `<rect x="${x}" y="${y}" width="${cs}" height="${cs}" rx="2" fill="${on?'var(--accent)':'rgba(255,255,255,.07)'}" stroke="${on?'#d9a520':'rgba(242,240,230,.18)'}" stroke-width="1"></rect>`; }
      for (let r = 1; r < N; r++) { const y = pad + r*(cs+gp) - gp/2 - 1;
        s += `<line x1="${pad-4}" y1="${y}" x2="${W-pad+4}" y2="${y}" stroke="rgba(242,240,230,.35)" stroke-width="1.5"></line>`; }
      const lab = this.fmt() === 'percent' ? `${st.g100}%` : `${st.g100}/100 = ${this.dec(st.g100)}`;
      host.innerHTML = `<svg id="g100" width="${W}" height="${Hh+26}" viewBox="0 0 ${W} ${Hh+26}" style="cursor:pointer">${s}`
        + `<text x="${pad}" y="${Hh+20}" fill="var(--accent)" font-size="17" font-weight="700">${lab}</text>`
        + `<text x="${W-pad}" y="${Hh+20}" fill="rgba(242,240,230,.6)" font-size="12" text-anchor="end">hàng ${Math.floor(st.g100/10)} · lẻ ${st.g100%10}</text></svg>`;
      const svg = host.querySelector('#g100');
      svg.addEventListener('pointerdown', (e) => { const r = svg.getBoundingClientRect();
        const px = (e.clientX-r.left)/r.width*W, py = (e.clientY-r.top)/r.height*(Hh+26);
        const c = Math.floor((px-pad)/(cs+gp)), rr = Math.floor((py-pad)/(cs+gp));
        if (c < 0 || c >= N || rr < 0 || rr >= N) return;
        state.g100 = clamp(rr*N + c + 1, 0, 100); drawVisual(); render(); });
    },
    caption(st) {
      const L = cur(), s = st.step, g = st.g100, fmt = this.fmt(), gia = L.gia || 0;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return fmt === 'percent'
        ? { cap: `Vật thật: lưới 100 ô, mỗi ô = 1%. Đang tô ${g} ô = ${g}% giá được giảm.`, hint: 'Đưa tay ngang chọn %, hoặc bấm vào ô.' }
        : { cap: `Vật thật: hình vuông đơn vị chia 100 ô, đã tô ${g} ô. Mỗi hàng 10 ô = 1 phần mười, mỗi ô = 1 phần trăm.`, hint: 'Đưa tay ngang kéo vạch trượt tô thêm/bớt ô, hoặc bấm vào ô.' };
      if (s === 2) return fmt === 'percent'
        ? { cap: `Sơ đồ: ${g}/100 ô = ${g}%.`, hint: 'Đọc tỉ lệ bằng số ô đã tô.' }
        : { cap: `Sơ đồ: ${Math.floor(g/10)} hàng = ${Math.floor(g/10)} phần mười, ${g%10} ô = ${g%10} phần trăm → ${g}/100.`, hint: 'Đếm hàng trước, ô lẻ sau.' };
      if (s === 3) return fmt === 'percent'
        ? { cap: `${gia} nghìn × ${g}% = ${gia*g/100} nghìn được giảm → phải trả ${gia - gia*g/100} nghìn. ` + L.chot, hint: '' }
        : { cap: `${g}/100 = ${this.dec(g)}. ` + L.chot, hint: '' };
      return fmt === 'percent'
        ? { cap: `Cả lớp trả lời: phải trả bao nhiêu tiền? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' }
        : { cap: `Cả lớp trả lời: phần đã tô viết thành số thập phân nào? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return this.fmt() === 'percent' ? `${st.g100}%` : `${st.g100}/100 = ${this.dec(st.g100)}`; },
    showFromStep() { return 2; },
    build3d() {
      const g = new THREE.Group(), N = 10, sp = 1.0, geo = new THREE.BoxGeometry(0.9, 0.16, 0.9);
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color:0x4d635a, roughness:.6 }));
        m.position.set((c-(N-1)/2)*sp, 0, (r-(N-1)/2)*sp); m.userData.idx = r*N + c; g.add(m);
      }
      return g;
    },
    paint3d(g, st) { for (const m of g.children) if (m.userData.idx != null) m.material.color.set(m.userData.idx < st.g100 ? 0xffd166 : 0x4d635a); },
    hand() {},
    handLabel() { return ''; },
  },

  // ======================= Model: bar (biểu đồ cột — đường dóng ra trục) =======================
  // Repo: "kéo ô thả vào cột, cột đầy từ dưới lên, tự hiện số ở đỉnh"; "kẻ đường dóng ngang từ đỉnh cột
  // sang trục số để đọc giá trị, CẤM ước lượng bằng mắt". Bấm cột để chọn, ngón tay đặt chiều cao cột đó.
  bar: {
    defaults(st, L) { st.b0 = L.b0; st.b1 = L.b1; st.b2 = L.b2; st.b3 = L.b3; st.barSel = L.barSel; st.dong = L.dong; },
    vals(st) { return [st.b0, st.b1, st.b2, st.b3]; },
    cats() { return cur().cats || ['A', 'B', 'C', 'D']; },
    geomSig(st) { return 'bar' + this.vals(st).join('-') + ':' + st.barSel; },
    params() { const c = this.cats(); return [
      { key:'b0', label:'Cột ' + c[0], min:0, max:9 }, { key:'b1', label:'Cột ' + c[1], min:0, max:9 },
      { key:'b2', label:'Cột ' + c[2], min:0, max:9 }, { key:'b3', label:'Cột ' + c[3], min:0, max:9 }]; },
    toggles() { return [{ key:'dong', label:'Đường dóng ngang sang trục giá trị' }]; },
    ctlHint() { return 'Bấm vào cột để CHỌN, giơ 0–9 ngón đặt chiều cao cột đó, hoặc +/− từng cột.'; },
    draw2d(host, st) {
      const cats = this.cats(), dv = cur().danvi || '', vals = this.vals(st), n = cats.length;
      const pad = 44, base = 184, top = 30, u = (base - top)/10, bw = 48, gap = 22;
      const W = pad + 26 + n*(bw+gap), Hh = base + 32, bx = i => pad + 26 + i*(bw+gap);
      let grid = '';
      for (let v = 0; v <= 10; v += 2) { const y = base - v*u;
        grid += `<line x1="${pad}" y1="${y.toFixed(1)}" x2="${W-gap}" y2="${y.toFixed(1)}" stroke="rgba(242,240,230,.12)" stroke-width="1"></line>`
          + `<text x="${pad-6}" y="${(y+4).toFixed(1)}" fill="rgba(242,240,230,.6)" font-size="12" text-anchor="end">${v}</text>`; }
      let cols = '';
      for (let i = 0; i < n; i++) { const v = vals[i], y = base - v*u, sel = i === st.barSel;
        cols += `<g data-bar="${i}" style="cursor:pointer"><rect x="${bx(i)}" y="${y.toFixed(1)}" width="${bw}" height="${(v*u).toFixed(1)}" fill="${sel?'var(--accent)':'rgba(255,209,102,.5)'}" stroke="${sel?'#fff':'#d9a520'}" stroke-width="${sel?2.5:1.5}"></rect>`;
        for (let k = 1; k < v; k++) { const yy = base - k*u; cols += `<line x1="${bx(i)}" y1="${yy.toFixed(1)}" x2="${bx(i)+bw}" y2="${yy.toFixed(1)}" stroke="rgba(0,0,0,.25)" stroke-width="1"></line>`; }
        cols += `<text x="${bx(i)+bw/2}" y="${(y-6).toFixed(1)}" fill="var(--chalk)" font-size="15" font-weight="700" text-anchor="middle">${v}</text>`
          + `<text x="${bx(i)+bw/2}" y="${base+18}" fill="rgba(242,240,230,.8)" font-size="12" text-anchor="middle">${cats[i]}</text></g>`; }
      let dong = '';
      if (st.dong) { const i = st.barSel, v = vals[i], y = base - v*u;
        dong = `<line x1="${bx(i)}" y1="${y.toFixed(1)}" x2="${pad}" y2="${y.toFixed(1)}" stroke="var(--warn)" stroke-width="2.5" stroke-dasharray="7 5"></line>`
          + `<path d="M ${pad} ${y.toFixed(1)} l 11 -5.5 l 0 11 Z" fill="var(--warn)"></path>`; }
      host.innerHTML = `<svg id="bar" width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">`
        + grid
        + `<line x1="${pad}" y1="${top-10}" x2="${pad}" y2="${base}" stroke="var(--chalk)" stroke-width="2"></line>`
        + `<line x1="${pad}" y1="${base}" x2="${W-gap}" y2="${base}" stroke="var(--chalk)" stroke-width="2"></line>`
        + cols + dong
        + `<text x="${W-gap}" y="${top-14}" fill="rgba(242,240,230,.55)" font-size="11" text-anchor="end">trục số lượng (${dv})</text></svg>`;
      const svg = host.querySelector('#bar');
      svg.addEventListener('pointerdown', (e) => { const r = svg.getBoundingClientRect();
        const px = (e.clientX-r.left)/r.width*W;
        for (let i = 0; i < n; i++) if (px >= bx(i)-gap/2 && px <= bx(i)+bw+gap/2) { state.barSel = i; drawVisual(); render(); return; } });
    },
    caption(st) {
      const L = cur(), s = st.step, cats = this.cats(), dv = L.danvi || '', vals = this.vals(st), i = st.barSel;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: biểu đồ cột số ${dv} yêu thích. Cột '${cats[i]}' cao ${vals[i]} ô.`, hint: 'Bấm vào cột để chọn, giơ ngón tay đặt chiều cao cột đó.' };
      if (s === 2) return { cap: `Sơ đồ: dóng ngang từ ĐỈNH cột '${cats[i]}' (${vals[i]} ô) sang trục số → đọc đúng vạch ${vals[i]}. Bật "Đường dóng" để thấy.`, hint: 'Cấm ước lượng bằng mắt — phải dóng ra trục.' };
      if (s === 3) { const mx = vals.indexOf(Math.max(...vals)); return { cap: `Đọc: ${cats[i]} = ${vals[i]} ${dv}; nhiều nhất là ${cats[mx]} (${vals[mx]} ${dv}). ` + L.chot, hint: '' }; }
      return { cap: `Cả lớp trả lời: cột nào cao nhất, có bao nhiêu ${dv}? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const dv = cur().danvi || ''; return `${this.cats()[st.barSel]} = ${this.vals(st)[st.barSel]} ${dv}`; },
    showFromStep() { return 2; },
    hand(st, f) { st['b' + st.barSel] = clamp(f, 0, 9); },
    handLabel(f, st) { return `→ cột ${this.cats()[st.barSel]} = ${clamp(f, 0, 9)}`; },
    build3d(st) {
      const g = new THREE.Group(), vals = this.vals(st);
      for (let i = 0; i < vals.length; i++) { const x = (i-1.5)*1.3;
        for (let k = 0; k < vals[i]; k++) {
          const m = new THREE.Mesh(new THREE.BoxGeometry(1,0.9,1), new THREE.MeshStandardMaterial({ color: i===st.barSel?0xffd166:0x8fa0ad, roughness:.6 }));
          m.position.set(x, k*0.9+0.45, 0); g.add(m); } }
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: mean (trung bình cộng — san đều mực nước) =======================
  // Repo bang-so-lieu: "số trung bình cộng bằng tổng chia cho số phần tử"; dạy bằng hình ảnh
  // "san bằng": ô THỪA ở cột cao (cam) dịch xuống ô TRỐNG ở cột thấp cho tới khi mọi cột cao
  // bằng nhau = MỰC NƯỚC trung bình. Bấm cột để CHỌN, đưa tay ngang đặt chiều cao cột đó.
  mean: {
    usesPalm: true,
    defaults(st, L) { st.q0 = L.q0; st.q1 = L.q1; st.q2 = L.q2; st.q3 = L.q3; st.qSel = L.qSel; st.san = L.san; },
    vals(st) { return [st.q0, st.q1, st.q2, st.q3]; },
    sum(st) { return this.vals(st).reduce((a, b) => a + b, 0); },
    avg(st) { return this.sum(st) / this.vals(st).length; },
    cats() { return cur().cats || ['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4']; },
    fmtA(a) { return Number.isInteger(a) ? String(a) : String(a).replace('.', ','); },
    palmToValue(st, x) { st['q' + st.qSel] = clamp(Math.round((1 - x) * 9), 0, 9); },
    palmLabel(st) { return `cột ${this.cats()[st.qSel]} = ${st['q' + st.qSel]}`; },
    geomSig(st) { return 'mean' + this.vals(st).join('-') + ':' + (st.san ? 1 : 0) + ':' + st.qSel; },
    params() { const c = this.cats(); return [
      { key:'q0', label:c[0], min:0, max:9 }, { key:'q1', label:c[1], min:0, max:9 },
      { key:'q2', label:c[2], min:0, max:9 }, { key:'q3', label:c[3], min:0, max:9 }]; },
    toggles() { return [{ key:'san', label:'San đều — vạch trung bình + phần thừa/thiếu' }]; },
    ctlHint() { return 'Bấm cột để CHỌN, đưa tay ngang đặt chiều cao cột đó, hoặc +/− từng cột. Bật "San đều" để thấy mực nước trung bình.'; },
    draw2d(host, st) {
      const cats = this.cats(), dv = cur().danvi || '', vals = this.vals(st), n = cats.length, A = this.avg(st);
      const pad = 44, base = 184, top = 30, u = (base - top)/10, bw = 48, gap = 22;
      const W = pad + 26 + n*(bw + gap), Hh = base + 34, bx = i => pad + 26 + i*(bw + gap);
      let grid = '';
      for (let v = 0; v <= 10; v += 2) { const y = base - v*u;
        grid += `<line x1="${pad}" y1="${y.toFixed(1)}" x2="${W-gap}" y2="${y.toFixed(1)}" stroke="rgba(242,240,230,.12)" stroke-width="1"></line>`
          + `<text x="${pad-6}" y="${(y+4).toFixed(1)}" fill="rgba(242,240,230,.6)" font-size="12" text-anchor="end">${v}</text>`; }
      let cells = '';
      for (let i = 0; i < n; i++) { const v = vals[i], sel = i === st.qSel;
        for (let k = 0; k < v; k++) { const y = base - (k+1)*u, over = st.san && (k+1) > A;
          const fill = over ? 'rgba(224,121,31,.85)' : (st.san ? 'rgba(255,209,102,.6)' : (sel ? 'var(--accent)' : 'rgba(255,209,102,.5)'));
          cells += `<rect x="${bx(i)}" y="${y.toFixed(1)}" width="${bw}" height="${u.toFixed(1)}" fill="${fill}" stroke="${sel?'#fff':'#d9a520'}" stroke-width="${sel?2:1}"></rect>`; }
        if (st.san) for (let k = v; k < A; k++) { const y = base - (k+1)*u;
          cells += `<rect x="${bx(i)}" y="${y.toFixed(1)}" width="${bw}" height="${u.toFixed(1)}" fill="none" stroke="var(--chalk)" stroke-dasharray="4 3" stroke-width="1"></rect>`; }
        cells += `<text x="${bx(i)+bw/2}" y="${(base - v*u - 6).toFixed(1)}" fill="var(--chalk)" font-size="15" font-weight="700" text-anchor="middle">${v}</text>`
          + `<text x="${bx(i)+bw/2}" y="${base+18}" fill="rgba(242,240,230,.8)" font-size="12" text-anchor="middle">${cats[i]}</text>`; }
      let ml = '';
      if (st.san) { const y = base - A*u;
        ml = `<line x1="${pad}" y1="${y.toFixed(1)}" x2="${W-gap}" y2="${y.toFixed(1)}" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="8 5"></line>`
          + `<text x="${W-gap}" y="${(y-6).toFixed(1)}" fill="var(--accent)" font-size="12" text-anchor="end">TB = ${this.fmtA(A)} ${dv}</text>`; }
      host.innerHTML = `<svg id="mean" width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}" style="cursor:pointer">`
        + grid
        + `<line x1="${pad}" y1="${top-10}" x2="${pad}" y2="${base}" stroke="var(--chalk)" stroke-width="2"></line>`
        + `<line x1="${pad}" y1="${base}" x2="${W-gap}" y2="${base}" stroke="var(--chalk)" stroke-width="2"></line>`
        + cells + ml + `</svg>`;
      const svg = host.querySelector('#mean');
      svg.addEventListener('pointerdown', (e) => { const r = svg.getBoundingClientRect();
        const px = (e.clientX - r.left)/r.width*W;
        for (let i = 0; i < n; i++) if (px >= bx(i)-gap/2 && px <= bx(i)+bw+gap/2) { state.qSel = i; drawVisual(); render(); return; } });
    },
    caption(st) {
      const L = cur(), s = st.step, cats = this.cats(), dv = L.danvi || '', vals = this.vals(st), A = this.avg(st), sum = this.sum(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${cats.join(', ')} hái được ${vals.join(', ')} ${dv}. Tổng = ${sum} ${dv}, chia đều cho ${vals.length} cột.`, hint: 'Bấm cột để chọn, đưa tay ngang đổi chiều cao cột đó, hoặc +/−.' };
      if (s === 2) return { cap: `Sơ đồ: "san đều" — ô cam là phần THỪA ở cột cao, ô viền là chỗ TRỐNG ở cột thấp. Chuyển phần thừa xuống cho tới khi mọi cột cao bằng nhau = ${this.fmtA(A)} ô (vạch mực nước).`, hint: 'Trung bình cộng chính là MỰC NƯỚC khi san bằng.' };
      if (s === 3) return { cap: `Phép tính: Trung bình cộng = tổng : số phần = ${sum} : ${vals.length} = ${this.fmtA(A)}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: trung bình mỗi tổ hái được bao nhiêu ${dv}? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const dv = cur().danvi || ''; return `Trung bình cộng = ${this.fmtA(this.avg(st))} ${dv}`.trim(); },
    showFromStep() { return 2; },
    hand() {},
    handLabel() { return ''; },
    build3d(st) {
      const g = new THREE.Group(), vals = this.vals(st), A = this.avg(st);
      for (let i = 0; i < vals.length; i++) { const x = (i-1.5)*1.3;
        for (let k = 0; k < vals[i]; k++) { const over = st.san && (k+1) > A;
          const col = st.san ? (over ? 0xe0791f : 0xffd166) : (i === st.qSel ? 0xffd166 : 0x8fa0ad);
          const m = new THREE.Mesh(new THREE.BoxGeometry(1,0.9,1), new THREE.MeshStandardMaterial({ color:col, roughness:.6 }));
          m.position.set(x, k*0.9+0.45, 0); g.add(m); } }
      if (st.san) { const slab = new THREE.Mesh(new THREE.BoxGeometry(vals.length*1.3+0.2, 0.06, 1.3),
        new THREE.MeshStandardMaterial({ color:0xffffff, transparent:true, opacity:.5 }));
        slab.position.set(0, A*0.9, 0); g.add(slab); }
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: tape (sơ đồ đoạn thẳng — tổng & tỉ số) =======================
  // Repo ti-so-tong-hieu: "sơ đồ đoạn thẳng chia đúng số phần bằng nhau của tỉ số"; "giá trị một
  // phần bằng tổng chia cho tổng số phần". Vẽ thanh TỔNG = (a+b) phần bằng nhau, rồi tách thành
  // hai hàng theo tỉ số. Đưa tay ngang đổi giá trị MỘT PHẦN → tổng đổi theo, hiểu ngay 1 phần : tổng.
  tape: {
    usesPalm: true,
    defaults(st, L) { st.tpA = L.tpA; st.tpB = L.tpB; st.tpTong = L.tpTong; st.tpShow = L.tpShow; },
    unit(st) { return st.tpTong / (st.tpA + st.tpB); },
    fmt(n) { return Number.isInteger(n) ? String(n) : String(n).replace('.', ','); },
    labels() { return cur().labels || ['Số thứ nhất', 'Số thứ hai']; },
    palmToValue(st, x) { const ab = st.tpA + st.tpB; st.tpTong = clamp(Math.round((1 - x) * 10), 1, 10) * ab; },
    palmLabel(st) { return `mỗi phần = ${this.fmt(this.unit(st))} → tổng ${st.tpTong}`; },
    geomSig(st) { return 'tape' + st.tpA + ':' + st.tpB; },
    params() { const l = this.labels(); return [
      { key:'tpA', label:'Số phần ' + l[0], min:1, max:5 },
      { key:'tpB', label:'Số phần ' + l[1], min:1, max:6 },
      { key:'tpTong', label:'Tổng', min:3, max:96 }]; },
    toggles() { return [{ key:'tpShow', label:'Hiện giá trị mỗi phần và hai số' }]; },
    ctlHint() { return 'Đưa tay ngang đổi giá trị một phần (tổng đổi theo), hoặc +/− số phần và tổng. Bật "Hiện giá trị".'; },
    draw2d(host, st) {
      const a = st.tpA, b = st.tpB, ab = a + b, u = this.unit(st), l = this.labels(), show = st.tpShow || st.step >= 3;
      const pad = 46, W = 548, cw = Math.min(66, Math.floor((W - 100) / ab)), h = 30;
      const yT = 24, yA = 92, yB = 146;
      const cells = (x, y, n, fill, stroke) => { let s = ''; for (let i = 0; i < n; i++) { const cx = x + i*cw;
        s += `<rect x="${cx}" y="${y}" width="${cw-2}" height="${h}" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="1.5"></rect>`; } return s; };
      let s = cells(pad, yT, ab, 'rgba(242,240,230,.12)', 'var(--chalk)')
        + cells(pad, yA, a, 'rgba(109,179,166,.6)', '#3f8f84')
        + cells(pad + a*cw, yB, b, 'var(--accent)', '#d9a520');
      const tbX = pad + ab*cw, midX = (pad + tbX)/2;
      let lab = `<text x="${pad-6}" y="${yT+h/2+5}" fill="rgba(242,240,230,.85)" font-size="13" text-anchor="end">Tổng</text>`
        + `<text x="${pad-6}" y="${yA+h/2+5}" fill="rgba(242,240,230,.85)" font-size="13" text-anchor="end">${l[0]}</text>`
        + `<text x="${pad-6}" y="${yB+h/2+5}" fill="rgba(242,240,230,.85)" font-size="13" text-anchor="end">${l[1]}</text>`;
      let brace = `<line x1="${pad}" y1="${yT+h+9}" x2="${tbX}" y2="${yT+h+9}" stroke="var(--warn)" stroke-width="2"></line>`
        + `<text x="${midX}" y="${yT+h+28}" fill="var(--warn)" font-size="15" font-weight="700" text-anchor="middle">Tổng = ${st.tpTong} ${cur().danvi || ''}</text>`;
      let info = `<text x="${pad + a*cw/2}" y="${yA-6}" fill="rgba(242,240,230,.7)" font-size="12" text-anchor="middle">${a} phần</text>`
        + `<text x="${pad + a*cw + b*cw/2}" y="${yB-6}" fill="rgba(242,240,230,.7)" font-size="12" text-anchor="middle">${b} phần</text>`;
      let vals = '';
      if (show) vals = `<text x="${tbX+10}" y="${yA+h/2+5}" fill="var(--chalk)" font-size="14" font-weight="700">${l[0]} = ${this.fmt(a*u)}</text>`
        + `<text x="${tbX+10}" y="${yB+h/2+5}" fill="var(--chalk)" font-size="14" font-weight="700">${l[1]} = ${this.fmt(b*u)}</text>`
        + `<text x="${midX}" y="${yT-6}" fill="var(--accent)" font-size="12" text-anchor="middle">mỗi phần = ${this.fmt(u)}</text>`;
      host.innerHTML = `<svg width="${W}" height="192" viewBox="0 0 ${W} 192">` + s + brace + lab + info + vals + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, a = st.tpA, b = st.tpB, ab = a + b, u = this.unit(st), l = this.labels(), dv = L.danvi || '';
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: tổng ${st.tpTong} ${dv}. Theo tỉ số, ${l[0]} là ${a} phần, ${l[1]} là ${b} phần bằng nhau.`, hint: 'Đưa tay ngang đổi giá trị một phần, hoặc +/− số phần.' };
      if (s === 2) return { cap: `Sơ đồ đoạn thẳng: cả hai là ${ab} phần bằng nhau, ứng với ${st.tpTong} ${dv}. Bật "Hiện giá trị" để thấy mỗi phần.`, hint: 'Đếm TỔNG số phần bằng nhau trước khi tính.' };
      if (s === 3) return { cap: `Phép tính: một phần = ${st.tpTong} : ${ab} = ${this.fmt(u)}; ${l[0]} = ${a}×${this.fmt(u)} = ${this.fmt(a*u)}; ${l[1]} = ${b}×${this.fmt(u)} = ${this.fmt(b*u)}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: ${l[1]} có bao nhiêu ${dv}? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const l = this.labels(), u = this.unit(st); return `${l[0]} = ${this.fmt(st.tpA*u)}, ${l[1]} = ${this.fmt(st.tpB*u)}`; },
    showFromStep() { return 2; },
    hand() {},
    handLabel() { return ''; },
    build3d(st) {
      const g = new THREE.Group(), a = st.tpA, b = st.tpB, ab = a + b;
      for (let i = 0; i < ab; i++) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1, 0.95), new THREE.MeshStandardMaterial({ color: i < a ? 0x5fb0a5 : 0xffd166, roughness:.6 }));
        m.position.set((i-(ab-1)/2)*1.05, 0, 0); g.add(m);
      }
      this.paint3d(g, st);
      return g;
    },
    // Chiều cao hộp = giá trị MỘT PHẦN (chuẩn hoá theo u=10 → cao 1): tổng đổi → 3D phản ứng
    // ngay qua transform, các phần vẫn bằng nhau (scale đều). geomSig giữ nguyên (chỉ cấu trúc).
    paint3d(g, st) {
      const h = clamp(this.unit(st) / 10, 0.35, 2.2);
      for (const m of g.children) { m.scale.y = h; m.position.y = (h - 1) / 2; }
    },
  },

  // ======================= Model: rhomb (diện tích hình thoi — hai đường chéo) =======================
  // Repo hinh-thoi: "nối hai đường chéo rồi tô 4 tam giác ghép thành hình chữ nhật"; S = d₁×d₂÷2.
  // Hai đường chéo vuông góc tại trung điểm. Đưa tay ngang đổi d₁; bật "Ghép" thấy 4 tam giác
  // ngoài thoi đúng bằng nửa hình chữ nhật bao (d₁ × d₂) → thoi = một nửa.
  rhomb: {
    usesPalm: true,
    defaults(st, L) { st.rhD1 = L.rhD1; st.rhD2 = L.rhD2; st.rhGhep = L.rhGhep; },
    area(st) { return st.rhD1 * st.rhD2 / 2; },
    palmToValue(st, x) { st.rhD1 = 2 * clamp(Math.round((1 - x) * 4), 1, 4); },
    palmLabel(st) { return `d₁ = ${st.rhD1} cm → S = ${this.area(st)} cm²`; },
    geomSig(st) { return 'rhomb' + st.rhD1 + ':' + st.rhD2; },
    params() { return [
      { key:'rhD1', label:'Đường chéo d₁ (cm)', min:2, max:8, step:2 },
      { key:'rhD2', label:'Đường chéo d₂ (cm)', min:2, max:8, step:2 }]; },
    toggles() { return [{ key:'rhGhep', label:'Ghép 4 tam giác → hình chữ nhật bao' }]; },
    ctlHint() { return 'Đưa tay ngang đổi độ dài đường chéo ngang d₁, hoặc +/− cho d₁ và d₂. Bật "Ghép" để thấy nửa chữ nhật.'; },
    draw2d(host, st) {
      const d1 = st.rhD1, d2 = st.rhD2, u = 24, W = 548, Hh = 234, cx = W/2, cy = 108, ha = d1*u/2, hb = d2*u/2;
      const V = [[cx+ha,cy],[cx,cy-hb],[cx-ha,cy],[cx,cy+hb]];
      const tf = ['rgba(95,176,165,.6)','rgba(255,209,102,.65)','rgba(95,176,165,.6)','rgba(255,209,102,.65)'];
      let t = '';
      for (let i = 0; i < 4; i++) { const a = V[i], b = V[(i+1)%4];
        t += `<polygon points="${cx},${cy} ${a[0]},${a[1]} ${b[0]},${b[1]}" fill="${tf[i]}" stroke="var(--chalk)" stroke-width="1"></polygon>`; }
      let corners = '';
      if (st.rhGhep) { const c = [
        [[cx-ha,cy-hb],[cx,cy-hb],[cx-ha,cy]], [[cx+ha,cy-hb],[cx+ha,cy],[cx,cy-hb]],
        [[cx-ha,cy+hb],[cx-ha,cy],[cx,cy+hb]], [[cx+ha,cy+hb],[cx,cy+hb],[cx+ha,cy]]];
        for (const tri of c) corners += `<polygon points="${tri.map(p=>p.join(',')).join(' ')}" fill="rgba(224,121,31,.28)" stroke="var(--warn)" stroke-width="1" stroke-dasharray="4 3"></polygon>`;
        corners += `<rect x="${cx-ha}" y="${cy-hb}" width="${d1*u}" height="${d2*u}" fill="none" stroke="var(--warn)" stroke-width="1.5" stroke-dasharray="7 5"></rect>`; }
      const dia = `<line x1="${cx-ha}" y1="${cy}" x2="${cx+ha}" y2="${cy}" stroke="var(--warn)" stroke-width="2"></line>`
        + `<line x1="${cx}" y1="${cy-hb}" x2="${cx}" y2="${cy+hb}" stroke="var(--warn)" stroke-width="2"></line>`;
      const lab = `<text x="${cx+ha+6}" y="${cy+4}" fill="rgba(242,240,230,.85)" font-size="13">d₁ = ${d1}</text>`
        + `<text x="${cx+7}" y="${cy-hb-3}" fill="rgba(242,240,230,.85)" font-size="13">d₂ = ${d2}</text>`
        + `<text x="${cx}" y="${Hh-8}" fill="var(--accent)" font-size="16" font-weight="700" text-anchor="middle">S = ${d1} × ${d2} : 2 = ${this.area(st)} cm²</text>`;
      host.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">` + corners + t + dia + lab + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, d1 = st.rhD1, d2 = st.rhD2, area = this.area(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hình thoi có hai đường chéo d₁ = ${d1} cm (ngang) và d₂ = ${d2} cm (dọc), vuông góc và cắt nhau tại trung điểm mỗi đường.`, hint: 'Đưa tay ngang đổi d₁, hoặc +/− cho d₁ và d₂.' };
      if (s === 2) return { cap: `Sơ đồ: nối hai đường chéo chia hình thoi thành 4 tam giác vuông. Bật "Ghép" để thấy 4 tam giác cam ngoài thoi đúng bằng nửa hình chữ nhật bao ${d1} × ${d2}.`, hint: 'Thoi = một nửa hình chữ nhật bao.' };
      if (s === 3) return { cap: `Phép tính: S = d₁ × d₂ : 2 = ${d1} × ${d2} : 2 = ${area} cm². ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: diện tích hình thoi này là bao nhiêu cm²? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `S = ${st.rhD1} × ${st.rhD2} : 2 = ${this.area(st)} cm²`; },
    showFromStep() { return 2; },
    hand() {},
    handLabel() { return ''; },
    build3d(st) {
      const g = new THREE.Group(), ha = st.rhD1/2, hb = st.rhD2/2;
      const shape = new THREE.Shape();
      shape.moveTo(ha, 0); shape.lineTo(0, hb); shape.lineTo(-ha, 0); shape.lineTo(0, -hb); shape.closePath();
      const plate = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: false }),
        new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: .6 }));
      plate.position.z = -0.15; g.add(plate);
      const r1 = new THREE.Mesh(new THREE.BoxGeometry(st.rhD1*0.96, 0.08, 0.08), new THREE.MeshStandardMaterial({ color: 0xe0791f })); g.add(r1);
      const r2 = new THREE.Mesh(new THREE.BoxGeometry(st.rhD2*0.96, 0.08, 0.08), new THREE.MeshStandardMaterial({ color: 0xffffff })); r2.rotation.z = Math.PI/2; g.add(r2);
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: fracbar (thanh phân số — HAI TAY, hai tử số) =======================
  // Repo phan-so-bang-nhau: "hai băng bằng chiều dài, phần tô trùng khít → hai phân số bằng nhau".
  // Hai băng trên CÙNG một trục; giơ HAI tay: tay trái = tử số băng 1, tay phải = tử số băng 2.
  // Mẫu số chỉnh bằng +/−. So sánh chéo (n1×d2 so n2×d1) → = / > / <.
  fracbar: {
    twoHands: true,
    defaults(st, L) { st.fbN1 = L.fbN1; st.fbD1 = L.fbD1; st.fbN2 = L.fbN2; st.fbD2 = L.fbD2; },
    cmp(st) { const c = st.fbN1*st.fbD2 - st.fbN2*st.fbD1; return c === 0 ? '=' : (c > 0 ? '>' : '<'); },
    equal(st) { return st.fbN1*st.fbD2 === st.fbN2*st.fbD1; },
    geomSig(st) { return 'fb' + st.fbN1 + '/' + st.fbD1 + ';' + st.fbN2 + '/' + st.fbD2; },
    params() { return [
      { key:'fbN1', label:'Tử số PS 1', min:0, max:6 }, { key:'fbD1', label:'Mẫu số PS 1', min:1, max:8 },
      { key:'fbN2', label:'Tử số PS 2', min:0, max:6 }, { key:'fbD2', label:'Mẫu số PS 2', min:1, max:8 }]; },
    ctlHint() { return 'Bật camera, giơ HAI tay: tay trái đặt tử số phân số 1, tay phải đặt tử số phân số 2. Mẫu số chỉnh bằng +/−.'; },
    draw2d(host, st) {
      const pad = 44, L = 400, y1 = 60, y2 = 122, bh = 42, W = 520, Hh = 214;
      const bar = (y, d, n) => { let s = `<rect x="${pad}" y="${y}" width="${L}" height="${bh}" fill="rgba(242,240,230,.06)" stroke="var(--chalk)" stroke-width="1.5"></rect>`;
        const cw = L/d; for (let i = 0; i < d; i++) { if (i < n) s += `<rect x="${pad+i*cw}" y="${y}" width="${cw}" height="${bh}" fill="${'rgba(255,209,102,.75)'}"></rect>`; }
        for (let i = 1; i < d; i++) s += `<line x1="${pad+i*cw}" y1="${y}" x2="${pad+i*cw}" y2="${y+bh}" stroke="var(--chalk)" stroke-width="1"></line>`;
        return s; };
      const e1 = pad + (st.fbN1/st.fbD1)*L, e2 = pad + (st.fbN2/st.fbD2)*L;
      let guide = `<line x1="${e1}" y1="${y1-6}" x2="${e1}" y2="${y2+bh+6}" stroke="var(--warn)" stroke-width="1.5" stroke-dasharray="5 4"></line>`;
      if (this.equal(st)) guide += `<line x1="${e2}" y1="${y1-6}" x2="${e2}" y2="${y2+bh+6}" stroke="var(--accent)" stroke-width="2" stroke-dasharray="5 4"></line>`;
      let s = bar(y1, st.fbD1, st.fbN1) + bar(y2, st.fbD2, st.fbN2) + guide
        + `<text x="${pad-6}" y="${y1+bh/2+5}" fill="var(--chalk)" font-size="18" font-weight="700" text-anchor="end">${st.fbN1}/${st.fbD1}</text>`
        + `<text x="${pad-6}" y="${y2+bh/2+5}" fill="var(--chalk)" font-size="18" font-weight="700" text-anchor="end">${st.fbN2}/${st.fbD2}</text>`
        + `<text x="${pad}" y="${y1-12}" fill="rgba(242,240,230,.55)" font-size="11">0${this.equal(st) ? '' : ' · đầu phần tô không trùng nhau'}</text>`;
      const v = this.cmp(st);
      s += `<text x="${W/2}" y="${Hh-8}" fill="${v==='='?'var(--accent)':'var(--warn)'}" font-size="22" font-weight="700" text-anchor="middle">${st.fbN1}/${st.fbD1}  ${v}  ${st.fbN2}/${st.fbD2}${v==='='?'  (bằng nhau)':''}</text>`;
      host.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, n1 = st.fbN1, d1 = st.fbD1, n2 = st.fbN2, d2 = st.fbD2, eq = this.equal(st), v = this.cmp(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hai băng bánh bằng nhau. An ăn ${n1}/${d1} (tô ${n1} trên ${d1} phần), Bình ăn ${n2}/${d2} (tô ${n2} trên ${d2} phần).`, hint: 'Giơ HAI tay để đổi tử số mỗi phân số, mẫu số bấm +/−.' };
      if (s === 2) return { cap: `Sơ đồ: đặt hai băng trên CÙNG một trục rồi so đầu phần tô. ${eq ? 'Hai đầu trùng khít → hai phân số bằng nhau.' : 'Băng có đầu tô dài hơn thì phân số lớn hơn.'}`, hint: 'Không so tử số riêng — phải so ĐỘ DÀI trên cùng trục.' };
      if (s === 3) return { cap: `Phép tính: ${n1}×${d2} = ${n1*d2} so với ${n2}×${d1} = ${n2*d1} → ${n1}/${d1} ${v} ${n2}/${d2}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: An ăn nhiều hơn, Bình ăn nhiều hơn, hay hai bạn bằng nhau? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `${st.fbN1}/${st.fbD1} ${this.cmp(st)} ${st.fbN2}/${st.fbD2}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.fbN1 = clamp(l, 0, st.fbD1);
      if (r !== null) st.fbN2 = clamp(r, 0, st.fbD2);
    },
    build3d(st) {
      const g = new THREE.Group(), span = 6;
      const bar = (d, n, z) => { const w = span/d; for (let i = 0; i < d; i++) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w*0.92, 0.6, 0.6), new THREE.MeshStandardMaterial({ color: i < n ? 0xffd166 : 0x3a4a52, roughness: .6 }));
        m.position.set(-span/2 + w*(i+0.5), 0, z); g.add(m); } };
      bar(st.fbD1, st.fbN1, 0.7); bar(st.fbD2, st.fbN2, -0.7);
      return g;
    },
    paint3d() {},
  },

};

// ---- tiep MODELS: gop vao object MODELS (giu nguyen thu tu key) ----
Object.assign(MODELS, {
  // ======================= Model: areaunits (bảng đơn vị đo DIỆN TÍCH — beyond-bank) =======================
  // Đối trọng của lenunits: đơn vị diện tích liền nhau hơn kém 100 LẦN (không phải 10), vì cả HAI chiều dài đều ×10.
  // Ô vuông 10×10: cạnh 1 m = 10 dm → trong 1 m² xếp được 10 × 10 = 100 ô dm². Đây là lý do "diện tích nhảy bậc ×100".
  areaunits: {
    U: ['km²', 'hm²', 'dam²', 'm²', 'dm²', 'cm²', 'mm²'],
    mp() { return [1e6, 1e4, 1e2, 1, 0.01, 1e-4, 1e-6]; },
    lvf(x) { if (x > 0 && Math.round(x * 1e6) === 0) return '≈0'; const r = Math.round(x * 1e6) / 1e6; if (Number.isInteger(r)) return String(r); let t = r.toFixed(6).replace(/0+$/, ''); if (t.endsWith('.')) t = t.slice(0, -1); return t.replace('.', ','); },
    noun(u) { return ['mảnh đất cả xã', 'khu rừng', 'sân trường', 'mặt nền nhà', 'mặt bàn học', 'mặt viên gạch nhỏ', 'mặt đồng xu'][clamp(u, 0, 6)]; },
    res(st) { const u = clamp(Math.round(st.auUnit), 0, 6), num = clamp(Math.round(st.auNum), 1, 20); const cnt = []; for (let i = 0; i < 7; i++) cnt.push(num * Math.pow(100, i - u)); return { u, num, sqm: num * this.mp()[u], cnt }; },
    defaults(st, L) { st.auNum = (L.auNum != null ? L.auNum : 1); st.auUnit = (L.auUnit != null ? L.auUnit : 3); },
    geomSig(st) { const d = this.res(st); return 'au' + d.num + ',' + d.u; },
    params() { return [{ key: 'auNum', label: 'Số đo ở đơn vị đang chọn', min: 1, max: 20 }, { key: 'auUnit', label: 'Đơn vị đang chọn (bậc)', min: 0, max: 6 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bấm một BẬC để chọn đơn vị đang đo; giơ 1–9 ngón đặt con số; +/− chỉnh. DIỆN TÍCH mỗi bậc ×100 (khác độ dài ×10).'; },
    hand(st, f) { st.auNum = clamp(Math.round(f), 1, 20); },
    handLabel(f) { return '→ số đo = ' + clamp(Math.round(f), 1, 20); },
    draw2d(host, st) {
      const d = this.res(st);
      const yb = (i) => 40 + i * 26;
      let rows = '', x100 = '';
      for (let i = 0; i < 7; i++) {
        const on = i === d.u, isM = i === 3, y = yb(i);
        rows += `<g data-au="${i}" style="cursor:pointer"><rect x="12" y="${y - 16}" width="150" height="23" rx="3" fill="${on ? 'rgba(240,196,92,.20)' : (isM ? 'rgba(127,201,191,.10)' : 'rgba(255,255,255,.03)')}" stroke="${on ? 'var(--accent)' : 'rgba(242,240,230,.14)'}" stroke-width="${on ? 2 : 1}"></rect>`
          + `<text x="20" y="${y - 1}" font-size="12" font-weight="${on ? 700 : 500}" fill="${on ? 'var(--accent)' : 'var(--chalk)'}">${this.U[i]}</text>`
          + `<text x="156" y="${y - 1}" text-anchor="end" font-size="13" font-weight="${on ? 800 : 500}" fill="${on ? 'var(--accent)' : 'rgba(242,240,230,.92)'}">${this.lvf(d.cnt[i])}</text></g>`;
        if (i < 6) x100 += `<text x="166" y="${y + 11}" font-size="8" fill="rgba(242,240,230,.5)">×100</text>`;
      }
      // ô vuông 10×10 giải thích ×100: chọn cặp (bậc đang chọn, bậc kế nhỏ hơn)
      const bigU = Math.min(d.u, 5), smallU = bigU + 1;
      const sx = 250, sy = 40, side = 118, cell = side / 10;
      let grid = '';
      for (let k = 1; k < 10; k++) {
        grid += `<line x1="${(sx + k * cell).toFixed(1)}" y1="${sy}" x2="${(sx + k * cell).toFixed(1)}" y2="${sy + side}" stroke="rgba(242,240,230,.22)" stroke-width="0.6"></line>`;
        grid += `<line x1="${sx}" y1="${(sy + k * cell).toFixed(1)}" x2="${sx + side}" y2="${(sy + k * cell).toFixed(1)}" stroke="rgba(242,240,230,.22)" stroke-width="0.6"></line>`;
      }
      const sq = `<text x="188" y="20" fill="var(--chalk)" font-size="13" font-weight="700">Vì sao ×100? Cạnh ×10, nhưng cả 2 chiều:</text>`
        + `<rect x="${sx}" y="${sy}" width="${side}" height="${side}" fill="rgba(240,196,92,.10)" stroke="var(--accent)" stroke-width="2"></rect>`
        + grid
        + `<text x="${sx + side / 2}" y="${sy - 4}" text-anchor="middle" font-size="10.5" fill="rgba(242,240,230,.8)">cạnh 1 ${this.U[bigU].replace('²', '')} = 10 ${this.U[smallU].replace('²', '')}</text>`
        + `<text x="${sx + side / 2}" y="${sy + side / 2 + 4}" text-anchor="middle" font-size="15" font-weight="800" fill="var(--accent)">= 100 ô</text>`
        + `<text x="${sx + side / 2}" y="${sy + side + 16}" text-anchor="middle" font-size="12" fill="var(--chalk)">1 ${this.U[bigU]} = 100 ${this.U[smallU]}</text>`;
      const conv = `<text x="400" y="52" fill="rgba(242,240,230,.7)" font-size="11.5">Cùng MỘT diện tích:</text>`
        + `<text x="400" y="78" fill="var(--accent)" font-size="18" font-weight="800">${this.lvf(d.num)} ${this.U[d.u]}</text>`
        + `<text x="400" y="102" fill="var(--chalk)" font-size="14">= ${this.lvf(d.sqm)} m²</text>`
        + `<text x="400" y="126" fill="var(--chalk)" font-size="14">= ${this.lvf(d.cnt[6])} mm²</text>`
        + `<text x="400" y="158" fill="rgba(242,240,230,.85)" font-size="11.5">Hai đơn vị diện tích</text>`
        + `<text x="400" y="174" fill="rgba(242,240,230,.85)" font-size="11.5">liền nhau hơn kém 100 lần.</text>`
        + `<text x="400" y="200" fill="rgba(242,240,230,.85)" font-size="11.5">(khác độ dài: chỉ ×10)</text>`;
      const err = `<text x="12" y="250" fill="var(--warn)" font-size="11">❌ Nhầm: 2 m² = 20 dm²? Sai — là 200 dm². Diện tích nhảy ×100 mỗi bậc, không phải ×10.</text>`;
      host.innerHTML = `<svg id="areaunits" width="548" height="258" viewBox="0 0 548 258">` + rows + x100 + sq + conv + err + `</svg>`;
      const svg = host.querySelector('#areaunits');
      if (svg && svg.querySelectorAll) svg.querySelectorAll('g[data-au]').forEach((g) => g.addEventListener('pointerdown', () => { state.auUnit = +g.dataset.au; drawVisual(); render(); }));
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st), bigU = Math.min(d.u, 5), smallU = bigU + 1;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${this.noun(d.u)} rộng ${this.lvf(d.num)} ${this.U[d.u]}. Nếu lát bằng viên ${this.U[smallU]} thì cần bao nhiêu viên — gấp mấy lần con số đo bằng ${this.U[bigU]}?`, hint: 'Diện tích đơn vị nhỏ hơn ⇒ số đo gấp 100 lần mỗi bậc (không phải 10).' };
      if (s === 2) return { cap: `Sơ đồ ô vuông: hình vuông cạnh 1 ${this.U[bigU].replace('²', '')} = cạnh ${this.U[smallU]} dài 10 ô, nên CHIA được 10 × 10 = 100 ô ${this.U[smallU]}. Vậy 1 ${this.U[bigU]} = 100 ${this.U[smallU]} — đơn vị diện tích liền nhau hơn kém 100 lần vì cả HAI chiều đều ×10.`, hint: 'Độ dài ×10 mỗi bậc, nhưng diện tích = dài × rộng nên ×10 ×10 = ×100.' };
      if (s === 3) return { cap: `Phép tính: ${this.lvf(d.num)} ${this.U[d.u]} = ${this.lvf(d.sqm)} m² = ${this.lvf(d.cnt[6])} mm². ` + L.chot, hint: '' };
      return { cap: `Cả lớp: ${this.lvf(d.num)} ${this.U[d.u]} bằng bao nhiêu mét vuông? Đi từ ${this.U[d.u]} tới m² là ${Math.abs(3 - d.u)} bậc, ${d.u < 3 ? ('×100 mỗi bậc = ×' + Math.pow(100, 3 - d.u)) : (d.u > 3 ? (':100 mỗi bậc = :' + Math.pow(100, d.u - 3)) : 'bằng mét vuông rồi')}.`, hint: '' };
    },
    value(st) { const d = this.res(st); return `${this.lvf(d.num)} ${this.U[d.u]} = ${this.lvf(d.sqm)} m²`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matSel = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.5 }), matCell = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.55 });
      const plate = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 3.6), matSel); plate.position.set(0, 0.06, 0); g.add(plate);
      const cell = 3.24 / 10;
      for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) { const m = new THREE.Mesh(new THREE.BoxGeometry(cell * 0.86, 0.22, cell * 0.86), matCell); m.position.set(-1.62 + cell * (c + 0.5), 0.23, -1.62 + cell * (r + 0.5)); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  // ======================= Model: volunits (bảng đơn vị đo THỂ TÍCH — beyond-bank) =======================
  // Hoàn thiện bộ ba bảng đơn vị: độ dài ×10 (lenunits) → diện tích ×100 (areaunits) → thể tích ×1000 (volunits).
  // Hình lập phương cạnh 1 dm = 10 cm → 10 × 10 = 100 ô trên một MẶT, cao 10 LỚP ⇒ nhét đầy 1000 cm³ trong 1 dm³.
  volunits: {
    U: ['m³', 'dm³', 'cm³'],
    mp() { return [1, 0.001, 1e-6]; },
    lvf(x) { if (x > 0 && Math.round(x * 1e6) === 0) return '≈0'; const r = Math.round(x * 1e6) / 1e6; if (Number.isInteger(r)) return String(r); let t = r.toFixed(6).replace(/0+$/, ''); if (t.endsWith('.')) t = t.slice(0, -1); return t.replace('.', ','); },
    noun(u) { return ['thùng hàng to / bể cá', 'hộp sữa 1 lít', 'viên kẹo hình xúc xắc'][clamp(u, 0, 2)]; },
    res(st) { const u = clamp(Math.round(st.vuUnit), 0, 2), num = clamp(Math.round(st.vuNum), 1, 9); const cnt = []; for (let i = 0; i < 3; i++) cnt.push(num * Math.pow(1000, i - u)); return { u, num, m3: num * this.mp()[u], cnt }; },
    defaults(st, L) { st.vuNum = (L.vuNum != null ? L.vuNum : 1); st.vuUnit = (L.vuUnit != null ? L.vuUnit : 0); },
    geomSig(st) { const d = this.res(st); return 'vu' + d.num + ',' + d.u; },
    params() { return [{ key: 'vuNum', label: 'Số đo ở đơn vị đang chọn', min: 1, max: 9 }, { key: 'vuUnit', label: 'Đơn vị đang chọn (bậc)', min: 0, max: 2 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bấm một BẬC để chọn đơn vị đang đo; giơ 1–9 ngón đặt con số; +/− chỉnh. THỂ TÍCH mỗi bậc ×1000 (khác diện tích ×100, độ dài ×10).'; },
    hand(st, f) { st.vuNum = clamp(Math.round(f), 1, 9); },
    handLabel(f) { return '→ số đo = ' + clamp(Math.round(f), 1, 9); },
    draw2d(host, st) {
      const d = this.res(st);
      const yb = (i) => 76 + i * 36;
      let rows = '', x1000 = '';
      for (let i = 0; i < 3; i++) {
        const on = i === d.u, isM = i === 0, y = yb(i);
        rows += `<g data-vu="${i}" style="cursor:pointer"><rect x="12" y="${y - 16}" width="150" height="26" rx="3" fill="${on ? 'rgba(240,196,92,.20)' : (isM ? 'rgba(127,201,191,.10)' : 'rgba(255,255,255,.03)')}" stroke="${on ? 'var(--accent)' : 'rgba(242,240,230,.14)'}" stroke-width="${on ? 2 : 1}"></rect>`
          + `<text x="20" y="${y}" font-size="13" font-weight="${on ? 700 : 500}" fill="${on ? 'var(--accent)' : 'var(--chalk)'}">${this.U[i]}</text>`
          + `<text x="156" y="${y}" text-anchor="end" font-size="14" font-weight="${on ? 800 : 500}" fill="${on ? 'var(--accent)' : 'rgba(242,240,230,.92)'}">${this.lvf(d.cnt[i])}</text></g>`;
        if (i < 2) x1000 += `<text x="164" y="${y + 20}" font-size="8.5" fill="rgba(242,240,230,.55)">×1000</text>`;
      }
      const bigU = Math.min(d.u, 1), smallU = bigU + 1, bb = this.U[bigU].replace('³', ''), sb = this.U[smallU].replace('³', '');
      const sx = 232, sy = 56, side = 96, cell = side / 10, dx = 28, dy = -18;
      let grid = '';
      for (let k = 1; k < 10; k++) {
        grid += `<line x1="${(sx + k * cell).toFixed(1)}" y1="${sy}" x2="${(sx + k * cell).toFixed(1)}" y2="${sy + side}" stroke="rgba(242,240,230,.22)" stroke-width="0.6"></line>`;
        grid += `<line x1="${sx}" y1="${(sy + k * cell).toFixed(1)}" x2="${sx + side}" y2="${(sy + k * cell).toFixed(1)}" stroke="rgba(242,240,230,.22)" stroke-width="0.6"></line>`;
      }
      const cube = `<text x="186" y="20" fill="var(--chalk)" font-size="13" font-weight="700">Vì sao ×1000? Cạnh ×10, nhưng cả 3 chiều:</text>`
        + `<rect x="${sx + dx}" y="${sy + dy}" width="${side}" height="${side}" fill="none" stroke="rgba(242,240,230,.3)" stroke-width="1"></rect>`
        + `<line x1="${sx}" y1="${sy}" x2="${sx + dx}" y2="${sy + dy}" stroke="rgba(242,240,230,.3)"></line>`
        + `<line x1="${sx + side}" y1="${sy}" x2="${sx + side + dx}" y2="${sy + dy}" stroke="rgba(242,240,230,.3)"></line>`
        + `<line x1="${sx}" y1="${sy + side}" x2="${sx + dx}" y2="${sy + side + dy}" stroke="rgba(242,240,230,.3)"></line>`
        + `<line x1="${sx + side}" y1="${sy + side}" x2="${sx + side + dx}" y2="${sy + side + dy}" stroke="rgba(242,240,230,.3)"></line>`
        + `<rect x="${sx}" y="${sy}" width="${side}" height="${side}" fill="rgba(240,196,92,.10)" stroke="var(--accent)" stroke-width="2"></rect>`
        + grid
        + `<text x="${sx + side / 2}" y="${sy + side / 2 - 2}" text-anchor="middle" font-size="12" font-weight="800" fill="var(--accent)">10 × 10</text>`
        + `<text x="${sx + side / 2}" y="${sy + side / 2 + 12}" text-anchor="middle" font-size="10" fill="var(--chalk)">= 100 ô · 1 mặt</text>`
        + `<text x="${sx + side / 2}" y="${sy - 6}" text-anchor="middle" font-size="10.5" fill="rgba(242,240,230,.8)">cạnh 1 ${bb} = 10 ${sb}</text>`
        + `<text x="${sx + side / 2}" y="${sy + side + 16}" text-anchor="middle" font-size="11" fill="var(--chalk)">× 10 lớp = 1000</text>`
        + `<text x="${sx + side / 2}" y="${sy + side + 32}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent)">1 ${this.U[bigU]} = 1000 ${this.U[smallU]}</text>`;
      const conv = `<text x="404" y="56" fill="rgba(242,240,230,.7)" font-size="11.5">Cùng MỘT thể tích:</text>`
        + `<text x="404" y="82" fill="var(--accent)" font-size="18" font-weight="800">${this.lvf(d.num)} ${this.U[d.u]}</text>`
        + `<text x="404" y="106" fill="var(--chalk)" font-size="14">= ${this.lvf(d.m3)} m³</text>`
        + `<text x="404" y="128" fill="var(--chalk)" font-size="14">= ${this.lvf(d.cnt[2])} cm³</text>`
        + `<text x="404" y="158" fill="rgba(242,240,230,.85)" font-size="11.5">Hai đơn vị thể tích</text>`
        + `<text x="404" y="174" fill="rgba(242,240,230,.85)" font-size="11.5">liền nhau hơn kém 1000 lần.</text>`
        + `<text x="404" y="200" fill="rgba(242,240,230,.85)" font-size="11.5">(diện tích ×100,</text>`
        + `<text x="404" y="216" fill="rgba(242,240,230,.85)" font-size="11.5">độ dài ×10)</text>`;
      const err = `<text x="12" y="250" fill="var(--warn)" font-size="11">❌ Nhầm: 1 m³ = 100 dm³? Sai — là 1000 dm³. Thể tích nhảy ×1000 mỗi bậc (ba chiều), không phải ×100.</text>`;
      host.innerHTML = `<svg id="volunits" width="548" height="258" viewBox="0 0 548 258">` + rows + x1000 + cube + conv + err + `</svg>`;
      const svg = host.querySelector('#volunits');
      if (svg && svg.querySelectorAll) svg.querySelectorAll('g[data-vu]').forEach((g) => g.addEventListener('pointerdown', () => { state.vuUnit = +g.dataset.vu; drawVisual(); render(); }));
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st), bigU = Math.min(d.u, 1), smallU = bigU + 1, bb = this.U[bigU].replace('³', ''), sb = this.U[smallU].replace('³', '');
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${this.noun(d.u)} chứa ${this.lvf(d.num)} ${this.U[d.u]}. Nếu xúc đầy bằng viên ${this.U[smallU]} cạnh 1 ${sb} thì được bao nhiêu — gấp 1000 lần hay chỉ 100 lần?`, hint: 'Thể tích đơn vị nhỏ hơn ⇒ số đo gấp 1000 lần mỗi bậc (ba chiều), không phải 100.' };
      if (s === 2) return { cap: `Sơ đồ khối: hình lập phương cạnh 1 ${bb} = ${sb} dài 10 ô, nên một MẶT xếp 10 × 10 = 100 ô và cao 10 LỚP ⇒ nhét đầy 10 × 10 × 10 = 1000 khối ${this.U[smallU]}. Vậy 1 ${this.U[bigU]} = 1000 ${this.U[smallU]} — thể tích nhảy ×1000 vì cả BA chiều cùng ×10.`, hint: 'Độ dài ×10, diện tích ×100 (2 chiều), thể tích ×1000 (3 chiều).' };
      if (s === 3) return { cap: `Phép tính: ${this.lvf(d.num)} ${this.U[d.u]} = ${this.lvf(d.m3)} m³ = ${this.lvf(d.cnt[2])} cm³. ` + L.chot, hint: '' };
      return { cap: `Cả lớp: ${this.lvf(d.num)} ${this.U[d.u]} bằng bao nhiêu mét khối? Đi từ ${this.U[d.u]} tới m³ là ${d.u} bậc, ${d.u > 0 ? (':1000 mỗi bậc = :' + Math.pow(1000, d.u)) : 'bằng mét khối rồi'}.`, hint: '' };
    },
    value(st) { const d = this.res(st); return `${this.lvf(d.num)} ${this.U[d.u]} = ${this.lvf(d.m3)} m³`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matSel = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.5, transparent: true, opacity: 0.32 }), matCell = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.55 });
      const outer = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.6, 3.6), matSel); outer.position.set(0, 1.9, 0); g.add(outer);
      const cell = 3.24 / 10;
      for (let c = 0; c < 10; c++) for (let r = 0; r < 10; r++) { const m = new THREE.Mesh(new THREE.BoxGeometry(cell * 0.8, cell * 0.8, cell * 0.8), matCell); m.position.set(-1.62 + cell * (c + 0.5), 0.18 + cell * (r + 0.5), 1.62 - cell * 0.5); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  // ======================= Model: prop (hai đại lượng TỈ LỆ THUẬN — beyond-bank) =======================
  // y = k·x: x gấp lên mấy lần thì y gấp đúng mấy lần; thương y:x KHÔNG đổi; đồ thị là đường thẳng qua GỐC (0,0).
  prop: {
    res(st) { const k = clamp(Math.round(st.prK), 2, 9), x = clamp(Math.round(st.prX), 1, 4); return { k, x, ys: [k, 2 * k, 3 * k, 4 * k] }; },
    defaults(st, L) { st.prK = (L.prK != null ? L.prK : 3); st.prX = (L.prX != null ? L.prX : 2); },
    geomSig(st) { const d = this.res(st); return 'pr' + d.k + ',' + d.x; },
    params() { return [{ key: 'prK', label: 'Hệ số k (y = k·x)', min: 2, max: 9 }, { key: 'prX', label: 'Giá trị x đang đọc', min: 1, max: 4 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bấm một CỘT (x = 1…4) để chọn; giơ 1–4 ngón đặt x; +/− đổi hệ số k. TỈ LỆ THUẬN: x gấp mấy lần thì y gấp bấy nhiêu (y = k·x).'; },
    hand(st, f) { st.prX = clamp(Math.round(f), 1, 4); },
    handLabel(f) { return '→ x = ' + clamp(Math.round(f), 1, 4); },
    draw2d(host, st) {
      const d = this.res(st);
      let tbl = `<text x="12" y="30" fill="var(--chalk)" font-size="13" font-weight="700">Bảng: y = ${d.k} · x</text>`;
      tbl += `<text x="16" y="70" fill="rgba(242,240,230,.7)" font-size="12">x</text><text x="16" y="104" fill="rgba(242,240,230,.7)" font-size="12">y</text>`;
      for (let i = 1; i <= 4; i++) {
        const cx = 54 + (i - 1) * 46, on = i === d.x;
        tbl += `<g data-prx="${i}" style="cursor:pointer"><rect x="${cx - 18}" y="54" width="40" height="58" rx="3" fill="${on ? 'rgba(240,196,92,.20)' : 'rgba(255,255,255,.03)'}" stroke="${on ? 'var(--accent)' : 'rgba(242,240,230,.14)'}" stroke-width="${on ? 2 : 1}"></rect>`
          + `<text x="${cx}" y="70" text-anchor="middle" font-size="13" fill="${on ? 'var(--accent)' : 'var(--chalk)'}">${i}</text>`
          + `<text x="${cx}" y="104" text-anchor="middle" font-size="13" font-weight="${on ? 800 : 500}" fill="${on ? 'var(--accent)' : 'rgba(242,240,230,.92)'}">${d.ys[i - 1]}</text></g>`;
      }
      tbl += `<text x="12" y="132" fill="rgba(242,240,230,.85)" font-size="11.5">Thương y : x = ${d.k} — luôn không đổi.</text>`;
      tbl += `<text x="12" y="150" fill="rgba(242,240,230,.85)" font-size="11.5">x ×2 thì y ×2 · x ×3 thì y ×3.</text>`;
      // đồ thị: gốc (ox,oy) → (4, 4k)
      const ox = 300, oy = 205, ux = 52, uY = 150 / (4 * d.k);
      const px = (i) => ox + i * ux, py = (i) => oy - i * d.k * uY;
      let dots = '';
      for (let i = 1; i <= 4; i++) { const on = i === d.x; dots += `<circle cx="${px(i)}" cy="${py(i)}" r="${on ? 5 : 3.2}" fill="${on ? 'var(--accent)' : 'var(--chalk)'}" opacity="${on ? 1 : 0.85}"></circle>`; if (on) dots += `<text x="${px(i)}" y="${py(i) - 9}" text-anchor="middle" font-size="11" fill="var(--accent)">${d.k * i}</text>`; }
      const line = `<line x1="${ox}" y1="${oy}" x2="${px(4)}" y2="${py(4)}" stroke="rgba(127,201,191,.8)" stroke-width="2"></line>`;
      const axes = `<line x1="${ox}" y1="${oy}" x2="${ox + 4 * ux + 12}" y2="${oy}" stroke="rgba(242,240,230,.5)"></line>`
        + `<line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy - 168}" stroke="rgba(242,240,230,.5)"></line>`
        + `<text x="${ox + 4 * ux + 8}" y="${oy + 14}" font-size="10" fill="rgba(242,240,230,.6)">x</text>`
        + `<text x="${ox - 14}" y="${oy - 160}" font-size="10" fill="rgba(242,240,230,.6)">y</text>`;
      const graph = `<text x="${ox}" y="30" fill="var(--chalk)" font-size="13" font-weight="700">Đồ thị qua gốc (0, 0)</text>` + axes + line + dots;
      const err = `<text x="12" y="232" fill="var(--warn)" font-size="11">❌ Nhầm: cho thêm 2 là tỉ lệ thuận? Sai — y = ${d.k}·x (GẤP lên), không phải x + ${d.k}. Thương y:x mới không đổi.</text>`;
      host.innerHTML = `<svg id="prop" width="548" height="258" viewBox="0 0 548 258">` + tbl + graph + err + `</svg>`;
      const svg = host.querySelector('#prop');
      if (svg && svg.querySelectorAll) svg.querySelectorAll('g[data-prx]').forEach((g) => g.addEventListener('pointerdown', () => { state.prX = +g.dataset.prx; drawVisual(); render(); }));
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: mua 1 quyển vở hết ${d.k} nghìn, mua 2 quyển ${2 * d.k} nghìn, 3 quyển ${3 * d.k} nghìn… ${d.x} quyển hết ${d.k * d.x} nghìn. Số tiền GẤP lên đúng theo số quyển.`, hint: 'Hai đại lượng cùng gấp (hoặc cùng rút đi) một số lần như nhau ⟹ tỉ lệ thuận.' };
      if (s === 2) return { cap: `Sơ đồ đồ thị: các điểm (1, ${d.k}), (2, ${2 * d.k}), (3, ${3 * d.k}), (4, ${4 * d.k}) nằm trên MỘT đường thẳng đi qua GỐC (0, 0). Vì y = ${d.k}·x, x gấp lên mấy lần thì y gấp đúng mấy lần, nên thương y : x luôn bằng ${d.k} không đổi.`, hint: 'Đồ thị của hai đại lượng tỉ lệ thuận là đường thẳng qua gốc tọa độ.' };
      if (s === 3) return { cap: `Phép tính: x = ${d.x} ⟹ y = ${d.k} × ${d.x} = ${d.k * d.x}. Hệ số tỉ lệ k = y : x = ${d.k} (không đổi). ` + L.chot, hint: '' };
      return { cap: `Cả lớp: nếu x = ${d.x} thì y bằng bao nhiêu? Lấy ${d.k} × ${d.x} = ? Muốn đổi hệ số k thì +/−; muốn chọn x thì bấm một CỘT hoặc giơ 1–4 ngón.`, hint: '' };
    },
    value(st) { const d = this.res(st); return `x = ${d.x} → y = ${d.k} × ${d.x} = ${d.k * d.x}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matB = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.55 }), matH = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const bw = 0.7, gap = 0.45, s = 0.12;
      for (let i = 1; i <= 4; i++) { const h = i * d.k * s; const m = new THREE.Mesh(new THREE.BoxGeometry(bw, h, bw), i === d.x ? matH : matB); m.position.set((i - 2.5) * (bw + gap), h / 2, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  // ======================= Model: inprop (hai đại lượng TỈ LỆ NGHỊCH — beyond-bank) =======================
  // y = A : x: x gấp lên mấy lần thì y RÚT đi đúng mấy lần; TÍCH x·y KHÔNG đổi; đồ thị là ĐƯỜNG CONG đi xuống (hyperbola).
  inprop: {
    res(st) { const A = Math.max(12, Math.round(clamp(Math.round(st.inK), 12, 60) / 12) * 12), x = clamp(Math.round(st.inX), 1, 4); const xs = [1, 2, 3, 4]; const ys = xs.map((i) => A / i); return { A, x, xs, ys }; },
    defaults(st, L) { st.inK = (L.inK != null ? L.inK : 12); st.inX = (L.inX != null ? L.inX : 2); },
    geomSig(st) { const d = this.res(st); return 'ip' + d.A + ',' + d.x; },
    params() { return [{ key: 'inK', label: 'Tích không đổi A (= x·y)', min: 12, max: 60 }, { key: 'inX', label: 'Giá trị x đang đọc', min: 1, max: 4 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bấm một CỘT (x = 1…4) để chọn; giơ 1–4 ngón đặt x; +/− đổi tích A. TỈ LỆ NGHỊCH: x gấp mấy lần thì y RÚT đi bấy nhiêu (x·y = A).'; },
    hand(st, f) { st.inX = clamp(Math.round(f), 1, 4); },
    handLabel(f) { return '→ x = ' + clamp(Math.round(f), 1, 4); },
    draw2d(host, st) {
      const d = this.res(st);
      let tbl = `<text x="12" y="30" fill="var(--chalk)" font-size="13" font-weight="700">Bảng: x · y = ${d.A}</text>`;
      tbl += `<text x="16" y="70" fill="rgba(242,240,230,.7)" font-size="12">x</text><text x="16" y="104" fill="rgba(242,240,230,.7)" font-size="12">y</text>`;
      for (let i = 1; i <= 4; i++) {
        const cx = 54 + (i - 1) * 46, on = i === d.x;
        tbl += `<g data-inx="${i}" style="cursor:pointer"><rect x="${cx - 18}" y="54" width="40" height="58" rx="3" fill="${on ? 'rgba(240,196,92,.20)' : 'rgba(255,255,255,.03)'}" stroke="${on ? 'var(--accent)' : 'rgba(242,240,230,.14)'}" stroke-width="${on ? 2 : 1}"></rect>`
          + `<text x="${cx}" y="70" text-anchor="middle" font-size="13" fill="${on ? 'var(--accent)' : 'var(--chalk)'}">${i}</text>`
          + `<text x="${cx}" y="104" text-anchor="middle" font-size="13" font-weight="${on ? 800 : 500}" fill="${on ? 'var(--accent)' : 'rgba(242,240,230,.92)'}">${d.ys[i - 1]}</text></g>`;
      }
      tbl += `<text x="12" y="132" fill="rgba(242,240,230,.85)" font-size="11.5">Tích x · y = ${d.A} — luôn không đổi.</text>`;
      tbl += `<text x="12" y="150" fill="rgba(242,240,230,.85)" font-size="11.5">x ×2 thì y :2 · x ×3 thì y :3.</text>`;
      const ox = 300, oy = 205, ux = 52, uY = 150 / d.A;
      const px = (i) => ox + i * ux, py = (i) => oy - (d.A / i) * uY;
      let curve = '';
      for (let i = 1; i < 4; i++) curve += `<line x1="${px(i)}" y1="${py(i)}" x2="${px(i + 1)}" y2="${py(i + 1)}" stroke="rgba(127,201,191,.8)" stroke-width="2"></line>`;
      let dots = '';
      for (let i = 1; i <= 4; i++) { const on = i === d.x; dots += `<circle cx="${px(i)}" cy="${py(i)}" r="${on ? 5 : 3.2}" fill="${on ? 'var(--accent)' : 'var(--chalk)'}" opacity="${on ? 1 : 0.85}"></circle>`; if (on) dots += `<text x="${px(i)}" y="${py(i) - 9}" text-anchor="middle" font-size="11" fill="var(--accent)">${d.ys[i - 1]}</text>`; }
      const axes = `<line x1="${ox}" y1="${oy}" x2="${ox + 4 * ux + 12}" y2="${oy}" stroke="rgba(242,240,230,.5)"></line>`
        + `<line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy - 168}" stroke="rgba(242,240,230,.5)"></line>`
        + `<text x="${ox + 4 * ux + 8}" y="${oy + 14}" font-size="10" fill="rgba(242,240,230,.6)">x</text>`
        + `<text x="${ox - 14}" y="${oy - 160}" font-size="10" fill="rgba(242,240,230,.6)">y</text>`;
      const graph = `<text x="${ox}" y="30" fill="var(--chalk)" font-size="13" font-weight="700">Đồ thị đường CONG (không qua gốc)</text>` + axes + curve + dots;
      const err = `<text x="12" y="232" fill="var(--warn)" font-size="11">❌ Nhầm: nghịch là y bớt đều mỗi lần trừ? Sai — TÍCH x·y = ${d.A} không đổi (y = ${d.A} : x), nên đồ thị là ĐƯỜNG CONG.</text>`;
      host.innerHTML = `<svg id="inprop" width="548" height="258" viewBox="0 0 548 258">` + tbl + graph + err + `</svg>`;
      const svg = host.querySelector('#inprop');
      if (svg && svg.querySelectorAll) svg.querySelectorAll('g[data-inx]').forEach((g) => g.addEventListener('pointerdown', () => { state.inX = +g.dataset.inx; drawVisual(); render(); }));
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: chia ${d.A} cái kẹo cho 1 bạn → mỗi bạn ${d.A} cái; cho 2 bạn → ${d.A / 2} cái; 3 bạn → ${Math.round(d.A / 3)} cái; ${d.x} bạn → ${d.ys[d.x - 1]} cái. Càng NHIỀU bạn thì mỗi bạn nhận ÍT đi.`, hint: 'Hai đại lượng: cái này gấp lên bao nhiêu lần thì cái kia rút đi đúng bấy nhiêu lần ⟹ tỉ lệ nghịch.' };
      if (s === 2) return { cap: `Sơ đồ đồ thị: các điểm (1, ${d.A}), (2, ${d.A / 2}), (3, ${d.A / 3}), (4, ${d.A / 4}) nằm trên một ĐƯỜNG CONG đi xuống (không qua gốc). Vì x · y = ${d.A} nên x gấp lên mấy lần thì y rút đi đúng mấy lần; TÍCH x·y luôn bằng ${d.A} không đổi.`, hint: 'Đồ thị tỉ lệ nghịch là đường cong, khác đường thẳng qua gốc của tỉ lệ thuận (prop).' };
      if (s === 3) return { cap: `Phép tính: x = ${d.x} ⟹ y = ${d.A} : ${d.x} = ${d.ys[d.x - 1]}. Kiểm tra: x × y = ${d.x} × ${d.ys[d.x - 1]} = ${d.A} (không đổi). ` + L.chot, hint: '' };
      return { cap: `Cả lớp: với tích ${d.A}, nếu x = ${d.x} thì y = ? Lấy ${d.A} : ${d.x}. Muốn đổi tích A thì +/−; muốn chọn x thì bấm một CỘT hoặc giơ 1–4 ngón.`, hint: '' };
    },
    value(st) { const d = this.res(st); return `x = ${d.x} → y = ${d.A} : ${d.x} = ${d.ys[d.x - 1]}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matB = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.55 }), matH = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const bw = 0.7, gap = 0.45, s = 1.8 / d.A;
      for (let i = 1; i <= 4; i++) { const h = (d.A / i) * s; const m = new THREE.Mesh(new THREE.BoxGeometry(bw, h, bw), i === d.x ? matH : matB); m.position.set((i - 2.5) * (bw + gap), h / 2, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  // ======================= Model: timeunits (bảng đơn vị đo THỜI GIAN — beyond-bank) =======================
  // Giờ · phút · giây: MỖI BẬC ×60 (khác độ dài/diện tích/thể tích ×10/×100/×1000). Bẫy kinh điển: 1,5 giờ = 1 giờ 30 phút, KHÔNG phải 1 giờ 50 phút.
  timeunits: {
    U: ['giờ', 'phút', 'giây'],
    lvf(x) { if (x > 0 && Math.round(x * 1e6) === 0) return '≈0'; const r = Math.round(x * 1e6) / 1e6; if (Number.isInteger(r)) return String(r); let t = r.toFixed(6).replace(/0+$/, ''); if (t.endsWith('.')) t = t.slice(0, -1); return t.replace('.', ','); },
    noun(u) { return ['một tiết học 1 giờ', 'một phút trực nhật', 'một nhịp thở ngắn'][clamp(u, 0, 2)]; },
    res(st) { const u = clamp(Math.round(st.tuUnit), 0, 2), num = clamp(Math.round(st.tuNum), 1, 9); const cnt = []; for (let i = 0; i < 3; i++) cnt.push(num * Math.pow(60, i - u)); return { u, num, cnt, giay: num * Math.pow(60, 2 - u) }; },
    defaults(st, L) { st.tuNum = (L.tuNum != null ? L.tuNum : 2); st.tuUnit = (L.tuUnit != null ? L.tuUnit : 0); },
    geomSig(st) { const d = this.res(st); return 'tu' + d.num + ',' + d.u; },
    params() { return [{ key: 'tuNum', label: 'Số đo ở đơn vị đang chọn', min: 1, max: 9 }, { key: 'tuUnit', label: 'Đơn vị đang chọn (bậc)', min: 0, max: 2 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bấm một BẬC để chọn đơn vị đang đo; giơ 1–9 ngón đặt con số; +/− chỉnh. THỜI GIAN mỗi bậc ×60 (giờ→phút→giây), KHÁC độ dài ×10 / diện tích ×100 / thể tích ×1000.'; },
    hand(st, f) { st.tuNum = clamp(Math.round(f), 1, 9); },
    handLabel(f) { return '→ số đo = ' + clamp(Math.round(f), 1, 9); },
    draw2d(host, st) {
      const d = this.res(st);
      const yb = (i) => 76 + i * 36;
      let rows = '', x60 = '';
      for (let i = 0; i < 3; i++) {
        const on = i === d.u, y = yb(i);
        rows += `<g data-tu="${i}" style="cursor:pointer"><rect x="12" y="${y - 16}" width="150" height="26" rx="3" fill="${on ? 'rgba(240,196,92,.20)' : 'rgba(255,255,255,.03)'}" stroke="${on ? 'var(--accent)' : 'rgba(242,240,230,.14)'}" stroke-width="${on ? 2 : 1}"></rect>`
          + `<text x="20" y="${y}" font-size="13" font-weight="${on ? 700 : 500}" fill="${on ? 'var(--accent)' : 'var(--chalk)'}">${this.U[i]}</text>`
          + `<text x="156" y="${y}" text-anchor="end" font-size="14" font-weight="${on ? 800 : 500}" fill="${on ? 'var(--accent)' : 'rgba(242,240,230,.92)'}">${this.lvf(d.cnt[i])}</text></g>`;
        if (i < 2) x60 += `<text x="166" y="${y + 20}" font-size="9" fill="rgba(242,240,230,.55)">×60</text>`;
      }
      const cx = 258, cy = 134, R = 54;
      const wedge = `<path d="M ${cx} ${cy} L ${cx} ${cy - R} A ${R} ${R} 0 0 1 ${cx} ${cy + R} Z" fill="rgba(240,196,92,.14)" stroke="none"></path>`;
      let ticks = '';
      for (let t = 0; t < 60; t++) {
        const a = (-90 + t * 6) * Math.PI / 180, big = (t % 5 === 0), r0 = big ? R - 10 : R - 5;
        const x1 = (cx + Math.cos(a) * R).toFixed(1), y1 = (cy + Math.sin(a) * R).toFixed(1);
        const x2 = (cx + Math.cos(a) * r0).toFixed(1), y2 = (cy + Math.sin(a) * r0).toFixed(1);
        ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${big ? 'var(--chalk)' : 'rgba(242,240,230,.45)'}" stroke-width="${big ? 1.5 : 0.7}"></line>`;
      }
      const clock = `<text x="${cx}" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="var(--chalk)">Mặt đồng hồ: 60 vạch · ½ vòng = 30 phút</text>`
        + wedge
        + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--accent)" stroke-width="1.6"></circle>`
        + ticks
        + `<text x="${cx}" y="${cy - R - 3}" text-anchor="middle" font-size="8.5" fill="rgba(242,240,230,.6)">0</text>`
        + `<text x="${cx + R + 4}" y="${cy + 3}" font-size="8.5" fill="rgba(242,240,230,.6)">15</text>`
        + `<text x="${cx}" y="${cy + R + 9}" text-anchor="middle" font-size="8.5" fill="rgba(242,240,230,.6)">30</text>`
        + `<text x="${cx - R - 4}" y="${cy + 3}" text-anchor="end" font-size="8.5" fill="rgba(242,240,230,.6)">45</text>`
        + `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="12" font-weight="800" fill="var(--accent)">${this.lvf(d.num)} ${this.U[d.u]}</text>`;
      const conv = `<text x="404" y="52" fill="rgba(242,240,230,.7)" font-size="11.5">Cùng MỘT khoảng thời gian:</text>`
        + `<text x="404" y="78" fill="var(--accent)" font-size="18" font-weight="800">${this.lvf(d.num)} ${this.U[d.u]}</text>`
        + `<text x="404" y="102" fill="var(--chalk)" font-size="14">= ${this.lvf(d.cnt[1])} phút</text>`
        + `<text x="404" y="124" fill="var(--chalk)" font-size="14">= ${this.lvf(d.giay)} giây</text>`
        + `<text x="404" y="152" fill="rgba(242,240,230,.85)" font-size="11.5">1 giờ = 60 phút,</text>`
        + `<text x="404" y="168" fill="rgba(242,240,230,.85)" font-size="11.5">1 phút = 60 giây.</text>`
        + `<text x="404" y="192" fill="var(--warn)" font-size="11.5" font-weight="700">½ giờ = 30 phút</text>`
        + `<text x="404" y="208" fill="var(--warn)" font-size="11.5">(KHÔNG phải 50 phút)</text>`;
      const err = `<text x="12" y="250" fill="var(--warn)" font-size="11">❌ Nhầm: 1,5 giờ = 1 giờ 50 phút? Sai — 0,5 giờ = 30 phút, vậy 1,5 giờ = 1 giờ 30 phút. Thời gian nhảy ×60 mỗi bậc, không phải ×10 hay ×100.</text>`;
      host.innerHTML = `<svg id="timeunits" width="548" height="258" viewBox="0 0 548 258">` + rows + x60 + clock + conv + err + `</svg>`;
      const svg = host.querySelector('#timeunits');
      if (svg && svg.querySelectorAll) svg.querySelectorAll('g[data-tu]').forEach((g) => g.addEventListener('pointerdown', () => { state.tuUnit = +g.dataset.tu; drawVisual(); render(); }));
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${this.noun(d.u)}. Nhìn mặt đồng hồ: kim phút đi hết MỘT vòng (60 vạch) thì kim giờ nhích đúng 1 bước — vậy 1 giờ = 60 phút, không phải 100. ${this.lvf(d.num)} ${this.U[d.u]} tương ứng bao nhiêu phút?`, hint: 'Thời gian nhảy ×60 mỗi bậc, KHÁC hẳn độ dài/diện tích/thể tích (×10/×100/×1000).' };
      if (s === 2) return { cap: `Sơ đồ: mặt đồng hồ chia 60 vạch phút ⟹ 1 giờ = 60 phút. Nửa vòng (vạch số 30, tô vàng) là ½ giờ = 30 phút — KHÔNG phải 50 phút! Vì thế 1,5 giờ = 1 giờ 30 phút. Ở đây ${this.lvf(d.num)} ${this.U[d.u]} = ${this.lvf(d.cnt[1])} phút.`, hint: 'Đừng lấy phần thập phân ×100: phút là phần của 60, không phải của 100.' };
      if (s === 3) return { cap: `Phép tính: ${this.lvf(d.num)} ${this.U[d.u]} = ${this.lvf(d.cnt[1])} phút = ${this.lvf(d.giay)} giây. ` + L.chot, hint: '' };
      return { cap: `Cả lớp: ${this.lvf(d.num)} ${this.U[d.u]} bằng mấy phút, mấy giây? Đi xuống từ ${this.U[d.u]} tới giây là ${2 - d.u} bậc ⟹ ×60 mỗi bậc = ×${Math.pow(60, 2 - d.u)}.`, hint: '' };
    },
    value(st) { const d = this.res(st); return `${this.lvf(d.num)} ${this.U[d.u]} = ${this.lvf(d.cnt[1])} phút = ${this.lvf(d.giay)} giây`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matDisc = new THREE.MeshStandardMaterial({ color: 0x2b3a42, roughness: 0.6, transparent: true, opacity: 0.55 });
      const matTick = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.55 });
      const matHour = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.12, 48), matDisc); disc.rotation.set(Math.PI / 2, 0, 0); disc.position.set(0, 1.6, 0); g.add(disc);
      const face = new THREE.Group(); face.position.set(0, 1.6, 0.1);
      for (let t = 0; t < 60; t++) { const a = t / 60 * Math.PI * 2, big = (t % 5 === 0); const sz = big ? 0.14 : 0.07; const m = new THREE.Mesh(new THREE.BoxGeometry(sz, sz, 0.06), big ? matHour : matTick); m.position.set(Math.cos(a) * 1.6, Math.sin(a) * 1.6, 0); face.add(m); }
      g.add(face);
      return g;
    },
    paint3d() {},
  },
  // ======================= Model: mixed (HỖN SỐ — beyond-bank) =======================
  // Một phân số lớn hơn 1 = phần NGUYÊN + phần PHÂN SỐ. Đổi: lấy TỬ CHIA MẪU → thương = phần nguyên, dư = tử mới, mẫu giữ nguyên.
  mixed: {
    res(st) { const D = clamp(Math.round(st.mxDen), 2, 6), T = clamp(Math.round(st.mxTop), 1, 12); const Q = Math.floor(T / D), R = T % D; return { D, T, Q, R, mixed: R === 0 ? String(Q) : (Q === 0 ? `${R}/${D}` : `${Q} ${R}/${D}`) }; },
    defaults(st, L) { st.mxTop = (L.mxTop != null ? L.mxTop : 5); st.mxDen = (L.mxDen != null ? L.mxDen : 3); },
    geomSig(st) { const d = this.res(st); return 'mx' + d.T + ',' + d.D; },
    params() { return [{ key: 'mxTop', label: 'Số phần tô (tử số)', min: 1, max: 12 }, { key: 'mxDen', label: 'Mẫu số (số phần mỗi ô)', min: 2, max: 6 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bấm một MẪU SỐ (2…6) để chọn cỡ mỗi phần; giơ 1–12 ngón đặt số phần tô (tử số). Hỗn số: lấy TỬ CHIA MẪU → thương = phần nguyên, dư = tử phần sau.'; },
    hand(st, f) { st.mxTop = clamp(Math.round(f), 1, 12); },
    handLabel(f) { return '→ số phần = ' + clamp(Math.round(f), 1, 12); },
    draw2d(host, st) {
      const d = this.res(st);
      const ox = 16, oy = 40, sq = 48, gap = 12, step = sq + gap;
      const N = d.Q > 0 ? (d.R > 0 ? d.Q + 1 : d.Q) : 1;
      let cells = '';
      for (let s = 0; s < N; s++) {
        const bx = ox + s * step;
        cells += `<rect x="${bx}" y="${oy}" width="${sq}" height="${sq}" fill="none" stroke="rgba(242,240,230,.5)" stroke-width="1.4"></rect>`;
        for (let k = 0; k < d.D; k++) {
          const cx = bx + (k * sq) / d.D, cw = sq / d.D, on = (s * d.D + k) < d.T;
          cells += `<rect x="${cx.toFixed(1)}" y="${oy}" width="${cw.toFixed(1)}" height="${sq}" fill="${on ? 'rgba(240,196,92,.5)' : 'rgba(255,255,255,.02)'}" stroke="rgba(242,240,230,.28)" stroke-width="0.7"></rect>`;
        }
      }
      let axis = `<line x1="${ox}" y1="${oy + sq + 8}" x2="${ox + N * step - gap}" y2="${oy + sq + 8}" stroke="rgba(242,240,230,.5)"></line>`;
      for (let s = 0; s <= N; s++) { const bx = ox + s * step; axis += `<line x1="${bx}" y1="${oy + sq + 4}" x2="${bx}" y2="${oy + sq + 12}" stroke="rgba(242,240,230,.6)"></line><text x="${bx}" y="${oy + sq + 24}" text-anchor="middle" font-size="11" fill="rgba(242,240,230,.8)">${s}</text>`; }
      const cards = `<text x="360" y="30" fill="var(--chalk)" font-size="12.5" font-weight="700">Hai cách viết CÙNG một số:</text>`
        + `<rect x="360" y="40" width="84" height="30" rx="4" fill="rgba(127,201,191,.14)" stroke="rgba(127,201,191,.5)"></rect><text x="402" y="60" text-anchor="middle" font-size="14" font-weight="800" fill="var(--chalk)">${d.T}/${d.D}</text>`
        + `<text x="450" y="60" font-size="16" fill="var(--accent)">=</text>`
        + `<rect x="462" y="40" width="78" height="30" rx="4" fill="rgba(240,196,92,.18)" stroke="var(--accent)"></rect><text x="501" y="60" text-anchor="middle" font-size="14" font-weight="800" fill="var(--accent)">${d.mixed}</text>`
        + `<text x="360" y="92" fill="rgba(242,240,230,.85)" font-size="11.5">Tử chia mẫu: ${d.T} : ${d.D} = ${d.Q} dư ${d.R}.</text>`
        + `<text x="360" y="110" fill="rgba(242,240,230,.85)" font-size="11.5">→ phần nguyên ${d.Q}, dư ${d.R} là tử,</text>`
        + `<text x="360" y="128" fill="rgba(242,240,230,.85)" font-size="11.5">mẫu vẫn là ${d.D}. Mỗi ô = ${d.D} phần.</text>`;
      const denLabel = `<text x="16" y="150" fill="rgba(242,240,230,.7)" font-size="11.5">Mẫu số (số phần mỗi ô) — bấm để đổi:</text>`;
      let chips = '';
      for (let D = 2; D <= 6; D++) { const cx = 16 + (D - 2) * 44, on = D === d.D; chips += `<g data-mxd="${D}" style="cursor:pointer"><rect x="${cx}" y="158" width="38" height="24" rx="3" fill="${on ? 'rgba(240,196,92,.20)' : 'rgba(255,255,255,.03)'}" stroke="${on ? 'var(--accent)' : 'rgba(242,240,230,.14)'}" stroke-width="${on ? 2 : 1}"></rect><text x="${cx + 19}" y="175" text-anchor="middle" font-size="13" font-weight="${on ? 800 : 500}" fill="${on ? 'var(--accent)' : 'var(--chalk)'}">${D}</text></g>`; }
      const title = `<text x="16" y="16" fill="var(--chalk)" font-size="13" font-weight="700">Hỗn số = phần NGUYÊN + phần bé hơn 1</text>`;
      const err = `<text x="16" y="216" fill="var(--warn)" font-size="11">❌ Nhầm: ${d.T}/${d.D} = ${d.T} ${d.R === 0 ? 1 : d.R}/${d.D}? Sai — phải LẤY TỬ CHIA MẪU: ${d.T} : ${d.D} = ${d.Q} dư ${d.R}, nên ${d.T}/${d.D} = ${d.mixed}.</text>`;
      host.innerHTML = `<svg id="mixed" width="548" height="258" viewBox="0 0 548 258">` + title + cells + axis + cards + denLabel + chips + err + `</svg>`;
      const svg = host.querySelector('#mixed');
      if (svg && svg.querySelectorAll) svg.querySelectorAll('g[data-mxd]').forEach((g) => g.addEventListener('pointerdown', () => { state.mxDen = +g.dataset.mxd; drawVisual(); render(); }));
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: mỗi cái bánh cắt ${d.D} phần bằng nhau. Cô có ${d.T} mảnh. Ghép ${d.D} mảnh = 1 cái nguyên, nên ghép được ${d.Q} cái nguyên và thừa ${d.R} mảnh — tức ${d.mixed} cái bánh.`, hint: 'Cứ đủ ' + d.D + ' mảnh là sang một cái nguyên mới.' };
      if (s === 2) return { cap: `Sơ đồ ô vuông + trục số: mỗi ô là 1 cái bánh = ${d.D}/${d.D} (${d.D} phần). Tô ${d.T} phần: đi đầy ${d.Q} ô rồi mới lan sang ô thứ ${d.Q + 1} được ${d.R} phần. Vậy ${d.T}/${d.D} = ${d.mixed}.`, hint: 'Phần nguyên = số Ô ĐÃ ĐẦY; phần phân số = số phần tô ở ô cuối.' };
      if (s === 3) return { cap: `Phép tính: ${d.T} : ${d.D} = ${d.Q} dư ${d.R} ⟹ ${d.T}/${d.D} = ${d.mixed}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp: ${d.T}/${d.D} đổi ra hỗn số thế nào? Lấy ${d.T} : ${d.D} được ${d.Q} dư ${d.R}. Muốn đổi ngược về phân số thì ${d.Q} × ${d.D} + ${d.R}.`, hint: '' };
    },
    value(st) { const d = this.res(st); return `${d.T}/${d.D} = ${d.mixed}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matFull = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.55 }), matPart = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const sz = 1.1, sp = 1.4; let x = 0;
      for (let i = 0; i < d.Q; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(sz, sz, sz), matFull); m.position.set(x, sz / 2, 0); g.add(m); x += sp; }
      if (d.R > 0) { const m = new THREE.Mesh(new THREE.BoxGeometry(sz * (d.R / d.D), sz, sz), matPart); m.position.set(x + (sz * (d.R / d.D)) / 2, sz / 2, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  decfrac: {
    res(st) {
      const e = clamp(Math.round(st.dfExp), 1, 3), D = Math.pow(10, e), N = clamp(Math.round(st.dfNum), 1, 99);
      const ip = Math.floor(N / D), fp = N % D, fracStr = String(fp).padStart(e, '0');
      const digits = fracStr.split('').map((ch) => +ch);
      const trimmed = fracStr.replace(/0+$/, '');
      const dec = trimmed === '' ? String(ip) : (`${ip},${trimmed}`);
      const PLACE = ['phần mười', 'phần trăm', 'phần nghìn'];
      return { e, D, N, ip, fp, fracStr, digits, dec, placeName: PLACE[e - 1] };
    },
    defaults(st, L) { st.dfExp = (L.dfExp != null ? L.dfExp : 1); st.dfNum = (L.dfNum != null ? L.dfNum : 7); },
    geomSig(st) { const d = this.res(st); return 'df' + d.e + ',' + d.N; },
    params() { return [{ key: 'dfExp', label: 'Mẫu số (10 · 100 · 1000)', min: 1, max: 3 }, { key: 'dfNum', label: 'Tử số (số phần tô)', min: 1, max: 99 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bấm một MẪU (10 · 100 · 1000) để chọn hàng; giơ 1–9 ngón đặt tử số. Tử số rơi đúng vào hàng phần mười / phần trăm / phần nghìn sau dấu phẩy.'; },
    hand(st, f) { st.dfNum = clamp(Math.round(f), 1, 99); },
    handLabel(f) { return '→ tử số = ' + clamp(Math.round(f), 1, 99); },
    draw2d(host, st) {
      const d = this.res(st);
      const PLACE = ['phần mười', 'phần trăm', 'phần nghìn'];
      const frac = `<text x="20" y="34" fill="var(--chalk)" font-size="12.5" font-weight="700">Phân số thập phân</text>`
        + `<text x="34" y="66" text-anchor="middle" fill="var(--chalk)" font-size="20" font-weight="800">${d.N}</text>`
        + `<line x1="16" y1="72" x2="52" y2="72" stroke="var(--chalk)" stroke-width="2"></line>`
        + `<text x="34" y="94" text-anchor="middle" fill="var(--chalk)" font-size="20" font-weight="800">${d.D}</text>`;
      const ipx = 96; let ipBoxes = `<text x="${ipx}" y="34" fill="rgba(242,240,230,.7)" font-size="11">Nguyên = ${d.ip}</text>`;
      for (let k = 0; k < d.ip; k++) { const bx = ipx + k * 16; ipBoxes += `<rect x="${bx}" y="44" width="14" height="14" fill="rgba(127,201,191,.7)" stroke="rgba(242,240,230,.6)" stroke-width="0.8"></rect>`; }
      const comma = `<text x="${ipx + d.ip * 16 + 4}" y="70" fill="var(--accent)" font-size="26" font-weight="800">,</text>`;
      let cols = '';
      for (let j = 0; j < d.e; j++) {
        const cx = 300 + j * 76, digit = d.digits[j];
        cols += `<text x="${cx + 22}" y="34" text-anchor="middle" fill="rgba(242,240,230,.7)" font-size="10.5">${PLACE[j]}</text>`;
        for (let s = 0; s < 10; s++) { const by = 48 + (9 - s) * 13, on = s < digit; cols += `<rect x="${cx}" y="${by}" width="44" height="11" fill="${on ? 'rgba(240,196,92,.72)' : 'rgba(255,255,255,.04)'}" stroke="rgba(242,240,230,.28)" stroke-width="0.6"></rect>`; }
        cols += `<text x="${cx + 22}" y="192" text-anchor="middle" fill="var(--accent)" font-size="16" font-weight="800">${digit}</text>`;
      }
      const decCard = `<text x="16" y="128" fill="var(--chalk)" font-size="12.5" font-weight="700">Số thập phân:</text>`
        + `<rect x="16" y="136" width="72" height="32" rx="4" fill="rgba(240,196,92,.16)" stroke="var(--accent)"></rect>`
        + `<text x="52" y="157" text-anchor="middle" fill="var(--accent)" font-size="16" font-weight="800">${d.dec}</text>`
        + `<text x="98" y="150" fill="rgba(242,240,230,.85)" font-size="11">Tử ${d.N} đặt vào hàng ${d.placeName}.</text>`
        + `<text x="98" y="166" fill="rgba(242,240,230,.85)" font-size="11">Mẫu ${d.D} có ${d.e} chữ số 0 → ${d.e} chữ số sau phẩy.</text>`;
      let chips = `<text x="150" y="222" fill="rgba(242,240,230,.7)" font-size="11">Mẫu — bấm để đổi hàng:</text>`;
      for (let e = 1; e <= 3; e++) { const Dv = Math.pow(10, e), cx = 150 + (e - 1) * 70, on = e === d.e; chips += `<g data-dfe="${e}" style="cursor:pointer"><rect x="${cx}" y="228" width="58" height="24" rx="3" fill="${on ? 'rgba(240,196,92,.2)' : 'rgba(255,255,255,.03)'}" stroke="${on ? 'var(--accent)' : 'rgba(242,240,230,.14)'}" stroke-width="${on ? 2 : 1}"></rect><text x="${cx + 29}" y="245" text-anchor="middle" font-size="13" font-weight="${on ? 800 : 500}" fill="${on ? 'var(--accent)' : 'var(--chalk)'}">${Dv}</text></g>`; }
      const err = `<text x="366" y="230" fill="var(--warn)" font-size="10.5">❌ 7/100 = 0,7? Sai — mẫu 100 → hàng PHẦN TRĂM → 0,07.</text>`;
      const title = `<text x="150" y="16" fill="var(--chalk)" font-size="13" font-weight="700">Phân số thập phân ↔ Số thập phân (bảng hàng giá trị)</text>`;
      host.innerHTML = `<svg id="decfrac" width="548" height="258" viewBox="0 0 548 258">` + title + frac + ipBoxes + comma + cols + decCard + chips + err + `</svg>`;
      const svg = host.querySelector('#decfrac');
      if (svg && svg.querySelectorAll) svg.querySelectorAll('g[data-dfe]').forEach((g) => g.addEventListener('pointerdown', () => { state.dfExp = +g.dataset.dfe; drawVisual(); render(); }));
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: một băng giấy chia ${d.D} phần bằng nhau, cô tô ${d.N} phần = ${d.N}/${d.D}. Mỗi phần nhỏ bằng ${d.placeName}.`, hint: 'Càng nhiều số 0 ở mẫu thì mỗi phần càng nhỏ.' };
      if (s === 2) return { cap: `Bảng hàng giá trị: tử số ${d.N} đặt vào hàng ${d.placeName} (chữ số ${d.digits.join('')} sau dấu phẩy). Vậy ${d.N}/${d.D} = ${d.dec}.`, hint: 'Đếm số chữ số sau phẩy = số chữ số 0 của mẫu.' };
      if (s === 3) return { cap: `Phép đổi: ${d.N} : ${d.D} = ${d.dec}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp: đổi ${d.N}/${d.D} ra số thập phân? Mẫu ${d.D} có ${d.e} chữ số 0 → viết ${d.e} chữ số sau dấu phẩy → ${d.dec}.`, hint: '' };
    },
    value(st) { const d = this.res(st); return `${d.N}/${d.D} = ${d.dec}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matInt = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.55 });
      const matSeg = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const matEmpty = new THREE.MeshStandardMaterial({ color: 0x3a3f4b, roughness: 0.85 });
      let x = 0;
      for (let k = 0; k < d.ip; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), matInt); m.position.set(x, 0.5, 0); g.add(m); x += 1.2; }
      for (let j = 0; j < d.e; j++) { const digit = d.digits[j]; for (let s = 0; s < 10; s++) { const on = s < digit; const m = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.7), on ? matSeg : matEmpty); m.position.set(x + j * 1.4, 0.1 + s * 0.16, 0); g.add(m); } }
      return g;
    },
    paint3d() {},
  },
  zeromult: {
    res(st) {
      const mant = clamp(Math.round(st.zmMant), 1, 9), z = clamp(Math.round(st.zmZeros), 0, 3), b = clamp(Math.round(st.zmB), 1, 9);
      const A = mant * Math.pow(10, z), base = mant * b, product = base * Math.pow(10, z);
      return { mant, z, b, A, base, product };
    },
    defaults(st, L) { st.zmMant = (L.zmMant != null ? L.zmMant : 3); st.zmZeros = (L.zmZeros != null ? L.zmZeros : 1); st.zmB = (L.zmB != null ? L.zmB : 4); },
    geomSig(st) { const d = this.res(st); return 'zm' + d.mant + ',' + d.z + ',' + d.b; },
    params() { return [{ key: 'zmMant', label: 'Chữ số khác 0 (thừa số 1)', min: 1, max: 9 }, { key: 'zmZeros', label: 'Số chữ số 0 ở tận cùng', min: 0, max: 3 }, { key: 'zmB', label: 'Thừa số thứ hai (1 chữ số)', min: 1, max: 9 }]; },
    toggles() { return []; },
    ctlHint() { return 'Ba thanh trượt: mant (1–9), số CHỮ SỐ 0 tận cùng thừa số 1 (0–3), thừa số 2 (1–9). Giơ 1–9 ngón đổi mant. Bỏ 0 → nhân phần khác 0 → viết lại đủ số 0.'; },
    hand(st, f) { st.zmMant = clamp(Math.round(f), 1, 9); },
    handLabel(f) { return '→ mant = ' + clamp(Math.round(f), 1, 9); },
    draw2d(host, st) {
      const d = this.res(st);
      const cell = 40, gapw = 46;
      const drawNum = (str, ztrail, x0, y) => { let out = ''; const n = str.length; for (let k = 0; k < n; k++) { const bx = x0 + k * gapw, isZero = (n - k) <= ztrail, ch = str[k]; out += `<rect x="${bx}" y="${y}" width="${cell}" height="${cell}" rx="4" fill="${isZero ? 'rgba(127,201,191,.12)' : 'rgba(240,196,92,.2)'}" stroke="${isZero ? 'rgba(127,201,191,.55)' : 'var(--accent)'}" stroke-width="1.5"></rect><text x="${(bx + cell / 2).toFixed(0)}" y="${y + cell / 2 + 8}" text-anchor="middle" font-size="22" font-weight="800" fill="${isZero ? 'rgba(127,201,191,.95)' : 'var(--accent)'}">${ch}</text>`; } return out; };
      const aX = 44, aY = 40;
      const aBoxes = drawNum(String(d.A), d.z, aX, aY);
      const opX = aX + String(d.A).length * gapw + 8;
      const op = `<text x="${opX}" y="${aY + 28}" fill="var(--chalk)" font-size="20" font-weight="800">× ${d.b}</text>`;
      const mid = `<text x="16" y="112" fill="rgba(242,240,230,.9)" font-size="12">${d.z > 0 ? 'Tạm bỏ ' + d.z + ' chữ số 0 → ' : 'Không có số 0 ở tận cùng → '}nhẩm: ${d.mant} × ${d.b} = ${d.base}</text>`;
      const pY = 132;
      const eqLbl = `<text x="16" y="${pY + 28}" fill="var(--chalk)" font-size="20" font-weight="800">=</text>`;
      const pBoxes = drawNum(String(d.product), d.z, aX, pY);
      const note = `<text x="${aX + String(d.product).length * gapw + 8}" y="${pY + 28}" fill="rgba(240,196,92,.9)" font-size="11">→ viết lại ${d.z} chữ số 0</text>`;
      const legend = `<text x="16" y="196" fill="rgba(127,201,191,.9)" font-size="10.5">ô xám = chữ số 0 tận cùng (chỉ "gấp 10/100/1000") · ô vàng = phần khác 0</text>`;
      const err = `<text x="16" y="246" fill="var(--warn)" font-size="10.5">❌ Quên viết lại ${d.z} chữ số 0 thì ra ${d.base} (sai) — đúng phải là ${d.A} × ${d.b} = ${d.product}.</text>`;
      const title = `<text x="150" y="16" fill="var(--chalk)" font-size="13" font-weight="700">Nhân nhẩm với số có chữ số 0 ở tận cùng</text>`;
      host.innerHTML = `<svg id="zeromult" width="548" height="258" viewBox="0 0 548 258">` + title + aBoxes + op + mid + eqLbl + pBoxes + note + legend + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${d.A} gói kẹo xếp ${d.b} lớp. Bỏ ${d.z} chữ số 0 ở ${d.A} thì còn ${d.mant} gói × ${d.b} lớp = ${d.base}, rồi viết lại ${d.z} chữ số 0 → ${d.product} gói.`, hint: 'Số 0 ở tận cùng chỉ "to gấp 10, 100…", không đổi phép nhân cơ bản.' };
      if (s === 2) return { cap: `Tách số: ${d.A} = ${d.mant} × ${Math.pow(10, d.z)}. Nhân phần khác 0: ${d.mant} × ${d.b} = ${d.base}. Viết lại ${d.z} chữ số 0 ⟹ ${d.A} × ${d.b} = ${d.product}.`, hint: 'Đếm chữ số 0 ở tận cùng hai thừa số = số chữ số 0 viết thêm vào kết quả.' };
      if (s === 3) return { cap: `Phép tính: ${d.A} × ${d.b} = ${d.product}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp: tính ${d.A} × ${d.b}? Bỏ ${d.z} chữ số 0, nhẩm ${d.mant} × ${d.b} = ${d.base}, rồi viết ${d.z} chữ số 0 ra sau ⟹ ${d.product}.`, hint: '' };
    },
    value(st) { const d = this.res(st); return `${d.A} × ${d.b} = ${d.product}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matBase = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const matZero = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      for (let r = 0; r < d.mant; r++) { for (let c = 0; c < d.b; c++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), matBase); m.position.set(c * 0.9, -r * 0.9, 0); g.add(m); } }
      for (let k = 0; k < d.z; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), matZero); m.position.set((d.b + 0.6 + k) * 0.9, -0.45, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  addgroup: {
    res(st) {
      const A = clamp(Math.round(st.agA), 2, 99), B = clamp(Math.round(st.agB), 2, 99), C = clamp(Math.round(st.agC), 2, 99);
      const vals = [A, B, C];
      const tz = (n) => { if (!n) return 0; let k = 0; while (n % 10 === 0 && k < 4) { k++; n = Math.floor(n / 10); } return k; };
      const cand = [{ p: [0, 1], s: A + B }, { p: [0, 2], s: A + C }, { p: [1, 2], s: B + C }];
      let best = cand[0];
      for (const c of cand) { if (tz(c.s) > tz(best.s)) best = c; }
      const total = A + B + C;
      const otherIdx = [0, 1, 2].find(i => i !== best.p[0] && i !== best.p[1]);
      const other = vals[otherIdx];
      return { A, B, C, vals, pair: best.p, pairSum: best.s, otherIdx, other, total, round: best.s % 10 === 0 };
    },
    defaults(st, L) { st.agA = (L.agA != null ? L.agA : 27); st.agB = (L.agB != null ? L.agB : 43); st.agC = (L.agC != null ? L.agC : 15); },
    geomSig(st) { const d = this.res(st); return 'ag' + d.A + ',' + d.B + ',' + d.C; },
    params() { return [{ key: 'agA', label: 'Số hạng ①', min: 2, max: 99 }, { key: 'agB', label: 'Số hạng ②', min: 2, max: 99 }, { key: 'agC', label: 'Số hạng ③', min: 2, max: 99 }]; },
    toggles() { return []; },
    ctlHint() { return 'Ba thanh trượt cho ba số hạng (2–99). Giơ 1–9 ngón đổi số ①. Muốn nhanh: chọn hai số có chữ số TẬN CÙNG bù nhau về 0 (7+3, 4+6, 8+2…) để nhóm thành tròn chục.'; },
    hand(st, f) { st.agA = clamp(Math.round(f), 2, 99); },
    handLabel(f) { return '→ số ① = ' + clamp(Math.round(f), 2, 99); },
    draw2d(host, st) {
      const d = this.res(st);
      const lab = ['①', '②', '③'];
      const cellW = 96, cellH = 66, y0 = 58, gap = 34, x0 = 44;
      let tiles = '';
      for (let i = 0; i < 3; i++) {
        const bx = x0 + i * (cellW + gap);
        const inPair = d.pair.includes(i);
        const stroke = inPair ? 'var(--accent)' : 'rgba(127,201,191,.7)';
        const fill = inPair ? 'rgba(240,196,92,.16)' : 'rgba(127,201,191,.08)';
        tiles += `<rect x="${bx}" y="${y0}" width="${cellW}" height="${cellH}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="2"></rect>`
          + `<text x="${(bx + cellW / 2).toFixed(0)}" y="${y0 + 30}" text-anchor="middle" font-size="26" font-weight="800" fill="var(--chalk)">${d.vals[i]}</text>`
          + `<text x="${(bx + cellW / 2).toFixed(0)}" y="${y0 + 54}" text-anchor="middle" font-size="11" fill="rgba(242,240,230,.7)">${lab[i]} · tận cùng ${d.vals[i] % 10}</text>`;
      }
      const pi = d.pair[0], pj = d.pair[1];
      const cx1 = x0 + pi * (cellW + gap) + cellW / 2, cx2 = x0 + pj * (cellW + gap) + cellW / 2;
      const brY = y0 - 10;
      const conn = `<path d="M ${cx1.toFixed(0)} ${brY} Q ${((cx1 + cx2) / 2).toFixed(0)} ${brY - 22} ${cx2.toFixed(0)} ${brY}" fill="none" stroke="var(--accent)" stroke-width="2"></path>`
        + `<text x="${((cx1 + cx2) / 2).toFixed(0)}" y="${brY - 26}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--accent)">nhóm = ${d.pairSum}</text>`;
      const plus1 = `<text x="${(x0 + cellW + gap / 2).toFixed(0)}" y="${y0 + cellH / 2 + 8}" text-anchor="middle" font-size="20" font-weight="800" fill="var(--chalk)">+</text>`;
      const plus2 = `<text x="${(x0 + 2 * (cellW + gap) - gap / 2).toFixed(0)}" y="${y0 + cellH / 2 + 8}" text-anchor="middle" font-size="20" font-weight="800" fill="var(--chalk)">+</text>`;
      const ey = y0 + cellH + 34;
      const expr = `<text x="16" y="${ey}" font-size="15" fill="var(--chalk)" font-weight="700">= (${d.vals[pi]} + ${d.vals[pj]}) + ${d.other} = ${d.pairSum} + ${d.other} = ${d.total}</text>`;
      const note = `<text x="16" y="${ey + 22}" font-size="11" fill="rgba(240,196,92,.9)">${d.round ? '✓ Hai số tận cùng bù về 0 → nhóm ra ' + d.pairSum + ' tròn ' + (d.pairSum % 100 === 0 ? 'trăm' : 'chục') + ', cộng nhẩm rất nhanh.' : '⚠ Chưa có cặp nào cộng ra tròn chục — cô chọn hai số có chữ số tận cùng bù nhau (7 và 3, 4 và 6…).'}</text>`;
      const err = `<text x="16" y="${ey + 46}" font-size="10.5" fill="var(--warn)">❌ Cộng tuần tự ${d.A} + ${d.B} rồi + ${d.C} dễ sai ở chỗ nhớ; nên ĐỔI CHỖ + THÊM NGOẶC để ghép số tròn chục trước (tính chất giao hoán + kết hợp).</text>`;
      const title = `<text x="170" y="16" fill="var(--chalk)" font-size="13" font-weight="700">Nhóm tạo tròn chục khi cộng</text>`;
      host.innerHTML = `<svg id="addgroup" width="548" height="258" viewBox="0 0 548 258">` + title + conn + tiles + plus1 + plus2 + expr + note + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st);
      const lab = ['①', '②', '③'];
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${d.vals[d.pair[0]]} viên + ${d.vals[d.pair[1]]} viên ghép lại = ${d.pairSum}${d.round ? ' (đúng tròn ' + (d.pairSum % 100 === 0 ? 'trăm' : 'chục') + ')' : ''}, rồi cộng tiếp ${d.other} viên → ${d.total} viên.`, hint: 'Ưu tiên ghép hai đống thành tròn chục rồi mới cộng đống còn lại.' };
      if (s === 2) return { cap: `Sơ đồ: ${d.A} + ${d.B} + ${d.C}. Nhóm ${lab[d.pair[0]]}+${lab[d.pair[1]]} = ${d.vals[d.pair[0]]} + ${d.vals[d.pair[1]]} = ${d.pairSum}, rồi ${d.pairSum} + ${d.other} = ${d.total}.`, hint: 'ĐỔI CHỖ (giao hoán) để hai số bù nhau đứng cạnh, THÊM NGOẶC (kết hợp) để cộng chúng trước.' };
      if (s === 3) return { cap: `Phép tính: (${d.vals[d.pair[0]]} + ${d.vals[d.pair[1]]}) + ${d.other} = ${d.pairSum} + ${d.other} = ${d.total}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp: tính ${d.A} + ${d.B} + ${d.C}? Tìm hai số có tận cùng bù về 0 để nhóm thành tròn chục (${d.vals[d.pair[0]]} + ${d.vals[d.pair[1]]} = ${d.pairSum}), rồi cộng ${d.other} → ${d.total}.`, hint: '' };
    },
    value(st) { const d = this.res(st); return `${d.A} + ${d.B} + ${d.C} = ${d.total}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matPair = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const matOther = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const w = 0.8;
      for (let i = 0; i < 3; i++) {
        const hh = d.vals[i] / 12;
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, w), d.pair.includes(i) ? matPair : matOther);
        m.position.set((i - 1) * 1.1, hh / 2, 0); g.add(m);
      }
      return g;
    },
    paint3d() {},
  },
  diffratio: {
    res(st) {
      const a = clamp(Math.round(st.drBig), 2, 10), b = clamp(Math.round(st.drSmall), 1, 9), D = clamp(Math.round(st.drDiff), 1, 60);
      const dp = a - b, ok = dp > 0;
      const partVal = ok ? D / dp : 0, big = ok ? a * partVal : 0, small = ok ? b * partVal : 0;
      return { a, b, D, dp, ok, partVal, big, small };
    },
    defaults(st, L) { st.drBig = (L.drBig != null ? L.drBig : 5); st.drSmall = (L.drSmall != null ? L.drSmall : 2); st.drDiff = (L.drDiff != null ? L.drDiff : 24); },
    geomSig(st) { const d = this.res(st); return 'dr' + d.a + ',' + d.b + ',' + d.D; },
    params() { return [{ key: 'drBig', label: 'Số phần của SỐ LỚN', min: 2, max: 10 }, { key: 'drSmall', label: 'Số phần của SỐ BÉ', min: 1, max: 9 }, { key: 'drDiff', label: 'HIỆU hai số', min: 1, max: 60 }]; },
    toggles() { return []; },
    ctlHint() { return 'Ba thanh trượt: số phần SỐ LỚN (2–10), số phần SỐ BÉ (1–9), HIỆU (1–60). Số phần lớn phải HƠN số phần bé. Giơ 2–9 ngón đặt số phần lớn. Một phần = HIỆU : (số phần lớn − số phần bé).'; },
    hand(st, f) { st.drBig = clamp(Math.round(f), 2, 10); },
    handLabel(f) { return '→ số phần lớn = ' + clamp(Math.round(f), 2, 10); },
    draw2d(host, st) {
      const d = this.res(st);
      const nf = (x) => { const r = Math.round(x * 1000) / 1000; return Number.isInteger(r) ? String(r) : String(r).replace('.', ','); };
      const sq = 34, ox = 150, rowBigY = 44, rowSmallY = rowBigY + sq + 18;
      const cell = (x, y, fill, stroke) => `<rect x="${x.toFixed(0)}" y="${y}" width="${sq - 2}" height="${sq - 2}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"></rect>`;
      let rowA = ''; for (let k = 0; k < d.a; k++) { rowA += cell(ox + k * sq, rowBigY, k >= d.b ? 'rgba(240,196,92,.28)' : 'rgba(127,201,191,.22)', 'var(--accent)'); }
      let rowB = ''; for (let k = 0; k < d.b; k++) { rowB += cell(ox + k * sq, rowSmallY, 'rgba(127,201,191,.22)', 'rgba(127,201,191,.7)'); }
      const lblA = `<text x="14" y="${rowBigY + sq / 2 + 4}" font-size="12" fill="var(--chalk)">số lớn · ${d.a} phần</text>`;
      const lblB = `<text x="14" y="${rowSmallY + sq / 2 + 4}" font-size="12" fill="var(--chalk)">số bé · ${d.b} phần</text>`;
      let eff = '';
      if (d.ok) { const ex = ox + d.b * sq, exEnd = ox + d.a * sq; eff = `<path d="M ${ex.toFixed(0)} ${rowBigY - 6} L ${ex.toFixed(0)} ${rowBigY - 14} L ${exEnd.toFixed(0)} ${rowBigY - 14} L ${exEnd.toFixed(0)} ${rowBigY - 6}" fill="none" stroke="var(--accent)" stroke-width="2"></path><text x="${((ex + exEnd) / 2).toFixed(0)}" y="${rowBigY - 18}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--accent)">hiệu ${d.D} = ${d.dp} phần</text>`; }
      const line1 = `<text x="14" y="${rowSmallY + sq + 22}" font-size="12" fill="rgba(242,240,230,.9)">${d.ok ? '1 phần = ' + d.D + ' : ' + d.dp + ' = ' + nf(d.partVal) : '⚠ Số phần của SỐ LỚN phải LỚN HƠN số phần của SỐ BÉ (để hiệu dương).'}</text>`;
      const line2 = `<text x="14" y="${rowSmallY + sq + 44}" font-size="13" font-weight="700" fill="var(--chalk)">${d.ok ? 'Số lớn = ' + d.a + ' × ' + nf(d.partVal) + ' = ' + nf(d.big) + ' · Số bé = ' + d.b + ' × ' + nf(d.partVal) + ' = ' + nf(d.small) : ''}</text>`;
      const err = `<text x="14" y="${rowSmallY + sq + 68}" font-size="10.5" fill="var(--warn)">❌ Chia hiệu cho TỔNG số phần (${d.a} + ${d.b})? Sai — phải chia cho HIỆU số phần (${d.a} − ${d.b} = ${d.dp}).</text>`;
      const title = `<text x="170" y="16" font-size="13" font-weight="700" fill="var(--chalk)">Tìm hai số khi biết HIỆU và TỈ số</text>`;
      host.innerHTML = `<svg id="diffratio" width="520" height="210" viewBox="0 0 520 210">` + title + eff + rowA + rowB + lblA + lblB + line1 + line2 + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st);
      const nf = (x) => { const r = Math.round(x * 1000) / 1000; return Number.isInteger(r) ? String(r) : String(r).replace('.', ','); };
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hai đống hơn nhau ${d.D} cái, đúng bằng ${d.dp} phần thừa ra (số lớn ${d.a} phần, số bé ${d.b} phần).`, hint: d.ok ? 'Mỗi phần = hiệu : HIỆU số phần.' : 'Số phần lớn phải lớn hơn số phần bé.' };
      if (s === 2) return { cap: `Sơ đồ: số lớn ${d.a} phần, số bé ${d.b} phần → lệch ${d.dp} phần = ${d.D}. 1 phần = ${d.D} : ${d.dp} = ${nf(d.partVal)}. Số lớn = ${d.a} × ${nf(d.partVal)} = ${nf(d.big)}, số bé = ${d.b} × ${nf(d.partVal)} = ${nf(d.small)}.`, hint: 'CHIA hiệu cho HIỆU số phần, không phải tổng số phần.' };
      if (s === 3) return { cap: `Phép tính: ${d.D} : (${d.a} − ${d.b}) = ${nf(d.partVal)} · Số lớn ${nf(d.big)}, số bé ${nf(d.small)} (thử lại ${nf(d.big)} − ${nf(d.small)} = ${d.D}). ` + L.chot, hint: '' };
      return { cap: `Cả lớp: hiệu ${d.D}, tỉ số ${d.a} : ${d.b}. Lệch ${d.dp} phần = ${d.D} → 1 phần = ${nf(d.partVal)} → số lớn ${nf(d.big)}, số bé ${nf(d.small)}.`, hint: '' };
    },
    value(st) { const d = this.res(st); const nf = (x) => { const r = Math.round(x * 1000) / 1000; return Number.isInteger(r) ? String(r) : String(r).replace('.', ','); }; return d.ok ? `Số lớn ${nf(d.big)}, số bé ${nf(d.small)} (hiệu ${d.D}, tỉ ${d.a}:${d.b})` : `cần ${d.a} > ${d.b}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matBig = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const matSmall = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      for (let k = 0; k < d.a; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), k >= d.b ? matBig : matSmall); m.position.set(k * 0.9, 0.9, 0); g.add(m); }
      for (let k = 0; k < d.b; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), matSmall); m.position.set(k * 0.9, 0, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  sumdiff: {
    res(st) {
      const S = clamp(Math.round(st.sdSum), 2, 120), D = clamp(Math.round(st.sdDiff), 0, 60);
      const ok = S > D;
      const big = ok ? (S + D) / 2 : 0, small = ok ? (S - D) / 2 : 0;
      return { S, D, ok, big, small };
    },
    defaults(st, L) { st.sdSum = (L.sdSum != null ? L.sdSum : 96); st.sdDiff = (L.sdDiff != null ? L.sdDiff : 12); },
    geomSig(st) { const d = this.res(st); return 'sd' + d.S + ',' + d.D; },
    params() { return [{ key: 'sdSum', label: 'TỔNG hai số', min: 2, max: 120 }, { key: 'sdDiff', label: 'HIỆU hai số', min: 0, max: 60 }]; },
    toggles() { return []; },
    ctlHint() { return 'Hai thanh trượt: TỔNG (2–120), HIỆU (0–60) — hiệu không được lớn hơn tổng. Giơ 1–9 ngón đặt HIỆU. Số bé = (tổng − hiệu) : 2; số lớn = (tổng + hiệu) : 2.'; },
    hand(st, f) { st.sdDiff = clamp(Math.round(f), 0, 60); },
    handLabel(f) { return '→ hiệu = ' + clamp(Math.round(f), 0, 60); },
    draw2d(host, st) {
      const d = this.res(st);
      const nf = (x) => { const r = Math.round(x * 1000) / 1000; return Number.isInteger(r) ? String(r) : String(r).replace('.', ','); };
      const ox = 120, rowBigY = 46, rowSmallY = 82, bh = 26;
      const U = Math.min(13, 380 / Math.max(d.big, 1));
      const bigW = d.big * U, smallW = d.small * U;
      let g = '';
      if (d.ok) {
        g += `<rect x="${ox}" y="${rowSmallY}" width="${smallW.toFixed(0)}" height="${bh}" fill="rgba(127,201,191,.28)" stroke="rgba(127,201,191,.8)" stroke-width="1.5"></rect>`;
        g += `<rect x="${ox}" y="${rowBigY}" width="${bigW.toFixed(0)}" height="${bh}" fill="rgba(127,201,191,.16)" stroke="var(--accent)" stroke-width="1.5"></rect>`;
        const exX = ox + smallW, exW = bigW - smallW;
        g += `<rect x="${exX.toFixed(0)}" y="${rowBigY}" width="${exW.toFixed(0)}" height="${bh}" fill="rgba(240,196,92,.3)" stroke="var(--accent)" stroke-width="1.5"></rect>`;
        g += `<text x="${ox}" y="${rowSmallY - 6}" font-size="12" fill="var(--chalk)">số bé = ${nf(d.small)}</text>`;
        g += `<text x="${ox}" y="${rowBigY - 6}" font-size="12" fill="var(--chalk)">số lớn = ${nf(d.big)}</text>`;
        g += `<text x="${(exX + exW / 2).toFixed(0)}" y="${rowBigY + bh + 14}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--accent)">hiệu ${d.D}</text>`;
        g += `<text x="${(ox + bigW + 10).toFixed(0)}" y="${rowBigY + bh / 2 + 4}" font-size="11" fill="rgba(242,240,230,.85)">tổng ${d.S}</text>`;
      } else {
        g += `<text x="${ox}" y="66" font-size="12" fill="var(--warn)">⚠ HIỆU không thể lớn hơn (hoặc bằng) TỔNG — cô chọn số phù hợp.</text>`;
      }
      const l1 = `<text x="14" y="150" font-size="12" fill="rgba(242,240,230,.9)">${d.ok ? 'Số bé = (tổng − hiệu) : 2 = (' + d.S + ' − ' + d.D + ') : 2 = ' + nf(d.small) : ''}</text>`;
      const l2 = `<text x="14" y="172" font-size="13" font-weight="700" fill="var(--chalk)">${d.ok ? 'Số lớn = (tổng + hiệu) : 2 = (' + d.S + ' + ' + d.D + ') : 2 = ' + nf(d.big) : ''}</text>`;
      const err = `<text x="14" y="196" font-size="10.5" fill="var(--warn)">❌ Lấy (tổng + hiệu) : 2 rồi gọi là số BÉ? Sai — (tổng + hiệu) : 2 là số LỚN; số bé là (tổng − hiệu) : 2.</text>`;
      const title = `<text x="150" y="16" font-size="13" font-weight="700" fill="var(--chalk)">Tìm hai số khi biết TỔNG và HIỆU</text>`;
      host.innerHTML = `<svg id="sumdiff" width="520" height="214" viewBox="0 0 520 214">` + title + g + l1 + l2 + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st);
      const nf = (x) => { const r = Math.round(x * 1000) / 1000; return Number.isInteger(r) ? String(r) : String(r).replace('.', ','); };
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hai đống gộp lại ${d.S} cái, đống lớn hơn đống bé đúng ${d.D} cái. Bớt ${d.D} cái ở đống lớn thì hai đống bằng nhau, mỗi đống còn (${d.S} − ${d.D}) : 2 = ${nf(d.small)}.`, hint: d.ok ? 'Gấp đôi số bé rồi cộng hiệu thì ra tổng.' : 'Hiệu phải bé hơn tổng.' };
      if (s === 2) return { cap: `Sơ đồ: số bé một đoạn, số lớn = số bé + ${d.D}. Tổng ${d.S} = 2 × số bé + ${d.D} ⟹ số bé = (${d.S} − ${d.D}) : 2 = ${nf(d.small)}, số lớn = ${nf(d.big)}.`, hint: '(tổng − hiệu) : 2 = số bé; (tổng + hiệu) : 2 = số lớn.' };
      if (s === 3) return { cap: `Phép tính: (${d.S} − ${d.D}) : 2 = ${nf(d.small)}; (${d.S} + ${d.D}) : 2 = ${nf(d.big)}. Thử lại ${nf(d.big)} + ${nf(d.small)} = ${d.S}, ${nf(d.big)} − ${nf(d.small)} = ${d.D}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp: tổng ${d.S}, hiệu ${d.D}. Số lớn = (${d.S} + ${d.D}) : 2 = ${nf(d.big)}, số bé = (${d.S} − ${d.D}) : 2 = ${nf(d.small)}.`, hint: '' };
    },
    value(st) { const d = this.res(st); const nf = (x) => { const r = Math.round(x * 1000) / 1000; return Number.isInteger(r) ? String(r) : String(r).replace('.', ','); }; return d.ok ? `Số lớn ${nf(d.big)}, số bé ${nf(d.small)} (tổng ${d.S}, hiệu ${d.D})` : `hiệu < tổng`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matSmall = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const matExtra = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const nS = Math.max(0, Math.round(d.small)), nB = Math.max(0, Math.round(d.big));
      for (let k = 0; k < nS; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), matSmall); m.position.set(k * 0.9, 0, 0); g.add(m); }
      for (let k = 0; k < nB; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), k < nS ? matSmall : matExtra); m.position.set(k * 0.9, 0.9, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
});

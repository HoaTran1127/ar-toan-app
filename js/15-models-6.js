// ---- tiep MODELS: gop vao object MODELS (giu nguyen thu tu key) ----
Object.assign(MODELS, {
  seq: {
    res(st) {
      const a = clamp(Math.round(st.sqA), 1, 20), d = clamp(Math.round(st.sqD), 1, 10), n = clamp(Math.round(st.sqN), 2, 15);
      const nth = a + (n - 1) * d, wrong = n * d;
      return { a, d, n, nth, wrong };
    },
    defaults(st, L) { st.sqA = (L.sqA != null ? L.sqA : 3); st.sqD = (L.sqD != null ? L.sqD : 4); st.sqN = (L.sqN != null ? L.sqN : 12); },
    geomSig(st) { const d = this.res(st); return 'sq' + d.a + ',' + d.d + ',' + d.n; },
    params() { return [{ key: 'sqA', label: 'Số đầu', min: 1, max: 20 }, { key: 'sqD', label: 'Công số (bước nhảy)', min: 1, max: 10 }, { key: 'sqN', label: 'Vị trí số hạng cần tìm', min: 2, max: 15 }]; },
    toggles() { return []; },
    ctlHint() { return 'Ba thanh trượt: SỐ ĐẦU (1–20), CÔNG SỐ (1–10), VỊ TRÍ n (2–15). Giơ 1–9 ngón đặt CÔNG SỐ. Số hạng thứ n = số đầu + (n − 1) × công số.'; },
    hand(st, f) { st.sqD = clamp(Math.round(f), 1, 10); },
    handLabel(f) { return '→ công số = ' + clamp(Math.round(f), 1, 10); },
    draw2d(host, st) {
      const d = this.res(st);
      const showK = Math.min(d.n, 6);
      let chips = '', x = 18; const cw = 56, gp = 14;
      for (let k = 0; k < showK; k++) {
        const val = d.a + k * d.d, isNth = (d.n <= showK && k === d.n - 1);
        const fill = isNth ? 'rgba(240,196,92,.32)' : 'rgba(127,201,191,.18)';
        const stroke = isNth ? 'var(--accent)' : 'rgba(127,201,191,.8)';
        chips += `<rect x="${x}" y="52" width="${cw}" height="34" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"></rect>`;
        chips += `<text x="${x + cw / 2}" y="74" font-size="14" font-weight="700" text-anchor="middle" fill="var(--chalk)">${val}</text>`;
        chips += `<text x="${x + cw / 2}" y="46" font-size="10" text-anchor="middle" fill="rgba(242,240,230,.6)">${k + 1}</text>`;
        x += cw + gp;
        if (k < showK - 1) chips += `<text x="${x - gp / 2}" y="74" font-size="12" text-anchor="middle" fill="var(--accent)">+${d.d}</text>`;
      }
      if (d.n > showK) {
        chips += `<text x="${x}" y="74" font-size="16" fill="rgba(242,240,230,.7)">…</text>`;
        x += 24;
        chips += `<rect x="${x}" y="52" width="${cw}" height="34" rx="6" fill="rgba(240,196,92,.32)" stroke="var(--accent)" stroke-width="1.5"></rect>`;
        chips += `<text x="${x + cw / 2}" y="74" font-size="14" font-weight="700" text-anchor="middle" fill="var(--chalk)">${d.nth}</text>`;
        chips += `<text x="${x + cw / 2}" y="46" font-size="10" text-anchor="middle" fill="rgba(242,240,230,.6)">${d.n}</text>`;
      }
      const head = `<text x="14" y="24" font-size="13" font-weight="700" fill="var(--chalk)">Dãy số cách đều — mỗi số hơn số trước ${d.d} đơn vị</text>`;
      const steps = `<text x="14" y="112" font-size="11" fill="rgba(242,240,230,.85)">Từ số hạng thứ nhất đến số hạng thứ ${d.n} có đúng (${d.n} − 1) = ${d.n - 1} bước nhảy, mỗi bước +${d.d}.</text>`;
      const l1 = `<text x="14" y="140" font-size="13" font-weight="700" fill="var(--accent)">Số hạng thứ ${d.n} = ${d.a} + (${d.n} − 1) × ${d.d} = ${d.a} + ${(d.n - 1) * d.d} = ${d.nth}</text>`;
      const err = (d.wrong !== d.nth)
        ? `<text x="14" y="168" font-size="10.5" fill="var(--warn)">❌ Lấy ${d.n} × ${d.d} = ${d.wrong}? Sai — số đầu chưa phải một bước nhảy; phải ${d.a} + (${d.n} − 1) × ${d.d} = ${d.nth}.</text>`
        : `<text x="14" y="168" font-size="10.5" fill="var(--warn)">❌ Đừng đếm số BƯỚC = n: từ số 1 đến số n chỉ có (n − 1) bước nhảy.</text>`;
      host.innerHTML = `<svg id="seq" width="520" height="184" viewBox="0 0 520 184">` + head + chips + steps + l1 + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: xếp que thành từng nhóm — mỗi lần thêm đúng ${d.d} que. Số hạng đầu là ${d.a}, rồi ${d.a + d.d}, ${d.a + 2 * d.d}, …; cứ mỗi vị trí kế tiếp thêm một bước ${d.d}.`, hint: 'Từ số thứ 1 đến số thứ n có (n − 1) bước nhảy.' };
      if (s === 2) return { cap: `Sơ đồ: ${d.n} số hạng nghĩa là ${d.n - 1} bước nhảy, mỗi bước +${d.d}. Số hạng thứ ${d.n} = ${d.a} + ${d.n - 1} × ${d.d} = ${d.nth}.`, hint: 'nhân (n − 1), không phải n.' };
      if (s === 3) return { cap: `Phép tính: ${d.a} + (${d.n} − 1) × ${d.d} = ${d.nth}. Thử lại: ${d.nth} − ${d.d} = ${d.nth - d.d} (số ngay trước). ` + L.chot, hint: '' };
      return { cap: `Cả lớp: dãy ${d.a}, ${d.a + d.d}, … công số ${d.d}. Số hạng thứ ${d.n} = ${d.nth}. Muốn lùi: (số − số đầu) : công số + 1 = vị trí.`, hint: '' };
    },
    value(st) { const d = this.res(st); return `Số hạng thứ ${d.n} = ${d.nth} (dãy bắt đầu ${d.a}, công số ${d.d})`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matTeal = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const matGold = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      for (let k = 0; k < d.n; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), k === d.n - 1 ? matGold : matTeal); m.position.set(k * 1.0, 0, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  psimp: {
    res(st) {
      const n = clamp(Math.round(st.psN), 1, 24), d = clamp(Math.round(st.psD), 2, 30);
      const gcd = (x, y) => (y ? gcd(y, x % y) : x);
      const g = gcd(n, d), p = n / g, q = d / g;
      return { n, d, g, p, q };
    },
    defaults(st, L) { st.psN = (L.psN != null ? L.psN : 12); st.psD = (L.psD != null ? L.psD : 18); },
    geomSig(st) { const r = this.res(st); return 'ps' + r.n + '/' + r.d; },
    params() { return [{ key: 'psN', label: 'Tử số', min: 1, max: 24 }, { key: 'psD', label: 'Mẫu số', min: 2, max: 30 }]; },
    toggles() { return []; },
    ctlHint() { return 'Hai thanh trượt: TỬ SỐ (1–24), MẪU SỐ (2–30). Giơ 1–9 ngón đặt TỬ SỐ. Chia CẢ tử và mẫu cho ƯCLN để được phân số tối giản.'; },
    hand(st, f) { st.psN = clamp(Math.round(f), 1, 24); },
    handLabel(f) { return '→ tử số = ' + clamp(Math.round(f), 1, 24); },
    draw2d(host, st) {
      const r = this.res(st);
      const cell = 12, step = 13, ox = 88;
      const row = (y, count, tone, mark) => {
        let s = '';
        for (let k = 0; k < count; k++) {
          const x = ox + k * step;
          const sep = mark && r.g > 1 && (k % r.g === r.g - 1) && k < count - 1;
          s += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${tone}" stroke="${sep ? 'var(--accent)' : 'rgba(242,240,230,.3)'}" stroke-width="1"></rect>`;
        }
        return s;
      };
      let g = `<text x="14" y="18" font-size="13" font-weight="700" fill="var(--chalk)">Rút gọn phân số ${r.n}/${r.d}</text>`;
      g += `<text x="14" y="50" font-size="11.5" fill="rgba(242,240,230,.85)">tử = ${r.n}</text>` + row(40, r.n, 'rgba(127,201,191,.6)', true);
      g += `<text x="14" y="82" font-size="11.5" fill="rgba(242,240,230,.85)">mẫu = ${r.d}</text>` + row(72, r.d, 'rgba(242,240,230,.35)', true);
      const line = r.g > 1
        ? `<text x="14" y="106" font-size="12" font-weight="700" fill="var(--accent)">Chia CẢ HAI cho ƯCLN = ${r.g}:  ${r.n} ÷ ${r.g} = ${r.p}   ;   ${r.d} ÷ ${r.g} = ${r.q}</text>`
        : `<text x="14" y="106" font-size="12" fill="var(--warn)">Đã tối giản (ƯCLN = 1) — tử và mẫu không còn chia chung được nữa.</text>`;
      g += line;
      g += `<text x="14" y="134" font-size="11.5" fill="rgba(242,240,230,.85)">mẫu mới = ${r.q}</text>` + row(126, r.q, 'rgba(240,196,92,.6)', false);
      g += `<text x="14" y="164" font-size="15" font-weight="700" fill="var(--chalk)">${r.n}/${r.d} = ${r.p}/${r.q}</text>`;
      const err = `<text x="14" y="186" font-size="10.5" fill="var(--warn)">❌ Chia tử mà quên chia mẫu? Sai — phải chia CẢ HAI số thì giá trị phân số mới không đổi.</text>`;
      host.innerHTML = `<svg id="psimp" width="520" height="196" viewBox="0 0 520 196">` + g + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${r.d} ô bằng nhau, tô ${r.n} ô. Nhóm ${r.n}/${r.d} ô này lại theo từng cụm ${r.g} ô thì còn ${r.p} cụm trên tổng ${r.q} cụm — vẫn đúng một phần như cũ.`, hint: r.g > 1 ? 'Chia cả hai cho cùng một số.' : 'Đã tối giản.' };
      if (s === 2) return { cap: `Sơ đồ: tử ${r.n} và mẫu ${r.d} cùng chia được cho ${r.g > 1 ? 'ƯCLN = ' + r.g : 'chỉ số 1'}. Chia cả hai → ${r.p}/${r.q}.`, hint: 'giá trị không đổi vì chia cả trên và dưới.' };
      if (s === 3) return { cap: `Phép tính: ${r.n} ÷ ${r.g} = ${r.p}; ${r.d} ÷ ${r.g} = ${r.q}; vậy ${r.n}/${r.d} = ${r.p}/${r.q}` + (r.g > 1 ? '.' : ' (đã tối giản). ') + L.chot, hint: '' };
      return { cap: `Cả lớp: rút gọn ${r.n}/${r.d} = ${r.p}/${r.q} (chia cả hai cho ${r.g}). Kiểm tra ${r.p}/${r.q} tối giản vì ƯCLN(${r.p}, ${r.q}) = 1.`, hint: '' };
    },
    value(st) { const r = this.res(st); return `${r.n}/${r.d} = ${r.p}/${r.q} (ƯCLN ${r.g})`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mT = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mG = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      for (let k = 0; k < r.n; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), mT); m.position.set(k * 0.8, 0, 0); g.add(m); }
      for (let k = 0; k < r.q; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), mG); m.position.set(k * 0.8, 1.0, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  fraccmp: {
    res(st) {
      const a = clamp(Math.round(st.fcA), 1, 9), b = clamp(Math.round(st.fcB), 2, 12);
      const c = clamp(Math.round(st.fcC), 1, 9), d = clamp(Math.round(st.fcD), 2, 12);
      const left = a * d, right = c * b;
      const sign = left > right ? '>' : left < right ? '<' : '=';
      return { a, b, c, d, left, right, sign };
    },
    defaults(st, L) { st.fcA = (L.fcA != null ? L.fcA : 3); st.fcB = (L.fcB != null ? L.fcB : 4); st.fcC = (L.fcC != null ? L.fcC : 5); st.fcD = (L.fcD != null ? L.fcD : 6); },
    geomSig(st) { const r = this.res(st); return 'fc' + r.a + '/' + r.b + '~' + r.c + '/' + r.d; },
    params() { return [{ key: 'fcA', label: 'Tử số 1', min: 1, max: 9 }, { key: 'fcB', label: 'Mẫu số 1', min: 2, max: 12 }, { key: 'fcC', label: 'Tử số 2', min: 1, max: 9 }, { key: 'fcD', label: 'Mẫu số 2', min: 2, max: 12 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bốn thanh trượt cho hai phân số a/b và c/d (tử 1–9, mẫu 2–12). Giơ 1–9 ngón đặt TỬ số thứ nhất. Muốn so sánh: nhân chéo a×d với c×b rồi đối chiếu hai tích.'; },
    hand(st, f) { st.fcA = clamp(Math.round(f), 1, 9); },
    handLabel(f) { return '→ tử số thứ nhất = ' + clamp(Math.round(f), 1, 9); },
    draw2d(host, st) {
      const r = this.res(st);
      const W = 200, ox = 92, bh = 18;
      const ds = r.sign === '<' ? '&lt;' : r.sign === '>' ? '&gt;' : '=';
      const bar = (y, count, filled, tone) => {
        const cw = W / count; let s = '';
        for (let k = 0; k < count; k++) {
          const x = ox + k * cw; const on = k < filled;
          s += `<rect x="${x.toFixed(2)}" y="${y}" width="${(cw - 1.5).toFixed(2)}" height="${bh}" rx="2" fill="${on ? tone : 'rgba(242,240,230,.12)'}" stroke="rgba(242,240,230,.4)" stroke-width="1"></rect>`;
        }
        return s;
      };
      let g = `<text x="14" y="18" font-size="13" font-weight="700" fill="var(--chalk)">So sánh hai phân số khác mẫu số</text>`;
      g += `<text x="14" y="48" font-size="14" font-weight="700" fill="var(--chalk)">${r.a}/${r.b}</text>` + bar(36, r.b, r.a, 'rgba(127,201,191,.65)');
      g += `<text x="14" y="78" font-size="14" font-weight="700" fill="var(--chalk)">${r.c}/${r.d}</text>` + bar(66, r.d, r.c, 'rgba(240,196,92,.65)');
      g += `<text x="14" y="108" font-size="11.5" fill="rgba(242,240,230,.85)">Nhân chéo (cùng mẫu ${r.b * r.d}):  ${r.a} × ${r.d} = ${r.left}   ;   ${r.c} × ${r.b} = ${r.right}</text>`;
      g += `<text x="14" y="132" font-size="16" font-weight="700" fill="var(--accent)">${r.a}/${r.b}  ${ds}  ${r.c}/${r.d}   (vì ${r.left} ${ds} ${r.right})</text>`;
      const err = `<text x="14" y="158" font-size="10.5" fill="var(--warn)">❌ Mẫu khác nhau (${r.b} vs ${r.d}) thì KHÔNG được so tử ${r.a} với ${r.c}. Phải quy đồng hoặc nhân chéo rồi so ${r.left} với ${r.right}.</text>`;
      host.innerHTML = `<svg id="fraccmp" width="520" height="170" viewBox="0 0 520 170">` + g + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hai thanh dài BẰNG nhau (cùng 1 đơn vị). Thanh trên chia ${r.b} phần, tô ${r.a}; thanh dưới chia ${r.d} phần, tô ${r.c}. Nhìn phần tô của thanh nào phủ dài hơn.`, hint: 'hai thanh cùng độ dài nên mới so được.' };
      if (s === 2) return { cap: `Sơ đồ: mẫu khác nhau (${r.b} và ${r.d}) nên quy về cùng mẫu ${r.b * r.d}: ${r.a}/${r.b} = ${r.left}/${r.b * r.d}; ${r.c}/${r.d} = ${r.right}/${r.b * r.d}. Cùng mẫu rồi thì chỉ việc so tử.`, hint: 'nhân chéo chính là quy đồng mẫu số chung.' };
      if (s === 3) return { cap: `Phép tính: ${r.a} × ${r.d} = ${r.left}; ${r.c} × ${r.b} = ${r.right}; vì ${r.left} ${r.sign} ${r.right} nên ${r.a}/${r.b} ${r.sign} ${r.c}/${r.d}.`, hint: '' };
      return { cap: `Cả lớp: ${r.a}/${r.b} ${r.sign} ${r.c}/${r.d}. Mẹo nhớ: mẫu KHÁC nhau thì ${r.sign === '=' ? 'bằng nhau (hai tích chéo bằng nhau)' : 'nhân chéo a×d với c×b, tích nào lớn hơn thì phân số đó lớn hơn'} — đừng so tử bừa.`, hint: '' };
    },
    value(st) { const r = this.res(st); return `${r.a}/${r.b} ${r.sign} ${r.c}/${r.d}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mF = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mD = new THREE.MeshStandardMaterial({ color: 0x3a3f3a, roughness: 0.8 });
      const mG = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      for (let k = 0; k < r.b; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.5), k < r.a ? mF : mD); m.position.set(k * 0.95, 0, 0); g.add(m); }
      for (let k = 0; k < r.d; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.5), k < r.c ? mG : mD); m.position.set(k * 0.95, 0, 1.2); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  expr: {
    res(st) {
      const a = clamp(Math.round(st.exA), 1, 20), b = clamp(Math.round(st.exB), 1, 20);
      return { a, b, sum: a + b, prod: a * b, twosum: 2 * a + b };
    },
    defaults(st, L) { st.exA = (L.exA != null ? L.exA : 7); st.exB = (L.exB != null ? L.exB : 5); },
    geomSig(st) { const r = this.res(st); return 'ex' + r.a + ',' + r.b; },
    params() { return [{ key: 'exA', label: 'Chữ a', min: 1, max: 20 }, { key: 'exB', label: 'Chữ b', min: 1, max: 20 }]; },
    toggles() { return []; },
    ctlHint() { return 'Hai thanh trượt đặt GIÁ TRỊ của chữ a (1–20) và b (1–20). Giơ 1–9 ngón đặt a. Thay a, b bằng số rồi đọc giá trị từng biểu thức.'; },
    hand(st, f) { st.exA = clamp(Math.round(f), 1, 20); },
    handLabel(f) { return '→ a = ' + clamp(Math.round(f), 1, 20); },
    draw2d(host, st) {
      const r = this.res(st);
      const teal = 'rgba(127,201,191,.65)', gold = 'rgba(240,196,92,.65)';
      let g = `<text x="14" y="18" font-size="13" font-weight="700" fill="var(--chalk)">Biểu thức chứa chữ — thay số rồi tính</text>`;
      g += `<rect x="14" y="26" width="150" height="22" rx="4" fill="${teal}"></rect><text x="22" y="42" font-size="13" font-weight="700" fill="#0b0d0b">a = ${r.a}</text>`;
      g += `<rect x="176" y="26" width="150" height="22" rx="4" fill="${gold}"></rect><text x="184" y="42" font-size="13" font-weight="700" fill="#0b0d0b">b = ${r.b}</text>`;
      const row = (y, lit, sub, val) => `<text x="14" y="${y}" font-size="13.5" fill="var(--chalk)" font-weight="700">${lit}</text>`
        + `<text x="150" y="${y}" font-size="12.5" fill="rgba(242,240,230,.75)">= ${sub}</text>`
        + `<text x="360" y="${y}" font-size="14" fill="var(--accent)" font-weight="700">= ${val}</text>`;
      g += row(70, 'a + b', `${r.a} + ${r.b}`, r.sum);
      g += row(98, 'a × b', `${r.a} × ${r.b}`, r.prod);
      g += row(126, '2 × a + b', `2 × ${r.a} + ${r.b} = ${2 * r.a} + ${r.b}`, r.twosum);
      const err = `<text x="14" y="152" font-size="10.5" fill="var(--warn)">❌ Chữ a gặp chỗ này thay 7, chỗ kia thay 8? SAI — cùng một chữ phải lấy CÙNG một giá trị ở mọi chỗ.</text>`;
      host.innerHTML = `<svg id="expr" width="520" height="162" viewBox="0 0 520 162">` + g + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hộp A có ${r.a} đồ, hộp B có ${r.b} đồ. Chữ "a" chỉ số đồ trong hộp A, "b" chỉ hộp B — chưa biết thì để chữ, biết rồi thì thay số.`, hint: 'a và b là TÊN của hai số.' };
      if (s === 2) return { cap: `Sơ đồ: thay a = ${r.a}, b = ${r.b}. Biểu thức "a + b" hiện số ${r.a} + ${r.b}; "a × b" hiện ${r.a} × ${r.b}; mỗi lần gặp a lại thay đúng ${r.a}, gặp b thay đúng ${r.b}.`, hint: 'cùng chữ = cùng số.' };
      if (s === 3) return { cap: `Phép tính: a + b = ${r.sum}; a × b = ${r.prod}; 2 × a + b = ${2 * r.a} + ${r.b} = ${r.twosum} (nhân trước, cộng sau).`, hint: '' };
      return { cap: `Cả lớp: với a = ${r.a}, b = ${r.b} thì a + b = ${r.sum}, a × b = ${r.prod}, 2 × a + b = ${r.twosum}. Nhớ: thay CÙNG giá trị cho cùng một chữ rồi tính đúng thứ tự.`, hint: '' };
    },
    value(st) { const r = this.res(st); return `a=${r.a} b=${r.b} → a+b=${r.sum}, a×b=${r.prod}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mA = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mB = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.5 });
      const mP = new THREE.MeshStandardMaterial({ color: 0x8fb4ff, roughness: 0.55 });
      const barA = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mA); barA.scale.set(r.a, 0.6, 0.6); barA.position.set(r.a / 2, 1.4, 0); g.add(barA);
      const barB = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mB); barB.scale.set(r.b, 0.6, 0.6); barB.position.set(r.b / 2, 0.6, 0); g.add(barB);
      const plate = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 1), mP); plate.scale.set(r.a, 1, r.b); plate.position.set(r.a / 2, 0, -2.2); g.add(plate);
      return g;
    },
    paint3d() {},
  },
  nhamsam: {
    res(st) {
      const a = clamp(Math.round(st.nhA), 1, 99), mi = clamp(Math.round(st.nhM), 0, 2);
      const M = [11, 25, 99][mi], res = a * M;
      return { a, mi, M, res, round: mi === 0 ? a * 10 : a * 100, adj: mi === 1 ? a * 100 / 4 : a };
    },
    defaults(st, L) { st.nhA = (L.nhA != null ? L.nhA : 24); st.nhM = (L.nhM != null ? L.nhM : 0); },
    geomSig(st) { const r = this.res(st); return 'nm' + r.a + 'x' + r.M; },
    params() { return [{ key: 'nhA', label: 'Số a', min: 1, max: 99 }, { key: 'nhM', label: 'Nhân với (0:11 · 1:25 · 2:99)', min: 0, max: 2 }]; },
    toggles() { return []; },
    ctlHint() { return 'Hai thanh trượt: SỐ a (1–99) và DẠNG (0 = ×11, 1 = ×25, 2 = ×99). Giơ 1–9 ngón đặt a. Đổi về ×10 hoặc ×100 rồi cộng/trừ/chia theo mẹo.'; },
    hand(st, f) { st.nhA = clamp(Math.round(f), 1, 99); },
    handLabel(f) { return '→ a = ' + clamp(Math.round(f), 1, 99); },
    draw2d(host, st) {
      const r = this.res(st);
      const teal = 'rgba(127,201,191,.6)', gold = 'rgba(240,196,92,.65)';
      const exp = r.mi === 0
        ? { l1: `${r.a} × 11  =  ${r.a} × 10 + ${r.a}`, l2: `= ${r.a * 10} + ${r.a}`, err: '❌ ×11 KHÔNG phải "viết a rồi thêm 0"! Phải CỘNG thêm chính a (thiếu 1 nhóm a).' }
        : r.mi === 1
          ? { l1: `${r.a} × 25  =  ${r.a} × 100 : 4`, l2: `= ${r.a * 100} : 4`, err: '❌ ×25 là ¼ của ×100. Lấy a × 100 rồi CHIA 4, đừng nhân 25 bừa.' }
          : { l1: `${r.a} × 99  =  ${r.a} × 100 − ${r.a}`, l2: `= ${r.a * 100} − ${r.a}`, err: '❌ 99 = 100 − 1. Phải TRỪ chính a, không phải chỉ viết a00 (thừa đúng 1 nhóm a).' };
      let g = `<text x="14" y="20" font-size="14" font-weight="700" fill="var(--chalk)">Nhân nhẩm ${r.a} × ${r.M}</text>`;
      g += `<rect x="14" y="28" width="470" height="26" rx="4" fill="rgba(242,240,230,.08)"></rect>`;
      g += `<text x="24" y="46" font-size="13" fill="rgba(242,240,230,.85)">Đổi ${r.M} → số tròn ${r.mi === 0 ? '10' : '100'}, rồi hiệu chỉnh</text>`;
      g += `<text x="14" y="78" font-size="14" fill="var(--chalk)" font-weight="700">${exp.l1}</text>`;
      g += `<text x="14" y="102" font-size="15" fill="var(--accent)" font-weight="700">${exp.l2} = ${r.res}</text>`;
      g += `<rect x="14" y="112" width="${(r.a * 4.5).toFixed(1)}" height="16" rx="3" fill="${teal}"></rect>`;
      g += `<text x="${(20 + r.a * 4.5).toFixed(1)}" y="125" font-size="11.5" fill="rgba(242,240,230,.8)">a = ${r.a}</text>`;
      g += `<rect x="14" y="134" width="${(Math.min(470, r.round * 0.5)).toFixed(1)}" height="16" rx="3" fill="${gold}"></rect>`;
      g += `<text x="${(20 + Math.min(470, r.round * 0.5)).toFixed(1)}" y="147" font-size="11.5" fill="rgba(242,240,230,.8)">${r.mi === 0 ? 'a × 10' : 'a × 100'} = ${r.round}</text>`;
      const err = `<text x="14" y="170" font-size="10.5" fill="var(--warn)">${exp.err}</text>`;
      host.innerHTML = `<svg id="nhamsam" width="520" height="178" viewBox="0 0 520 178">` + g + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      const trick = r.mi === 0 ? '×11 = ×10 rồi cộng chính nó' : r.mi === 1 ? '×25 = ×100 rồi chia 4' : '×99 = ×100 rồi trừ chính nó';
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${r.a} nhóm, mỗi nhóm ${r.M} cái. Đổi ${r.M} thành số tròn dễ tính (${r.mi === 0 ? '10 + 1' : r.mi === 1 ? '100 : 4' : '100 − 1'}) rồi đếm.`, hint: trick };
      if (s === 2) return { cap: `Sơ đồ: ${trick}. Bars: đoạn "a × ${r.mi === 0 ? '10' : '100'}" = ${r.round}${r.mi === 1 ? ', rồi chia 4' : r.mi === 2 ? ', rồi bớt đi 1 nhóm a' : ', rồi thêm 1 nhóm a'}.`, hint: '' };
      if (s === 3) { const calc = r.mi === 0 ? `${r.a} × 10 + ${r.a} = ${r.a * 10} + ${r.a} = ${r.res}` : r.mi === 1 ? `${r.a} × 100 : 4 = ${r.a * 100} : 4 = ${r.res}` : `${r.a} × 100 − ${r.a} = ${r.a * 100} − ${r.a} = ${r.res}`; return { cap: `Phép tính: ${calc}.`, hint: '' }; }
      return { cap: `Cả lớp: ${r.a} × ${r.M} = ${r.res} theo mẹo "${trick}". Kiểm tra lại bằng tính nhẩm thông thường.`, hint: '' };
    },
    value(st) { const r = this.res(st); return `${r.a} × ${r.M} = ${r.res}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mA = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mM = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.5 });
      const barA = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mA); barA.scale.set(r.a, 0.6, 0.6); barA.position.set(r.a / 2, 1, 0); g.add(barA);
      const barM = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mM); barM.scale.set(r.M, 0.6, 0.6); barM.position.set(r.M / 2, 0, 0); g.add(barM);
      return g;
    },
    paint3d() {},
  },
  multprop: {
    res(st) {
      const f = [clamp(Math.round(st.mA), 1, 25), clamp(Math.round(st.mB), 1, 25), clamp(Math.round(st.mC), 1, 25)];
      const tz = (n) => { let t = 0; while (t < 4 && n % 10 === 0) { n /= 10; t++; } return t; };
      const pairs = [{ i: 0, j: 1, k: 2 }, { i: 0, j: 2, k: 1 }, { i: 1, j: 2, k: 0 }];
      let best = pairs[0], bestScore = -1;
      for (const p of pairs) { const prod = f[p.i] * f[p.j]; const sc = tz(prod) * 10000 + prod; if (sc > bestScore) { bestScore = sc; best = p; } }
      const x = f[best.i], y = f[best.j], z = f[best.k], pair = x * y, total = f[0] * f[1] * f[2], naive1 = f[0] * f[1];
      return { f, x, y, z, pair, total, naive1, tzp: tz(pair) };
    },
    defaults(st, L) { st.mA = (L.mA != null ? L.mA : 25); st.mB = (L.mB != null ? L.mB : 7); st.mC = (L.mC != null ? L.mC : 4); },
    geomSig(st) { const r = this.res(st); return 'mp' + r.f.join('-'); },
    params() { return [{ key: 'mA', label: 'Thừa số ①', min: 1, max: 25 }, { key: 'mB', label: 'Thừa số ②', min: 1, max: 25 }, { key: 'mC', label: 'Thừa số ③', min: 1, max: 25 }]; },
    toggles() { return []; },
    ctlHint() { return 'Ba thanh trượt: ba THỪA SỐ (mỗi số 1–25). App tự tìm CẶP nhân ra tròn chục/trăm rồi nhóm lại (kết hợp). Giơ 1–9 ngón đặt thừa số ①.'; },
    hand(st, f) { st.mA = clamp(Math.round(f), 1, 25); },
    handLabel(f) { return '→ thừa số ① = ' + clamp(Math.round(f), 1, 25); },
    draw2d(host, st) {
      const r = this.res(st);
      const teal = 'rgba(127,201,191,.6)', gold = 'rgba(240,196,92,.65)';
      const roundNote = r.tzp > 0 ? ` (tròn ${r.pair % 1000 === 0 ? 'nghìn' : r.pair % 100 === 0 ? 'trăm' : 'chục'})` : '';
      let g = `<text x="14" y="20" font-size="14" font-weight="700" fill="var(--chalk)">Nhân nhanh ${r.f[0]} × ${r.f[1]} × ${r.f[2]}</text>`;
      g += `<rect x="14" y="28" width="470" height="26" rx="4" fill="rgba(242,240,230,.08)"></rect>`;
      g += `<text x="24" y="46" font-size="13" fill="rgba(242,240,230,.85)">Đổi chỗ (giao hoán) để ${r.x} đứng cạnh ${r.y}, rồi nhóm lại (kết hợp)</text>`;
      g += `<text x="14" y="78" font-size="14" fill="var(--chalk)" font-weight="700">${r.f[0]} × ${r.f[1]} × ${r.f[2]}  =  (${r.x} × ${r.y}) × ${r.z}</text>`;
      g += `<text x="14" y="102" font-size="15" fill="var(--accent)" font-weight="700">= ${r.pair} × ${r.z} = ${r.total}</text>`;
      g += `<rect x="14" y="112" width="${(Math.min(300, 18 + r.pair * 0.45)).toFixed(1)}" height="15" rx="3" fill="${gold}"></rect>`;
      g += `<text x="${(20 + Math.min(300, 18 + r.pair * 0.45)).toFixed(1)}" y="124" font-size="11.5" fill="rgba(242,240,230,.8)">${r.x} × ${r.y} = ${r.pair}${roundNote}</text>`;
      g += `<rect x="14" y="132" width="${(Math.min(300, 18 + r.z * 9)).toFixed(1)}" height="15" rx="3" fill="${teal}"></rect>`;
      g += `<text x="${(20 + Math.min(300, 18 + r.z * 9)).toFixed(1)}" y="144" font-size="11.5" fill="rgba(242,240,230,.8)">× ${r.z} → ${r.total}</text>`;
      const err = `<text x="14" y="168" font-size="10.5" fill="var(--warn)">❌ Tính trái→phải: ${r.f[0]} × ${r.f[1]} = ${r.naive1} rồi × ${r.f[2]} — ĐÚNG nhưng chậm; nhóm cặp ra tròn trước thì nhanh hơn.</text>`;
      host.innerHTML = `<svg id="multprop" width="520" height="176" viewBox="0 0 520 176">` + g + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      const trick = r.tzp > 0 ? `nhóm (${r.x} × ${r.y}) = ${r.pair} (tròn) trước` : `nhóm (${r.x} × ${r.y}) = ${r.pair} trước`;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${r.f[0]} × ${r.f[1]} × ${r.f[2]} là xếp từng lớp khối; ĐỔI thứ tự các lớp hay NHÓM hai lớp lại trước thì tổng số khối KHÔNG đổi.`, hint: 'Giao hoán + kết hợp: tích không đổi dù đổi chỗ / nhóm lại.' };
      if (s === 2) return { cap: `Sơ đồ: ${trick}, rồi × ${r.z}. Bars: đoạn vàng = ${r.pair}, đoạn teal = ${r.z}.`, hint: '' };
      if (s === 3) return { cap: `Phép tính: (${r.x} × ${r.y}) × ${r.z} = ${r.pair} × ${r.z} = ${r.total}.`, hint: '' };
      return { cap: `Cả lớp: ${r.f[0]} × ${r.f[1]} × ${r.f[2]} = ${r.total}. Nhờ giao hoán + kết hợp nên đổi chỗ & nhóm lại KHÔNG làm đổi tích — mẹo hợp lệ.`, hint: '' };
    },
    value(st) { const r = this.res(st); return `${r.f[0]} × ${r.f[1]} × ${r.f[2]} = ${r.total}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mG = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.5 });
      const mT = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mG); b1.scale.set(r.x, 0.6, 0.6); b1.position.set(r.x / 2, 1, 0); g.add(b1);
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mG); b2.scale.set(r.y, 0.6, 0.6); b2.position.set(r.x + r.y / 2, 1, 0); g.add(b2);
      const b3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mT); b3.scale.set(r.z, 0.6, 0.6); b3.position.set(r.z / 2, 0, 0); g.add(b3);
      return g;
    },
    paint3d() {},
  },
  decrond: {
    res(st) {
      const U = clamp(Math.round(st.rU), 0, 12), T = clamp(Math.round(st.rT), 0, 9), H = clamp(Math.round(st.rH), 0, 9);
      const t = clamp(Math.round(st.rTar), 0, 2);
      const n = U * 100 + T * 10 + H;
      const rn = t === 0 ? Math.floor((n + 50) / 100) * 100 : t === 1 ? Math.floor((n + 5) / 10) * 10 : n;
      const decide = t === 0 ? T : t === 1 ? H : null;
      const up = decide != null && decide >= 5;
      const origStr = `${U},${T}${H}`;
      const ip = Math.floor(rn / 100), rem = rn % 100;
      const roundStr = t === 0 ? `${ip}` : t === 1 ? `${ip},${Math.floor(rem / 10)}` : `${ip},${Math.floor(rem / 10)}${rem % 10}`;
      const placeLabel = t === 0 ? 'hàng ĐƠN VỊ' : t === 1 ? 'hàng PHẦN MƯỜI' : 'hàng PHẦN TRĂM';
      return { U, T, H, t, n, rn, decide, up, origStr, roundStr, placeLabel };
    },
    defaults(st, L) { st.rU = (L.rU != null ? L.rU : 3); st.rT = (L.rT != null ? L.rT : 4); st.rH = (L.rH != null ? L.rH : 7); st.rTar = (L.rTar != null ? L.rTar : 1); },
    geomSig(st) { const r = this.res(st); return 'dr' + r.U + r.T + r.H + 't' + r.t; },
    params() { return [{ key: 'rU', label: 'Phần nguyên', min: 0, max: 12 }, { key: 'rT', label: 'Chữ số phần mười', min: 0, max: 9 }, { key: 'rH', label: 'Chữ số phần trăm', min: 0, max: 9 }, { key: 'rTar', label: 'Làm tròn đến (0:đơn vị · 1:phần mười · 2:phần trăm)', min: 0, max: 2 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bốn thanh trượt: PHẦN NGUYÊN (0–12), chữ số PHẦN MƯỜI (0–9), chữ số PHẦN TRĂM (0–9), và HÀNG làm tròn (0 = đơn vị, 1 = phần mười, 2 = phần trăm). Giơ 1–9 ngón đặt phần nguyên. App chỉ nhìn đúng MỘT chữ số ngay sau hàng làm tròn.'; },
    hand(st, f) { st.rU = clamp(Math.round(f), 0, 9); },
    handLabel(f) { return '→ phần nguyên = ' + clamp(Math.round(f), 0, 9); },
    draw2d(host, st) {
      const r = this.res(st);
      const teal = 'rgba(127,201,191,.6)', gold = 'rgba(240,196,92,.65)';
      const rule = r.t === 2
        ? `Đã đến ${r.placeLabel} nên GIỮ nguyên = ${r.roundStr}.`
        : `Chữ số quyết định (ngay sau ${r.placeLabel}) = ${r.decide} → ${r.up ? 'từ 5 trở lên, CỘNG 1 vào hàng làm tròn' : 'dưới 5, GIỮ hàng làm tròn'} rồi bỏ chữ số bên phải.`;
      let g = `<text x="14" y="20" font-size="14" font-weight="700" fill="var(--chalk)">Làm tròn ${r.origStr} → ${r.placeLabel}</text>`;
      g += `<rect x="14" y="28" width="470" height="26" rx="4" fill="rgba(242,240,230,.08)"></rect>`;
      g += `<text x="24" y="46" font-size="13" fill="rgba(242,240,230,.85)">Chỉ nhìn ĐÚNG MỘT chữ số ngay bên phải hàng cần làm tròn</text>`;
      const cells = [{ v: r.U, lab: 'ĐV', hl: r.t === 0 }, { v: r.T, lab: '1/10', hl: r.t === 1 }, { v: r.H, lab: '1/100', hl: false }];
      cells.forEach((c, i) => {
        const x = 14 + i * 66;
        const isDecide = (r.t === 0 && i === 1) || (r.t === 1 && i === 2);
        g += `<rect x="${x}" y="62" width="58" height="46" rx="4" fill="${isDecide ? gold : 'rgba(127,201,191,.18)'}" stroke="${c.hl ? 'var(--warn)' : 'transparent'}" stroke-width="2"></rect>`;
        g += `<text x="${x + 29}" y="94" font-size="26" font-weight="700" text-anchor="middle" fill="var(--chalk)">${c.v}</text>`;
        g += `<text x="${x + 29}" y="122" font-size="10" text-anchor="middle" fill="rgba(242,240,230,.7)">${c.lab}</text>`;
        if (i === 0) g += `<text x="${x + 60}" y="94" font-size="24" font-weight="700" fill="var(--chalk)">,</text>`;
      });
      g += `<text x="230" y="82" font-size="13" fill="rgba(242,240,230,.85)">hàng làm tròn</text>`;
      g += `<text x="230" y="102" font-size="15" font-weight="700" fill="var(--accent)">${r.origStr} ≈ ${r.roundStr}</text>`;
      g += `<text x="14" y="146" font-size="12" fill="var(--chalk)">${rule}</text>`;
      const err = `<text x="14" y="168" font-size="10.5" fill="var(--warn)">❌ Đừng làm tròn dây chuyền (làm tròn tiếp từ số vừa làm tròn) — chỉ nhìn MỘT chữ số sau hàng cần làm tròn rồi dừng.</text>`;
      host.innerHTML = `<svg id="decrond" width="520" height="176" viewBox="0 0 520 176">` + g + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${r.origStr} nằm giữa hai vạch trên tia số; vạch nào GẦN nó hơn chính là kết quả làm tròn đến ${r.placeLabel}.`, hint: 'Chỉ chữ số ngay sau hàng làm tròn mới quyết định.' };
      if (s === 2) return { cap: `Sơ đồ: hàng làm tròn = ${r.placeLabel}; chữ số quyết định = ${r.decide == null ? '(không có)' : r.decide} → ${r.up ? 'CỘNG 1' : r.t === 2 ? 'giữ (đã tới hàng)' : 'GIỮ'} rồi bỏ bên phải.`, hint: '' };
      if (s === 3) return { cap: `Phép tính: ${r.origStr} ≈ ${r.roundStr}.`, hint: '' };
      return { cap: `Cả lớp: làm tròn ${r.origStr} đến ${r.placeLabel} được ${r.roundStr}. Làm tròn số thập phân cũng chỉ nhìn MỘT chữ số sau hàng cần làm tròn.`, hint: '' };
    },
    value(st) { const r = this.res(st); return `${r.origStr} ≈ ${r.roundStr}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mT = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mG = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.5 });
      const w = (x) => Math.max(0.4, (x / 100) * 6);
      const bO = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mT); bO.scale.set(w(r.n), 0.6, 0.6); bO.position.set(w(r.n) / 2, 1, 0); g.add(bO);
      const bR = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mG); bR.scale.set(w(r.rn), 0.6, 0.6); bR.position.set(w(r.rn) / 2, 0, 0); g.add(bR);
      return g;
    },
    paint3d() {},
  },
  areamult: {
    res(st) {
      const a10 = clamp(Math.round(st.mA10), 1, 9), a1 = clamp(Math.round(st.mA1), 0, 9);
      const b10 = clamp(Math.round(st.mB10), 1, 9), b1 = clamp(Math.round(st.mB1), 0, 9);
      const A = a10 * 10 + a1, B = b10 * 10 + b1;
      const aT = a10 * 10, aO = a1, bT = b10 * 10, bO = b1;
      const p11 = aT * bT, p12 = aT * bO, p21 = aO * bT, p22 = aO * bO;
      const total = A * B;
      return { A, B, aT, aO, bT, bO, p11, p12, p21, p22, total };
    },
    defaults(st, L) { st.mA10 = (L.mA10 != null ? L.mA10 : 2); st.mA1 = (L.mA1 != null ? L.mA1 : 3); st.mB10 = (L.mB10 != null ? L.mB10 : 1); st.mB1 = (L.mB1 != null ? L.mB1 : 4); },
    geomSig(st) { const r = this.res(st); return 'am' + r.A + 'x' + r.B; },
    params() { return [{ key: 'mA10', label: 'Chục của thừa số ①', min: 1, max: 9 }, { key: 'mA1', label: 'Đơn vị của thừa số ①', min: 0, max: 9 }, { key: 'mB10', label: 'Chục của thừa số ②', min: 1, max: 9 }, { key: 'mB1', label: 'Đơn vị của thừa số ②', min: 0, max: 9 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bốn thanh trượt: CHỤC (1–9) và ĐƠN VỊ (0–9) của từng thừa số → thành hai số có 2 chữ số. App TÁCH mỗi số thành chục+đơn vị rồi vẽ 4 ô diện tích (tích riêng phần). Giơ 1–9 ngón đặt chục của thừa số ①.'; },
    hand(st, f) { st.mA10 = clamp(Math.round(f), 1, 9); },
    handLabel(f) { return '→ chục của thừa số ① = ' + clamp(Math.round(f), 1, 9); },
    draw2d(host, st) {
      const r = this.res(st);
      const gold = 'rgba(240,196,92,.65)', teal = 'rgba(127,201,191,.5)', dim = 'rgba(127,201,191,.2)';
      const x0 = 78, y0 = 42, Wtot = 404, Htot = 96;
      const cT = (r.aT / r.A) * Wtot, cO = (r.aO / r.A) * Wtot;
      const rT = (r.bT / r.B) * Htot, rO = (r.bO / r.B) * Htot;
      const F = (n) => n.toFixed(1);
      const cell = (x, y, w, h, fill, label) => {
        let s = `<rect x="${F(x)}" y="${F(y)}" width="${F(w)}" height="${F(h)}" fill="${fill}" stroke="rgba(242,240,230,.35)"></rect>`;
        if (w >= 26 && h >= 18) s += `<text x="${F(x + w / 2)}" y="${F(y + h / 2 + 4)}" font-size="12" font-weight="700" text-anchor="middle" fill="var(--chalk)">${label}</text>`;
        return s;
      };
      let g = `<text x="14" y="20" font-size="14" font-weight="700" fill="var(--chalk)">Nhân ${r.A} × ${r.B} = (${r.aT} + ${r.aO}) × (${r.bT} + ${r.bO})</text>`;
      g += `<text x="${F(x0 + cT / 2)}" y="38" font-size="10" text-anchor="middle" fill="rgba(242,240,230,.75)">${r.aT}</text>`;
      if (r.aO > 0) g += `<text x="${F(x0 + cT + cO / 2)}" y="38" font-size="10" text-anchor="middle" fill="rgba(242,240,230,.75)">${r.aO}</text>`;
      g += `<text x="70" y="${F(y0 + rT / 2 + 3)}" font-size="10" text-anchor="end" fill="rgba(242,240,230,.75)">${r.bT}</text>`;
      if (r.bO > 0) g += `<text x="70" y="${F(y0 + rT + rO / 2 + 3)}" font-size="10" text-anchor="end" fill="rgba(242,240,230,.75)">${r.bO}</text>`;
      g += cell(x0, y0, cT, rT, gold, `${r.aT}×${r.bT}=${r.p11}`);
      g += cell(x0 + cT, y0, cO, rT, teal, `${r.aT}×${r.bO}=${r.p12}`);
      g += cell(x0, y0 + rT, cT, rO, teal, `${r.aO}×${r.bT}=${r.p21}`);
      g += cell(x0 + cT, y0 + rT, cO, rO, dim, `${r.aO}×${r.bO}=${r.p22}`);
      g += `<text x="14" y="160" font-size="14" font-weight="700" fill="var(--accent)">${r.p11} + ${r.p12} + ${r.p21} + ${r.p22} = ${r.total}</text>`;
      const err = `<text x="14" y="182" font-size="10.5" fill="var(--warn)">❌ Phải đủ BỐN ô riêng phần (20×10, 20×4, 3×10, 3×4) rồi cộng lại — quên ô chéo (chục×đơn vị) là sai.</text>`;
      host.innerHTML = `<svg id="areamult" width="520" height="190" viewBox="0 0 520 190">` + g + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: một khu đất dài ${r.A} m, rộng ${r.B} m; kẻ một đường dọc và một đường ngang theo chục & đơn vị thì chia thành 4 mảnh chữ nhật.`, hint: 'Tách mỗi chiều thành (chục + đơn vị).' };
      if (s === 2) return { cap: `Sơ đồ: 4 ô diện tích — ${r.aT}×${r.bT}=${r.p11} (vàng), ${r.aT}×${r.bO}=${r.p12}, ${r.aO}×${r.bT}=${r.p21}, ${r.aO}×${r.bO}=${r.p22}.`, hint: '' };
      if (s === 3) return { cap: `Phép tính: ${r.p11} + ${r.p12} + ${r.p21} + ${r.p22} = ${r.total}, tức ${r.A} × ${r.B} = ${r.total}.`, hint: '' };
      return { cap: `Cả lớp: ${r.A} × ${r.B} = ${r.total}. Bốn tích riêng phần cộng lại đúng bằng kết quả đặt tính nhân hai chữ số.`, hint: '' };
    },
    value(st) { const r = this.res(st); return `${r.A} × ${r.B} = ${r.total}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mG = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.5 });
      const mT = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mD = new THREE.MeshStandardMaterial({ color: 0x4f7d78, roughness: 0.7 });
      const sx = (v) => Math.max(0.25, v / 10), sz = (v) => Math.max(0.25, v / 10);
      const box = (w, d, xoff, zoff, mat) => { const b = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat); b.scale.set(w, 0.5, d); b.position.set(xoff + w / 2, 0, zoff + d / 2); g.add(b); };
      box(sx(r.aT), sz(r.bT), 0, 0, mG);
      box(sx(r.aO), sz(r.bT), sx(r.aT), 0, mT);
      box(sx(r.aT), sz(r.bO), 0, sz(r.bT), mT);
      box(sx(r.aO), sz(r.bO), sx(r.aT), sz(r.bT), mD);
      return g;
    },
    paint3d() {},
  },
  qds: {
    res(st) {
      const a = clamp(Math.round(st.qdA), 1, 9), b = clamp(Math.round(st.qdB), 2, 12);
      const c = clamp(Math.round(st.qdC), 1, 9), d = clamp(Math.round(st.qdD), 2, 12);
      const cd = b * d, na = a * d, nc = c * b;
      const gcd = (x, y) => (y ? gcd(y, x % y) : x);
      const g = gcd(b, d), l = cd / g, f1 = l / b, f2 = l / d;
      const na2 = a * f1, nc2 = c * f2;
      return { a, b, c, d, cd, na, nc, g, l, f1, f2, na2, nc2 };
    },
    defaults(st, L) { st.qdA = (L.qdA != null ? L.qdA : 2); st.qdB = (L.qdB != null ? L.qdB : 3); st.qdC = (L.qdC != null ? L.qdC : 1); st.qdD = (L.qdD != null ? L.qdD : 4); },
    geomSig(st) { const r = this.res(st); return 'qds' + r.a + '/' + r.b + '~' + r.c + '/' + r.d; },
    params() { return [{ key: 'qdA', label: 'Tử số 1', min: 1, max: 9 }, { key: 'qdB', label: 'Mẫu số 1', min: 2, max: 12 }, { key: 'qdC', label: 'Tử số 2', min: 1, max: 9 }, { key: 'qdD', label: 'Mẫu số 2', min: 2, max: 12 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bốn thanh trượt cho hai phân số a/b và c/d (tử 1–9, mẫu 2–12). App quy đồng về mẫu chung = b × d bằng cách nhân CẢ tử và mẫu mỗi phân số với mẫu số còn lại. Giơ 1–9 ngón đặt TỬ số thứ nhất.'; },
    hand(st, f) { st.qdA = clamp(Math.round(f), 1, 9); },
    handLabel(f) { return '→ tử số thứ nhất = ' + clamp(Math.round(f), 1, 9); },
    draw2d(host, st) {
      const r = this.res(st);
      const W = 200, ox = 92, bh = 18;
      const bar = (y, count, filled, tone) => {
        const cw = W / count; let s = '';
        for (let k = 0; k < count; k++) {
          const x = ox + k * cw; const on = k < filled;
          s += `<rect x="${x.toFixed(2)}" y="${y}" width="${(cw - 1).toFixed(2)}" height="${bh}" rx="2" fill="${on ? tone : 'rgba(242,240,230,.12)'}" stroke="rgba(242,240,230,.4)" stroke-width="1"></rect>`;
        }
        return s;
      };
      let g = `<text x="14" y="18" font-size="13" font-weight="700" fill="var(--chalk)">Quy đồng mẫu số về mẫu chung ${r.cd} = ${r.b} × ${r.d}</text>`;
      g += `<text x="14" y="48" font-size="13" font-weight="700" fill="var(--chalk)">${r.a}/${r.b} = ${r.na}/${r.cd}</text>` + bar(36, r.cd, r.na, 'rgba(127,201,191,.65)');
      g += `<text x="14" y="72" font-size="10.5" fill="rgba(242,240,230,.8)">× ${r.d} cả tử và mẫu:  ${r.a}×${r.d} = ${r.na},  ${r.b}×${r.d} = ${r.cd}</text>`;
      g += `<text x="14" y="100" font-size="13" font-weight="700" fill="var(--chalk)">${r.c}/${r.d} = ${r.nc}/${r.cd}</text>` + bar(88, r.cd, r.nc, 'rgba(240,196,92,.65)');
      g += `<text x="14" y="124" font-size="10.5" fill="rgba(242,240,230,.8)">× ${r.b} cả tử và mẫu:  ${r.c}×${r.b} = ${r.nc},  ${r.d}×${r.b} = ${r.cd}</text>`;
      g += `<text x="14" y="150" font-size="12" font-weight="700" fill="var(--accent)">Cùng mẫu ${r.cd}: ${r.na}/${r.cd} và ${r.nc}/${r.cd} — giờ cộng, trừ, so sánh được ngay.</text>`;
      const err = `<text x="14" y="172" font-size="10.5" fill="var(--warn)">❌ Muốn đổi mẫu ${r.b} thành ${r.cd} phải nhân CẢ tử ${r.a} và mẫu ${r.b} với ${r.d}. Chỉ đổi mẫu (để ${r.a}/${r.cd}) là SAI — phân số đổi giá trị.</text>`;
      host.innerHTML = `<svg id="qds" width="520" height="184" viewBox="0 0 520 184">` + g + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hai băng giấy bằng nhau. Muốn đặt cạnh nhau thì Ô phải cùng cỡ, nên ta CHIA LẠI mỗi băng thành ${r.cd} ô nhỏ bằng nhau (${r.cd} = ${r.b} × ${r.d}).`, hint: 'cùng độ dài băng nên chỉ số ô thay đổi.' };
      if (s === 2) return { cap: `Sơ đồ: ${r.a}/${r.b} nhân cả tử lẫn mẫu với ${r.d} → ${r.na}/${r.cd}; ${r.c}/${r.d} nhân với ${r.b} → ${r.nc}/${r.cd}. Hai phân số giờ cùng mẫu ${r.cd}.`, hint: 'nhân cả tử và mẫu cùng một số thì giá trị không đổi.' };
      if (s === 3) return { cap: `Phép tính: ${r.a}/${r.b} = (${r.a}×${r.d})/(${r.b}×${r.d}) = ${r.na}/${r.cd}; ${r.c}/${r.d} = (${r.c}×${r.b})/(${r.d}×${r.b}) = ${r.nc}/${r.cd}.`, hint: '' };
      return { cap: `Cả lớp: quy đồng ${r.a}/${r.b} và ${r.c}/${r.d} được ${r.na}/${r.cd} và ${r.nc}/${r.cd}. ${r.l < r.cd ? 'Mẹo: mẫu chung NHỎ NHẤT (BCNN) là ' + r.l + ', khi đó gọn hơn thành ' + r.na2 + '/' + r.l + ' và ' + r.nc2 + '/' + r.l + '.' : 'Hai mẫu đã đôi một nguyên tố nên BCNN đúng bằng tích ' + r.cd + '.'}`, hint: '' };
    },
    value(st) { const r = this.res(st); return `${r.na}/${r.cd} và ${r.nc}/${r.cd}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mF = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mG = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const mD = new THREE.MeshStandardMaterial({ color: 0x3a3f3a, roughness: 0.8 });
      for (let k = 0; k < r.cd; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), k < r.na ? mF : mD); m.position.set(k * 0.55, 0, 0); g.add(m); }
      for (let k = 0; k < r.cd; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), k < r.nc ? mG : mD); m.position.set(k * 0.55, 0, 1.1); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  rutdonvi: {
    res(st) {
      const N = clamp(Math.round(st.rdN), 1, 9);
      const u = clamp(Math.round(st.rdUnit), 1, 9);
      const M = clamp(Math.round(st.rdM), 1, 9);
      const T = N * u;            // tổng tiền của N món (nghìn đồng)
      const unit = T / N;         // rút về đơn vị: giá 1 món (luôn nguyên vì T = N·u)
      const ans = unit * M;       // tiền của M món
      return { N, u, M, T, unit, ans };
    },
    defaults(st, L) { st.rdN = (L.rdN != null ? L.rdN : 5); st.rdUnit = (L.rdUnit != null ? L.rdUnit : 9); st.rdM = (L.rdM != null ? L.rdM : 8); },
    geomSig(st) { const r = this.res(st); return 'rdv' + r.N + '~' + r.u + '~' + r.M; },
    params() { return [{ key: 'rdN', label: 'Số món đã biết', min: 1, max: 9 }, { key: 'rdUnit', label: 'Giá 1 món (nghìn đồng)', min: 1, max: 9 }, { key: 'rdM', label: 'Số món cần mua', min: 1, max: 9 }]; },
    toggles() { return []; },
    ctlHint() { return 'Ba thanh trượt: số món ĐÃ BIẾT giá tiền (N), giá 1 món (đơn vị), số món CẦN MUA (M). App dựng "rút về đơn vị": tổng : N = giá 1 món, rồi giá 1 món × M = đáp số. Giơ 1–9 ngón đặt SỐ MÓN CẦN MUA.'; },
    hand(st, f) { st.rdM = clamp(Math.round(f), 1, 9); },
    handLabel(f) { return '→ số món cần mua = ' + clamp(Math.round(f), 1, 9); },
    draw2d(host, st) {
      const r = this.res(st);
      const W = 264, ox = 150;
      const row = (y, count, tone) => {
        const cw = W / count; let s = '';
        for (let k = 0; k < count; k++) {
          const x = ox + k * cw;
          s += `<rect x="${x.toFixed(2)}" y="${y}" width="${(cw - 2).toFixed(2)}" height="22" rx="2" fill="${tone}" stroke="rgba(242,240,230,.5)" stroke-width="1"></rect>`;
          s += `<text x="${(x + cw / 2 - 1).toFixed(2)}" y="${y + 15}" font-size="11" text-anchor="middle" fill="var(--chalk)">${r.u}</text>`;
        }
        return s;
      };
      let g = `<text x="14" y="18" font-size="13" font-weight="700" fill="var(--chalk)">Đã biết: ${r.N} món hết ${r.T} nghìn đồng</text>`;
      g += `<text x="${ox + W + 8}" y="52" font-size="12" font-weight="700" fill="var(--chalk)">= ${r.T}</text>` + row(38, r.N, 'rgba(127,201,191,.55)');
      g += `<text x="14" y="82" font-size="11" fill="var(--accent)">BƯỚC 1 — RÚT VỀ ĐƠN VỊ: giá 1 món = ${r.T} : ${r.N} = ${r.u} nghìn.</text>`;
      g += `<text x="14" y="120" font-size="13" font-weight="700" fill="var(--chalk)">Hỏi: ${r.M} món như thế hết bao nhiêu?</text>`;
      g += `<text x="${ox + W + 8}" y="154" font-size="12" font-weight="700" fill="var(--accent)">= ${r.ans}</text>` + row(140, r.M, 'rgba(240,196,92,.55)');
      g += `<text x="14" y="184" font-size="11" fill="var(--accent)">BƯỚC 2 — QUAY LẠI: ${r.M} món = ${r.u} × ${r.M} = ${r.ans} nghìn.</text>`;
      const err = `<text x="14" y="206" font-size="10.5" fill="var(--warn)">❌ Sai thường gặp: lấy ${r.T} × ${r.M} hay ${r.T} : ${r.M}. Phải tìm GIÁ TRỊ CỦA MỘT MÓN (${r.u}) trước, rồi mới nhân với ${r.M}.</text>`;
      host.innerHTML = `<svg id="rutdonvi" width="520" height="216" viewBox="0 0 520 216">` + g + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${r.N} món ĐỒ HOÀN TOÀN GIỐNG NHAU xếp thành hàng, cả ${r.N} món hết ${r.T} nghìn đồng. ${r.M} món cần mua cũng cùng loại ấy.`, hint: 'mỗi món một giá như nhau nên chỉ cần biết giá 1 món.' };
      if (s === 2) return { cap: `Sơ đồ: chia đều ${r.T} nghìn cho ${r.N} ô bằng nhau → mỗi ô (1 món) giá ${r.T} : ${r.N} = ${r.u} nghìn. Đây chính là BƯỚC RÚT VỀ ĐƠN VỊ.`, hint: 'rút về đơn vị = tìm giá trị của MỘT phần.' };
      if (s === 3) return { cap: `Phép tính: giá 1 món = ${r.T} : ${r.N} = ${r.u} nghìn; ${r.M} món = ${r.u} × ${r.M} = ${r.ans} nghìn.`, hint: '' };
      return { cap: `Cả lớp: biết ${r.N} món giá ${r.T}, ta tìm 1 món = ${r.T} : ${r.N} = ${r.u}, rồi ${r.M} món = ${r.u} × ${r.M} = ${r.ans} nghìn. Mẹo "rút về đơn vị": LUÔN CHIA để được giá trị một phần trước, rồi mới NHÂN lên số phần cần tìm.`, hint: '' };
    },
    value(st) { const r = this.res(st); return `${r.T} : ${r.N} = ${r.u} · ${r.u} × ${r.M} = ${r.ans} nghìn`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mF = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mG = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      for (let k = 0; k < r.N; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mF); m.position.set(k * 0.6, 0, 0); g.add(m); }
      for (let k = 0; k < r.M; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mG); m.position.set(k * 0.6, 0, 1.2); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  bcnn: {
    res(st) {
      const a = clamp(Math.round(st.bcA), 2, 12), b = clamp(Math.round(st.bcB), 2, 12);
      const gcd = (x, y) => (y ? gcd(y, x % y) : x);
      const g = gcd(a, b);
      const l = (a * b) / g;
      return { a, b, g, l, ca: a / g, cb: b / g, ka: l / a, kb: l / b };
    },
    defaults(st, L) { st.bcA = (L.bcA != null ? L.bcA : 8); st.bcB = (L.bcB != null ? L.bcB : 12); },
    geomSig(st) { const r = this.res(st); return 'bcnn' + r.a + '~' + r.b + '~g' + r.g + '~l' + r.l; },
    params() { return [{ key: 'bcA', label: 'Số thứ nhất', min: 2, max: 12 }, { key: 'bcB', label: 'Số thứ hai', min: 2, max: 12 }]; },
    toggles() { return []; },
    ctlHint() { return 'Hai thanh trượt chọn hai số (2–12). Trên = ƯCLN: ô vuông LỚN NHẤT lát khít cả hai dải. Dưới = BCNN: tia số các BỘI, hai hàng gặp nhau đầu tiên ở đâu thì BCNN ở đó. Đẳng thức then chốt: số_a × số_b = BCNN × ƯCLN. Giơ 2–12 ngón đặt số thứ nhất.'; },
    hand(st, f) { st.bcA = clamp(Math.round(f), 2, 12); },
    handLabel(f) { return '→ số thứ nhất = ' + clamp(Math.round(f), 2, 12); },
    draw2d(host, st) {
      const r = this.res(st);
      const W = 300, ox = 44, u = W / r.l;
      let g = `<text x="14" y="18" font-size="13" font-weight="700" fill="var(--chalk)">ƯCLN(${r.a}, ${r.b}) = ${r.g} — ô vuông lớn nhất lát vừa khít cả hai dải</text>`;
      const bar = (y, val, n, tone) => {
        const w = val * u, cw = w / n; let s = '';
        for (let k = 0; k < n; k++) s += `<rect x="${(ox + k * cw).toFixed(2)}" y="${y}" width="${Math.max(cw - 1, 0.5).toFixed(2)}" height="16" rx="1" fill="${tone}" stroke="rgba(242,240,230,.5)" stroke-width="1"></rect>`;
        return s;
      };
      g += `<text x="14" y="52" font-size="11" fill="var(--chalk)">${r.a} = ${r.ca} × ${r.g}</text>` + bar(40, r.a, r.ca, 'rgba(127,201,191,.6)');
      g += `<text x="14" y="78" font-size="11" fill="var(--chalk)">${r.b} = ${r.cb} × ${r.g}</text>` + bar(66, r.b, r.cb, 'rgba(240,196,92,.6)');
      g += `<text x="14" y="112" font-size="13" font-weight="700" fill="var(--chalk)">BCNN(${r.a}, ${r.b}) = ${r.l} — hai hàng bội gặp nhau đầu tiên</text>`;
      const ny = 150;
      g += `<line x1="${ox}" y1="${ny}" x2="${(ox + W).toFixed(2)}" y2="${ny}" stroke="rgba(242,240,230,.6)" stroke-width="1.5"></line>`;
      for (let k = 1; k <= r.ka; k++) { const x = ox + k * r.a * u; g += `<line x1="${x.toFixed(2)}" y1="${ny - 8}" x2="${x.toFixed(2)}" y2="${ny}" stroke="rgba(127,201,191,.9)" stroke-width="2"></line>`; }
      for (let k = 1; k <= r.kb; k++) { const x = ox + k * r.b * u; g += `<line x1="${x.toFixed(2)}" y1="${ny}" x2="${x.toFixed(2)}" y2="${ny + 8}" stroke="rgba(240,196,92,.9)" stroke-width="2"></line>`; }
      const cx = ox + r.l * u;
      g += `<text x="${(cx - 2).toFixed(2)}" y="${ny - 12}" font-size="10" text-anchor="end" fill="var(--accent)">gặp tại ${r.l}</text>`;
      g += `<text x="14" y="192" font-size="12" font-weight="700" fill="var(--accent)">${r.a} × ${r.b} = ${r.l} × ${r.g}  →  BCNN = ${r.a} × ${r.b} ÷ ${r.g} = ${r.l}</text>`;
      const err = `<text x="14" y="214" font-size="10.5" fill="var(--warn)">❌ Khi hai số có ước chung thì BCNN KHÔNG phải tích ${r.a} × ${r.b} = ${r.a * r.b}; phải CHIA cho ƯCLN ${r.g}. (Chỉ bằng tích khi ${r.g} = 1, tức đôi một nguyên tố.)</text>`;
      host.innerHTML = `<svg id="bcnn" width="520" height="224" viewBox="0 0 520 224">` + g + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: lát hai dải băng dài ${r.a} và ${r.b} bằng những Ô VUÔNG như nhau. Ô to nhất mà lát KHÍT cả hai dải có cạnh = ƯCLN = ${r.g}.`, hint: 'ước chung lớn nhất = ô to nhất lát vừa cả hai.' };
      if (s === 2) return { cap: `Sơ đồ: dải ${r.a} = ${r.ca} ô, dải ${r.b} = ${r.cb} ô, mỗi ô cạnh ${r.g}. Trên tia số, liệt kê bội của ${r.a} (vạch teal) và ${r.b} (vạch vàng) — chỗ gặp ĐẦU TIÊN là BCNN = ${r.l}.`, hint: 'bội chung nhỏ nhất = điểm gặp đầu tiên.' };
      if (s === 3) return { cap: `Phép tính: ƯCLN(${r.a},${r.b}) = ${r.g}; BCNN = ${r.a} × ${r.b} ÷ ${r.g} = ${r.l}. Kiểm tra ĐẲNG THỨC TÍCH: ${r.a} × ${r.b} = ${r.a * r.b} = ${r.l} × ${r.g}.`, hint: '' };
      return { cap: `Cả lớp: ƯCLN(${r.a},${r.b}) = ${r.g} (dùng để RÚT GỌN tỉ số: ${r.a}:${r.b} = ${r.ca}:${r.cb}), BCNN(${r.a},${r.b}) = ${r.l} (dùng làm MẪU CHUNG NHỎ NHẤT khi quy đồng). Ghi nhớ: BCNN × ƯCLN = ${r.a} × ${r.b}.`, hint: '' };
    },
    value(st) { const r = this.res(st); return `ƯCLN = ${r.g} · BCNN = ${r.l}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mF = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mG = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const sz = Math.max(0.3, Math.min(0.6, 3 / Math.max(r.ca, r.cb)));
      for (let k = 0; k < r.ca; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(sz, sz, sz), mF); m.position.set(k * (sz + 0.08), 0, 0); g.add(m); }
      for (let k = 0; k < r.cb; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(sz, sz, sz), mG); m.position.set(k * (sz + 0.08), 0, 1.2); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  phantphoi: {
    res(st) {
      const a = clamp(Math.round(st.pfA), 2, 9);
      const b = clamp(Math.round(st.pfB), 1, 9);
      const c = clamp(Math.round(st.pfC), 1, 9);
      const s = b + c, ab = a * b, ac = a * c, total = a * s;
      return { a, b, c, s, ab, ac, total };
    },
    defaults(st, L) { st.pfA = (L.pfA != null ? L.pfA : 4); st.pfB = (L.pfB != null ? L.pfB : 5); st.pfC = (L.pfC != null ? L.pfC : 3); },
    geomSig(st) { const r = this.res(st); return 'ppf' + r.a + '~' + r.b + '~' + r.c; },
    params() { return [{ key: 'pfA', label: 'a (số nhân cả hai)', min: 2, max: 9 }, { key: 'pfB', label: 'Số hạng b', min: 1, max: 9 }, { key: 'pfC', label: 'Số hạng c', min: 1, max: 9 }]; },
    toggles() { return []; },
    ctlHint() { return 'Ba thanh trượt cho a, b, c. Vẽ hình chữ nhật cao a, ngang (b + c); kẻ một đường dọc chia thành hai phần a×b và a×c. Tính chất PHÂN PHỐI: a × (b + c) = a×b + a×c. Giơ 2–9 ngón đặt số a.'; },
    hand(st, f) { st.pfA = clamp(Math.round(f), 2, 9); },
    handLabel(f) { return '→ a (số nhân cả hai) = ' + clamp(Math.round(f), 2, 9); },
    draw2d(host, st) {
      const r = this.res(st);
      const u = 13, ox = 46, oy = 46;
      const H = r.a * u, wb = r.b * u, wc = r.c * u;
      let g = '';
      g += `<rect x="${ox}" y="${oy}" width="${wb}" height="${H}" fill="rgba(127,201,191,.5)" stroke="rgba(242,240,230,.5)" stroke-width="1"></rect>`;
      g += `<rect x="${ox + wb}" y="${oy}" width="${wc}" height="${H}" fill="rgba(240,196,92,.5)" stroke="rgba(242,240,230,.5)" stroke-width="1"></rect>`;
      for (let k = 1; k < r.s; k++) g += `<line x1="${ox + k * u}" y1="${oy}" x2="${ox + k * u}" y2="${oy + H}" stroke="rgba(242,240,230,.16)" stroke-width="1"></line>`;
      for (let k = 1; k < r.a; k++) g += `<line x1="${ox}" y1="${oy + k * u}" x2="${ox + wb + wc}" y2="${oy + k * u}" stroke="rgba(242,240,230,.16)" stroke-width="1"></line>`;
      g += `<line x1="${ox + wb}" y1="${oy - 6}" x2="${ox + wb}" y2="${oy + H + 6}" stroke="var(--chalk)" stroke-width="1.5" stroke-dasharray="4 3"></line>`;
      g += `<text x="${ox + wb / 2}" y="${oy + H / 2 + 4}" font-size="12" font-weight="700" text-anchor="middle" fill="var(--chalk)">${r.ab}</text>`;
      g += `<text x="${ox + wb + wc / 2}" y="${oy + H / 2 + 4}" font-size="12" font-weight="700" text-anchor="middle" fill="var(--chalk)">${r.ac}</text>`;
      g += `<text x="${ox + wb / 2}" y="${oy - 10}" font-size="11" text-anchor="middle" fill="var(--chalk)">b=${r.b}</text>`;
      g += `<text x="${ox + wb + wc / 2}" y="${oy - 10}" font-size="11" text-anchor="middle" fill="var(--chalk)">c=${r.c}</text>`;
      g += `<text x="${ox - 8}" y="${oy + H / 2 + 4}" font-size="11" text-anchor="end" fill="var(--chalk)">a=${r.a}</text>`;
      g += `<text x="14" y="${oy + H + 24}" font-size="12" font-weight="700" fill="var(--accent)">${r.a} × (${r.b} + ${r.c}) = ${r.a}×${r.b} + ${r.a}×${r.c} = ${r.ab} + ${r.ac} = ${r.total}</text>`;
      const err = `<text x="14" y="${oy + H + 44}" font-size="10.5" fill="var(--warn)">❌ Phải nhân a với CẢ HAI số hạng: ${r.a}×(${r.b}+${r.c}) ≠ ${r.a}×${r.b} + ${r.c} (= ${r.ab + r.c}). Tổng hai phần phải bằng đúng số ô cả hình ${r.total}.</text>`;
      const head = `<text x="14" y="22" font-size="13" font-weight="700" fill="var(--chalk)">TÍNH CHẤT PHÂN PHỐI: a × (b + c) = a×b + a×c</text>`;
      host.innerHTML = `<svg id="phantphoi" width="520" height="${oy + H + 52}" viewBox="0 0 520 ${oy + H + 52}">` + head + g + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: xếp ${r.a} hàng, mỗi hàng có (${r.b} + ${r.c}) cái bánh xe (bánh ${r.b} cái teal ghép với ${r.c} cái vàng). Đếm theo hai cách.`, hint: 'một hình, hai cách đếm ô.' };
      if (s === 2) return { cap: `Sơ đồ: cả hình chữ nhật cao ${r.a}, ngang ${r.b}+${r.c} = ${r.s} ô → ${r.total} ô. Kẻ một đường dọc chia thành hai phần: teal ${r.a}×${r.b} = ${r.ab} ô, vàng ${r.a}×${r.c} = ${r.ac} ô.`, hint: 'tổng hai phần = toàn thể.' };
      if (s === 3) return { cap: `Phép tính: ${r.a} × (${r.b} + ${r.c}) = ${r.a}×${r.b} + ${r.a}×${r.c} = ${r.ab} + ${r.ac} = ${r.total}. Kiểm tra: ${r.a} × ${r.s} = ${r.total} — hai cách đếm ô cho CÙNG một số.`, hint: '' };
      return { cap: `Cả lớp: nhân một số với một tổng = nhân số đó với TỪNG số hạng rồi cộng lại. ${r.a} × (${r.b} + ${r.c}) = ${r.total}. Mẹo tính nhanh: tách số khó thành tổng các số tròn rồi nhân từng phần (đây chính là bản chất phép đặt tính ở areamult).`, hint: '' };
    },
    value(st) { const r = this.res(st); return `${r.a} × (${r.b} + ${r.c}) = ${r.ab} + ${r.ac} = ${r.total}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mF = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mG = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const k = 0.35;
      const left = new THREE.Mesh(new THREE.BoxGeometry(r.b * k, r.a * k, 0.3), mF); left.position.set((r.b * k) / 2, (r.a * k) / 2, 0); g.add(left);
      const right = new THREE.Mesh(new THREE.BoxGeometry(r.c * k, r.a * k, 0.3), mG); right.position.set(r.b * k + (r.c * k) / 2, (r.a * k) / 2, 0); g.add(right);
      return g;
    },
    paint3d() {},
  },
  gapso: {
    res(st) {
      const A = clamp(Math.round(st.gpA), 2, 9);
      const k = clamp(Math.round(st.gpK), 2, 9);
      const B = A * k;
      return { A, k, B };
    },
    defaults(st, L) { st.gpA = (L.gpA != null ? L.gpA : 3); st.gpK = (L.gpK != null ? L.gpK : 4); },
    geomSig(st) { const r = this.res(st); return 'gps' + r.A + '~' + r.k; },
    params() { return [{ key: 'gpA', label: 'Đoạn A (số ban đầu)', min: 2, max: 9 }, { key: 'gpK', label: 'Số lần k (2–9)', min: 2, max: 9 }]; },
    toggles() { return []; },
    ctlHint() { return 'Hai thanh trượt: đoạn A (2–9 ô) và số lần k (2–9). Giơ 2–9 ngón đặt A. GẤP k lần = viết lại A đúng k lần; GIẢM k lần = chia đoạn dài thành k phần bằng nhau.'; },
    hand(st, f) { st.gpA = clamp(Math.round(f), 2, 9); },
    handLabel(f) { return '→ A (đoạn ban đầu) = ' + clamp(Math.round(f), 2, 9); },
    draw2d(host, st) {
      const r = this.res(st);
      const u = 20, ox = 44;
      const yA = 58, yB = 150, H = 34;
      let g = '';
      g += `<rect x="${ox}" y="${yA}" width="${r.A * u}" height="${H}" fill="rgba(127,201,191,.55)" stroke="rgba(242,240,230,.5)" stroke-width="1"></rect>`;
      for (let i = 1; i < r.A; i++) g += `<line x1="${ox + i * u}" y1="${yA}" x2="${ox + i * u}" y2="${yA + H}" stroke="rgba(242,240,230,.22)" stroke-width="1"></line>`;
      g += `<text x="${ox - 8}" y="${yA + H / 2 + 4}" font-size="12" font-weight="700" text-anchor="end" fill="var(--chalk)">A</text>`;
      g += `<text x="${ox + r.A * u + 8}" y="${yA + H / 2 + 4}" font-size="12" fill="var(--chalk)">= ${r.A}</text>`;
      for (let j = 0; j < r.k; j++) {
        const bx = ox + j * r.A * u;
        g += `<rect x="${bx}" y="${yB}" width="${r.A * u}" height="${H}" fill="rgba(240,196,92,.5)" stroke="rgba(242,240,230,.5)" stroke-width="1"></rect>`;
        if (j > 0) g += `<line x1="${bx}" y1="${yB - 6}" x2="${bx}" y2="${yB + H + 6}" stroke="var(--chalk)" stroke-width="1.5" stroke-dasharray="4 3"></line>`;
      }
      for (let i = 1; i < r.B; i++) g += `<line x1="${ox + i * u}" y1="${yB}" x2="${ox + i * u}" y2="${yB + H}" stroke="rgba(242,240,230,.16)" stroke-width="1"></line>`;
      g += `<text x="${ox - 8}" y="${yB + H / 2 + 4}" font-size="12" font-weight="700" text-anchor="end" fill="var(--chalk)">B</text>`;
      g += `<text x="${ox + r.B * u + 8}" y="${yB + H / 2 + 4}" font-size="12" fill="var(--chalk)">= ${r.B}</text>`;
      g += `<text x="${ox}" y="${yB + H + 20}" font-size="11" fill="var(--chalk)">B gồm ${r.k} khối nối tiếp, mỗi khối = ${r.A} ô (= A)</text>`;
      g += `<text x="14" y="24" font-size="13" font-weight="700" fill="var(--chalk)">GẤP / GIẢM MỘT SỐ LẦN</text>`;
      g += `<text x="14" y="${yB + H + 44}" font-size="12" font-weight="700" fill="var(--accent)">Gấp ${r.k} lần: ${r.A} × ${r.k} = ${r.B} · Giảm ${r.k} lần: ${r.B} : ${r.k} = ${r.A}</text>`;
      g += `<text x="14" y="${yB + H + 64}" font-size="10.5" fill="var(--warn)">❌ GẤP là NHÂN thêm ${r.k} lần (B dài hơn A); GIẢM là CHIA ${r.k} phần (ngắn lại). Đừng nhầm: ${r.A} + ${r.k} = ${r.A + r.k} là CỘNG, không phải gấp ${r.k} lần ${r.A} (= ${r.B}).</text>`;
      const W = ox + r.B * u + 56;
      host.innerHTML = `<svg id="gapso" width="${W}" height="${yB + H + 80}" viewBox="0 0 ${W} ${yB + H + 80}">` + g + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hàng trên có ${r.A} cái kẹo (đoạn A). Hàng dưới xếp ${r.k} NHÓM, mỗi nhóm đúng ${r.A} cái như vậy → ${r.B} cái. Muốn gấp ${r.A} lên ${r.k} lần, ta viết ${r.A} lại ${r.k} lần rồi đếm.`, hint: 'gấp = thêm các nhóm bằng nhau.' };
      if (s === 2) return { cap: `Sơ đồ: đoạn A = ${r.A} ô. Đoạn B = ${r.k} đoạn A nối tiếp = ${r.B} ô, nên B DÀI GẤP ${r.k} LẦN A. Ngược lại, cắt B thành ${r.k} phần bằng nhau thì mỗi phần = ${r.A} ô (giảm ${r.k} lần).`, hint: 'đoạn này dài gấp mấy lần đoạn kia.' };
      if (s === 3) return { cap: `Phép tính: Gấp ${r.k} lần A là ${r.A} × ${r.k} = ${r.B}. Giảm ${r.k} lần B là ${r.B} : ${r.k} = ${r.A}. Hai phép là NGƯỢC nhau (nhân ↔ chia đúng ${r.k} lần).`, hint: '' };
      return { cap: `Cả lớp: "gấp ${r.k} lần" = nhân cho ${r.k}; "giảm ${r.k} lần" = chia cho ${r.k} (số bị chia phải chia hết). Kiểm: ${r.B} : ${r.k} = ${r.A}, đúng bằng đoạn ban đầu. Đây là nền của TỈ số (${r.B} : ${r.A} = ${r.k} lần) và hai đại lượng tỉ lệ thuận.`, hint: '' };
    },
    value(st) { const r = this.res(st); return `${r.A} × ${r.k} = ${r.B} · ${r.B} : ${r.k} = ${r.A}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mA = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mB = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const s = 0.35;
      const aBox = new THREE.Mesh(new THREE.BoxGeometry(r.A * s, s, s), mA); aBox.position.set((r.A * s) / 2, 1, 0); g.add(aBox);
      const bBox = new THREE.Mesh(new THREE.BoxGeometry(r.B * s, s, s), mB); bBox.position.set((r.B * s) / 2, 0, 0); g.add(bBox);
      return g;
    },
    paint3d() {},
  },
  psvs1: {
    res(st) {
      const d = clamp(Math.round(st.v1D), 2, 9);
      const n = clamp(Math.round(st.v1N), 1, 18);
      const q = Math.floor(n / d);
      const r = n - q * d;
      const cmp = n > d ? '>' : n === d ? '=' : '<';
      return { d, n, q, r, cmp };
    },
    defaults(st, L) { st.v1N = (L.v1N != null ? L.v1N : 7); st.v1D = (L.v1D != null ? L.v1D : 4); },
    geomSig(st) { const r = this.res(st); return 'psvs1' + r.n + '~' + r.d; },
    params() { return [{ key: 'v1N', label: 'Tử số n (số ô tô)', min: 1, max: 18 }, { key: 'v1D', label: 'Mẫu số d (1 gồm d phần, 2–9)', min: 2, max: 9 }]; },
    toggles() { return []; },
    ctlHint() { return 'Hai thanh trượt: tử số n (1–18 ô) và mẫu số d (2–9). Giơ ngón đặt n. Tử số = số ô đang tô; mẫu số = số ô tạo thành MỘT đơn vị (=1). Tô đủ d ô là được đúng 1.'; },
    hand(st, f) { st.v1N = clamp(Math.round(f), 1, 18); },
    handLabel(f) { return '→ Tử số n = ' + clamp(Math.round(f), 1, 18); },
    draw2d(host, st) {
      const r = this.res(st);
      const u = 22, H = 32, ox = 40, yRef = 52, yFrac = 116;
      const cs = r.cmp === '<' ? '&lt;' : r.cmp === '>' ? '&gt;' : '=';
      let g = '';
      g += `<text x="14" y="24" font-size="13" font-weight="700" fill="var(--chalk)">PHÂN SỐ SO VỚI 1</text>`;
      g += `<rect x="${ox}" y="${yRef}" width="${r.d * u}" height="${H}" fill="rgba(127,201,191,.5)" stroke="rgba(242,240,230,.5)" stroke-width="1"></rect>`;
      for (let i = 1; i < r.d; i++) g += `<line x1="${ox + i * u}" y1="${yRef}" x2="${ox + i * u}" y2="${yRef + H}" stroke="rgba(242,240,230,.25)" stroke-width="1"></line>`;
      g += `<text x="${ox - 6}" y="${yRef + H / 2 + 4}" font-size="12" font-weight="700" text-anchor="end" fill="var(--chalk)">1 =</text>`;
      g += `<text x="${ox + r.d * u + 8}" y="${yRef + H / 2 + 4}" font-size="11" fill="var(--chalk)">${r.d}/${r.d} ô</text>`;
      for (let i = 0; i < r.n; i++) {
        const x = ox + i * u;
        const whole = i < r.q * r.d;
        const fill = whole ? 'rgba(127,201,191,.5)' : 'rgba(240,196,92,.55)';
        g += `<rect x="${x}" y="${yFrac}" width="${u}" height="${H}" fill="${fill}" stroke="rgba(242,240,230,.45)" stroke-width="1"></rect>`;
      }
      for (let k = 1; k <= r.q; k++) {
        const bx = ox + k * r.d * u;
        g += `<line x1="${bx}" y1="${yFrac - 8}" x2="${bx}" y2="${yFrac + H + 8}" stroke="var(--chalk)" stroke-width="1.5" stroke-dasharray="4 3"></line>`;
      }
      for (let k = 0; k < r.q; k++) {
        const cx = ox + k * r.d * u + (r.d * u) / 2;
        g += `<text x="${cx}" y="${yFrac + H + 16}" font-size="11" font-weight="700" text-anchor="middle" fill="var(--chalk)">1</text>`;
      }
      if (r.r > 0) {
        const rx = ox + r.q * r.d * u + (r.r * u) / 2;
        g += `<text x="${rx}" y="${yFrac + H + 16}" font-size="10" text-anchor="middle" fill="var(--warn)">${r.r}/${r.d}</text>`;
      }
      g += `<text x="${ox - 6}" y="${yFrac + H / 2 + 4}" font-size="12" font-weight="700" text-anchor="end" fill="var(--chalk)">${r.n}/${r.d}</text>`;
      g += `<text x="14" y="${yFrac + H + 40}" font-size="12" font-weight="700" fill="var(--accent)">${r.n}/${r.d} ${cs} 1 · ${r.n} = ${r.q}×${r.d} + ${r.r}</text>`;
      g += `<text x="14" y="${yFrac + H + 60}" font-size="10.5" fill="var(--warn)">❌ So với 1 chỉ nhìn TỬ số và MẪU số: ${r.n} ${cs} ${r.d} → phân số ${r.cmp === '>' ? 'lớn hơn' : r.cmp === '<' ? 'bé hơn' : 'bằng'} 1. Có ${r.q} đơn vị nguyên${r.r > 0 ? ` và thừa ${r.r}/${r.d}` : ''}. Đừng nhầm "mẫu to thì phân số to".</text>`;
      const W = Math.max(ox + r.d * u, ox + r.n * u) + 60;
      host.innerHTML = `<svg id="psvs1" width="${W}" height="${yFrac + H + 78}" viewBox="0 0 ${W} ${yFrac + H + 78}">` + g + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      const tenPhan = r.cmp === '>' ? 'lớn hơn 1' : r.cmp === '<' ? 'bé hơn 1' : 'bằng đúng 1';
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: một cái bánh chia đều thành ${r.d} phần thì cả cái bánh là ${r.d}/${r.d} = 1. Em lấy ${r.n} phần như thế (${r.n}/${r.d}). Cứ đủ ${r.d} phần là một cái nguyên; ${r.n} phần thì được ${r.q} cái nguyên${r.r > 0 ? ` và ${r.r} phần lẻ` : ', vừa hết'}.`, hint: 'đếm theo từng "cái" tròn.' };
      if (s === 2) return { cap: `Sơ đồ: thanh dưới có ${r.n} ô, cứ ${r.d} ô ghép thành MỘT đơn vị (=1) như thanh trên. Ghép được ${r.q} đơn vị nguyên${r.r > 0 ? ` và dư ${r.r} ô (= ${r.r}/${r.d})` : ', vừa hết không dư'}.`, hint: 'tử số chứa mấy lần mẫu số.' };
      if (s === 3) return { cap: `Phép tính: lấy tử chia mẫu — ${r.n} : ${r.d} = ${r.q} dư ${r.r}, tức ${r.n} = ${r.q}×${r.d} + ${r.r}. Vì ${r.n} ${r.cmp} ${r.d} nên ${r.n}/${r.d} ${tenPhan}.`, hint: '' };
      return { cap: `Cả lớp: so phân số với 1 chỉ cần so TỬ số với MẪU số — tử ${r.cmp === '>' ? 'lớn hơn' : r.cmp === '<' ? 'bé hơn' : 'bằng'} mẫu thì phân số ${tenPhan}. Đây chính là phép chia có dư: thương ${r.q} là số đơn vị nguyên, số dư ${r.r} là phần lẻ ${r.r}/${r.d}.`, hint: '' };
    },
    value(st) { const r = this.res(st); return `${r.n}/${r.d} ${r.cmp} 1`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mWhole = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mPart = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const s = 0.6;
      for (let k = 0; k < r.q; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), mWhole); b.position.set(k * s + s / 2, 0, 0); g.add(b); }
      if (r.r > 0) { const w = (r.r / r.d) * s; const p = new THREE.Mesh(new THREE.BoxGeometry(w, s, s), mPart); p.position.set(r.q * s + w / 2, 0, 0); g.add(p); }
      return g;
    },
    paint3d() {},
  },
  seqmean: {
    res(st) {
      const a = clamp(Math.round(st.smA), 1, 9);
      const d = clamp(Math.round(st.smD), 1, 5);
      const n = clamp(Math.round(st.smN), 2, 7);
      const last = a + (n - 1) * d;
      const total = n * (a + last) / 2;
      const mean = (a + last) / 2;
      const mid = (n % 2 === 1) ? a + ((n - 1) / 2) * d : null;
      return { a, d, n, last, total, mean, mid };
    },
    defaults(st, L) { st.smA = (L.smA != null ? L.smA : 1); st.smD = (L.smD != null ? L.smD : 2); st.smN = (L.smN != null ? L.smN : 5); },
    geomSig(st) { const r = this.res(st); return 'sm~' + r.a + '~' + r.d + '~' + r.n; },
    params() { return [{ key: 'smA', label: 'Số hạng đầu a', min: 1, max: 9 }, { key: 'smD', label: 'Hiệu chung d (1–5)', min: 1, max: 5 }, { key: 'smN', label: 'Số số hạng n (2–7)', min: 2, max: 7 }]; },
    toggles() { return []; },
    ctlHint() { return 'Ba thanh trượt: số hạng đầu a (1–9), hiệu chung d (1–5), số số hạng n (2–7). Giơ ngón đặt a. Mỗi cột là một số hạng; đường nét đứt là MỨC SAN ĐỀU = trung bình cộng.'; },
    hand(st, f) { st.smA = clamp(Math.round(f), 1, 9); },
    handLabel(f) { return '→ Số hạng đầu a = ' + clamp(Math.round(f), 1, 9); },
    draw2d(host, st) {
      const r = this.res(st);
      const mf = Number.isInteger(r.mean) ? String(r.mean) : String(r.mean).replace('.', ',');
      const bw = 40, gap = 12, ox = 34, baseY = 190, maxH = 120;
      const scale = maxH / r.last;
      const W = ox + r.n * (bw + gap) + 26;
      let g = '';
      g += `<text x="14" y="22" font-size="13" font-weight="700" fill="var(--chalk)">TRUNG BÌNH CỘNG CỦA DÃY SỐ CÁCH ĐỀU</text>`;
      const meanY = baseY - r.mean * scale;
      g += `<line x1="${ox - 12}" y1="${meanY}" x2="${W - 14}" y2="${meanY}" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="6 4"></line>`;
      g += `<text x="${ox - 6}" y="${meanY - 5}" font-size="10.5" fill="var(--accent)">san đều ${mf}</text>`;
      for (let i = 0; i < r.n; i++) {
        const term = r.a + i * r.d;
        const h = term * scale;
        const x = ox + i * (bw + gap);
        const y = baseY - h;
        const isMid = r.mid != null && term === r.mid;
        const fill = isMid ? 'rgba(240,196,92,.6)' : 'rgba(127,201,191,.5)';
        g += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" fill="${fill}" stroke="rgba(242,240,230,.5)" stroke-width="1"></rect>`;
        g += `<text x="${x + bw / 2}" y="${y - 5}" font-size="11" font-weight="700" text-anchor="middle" fill="var(--chalk)">${term}</text>`;
      }
      g += `<line x1="${ox - 12}" y1="${baseY}" x2="${W - 14}" y2="${baseY}" stroke="rgba(242,240,230,.55)" stroke-width="1"></line>`;
      g += `<text x="14" y="${baseY + 22}" font-size="12" fill="var(--chalk)">Dãy: ${r.a}; ${r.a + r.d}; …; ${r.last} (${r.n} số hạng, cách đều nhau ${r.d} đơn vị)</text>`;
      g += `<text x="14" y="${baseY + 42}" font-size="12" font-weight="700" fill="var(--accent)">TB cộng = (số đầu + số cuối) : 2 = (${r.a} + ${r.last}) : 2 = ${mf} · Tổng = ${mf} × ${r.n} = ${r.total}</text>`;
      g += `<text x="14" y="${baseY + 62}" font-size="10.5" fill="var(--warn)">❌ Với DÃY CÁCH ĐỀU, trung bình cộng = số CHÍNH GIỮA${r.mid != null ? ` (= ${r.mid})` : ' (mức giữa hai số chính giữa)'} CHỨ KHÔNG phải số lớn nhất (${r.last}). Chỉ cần (đầu + cuối) : 2, không cần cộng hết rồi chia.</text>`;
      host.innerHTML = `<svg id="seqmean" width="${W}" height="${baseY + 82}" viewBox="0 0 ${W} ${baseY + 82}">` + g + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      const mf = Number.isInteger(r.mean) ? String(r.mean) : String(r.mean).replace('.', ',');
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${r.n} hàng cốc nước có mực cao lần lượt ${r.a}, ${r.a + r.d}, … đến ${r.last} (cách đều nhau ${r.d}). Rót san để MỌI hàng cao bằng nhau → mỗi hàng còn ${mf}. Con số san bằng đó chính là trung bình cộng.`, hint: 'san bằng rồi đo chiều cao chung.' };
      if (s === 2) return { cap: `Sơ đồ: ${r.n} cột cao theo từng số hạng; đường nét đứt ${mf} là MỨC SAN ĐỀU. Cột cao hơn nhô ra vừa khít phần cột thấp hơn bị lõm vào → trung bình cộng nằm CHÍNH GIỮA dãy.`, hint: 'phần dôi ra = phần thiếu đi.' };
      if (s === 3) return { cap: `Phép tính (Gauss): số ĐẦU + số CUỐI = ${r.a} + ${r.last} = ${r.a + r.last}; số thứ hai + áp chót cũng bằng ${r.a + r.last}. Vậy 2 × Tổng = ${r.n} × ${r.a + r.last} = ${2 * r.total}, nên Tổng = ${r.total}; TB cộng = Tổng : ${r.n} = ${mf}.`, hint: '' };
      return { cap: `Cả lớp: với DÃY CÁCH ĐỀU, trung bình cộng = (số đầu + số cuối) : 2${r.mid != null ? ` và đúng bằng SỐ CHÍNH GIỮA (= ${r.mid})` : ' (nằm giữa hai số chính giữa)'}. Đây là lúc model "san bằng" (mean) gặp model "dãy cách đều" (seq): Tổng = trung bình cộng × số số hạng.`, hint: '' };
    },
    value(st) { const r = this.res(st); const mf = Number.isInteger(r.mean) ? String(r.mean) : String(r.mean).replace('.', ','); return `TB cộng = (${r.a} + ${r.last}) : 2 = ${mf} · Tổng = ${r.total}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const mA = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const mM = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const bw = 0.6, gp = 0.2;
      for (let i = 0; i < r.n; i++) {
        const term = r.a + i * r.d;
        const h = term;
        const isMid = r.mid != null && term === r.mid;
        const box = new THREE.Mesh(new THREE.BoxGeometry(bw, h, bw), isMid ? mM : mA);
        box.position.set(i * (bw + gp) + bw / 2, h / 2, 0);
        g.add(box);
      }
      return g;
    },
    paint3d() {},
  },
  dbar: {
    res(st) {
      const t1 = clamp(Math.round(st.dbT1), 1, 12);
      const g1 = clamp(Math.round(st.dbG1), 1, 12);
      const t2 = clamp(Math.round(st.dbT2), 1, 12);
      const g2 = clamp(Math.round(st.dbG2), 1, 12);
      const total1 = t1 + g1, total2 = t2 + g2, grand = total1 + total2;
      const diff = Math.abs(total1 - total2);
      const moreTotal = total1 === total2 ? '=' : (total1 > total2 ? '>' : '<');
      return { t1, g1, t2, g2, total1, total2, grand, diff, moreTotal };
    },
    defaults(st, L) { st.dbT1 = (L.dbT1 != null ? L.dbT1 : 12); st.dbG1 = (L.dbG1 != null ? L.dbG1 : 8); st.dbT2 = (L.dbT2 != null ? L.dbT2 : 10); st.dbG2 = (L.dbG2 != null ? L.dbG2 : 12); },
    geomSig(st) { const r = this.res(st); return 'dbar~' + r.t1 + r.g1 + r.t2 + r.g2; },
    params() { return [{ key: 'dbT1', label: '4A — trai', min: 1, max: 12 }, { key: 'dbG1', label: '4A — gái', min: 1, max: 12 }, { key: 'dbT2', label: '4B — trai', min: 1, max: 12 }, { key: 'dbG2', label: '4B — gái', min: 1, max: 12 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bốn thanh trượt cho HAI cột đôi: 4A trai/gái và 4B trai/gái (mỗi cột 1–12 bạn). Giơ ngón đặt cột 4A-trai. Mỗi NHÓM có hai cột kề nhau (xanh = trai, vàng = gái).'; },
    hand(st, f) { st.dbT1 = clamp(Math.round(f), 1, 12); },
    handLabel(f) { return '→ 4A trai = ' + clamp(Math.round(f), 1, 12); },
    draw2d(host, st) {
      const r = this.res(st);
      const teal = 'rgba(127,201,191,.55)', gold = 'rgba(240,196,92,.6)';
      const moreWord = r.total1 > r.total2 ? 'nhiều hơn' : r.total1 < r.total2 ? 'ít hơn' : 'bằng';
      const bw = 32, inner = 6, groupGap = 48, ox = 52, baseY = 210, maxH = 150, axisMax = 12;
      const scale = maxH / axisMax;
      const groupW = 2 * bw + inner;
      const g0x = ox + 18;
      const g1x = g0x + groupW + groupGap;
      const W = g1x + groupW + 40;
      let g = '';
      g += `<text x="14" y="22" font-size="13" font-weight="700" fill="var(--chalk)">BIỂU ĐỒ CỘT ĐÔI · SỐ HỌC SINH HAI LỚP</text>`;
      g += `<rect x="${ox}" y="34" width="12" height="12" fill="${teal}" stroke="rgba(242,240,230,.5)"></rect><text x="${ox + 16}" y="44" font-size="10" fill="var(--chalk)">Trai</text>`;
      g += `<rect x="${ox + 52}" y="34" width="12" height="12" fill="${gold}" stroke="rgba(242,240,230,.5)"></rect><text x="${ox + 68}" y="44" font-size="10" fill="var(--chalk)">Gái</text>`;
      for (let v = 0; v <= axisMax; v += 2) {
        const y = baseY - v * scale;
        g += `<line x1="${ox}" y1="${y}" x2="${W - 14}" y2="${y}" stroke="rgba(242,240,230,.12)" stroke-width="1"></line>`;
        g += `<text x="${ox - 6}" y="${y + 3}" font-size="9" text-anchor="end" fill="var(--chalk)">${v}</text>`;
      }
      const drawBar = (x, val, c) => {
        const h = val * scale, y = baseY - h;
        return `<rect x="${x}" y="${y}" width="${bw}" height="${h}" fill="${c}" stroke="rgba(242,240,230,.5)" stroke-width="1"></rect>` +
          `<text x="${x + bw / 2}" y="${y - 4}" font-size="11" font-weight="700" text-anchor="middle" fill="var(--chalk)">${val}</text>`;
      };
      g += drawBar(g0x, r.t1, teal);
      g += drawBar(g0x + bw + inner, r.g1, gold);
      g += drawBar(g1x, r.t2, teal);
      g += drawBar(g1x + bw + inner, r.g2, gold);
      g += `<line x1="${ox}" y1="${baseY}" x2="${W - 14}" y2="${baseY}" stroke="rgba(242,240,230,.55)" stroke-width="1"></line>`;
      g += `<text x="${g0x + bw + inner / 2}" y="${baseY + 16}" font-size="11" text-anchor="middle" fill="var(--chalk)">Lớp 4A</text>`;
      g += `<text x="${g1x + bw + inner / 2}" y="${baseY + 16}" font-size="11" text-anchor="middle" fill="var(--chalk)">Lớp 4B</text>`;
      g += `<text x="14" y="${baseY + 38}" font-size="12" font-weight="700" fill="var(--accent)">Lớp 4A: ${r.t1} + ${r.g1} = ${r.total1} bạn · Lớp 4B: ${r.t2} + ${r.g2} = ${r.total2} bạn · Cả hai lớp: ${r.grand} bạn</text>`;
      g += `<text x="14" y="${baseY + 58}" font-size="10.5" fill="var(--warn)">❌ Đọc cột ĐÔI: xét TỪNG cặp (trai–gái) trong MỘT nhóm rồi cộng thành tổng nhóm; so hai nhóm bằng CẢ HAI tổng — đừng chỉ nhìn cột cao nhất. Ở đây Lớp 4A ${moreWord} Lớp 4B (${r.diff} bạn).</text>`;
      host.innerHTML = `<svg id="dbar" width="${W}" height="${baseY + 78}" viewBox="0 0 ${W} ${baseY + 78}">` + g + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      const moreWord = r.total1 > r.total2 ? 'nhiều hơn' : r.total1 < r.total2 ? 'ít hơn' : 'bằng';
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: kiểm tra sĩ số hai lớp. Lớp 4A có ${r.t1} bạn trai và ${r.g1} bạn gái; Lớp 4B có ${r.t2} bạn trai và ${r.g2} bạn gái. Biểu đồ dùng MÀU để phân biệt trai (xanh) và gái (vàng).`, hint: 'mỗi nhóm có HAI cột đứng cạnh nhau.' };
      if (s === 2) return { cap: `Sơ đồ: đọc CHIỀU CAO từng cột theo trục dọc, rồi CỘNG theo nhóm. Lớp 4A = ${r.t1} + ${r.g1} = ${r.total1} bạn; Lớp 4B = ${r.t2} + ${r.g2} = ${r.total2} bạn. Cột cao hơn = đông hơn.`, hint: 'một cột = một đại lượng.' };
      if (s === 3) return { cap: `Phép tính: cả hai lớp = ${r.total1} + ${r.total2} = ${r.grand} bạn. So sánh tổng: Lớp 4A ${moreWord} Lớp 4B, chênh lệch ${r.diff} bạn.`, hint: '' };
      return { cap: `Cả lớp: BIỂU ĐỒ CỘT ĐÔI cho phép xem ĐỒNG THỜI từng cặp trai–gái trong một nhóm và tổng giữa các nhóm. Đọc đúng = dựng từng cột theo đơn vị trục, rồi cộng/so theo TỪNG nhóm (không chỉ nhìn cột cao nhất nhất). Đây là kỹ năng Thống kê lớp 4, nối với bảng số liệu (dtable) và biểu đồ cột đơn (bar).`, hint: '' };
    },
    value(st) { const r = this.res(st); return `4A = ${r.total1} · 4B = ${r.total2} · chung = ${r.grand}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), g = new THREE.Group();
      const teal = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.6 });
      const gold = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.45 });
      const s = 0.5, gap = 0.3;
      const vals = [r.t1, r.g1, r.t2, r.g2];
      for (let i = 0; i < 4; i++) {
        const h = vals[i];
        const box = new THREE.Mesh(new THREE.BoxGeometry(s, h, s), (i % 2 === 0) ? teal : gold);
        box.position.set(i * (s + gap) + s / 2, h / 2, 0);
        g.add(box);
      }
      return g;
    },
    paint3d() {},
  },
});

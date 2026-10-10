// ---- tiep MODELS: gop vao object MODELS (giu nguyen thu tu key) ----
Object.assign(MODELS, {
  // ======================= Model: steps (bài toán nhiều bước — mở dần sơ đồ) =======================
  // Repo 'bai-toan-nhieu-buoc': vẽ sơ đồ trước rồi tính, MỖI BƯỚC một phép tính KÈM ĐƠN VỊ,
  // đáp số nằm ở BƯỚC CUỐI. Đưa tay ngang mở dần từng bước (bước sau cần kết quả bước trước).
  steps: {
    usesPalm: true,
    SS() { return (cur().steps) || []; },
    defaults(st, L) { st.pStep = 0; },
    palmToValue(st, x) { const K = this.SS().length; st.pStep = clamp(Math.round((1 - x) * K), 0, K); },
    palmLabel(st) { return `đã mở ${st.pStep}/${this.SS().length} bước`; },
    geomSig(st) { return 'steps' + this.SS().length; }, // pStep chỉ đổi màu hộp → paint3d, không rebuild
    params() { const K = this.SS().length; return [{ key: 'pStep', label: 'Số bước đã mở', min: 0, max: K }]; },
    ctlHint() { return 'Đưa bàn tay ngang để MỞ dần từng bước của lời giải (mỗi bước = một phép tính kèm đơn vị). Đáp số nằm ở bước cuối. Không có camera thì bấm +/−.'; },
    draw2d(host, st) {
      const L = cur(), steps = this.SS(), K = steps.length, shown = clamp(st.pStep, 0, K);
      const W = 560, bx = 30, bw = 500, rh = 66; let s = '';
      s += `<text x="16" y="22" fill="var(--chalk)" font-size="13">Đề: ${L.de || ''}</text>`;
      for (let i = 0; i < K; i++) { const y = 40 + i * rh, open = i < shown;
        if (open) { const b = steps[i];
          s += `<rect x="${bx}" y="${y}" width="${bw}" height="52" rx="8" fill="rgba(255,255,255,.06)" stroke="var(--chalk)" stroke-width="2"></rect>`
            + `<text x="${bx + 16}" y="${y + 21}" fill="rgba(242,240,230,.72)" font-size="12">Bước ${i + 1} · ${b.muc}</text>`
            + `<text x="${bx + 16}" y="${y + 42}" fill="var(--accent)" font-size="18" font-weight="700">${b.phep} = ${b.kq} ${b.donvi}</text>`;
          if (i === K - 1 && shown === K) s += `<text x="${bx + bw - 14}" y="${y + 34}" fill="var(--warn)" font-size="15" font-weight="700" text-anchor="end">→ ĐÁP SỐ</text>`;
        } else {
          s += `<rect x="${bx}" y="${y}" width="${bw}" height="52" rx="8" fill="none" stroke="rgba(242,240,230,.25)" stroke-dasharray="6 5"></rect>`
            + `<text x="${bx + 16}" y="${y + 32}" fill="rgba(242,240,230,.4)" font-size="13">Bước ${i + 1}: ? (phải có kết quả bước trước mới tính được)</text>`;
        }
        if (i < K - 1) s += `<path d="M 280 ${y + 52} L 280 ${y + rh - 4} M 275 ${y + rh - 10} L 280 ${y + rh - 3} L 285 ${y + rh - 10}" stroke="rgba(242,240,230,.4)" stroke-width="2" fill="none"></path>`;
      }
      const H = 40 + K * rh + 12;
      host.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="cursor:ew-resize">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, steps = this.SS(), K = steps.length, shown = clamp(st.pStep, 0, K);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật (đề bài): ${L.de}. Đọc xong, đừng tính ngay — hãy vẽ SƠ ĐỒ xem có mấy bước.`, hint: 'Đưa tay ngang mở dần từng bước.' };
      if (s === 2) return { cap: `Sơ đồ: bài này có ${K} bước, đã mở ${shown}. Mỗi bước là MỘT phép tính kèm ĐƠN VỊ; bước sau dùng kết quả bước trước.`, hint: `Mở hết ${K} bước để thấy đáp số ở bước cuối.` };
      if (s === 3) return { cap: (shown === K ? `Đáp số (bước cuối ${K}): ${steps[K - 1].kq} ${steps[K - 1].donvi}. ` : `Mở đủ ${K} bước để thấy đáp số ở bước cuối. `) + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: bước đầu tiên phải tính gì (kèm đơn vị)? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const K = this.SS().length, shown = clamp(st.pStep, 0, K); return shown === K ? `đáp số = ${this.SS()[K - 1].kq} ${this.SS()[K - 1].donvi}` : `đã mở ${shown}/${K} bước`; },
    showFromStep() { return 2; },
    build3d(st) {
      const g = new THREE.Group(), K = this.SS().length;
      for (let i = 0; i < K; i++) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.6, 0.6), new THREE.MeshStandardMaterial({ roughness: .6 }));
        m.position.set(0, 1.2 - i * 0.8, 0); m.userData.stepIdx = i; g.add(m);
      }
      g.userData.stepsK = K;
      this.paint3d(g, st);
      return g;
    },
    paint3d(g, st) {
      const K = g.userData.stepsK, shown = clamp(st.pStep, 0, K);
      for (const m of g.children) {
        const i = m.userData.stepIdx; if (i == null) continue;
        const last = i === K - 1 && shown === K, on = i < shown;
        m.material.color.set(on ? (last ? 0xff8f6b : 0x5fb0a5) : 0x33414a);
        const tr = !on;
        if (m.material.transparent !== tr) { m.material.transparent = tr; m.material.needsUpdate = true; }
        m.material.opacity = on ? 1 : 0.25;
      }
    },
  },

  // ======================= Model: numcmp (so sánh số nhiều chữ số) =======================
  // Repo 'so-sanh-sap-xep': so SỐ CHỮ SỐ trước, rồi mới từ hàng cao nhất xuống;
  // đừng nhìn chữ số đầu mà kết luận (9 một chữ số < 10 hai chữ số).
  numcmp: {
    twoHands: true,
    defaults(st, L) { st.aLen = L.aLen; st.aHi = L.aHi; st.bLen = L.bLen; st.bHi = L.bHi; },
    cmp(st) { const aL = st.aLen, bL = st.bLen, aH = st.aHi, bH = st.bHi;
      if (aL !== bL) return { stage: 'số chữ số', a: aL, b: bL, v: aL > bL ? '>' : '<' };
      if (aH !== bH) return { stage: 'chữ số hàng cao nhất', a: aH, b: bH, v: aH > bH ? '>' : '<' };
      return { stage: 'hai hàng đầu đã bằng nhau', a: aH, b: bH, v: '=' }; },
    geomSig(st) { return 'numcmp' + st.aLen + ':' + st.aHi + ':' + st.bLen + ':' + st.bHi; },
    params() { return [
      { key: 'aLen', label: 'A · số chữ số', min: 1, max: 6 }, { key: 'aHi', label: 'A · chữ số đầu', min: 1, max: 9 },
      { key: 'bLen', label: 'B · số chữ số', min: 1, max: 6 }, { key: 'bHi', label: 'B · chữ số đầu', min: 1, max: 9 }]; },
    ctlHint() { return 'Đếm số ô để biết số nào NHIỀU chữ số hơn (chắc chắn lớn hơn, chưa cần đọc!). Đưa hai tay đổi CHỮ SỐ ĐẦU khi hai số bằng độ dài, hoặc bấm +/−.'; },
    tiles(st, side, len, hi, y) {
      const xs = 150, tw = 44, gap = 8, lab = side === 'A' ? 'var(--accent)' : '#7fc9bf';
      let s = `<text x="16" y="${y + 28}" fill="${lab}" font-size="16" font-weight="700">Số ${side}</text>`
        + `<text x="16" y="${y + 46}" fill="rgba(242,240,230,.6)" font-size="12">${len} chữ số</text>`;
      for (let i = 0; i < len; i++) { const bx = xs + i * (tw + gap), first = i === 0;
        s += `<rect x="${bx}" y="${y}" width="${tw}" height="44" rx="6" fill="${first ? (side === 'A' ? 'rgba(255,209,102,.75)' : 'rgba(127,201,191,.7)') : 'rgba(255,255,255,.06)'}" stroke="${first ? 'var(--chalk)' : 'rgba(242,240,230,.3)'}" stroke-width="${first ? 2 : 1}"></rect>`
          + `<text x="${bx + tw / 2}" y="${y + 30}" fill="#0e1b22" font-size="22" font-weight="700" text-anchor="middle">${first ? hi : '·'}</text>`; }
      return s;
    },
    draw2d(host, st) {
      const c = this.cmp(st), W = 560, H = 250;
      let s = this.tiles(st, 'A', st.aLen, st.aHi, 40) + this.tiles(st, 'B', st.bLen, st.bHi, 118);
      s += `<text x="${W - 30}" y="98" fill="var(--warn)" font-size="40" font-weight="700" text-anchor="middle">${c.v}</text>`;
      let note;
      if (c.v === '=') note = `Hai số có ${c.a} chữ số và cùng chữ số đầu ${c.a} → phải xét tiếp hàng thấp hơn.`;
      else if (c.stage === 'số chữ số') { const more = c.v === '>' ? 'A' : 'B'; note = `${more} có NHIỀU chữ số hơn (${Math.max(st.aLen, st.bLen)} so với ${Math.min(st.aLen, st.bLen)}) nên ${more} chắc chắn lớn hơn — chưa cần đọc hết!` + (c.a !== c.b && ((c.a > c.b && st.aHi < st.bHi) || (c.b > c.a && st.bHi < st.aHi)) ? ` (chú ý: chữ số đầu của số LỚN hơn lại NHỎ hơn — đừng nhìn chữ số đầu mà kết luận).` : ''); }
      else note = `Bằng số chữ số (${st.aLen}), so chữ số hàng cao nhất: ${c.a} ${c.v} ${c.b} → ${c.v === '>' ? 'A' : 'B'} lớn hơn.`;
      s += `<text x="${W / 2}" y="200" fill="var(--chalk)" font-size="13" text-anchor="middle">${note}</text>`
        + `<text x="${W / 2}" y="230" fill="var(--accent)" font-size="24" font-weight="700" text-anchor="middle">${st.aLen} chữ số (đầu ${st.aHi})  ${c.v}  ${st.bLen} chữ số (đầu ${st.bHi})</text>`;
      host.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, c = this.cmp(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: số A có ${st.aLen} chữ số (đầu ${st.aHi}), số B có ${st.bLen} chữ số (đầu ${st.bHi}). Nhìn ĐỘ DÀI dải ô: bên nào nhiều ô hơn là bên to hơn.`, hint: 'Đếm số ô, rồi đưa hai tay đổi chữ số đầu.' };
      if (s === 2) return { cap: `Sơ đồ: ${c.v === '=' ? 'hai số bằng độ dài và cùng chữ số đầu → xét tiếp hàng dưới.' : c.stage === 'số chữ số' ? `BƯỚC 1 — so SỐ CHỮ SỐ: ${Math.max(st.aLen, st.bLen)} > ${Math.min(st.aLen, st.bLen)} nên số nhiều chữ số hơn LỚN HƠN, chưa cần đọc.` : `BƯỚC 2 — bằng số chữ số, so từ HÀNG CAO NHẤT: ${c.a} ${c.v} ${c.b}.`}`, hint: 'Luôn theo thứ tự: số chữ số → rồi từng hàng từ cao xuống thấp.' };
      if (s === 3) return { cap: `Kết luận: A ${c.v} B (quyết bởi ${c.stage}). ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: số có 6 chữ số và số có 5 chữ số, chưa đọc chữ số nào — số nào lớn hơn? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const c = this.cmp(st); return `${st.aLen}cs ${c.v} ${st.bLen}cs · ${c.stage}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; // màn chiếu mirror qua CSS → đảo trục
        if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.aHi = clamp(l, 1, 5) + 4;   // 1..5 ngón → 5..9 (chữ số đầu đáng kể)
      if (r !== null) st.bHi = clamp(r, 1, 5) + 4;
    },
    build3d(st) {
      const g = new THREE.Group(), mkRow = (side, len, hi, z) => { const first = clamp(hi, 1, 9);
        for (let i = 0; i < len; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.55, i === 0 ? 0.35 + first * 0.12 : 0.55, 0.55),
          new THREE.MeshStandardMaterial({ color: i === 0 ? (side === 'A' ? 0xffd166 : 0x7fc9bf) : 0x4a5a66, roughness: .55 }));
          m.position.set((i - (len - 1) / 2) * 0.7, 0, z); g.add(m); } };
      mkRow('A', st.aLen, st.aHi, -0.9); mkRow('B', st.bLen, st.bHi, 0.9);
      return g;
    },
    paint3d() {},
  },
  dtable: {
    twoHands: true,
    data() { return {
      rows: [ ['An', 8, 6, 7], ['Bình', 5, 9, 4], ['Cường', 10, 8, 9], ['Dung', 7, 9, 8] ],
      cols: ['Toán', 'Tiếng Việt', 'Anh'] }; },
    avg(row) { return (row[1] + row[2] + row[3]) / 3; },
    at(st) { const d = this.data(), ri = clamp(st.dtRow, 0, 3), ci = clamp(st.dtCol, 0, 3);
      return { d, ri, ci, rl: d.rows[ri][0], cl: ci < 3 ? d.cols[ci] : 'TB',
        val: ci < 3 ? d.rows[ri][1 + ci] : this.avg(d.rows[ri]) }; },
    defaults(st, L) { st.dtRow = L.dtRow; st.dtCol = L.dtCol; },
    geomSig(st) { return 'dtable' + st.dtRow + ':' + st.dtCol; },
    params() { return [ { key: 'dtRow', label: 'Hàng · bạn', min: 0, max: 3 }, { key: 'dtCol', label: 'Cột · môn', min: 0, max: 3 }]; },
    ctlHint() { return 'Dóng NGANG theo tên HÀNG (bên trái) rồi dóng DỌC theo tên CỘT (trên đầu): hai dải gặp nhau ở ĐÚNG một ô. Đưa hai tay — trái chọn hàng, phải chọn cột — hoặc bấm +/−.'; },
    draw2d(host, st) {
      const { d, ri, ci, rl, cl, val } = this.at(st);
      const headers = d.cols.concat(['TB']);
      const x0 = 20, LW = 118, CW = 112, topY = 40, HH = 34, RH = 44;
      const colX = (j) => x0 + LW + j * CW, rowY = (i) => topY + HH + i * RH;
      const W = 600, H = topY + HH + 4 * RH + 40;
      let s = `<rect x="${x0}" y="${rowY(ri)}" width="${LW + 4 * CW}" height="${RH}" fill="rgba(255,209,102,.14)"></rect>`
        + `<rect x="${colX(ci)}" y="${topY}" width="${CW}" height="${HH + 4 * RH}" fill="rgba(127,201,191,.16)"></rect>`;
      s += `<text x="${x0 + 8}" y="${topY + 22}" fill="var(--chalk)" font-size="13" font-weight="700">Bạn</text>`;
      headers.forEach((hh, j) => { s += `<text x="${colX(j) + CW / 2}" y="${topY + 22}" fill="${j === ci ? '#7fc9bf' : 'var(--chalk)'}" font-size="${j === 2 ? 12 : 13}" font-weight="${j === ci ? 700 : 400}" text-anchor="middle">${hh}</text>`; });
      d.rows.forEach((r, i) => {
        s += `<text x="${x0 + 8}" y="${rowY(i) + 28}" fill="${i === ri ? 'var(--accent)' : 'rgba(242,240,230,.85)'}" font-size="14" font-weight="${i === ri ? 700 : 400}">${r[0]}</text>`;
        for (let j = 0; j < 4; j++) {
          const v = j < 3 ? r[1 + j] : this.avg(r), sel = (i === ri && j === ci);
          s += `<rect x="${colX(j) + 6}" y="${rowY(i) + 6}" width="${CW - 12}" height="${RH - 12}" rx="5" fill="${sel ? 'rgba(255,209,102,.92)' : 'rgba(255,255,255,.05)'}" stroke="${sel ? 'var(--warn)' : 'rgba(242,240,230,.18)'}" stroke-width="${sel ? 3 : 1}"></rect>`
            + `<text x="${colX(j) + CW / 2}" y="${rowY(i) + 28}" fill="${sel ? '#0e1b22' : 'var(--chalk)'}" font-size="15" font-weight="${sel ? 700 : 400}" text-anchor="middle">${v}</text>`;
        } });
      s += `<text x="${W / 2}" y="${H - 14}" fill="var(--chalk)" font-size="13" text-anchor="middle">Hàng ${rl} (dải vàng) dóng × cột ${cl} (dải xám) → gặp nhau ở ô ${val}</text>`;
      host.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, { d, ri, ci, rl, cl, val } = this.at(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: đây là BẢNG ĐIỂM của 4 bạn, mỗi bạn 3 môn và một cột trung bình. Đọc bảng là DÓNG theo hàng và cột — không đoán, không nhìn lướt sang ô bên cạnh.`, hint: 'Đưa hai tay để chọn hàng và cột đang dóng.' };
      if (s === 2) return { cap: `Sơ đồ: dóng NGANG theo tên hàng "${rl}" (dải vàng) và dóng DỌC theo tên cột "${cl}" (dải xám); hai dải cắt nhau ở ĐÚNG một ô = ${val}. Nếu dóng sai một hàng là đọc nhầm sang bạn ngồi bên cạnh.`, hint: 'Nhớ: phải dóng CẢ tên hàng lẫn tên cột.' };
      if (s === 3) return { cap: (ci === 3 ? `Trung bình của ${rl} = (${d.rows[ri][1]} + ${d.rows[ri][2]} + ${d.rows[ri][3]}) : 3 môn = ${d.rows[ri][1] + d.rows[ri][2] + d.rows[ri][3]} : 3 = ${val}. ` : `Ô đang dóng: ${rl} · ${cl} = ${val}. `) + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: muốn biết điểm môn Tiếng Việt của bạn Bình, em dóng hàng nào trước rồi dóng cột nào? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const a = this.at(st); return `Ô ${a.rl} · ${a.cl} = ${a.val}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x;
        if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.dtRow = clamp(l, 0, 3);
      if (r !== null) st.dtCol = clamp(r, 0, 3);
    },
    build3d(st) {
      const g = new THREE.Group(), ri = clamp(st.dtRow, 0, 3), ci = clamp(st.dtCol, 0, 3);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const sel = (i === ri && j === ci), band = (i === ri || j === ci), h = sel ? 0.95 : band ? 0.45 : 0.2;
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.6, h, 0.6),
          new THREE.MeshStandardMaterial({ color: sel ? 0xffd166 : band ? 0x7fc9bf : 0x4a5a66, roughness: .55 }));
        m.position.set((j - 1.5) * 0.75, h / 2, (i - 1.5) * 0.75); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  borrow: {
    twoHands: true,
    defaults(st, L) { st.boT = L.boT; st.boO = L.boO; st.bsT = L.bsT; st.bsO = L.bsO; },
    calc(st) {
      const minuend = st.boT * 10 + st.boO, sub = st.bsT * 10 + st.bsO, result = minuend - sub;
      return { minuend, sub, result, borrowed: st.boO < st.bsO, neg: result < 0,
        oD: result >= 0 ? result % 10 : null, tD: result >= 0 ? Math.floor(result / 10) : null }; },
    geomSig(st) { return 'borrow' + st.boT + ':' + st.boO + ':' + st.bsT + ':' + st.bsO; },
    params() { return [
      { key: 'boT', label: 'Bị trừ · bó chục', min: 1, max: 6 }, { key: 'boO', label: 'Bị trừ · que lẻ', min: 0, max: 9 },
      { key: 'bsT', label: 'Trừ · bó chục', min: 0, max: 6 }, { key: 'bsO', label: 'Trừ · que lẻ', min: 0, max: 9 }]; },
    ctlHint() { return 'Hàng đơn vị: nếu SỐ QUE LẺ ít hơn số que phải bớt thì KHÔNG trừ được → app vẽ MƯỢN 1 bó chục rồi cởi bó đó thành đúng 10 que. Đưa hai tay — trái = que lẻ số bị trừ, phải = số que phải bớt (+/− chỉnh số bó chục).'; },
    draw2d(host, st) {
      const c = this.calc(st), W = 560, H = 250;
      const bundle = (x, y) => `<rect x="${x}" y="${y}" width="15" height="26" rx="4" fill="rgba(127,201,191,.28)" stroke="#7fc9bf" stroke-width="1.4"></rect><line x1="${x + 2}" y1="${y + 8}" x2="${x + 13}" y2="${y + 8}" stroke="#7fc9bf"></line><line x1="${x + 2}" y1="${y + 18}" x2="${x + 13}" y2="${y + 18}" stroke="#7fc9bf"></line>`;
      const stick = (x, y, col, cross) => `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 24}" stroke="${col || 'var(--chalk)'}" stroke-width="2"></line>` + (cross ? `<line x1="${x - 4}" y1="${y - 2}" x2="${x + 4}" y2="${y + 26}" stroke="var(--warn)" stroke-width="2"></line>` : '');
      const rowPiles = (tens, ones, y, xB, borrowed) => {
        let s = ''; const xT = xB;
        for (let i = 0; i < tens; i++) s += bundle(xT + i * 20, y - 6);
        if (borrowed) s += `<text x="${xT + tens * 20 + 4}" y="${y + 10}" fill="#7fc9bf" font-size="11">+10</text>`;
        const xS = xB + (tens + (borrowed ? 2 : 0)) * 20 + 24;
        for (let i = 0; i < ones; i++) s += stick(xS + i * 9, y - 4, null, false);
        return { g: s, xS };
      };
      let s = '';
      s += `<text x="16" y="30" fill="var(--accent)" font-size="13" font-weight="700">Số bị trừ = ${c.minuend}</text>`;
      s += rowPiles(c.borrowed ? st.boT - 1 : st.boT, c.borrowed ? st.boO + 10 : st.boO, 44, 150, c.borrowed).g;
      s += `<text x="16" y="96" fill="var(--warn)" font-size="13" font-weight="700">Số trừ = ${c.sub}</text>`;
      const rS = rowPiles(st.bsT, st.bsO, 110, 150, false).g; s += rS;
      s += `<text x="120" y="108" fill="var(--warn)" font-size="22" font-weight="700">−</text><line x1="150" y1="140" x2="500" y2="140" stroke="var(--chalk)" stroke-width="1.4"></line>`;
      if (!c.neg) {
        s += `<text x="16" y="176" fill="var(--chalk)" font-size="13" font-weight="700">Hiệu = ${c.result}</text>`;
        s += rowPiles(c.tD, c.oD, 190, 150, false).g;
      } else s += `<text x="16" y="176" fill="var(--warn)" font-size="13" font-weight="700">Số bị trừ bé hơn số trừ — lớp 4 chưa trừ được, phải đổi chỗ (lớn trừ nhỏ).</text>`;
      let note;
      if (c.neg) note = 'Đặt tính: số to ở trên, số nhỏ ở dưới.';
      else if (c.borrowed) note = `Đơn vị: ${st.boO} − ${st.bsO} không đủ → mượn 1 bó (còn ${st.boT - 1} bó) thành ${st.boO + 10} − ${st.bsO} = ${c.oD}. Chục: ${st.boT - 1} − ${st.bsT} = ${c.tD}.`;
      else note = `Đơn vị: ${st.boO} − ${st.bsO} = ${c.oD}. Chục: ${st.boT} − ${st.bsT} = ${c.tD}. Không phải mượn.`;
      s += `<text x="${W / 2}" y="236" fill="var(--chalk)" font-size="12.5" text-anchor="middle">${note}</text>`;
      host.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, c = this.calc(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${st.boT} bó chục và ${st.boO} que lẻ (= ${c.minuend}). Phải bớt ${st.bsT} bó và ${st.bsO} que (= ${c.sub}). Hàng đơn vị chỉ có ${st.boO} que mà phải bớt ${st.bsO} que — ${c.borrowed ? 'KHÔNG ĐỦ!' : 'đủ, trừ thẳng.'}`, hint: 'Đưa hai tay đổi số que lẻ và số que phải bớt.' };
      if (s === 2) return { cap: c.borrowed ? `Sơ đồ: mượn 1 bó của hàng chục (còn ${st.boT - 1} bó), CỜI bó đó thành đúng 10 que rời → hàng đơn vị thành ${st.boO} + 10 = ${st.boO + 10} que.` : `Sơ đồ: hàng đơn vị đủ nên KHÔNG cần mượn; trừ từng hàng từ phải sang trái.`, hint: 'Mượn ở hàng trên = trừ bớt 1 bó của hàng bên trái.' };
      if (s === 3) return { cap: (c.neg ? `Số bị trừ bé hơn số trừ nên chưa trừ được. ` : `Hiệu = ${c.result}. `) + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: 4 bó 3 que (43) trừ 2 bó 8 que (28) — hàng đơn vị có phải MƯỢN không? Giơ tay, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const c = this.calc(st); return c.neg ? `${c.minuend} − ${c.sub}: không trừ được` : `${c.minuend} − ${c.sub} = ${c.result}${c.borrowed ? ' (có mượn)' : ''}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x;
        if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.boO = clamp(l, 0, 9);
      if (r !== null) st.bsO = clamp(r, 0, 9);
    },
    build3d(st) {
      const g = new THREE.Group(), c = this.calc(st); if (c.neg) return g;
      for (let i = 0; i < c.tD; i++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.2, 14),
        new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: .5 })); m.position.set((i - (c.tD - 1) / 2) * 0.5, 0.6, -0.6); g.add(m); }
      for (let i = 0; i < c.oD; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.85, 0.12),
        new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: .5 })); m.position.set((i - (c.oD - 1) / 2) * 0.32, 0.45, 0.7); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  chooser: {
    defaults(st, L) { st.chSel = (L.chSel != null ? L.chSel : 0); },
    list() { return (cur().opts || []); },
    geomSig(st) { return 'chooser' + this.list().map((o) => o.n).join('|') + ':' + st.chSel; },
    params() { const n = Math.max(1, this.list().length); return [ { key: 'chSel', label: 'Phương án', min: 0, max: n - 1 }]; },
    ctlHint() { return 'Giơ ngón tay = chọn phương án (1 ngón → phương án 1). Cả lớp THỐNG NHẤT một chiến lược/công thức/vật TRƯỚC khi tính — đó mới là ý bài ôn tập.'; },
    wrap(txt, max) { const w = String(txt).split(' '); const lines = []; let c = '';
      for (const t of w) { if ((c + ' ' + t).trim().length > max) { if (c) lines.push(c.trim()); c = t; } else c += ' ' + t; } if (c) lines.push(c.trim()); return lines; },
    draw2d(host, st) {
      const L = cur(), o = this.list(), n = Math.max(1, o.length), sel = clamp(st.chSel, 0, n - 1);
      const W = 560, H = 260, mx = 14, gap = 10, cw = (W - 2 * mx - (n - 1) * gap) / n, cardY = 62, cardH = 96;
      let s = '';
      this.wrap(L.de || L.ten, 62).slice(0, 2).forEach((ln, i) => { s += `<text x="${W / 2}" y="${24 + i * 18}" fill="var(--chalk)" font-size="13" text-anchor="middle">${ln}</text>`; });
      for (let i = 0; i < n; i++) {
        const x = mx + i * (cw + gap), isSel = i === sel;
        const fill = isSel ? (o[i].ok ? 'rgba(255,209,102,.16)' : 'rgba(240,90,90,.16)') : 'rgba(255,255,255,.05)';
        const stroke = isSel ? (o[i].ok ? 'var(--accent)' : 'var(--warn)') : 'rgba(242,240,230,.25)';
        s += `<rect x="${x}" y="${cardY}" width="${cw}" height="${cardH}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${isSel ? 3 : 1.2}"></rect>`
          + `<circle cx="${x + 16}" cy="${cardY + 16}" r="11" fill="${isSel ? stroke : 'rgba(242,240,230,.2)'}"></circle>`
          + `<text x="${x + 16}" y="${cardY + 20}" fill="#0e1b22" font-size="12" font-weight="700" text-anchor="middle">${i + 1}</text>`;
        this.wrap(o[i].n, Math.floor(cw / 6.4)).slice(0, 3).forEach((ln, k) => { s += `<text x="${x + cw / 2}" y="${cardY + 44 + k * 15}" fill="var(--chalk)" font-size="11.5" font-weight="${isSel ? 700 : 400}" text-anchor="middle">${ln}</text>`; });
      }
      const det = o[sel] ? o[sel].d : '', dy = cardY + cardH + 18;
      this.wrap(det, 76).slice(0, 3).forEach((ln, i) => { s += `<text x="${W / 2}" y="${dy + i * 16}" fill="${o[sel] && o[sel].ok ? 'var(--accent)' : 'var(--chalk)'}" font-size="12.5" text-anchor="middle">${ln}</text>`; });
      const verdict = o[sel] && o[sel].ok ? '✓ Đúng rồi — chốt cách này rồi mới tính' : '✗ Chưa khớp — đề không hỏi cách này';
      s += `<text x="${W / 2}" y="${H - 8}" fill="${o[sel] && o[sel].ok ? 'var(--accent)' : 'var(--warn)'}" font-size="15" font-weight="700" text-anchor="middle">${verdict}</text>`;
      host.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, o = this.list(), sel = clamp(st.chSel, 0, Math.max(0, o.length - 1)), c = o[sel] || {};
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: đề bài — ${L.de || L.ten}`, hint: 'Đừng tính vội. Hãy chọn cách làm.' };
      if (s === 2) return { cap: `Sơ đồ: cả lớp giơ tay chọn phương án. Đang chọn: ${c.n || '—'}. ${c.d || ''}`, hint: 'Giơ ngón tay 1…' + o.length + ' để đổi phương án.' };
      if (s === 3) return { cap: (c.ok ? `Chốt đúng: ${c.n}. ` : `Phương án "${c.n || '—'}" chưa khớp. `) + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: bài này nên ${L.chien_luoc || 'chọn cách nào'} — em giơ tay chọn phương án. Cô đếm, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const o = this.list(), sel = clamp(st.chSel, 0, Math.max(0, o.length - 1)); return `Chọn: ${(o[sel] && o[sel].n) || '—'} · ${(o[sel] && o[sel].ok) ? 'đúng' : 'thử lại'}`; },
    showFromStep() { return 2; },
    hand(st, f) { const n = Math.max(1, this.list().length); st.chSel = clamp(f, 1, n) - 1; },
    handLabel(f) { const o = this.list(), i = clamp(f, 1, Math.max(1, o.length)) - 1; return (o[i] && o[i].n) || ('phương án ' + (i + 1)); },
    build3d(st) {
      const g = new THREE.Group(), o = this.list(), n = Math.max(1, o.length), sel = clamp(st.chSel, 0, n - 1);
      for (let i = 0; i < n; i++) { const h = i === sel ? 1.1 : 0.45;
        const col = i === sel ? (o[i].ok ? 0xffd166 : 0xf05a5a) : 0x4a5a66;
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.7, h, 0.7), new THREE.MeshStandardMaterial({ color: col, roughness: .55 }));
        m.position.set((i - (n - 1) / 2) * 0.9, h / 2, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  // ======================= Model: money (Tiền Việt Nam — đếm ví + tính tiền thối) =======================
  // beyond-bank: SGK lớp 4 có mạch "Tiền Việt Nam" (đọc tờ bạc, cộng thành tổng tiền, mua hàng tìm
  // tiền thối) nhưng bank giáo án chưa có cụm này → thêm MỘT mô hình MỚI + một dòng LESSONS. Ý cốt
  // (đúng lỗi hay mắc): đếm theo TỪNG mệnh giá rồi mới cộng; trả > giá → phần hơn là TIỀN THỐI, < giá → còn THIẾU.
  money: {
    denoms() { return [2000, 5000, 10000, 20000]; },
    colors() { return [['#7a5aa0', '#b89adb'], ['#3f9e57', '#79cf8c'], ['#2f77c2', '#6aa8e6'], ['#c65a2e', '#e79a6b']]; },
    keys() { return ['mnC0', 'mnC1', 'mnC2', 'mnC3']; },
    counts(st) { return [st.mnC0, st.mnC1, st.mnC2, st.mnC3]; },
    fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); },
    total(st) { const d = this.denoms(), c = this.counts(st); return d.reduce((s, x, i) => s + x * c[i], 0); },
    status(st) { const t = this.total(st), p = st.mnPrice;
      if (p <= 0) return { k: 'none', txt: `Tổng trong ví: ${this.fmt(t)} đồng.` };
      if (t === p) return { k: 'exact', txt: `Vừa đủ ${this.fmt(t)} đồng — không phải thối.` };
      if (t > p) return { k: 'over', txt: `Đủ — trả ${this.fmt(t)}, giá ${this.fmt(p)} → TIỀN THỐI ${this.fmt(t - p)} đồng.` };
      return { k: 'short', txt: `Chưa đủ — mới có ${this.fmt(t)}, còn THIẾU ${this.fmt(p - t)} đồng.` }; },
    defaults(st, L) { st.mnC0 = L.mnC0; st.mnC1 = L.mnC1; st.mnC2 = L.mnC2; st.mnC3 = L.mnC3; st.mnSel = (L.mnSel != null ? L.mnSel : 0); st.mnPrice = L.mnPrice; },
    geomSig(st) { return 'money' + this.counts(st).join('') + st.mnPrice + st.mnSel; },
    params() { const d = this.denoms();
      return d.map((x, i) => ({ key: this.keys()[i], label: 'Số tờ ' + this.fmt(x), min: 0, max: 9 }))
        .concat([{ key: 'mnPrice', label: 'Giá món hàng (đồng)', min: 0, max: 200000, step: 1000 }]); },
    toggles() { return []; },
    ctlHint() { return 'Bấm một xấp tiền để CHỌN, giơ 0–5 ngón = số tờ của xấp đó, hoặc +/− từng loại và giá món hàng.'; },
    draw2d(host, st) {
      const d = this.denoms(), cnt = this.counts(st), col = this.colors(), sel = clamp(st.mnSel, 0, 3), stt = this.status(st);
      const W = 548, Hh = 258, mx = 16, gap = 10, cw = (W - 2 * mx - 3 * gap) / 4, topY = 42, noteH = 30;
      let s = '';
      for (let i = 0; i < 4; i++) {
        const x = mx + i * (cw + gap), isSel = i === sel;
        s += `<g data-mns="${i}" style="cursor:pointer">`
          + `<rect x="${x}" y="${topY}" width="${cw}" height="162" rx="8" fill="${isSel ? 'rgba(255,255,255,.08)' : 'transparent'}" stroke="${isSel ? 'var(--accent)' : 'rgba(242,240,230,.15)'}" stroke-width="${isSel ? 2.5 : 1}"></rect>`
          + `<text x="${x + cw / 2}" y="${topY + 14}" fill="var(--chalk)" font-size="12.5" text-anchor="middle" font-weight="${isSel ? 700 : 400}">Tờ ${this.fmt(d[i])}</text>`;
        const shown = Math.min(cnt[i], 7);
        for (let k = 0; k < shown; k++) {
          const ny = topY + 20 + k * 15;
          s += `<rect x="${x + 8}" y="${ny}" width="${cw - 16}" height="${noteH}" rx="4" fill="${col[i][1]}" stroke="${col[i][0]}" stroke-width="1.5"></rect>`;
          if (k === shown - 1) s += `<text x="${x + cw / 2}" y="${ny + noteH / 2 + 4}" fill="#0e1b22" font-size="11.5" font-weight="700" text-anchor="middle">${this.fmt(d[i])}</text>`;
        }
        if (cnt[i] === 0) s += `<text x="${x + cw / 2}" y="${topY + 74}" fill="rgba(242,240,230,.35)" font-size="18" text-anchor="middle">—</text>`;
        s += `<text x="${x + cw / 2}" y="${topY + 178}" fill="${isSel ? 'var(--accent)' : 'rgba(242,240,230,.72)'}" font-size="12.5" text-anchor="middle" font-weight="700">${cnt[i]} tờ = ${this.fmt(d[i] * cnt[i])}</text>`;
        s += `</g>`;
      }
      host.innerHTML = `<svg id="money" width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">`
        + `<text x="${mx}" y="22" fill="rgba(242,240,230,.72)" font-size="13">Ví tiền — đếm theo từng mệnh giá rồi cộng · giá món hàng: ${this.fmt(st.mnPrice)} đồng</text>`
        + s
        + `<text x="${W / 2}" y="${Hh - 6}" fill="${stt.k === 'short' ? 'var(--warn)' : 'var(--accent)'}" font-size="14.5" font-weight="700" text-anchor="middle">${stt.txt}</text>`
        + `</svg>`;
      const svg = host.querySelector('#money');
      svg.querySelectorAll('g[data-mns]').forEach((g) => g.addEventListener('pointerdown', () => { state.mnSel = +g.dataset.mns; drawVisual(); render(); }));
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.denoms(), cnt = this.counts(st), t = this.total(st), stt = this.status(st);
      const terms = d.map((x, i) => cnt[i] ? `${cnt[i]} × ${this.fmt(x)}` : null).filter(Boolean).join(' + ') || '0';
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ví có ${cnt.map((c, i) => c ? `${c} tờ ${this.fmt(d[i])}` : null).filter(Boolean).join(', ') || 'chưa có tờ nào'}.`, hint: 'Bấm xấp tiền để chọn, giơ ngón tay đặt số tờ mỗi loại.' };
      if (s === 2) return { cap: `Sơ đồ: cộng theo mệnh giá → ${terms} = ${this.fmt(t)} đồng.`, hint: 'Đếm từng loại rồi mới cộng, đừng gộp nhầm mệnh giá.' };
      if (s === 3) return { cap: `${stt.txt} ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: với món hàng giá ${this.fmt(st.mnPrice)} đồng, đưa ví này là vừa đủ, phải thối lại, hay còn thiếu? Cô đếm tay, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const t = this.total(st), p = st.mnPrice, k = this.status(st).k;
      return `Ví ${this.fmt(t)}đ · ${k === 'none' ? '—' : k === 'exact' ? 'vừa đủ' : k === 'over' ? `thối ${this.fmt(t - p)}đ` : `thiếu ${this.fmt(p - t)}đ`}`; },
    showFromStep() { return 2; },
    hand(st, f) { st[this.keys()[clamp(st.mnSel, 0, 3)]] = clamp(f, 0, 9); },
    handLabel(f, st) { const d = this.denoms(), i = clamp(st.mnSel, 0, 3); return `→ ${clamp(f, 0, 9)} tờ ${this.fmt(d[i])}`; },
    build3d(st) {
      const g = new THREE.Group(), cnt = this.counts(st), col = this.colors();
      for (let i = 0; i < 4; i++) { const x = (i - 1.5) * 1.6, hex = parseInt(col[i][1].slice(1), 16);
        for (let k = 0; k < cnt[i]; k++) {
          const m = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 0.8), new THREE.MeshStandardMaterial({ color: hex, roughness: .6 }));
          m.position.set(x, 0.05 + k * 0.08, 0); g.add(m); } }
      return g;
    },
    paint3d() {},
  },
  // ======================= Model: divis (dấu hiệu chia hết 2·5·3·9 — beyond-bank) =======================
  // SGK lớp 4 có mạch "dấu hiệu chia hết" nhưng bank 39 cụm chưa có → thêm MỘT mô hình MỚI + dòng LESSONS.
  // Ý cốt + chặn LỖI KINH ĐIỂN: chia hết cho 2·5 nhìn CHỮ SỐ TẬN CÙNG, còn 3·9 nhìn TỔNG các chữ số —
  // học trò hay nhầm lấy chữ số cuối để xét 3/9. Hai tay dựng chữ số hàng chục | hàng đơn vị.
  divis: {
    twoHands: true,
    defaults(st, L) { st.dvT = L.dvT; st.dvU = L.dvU; },
    num(st) { return st.dvT * 10 + st.dvU; },
    sum(st) { return st.dvT + st.dvU; },
    tests(st) { const last = st.dvU, s = this.sum(st); return [
      { d: 2, ok: last % 2 === 0, why: `tận cùng ${last} ${last % 2 === 0 ? 'chẵn' : 'lẻ'}` },
      { d: 5, ok: last === 0 || last === 5, why: `tận cùng ${last} ${last === 0 || last === 5 ? 'là 0/5' : '≠ 0,5'}` },
      { d: 3, ok: s % 3 === 0, why: `${st.dvT}+${st.dvU}=${s} ${s % 3 === 0 ? '⋮ 3' : 'không ⋮ 3'}` },
      { d: 9, ok: s % 9 === 0, why: `${st.dvT}+${st.dvU}=${s} ${s % 9 === 0 ? '⋮ 9' : 'không ⋮ 9'}` },
    ]; },
    geomSig(st) { return 'divis' + st.dvT + ':' + st.dvU; },
    params() { return [
      { key: 'dvT', label: 'Chữ số hàng chục', min: 0, max: 9 }, { key: 'dvU', label: 'Chữ số hàng đơn vị', min: 0, max: 9 }]; },
    ctlHint() { return 'Tay TRÁI đặt chữ số hàng chục, tay PHẢI đặt chữ số hàng đơn vị (giơ 0–5 ngón, +/− tới 9). Số đổi → bốn dấu hiệu cập nhật ngay.'; },
    cell(x, y, w, digit, lab, tint) {
      return `<rect x="${x}" y="${y}" width="${w}" height="70" rx="8" fill="${tint}" stroke="var(--chalk)" stroke-width="2"></rect>`
        + `<text x="${x + w / 2}" y="${y - 7}" fill="rgba(242,240,230,.6)" font-size="11.5" text-anchor="middle">${lab}</text>`
        + `<text x="${x + w / 2}" y="${y + 47}" fill="#0e1b22" font-size="40" font-weight="700" text-anchor="middle">${digit}</text>`;
    },
    draw2d(host, st) {
      const n = this.num(st), ts = this.tests(st), W = 548, Hh = 258;
      let s = `<text x="${W / 2}" y="30" fill="var(--chalk)" font-size="22" font-weight="700" text-anchor="middle">Số ${n}</text>`;
      s += this.cell(150, 62, 70, st.dvT, 'hàng chục', 'rgba(127,201,191,.85)')
        + this.cell(260, 62, 70, st.dvU, 'hàng đơn vị (TẬN CÙNG)', 'rgba(255,209,102,.9)');
      s += `<text x="40" y="172" fill="rgba(242,240,230,.72)" font-size="12.5">2 · 5 → nhìn tận cùng (${st.dvU})   |   3 · 9 → nhìn tổng ${st.dvT} + ${st.dvU} = ${this.sum(st)}</text>`;
      let bx = 52;
      for (const t of ts) { const col = t.ok ? 'var(--accent)' : 'var(--warn)';
        s += `<g><rect x="${bx}" y="196" width="104" height="46" rx="8" fill="${t.ok ? 'rgba(255,209,102,.16)' : 'rgba(240,90,90,.14)'}" stroke="${col}" stroke-width="2"></rect>`
          + `<text x="${bx + 52}" y="216" fill="${col}" font-size="13" font-weight="700" text-anchor="middle">${n} ${t.ok ? '✓' : '✗'} ⋮ ${t.d}</text>`
          + `<text x="${bx + 52}" y="233" fill="rgba(242,240,230,.7)" font-size="10" text-anchor="middle">${t.why}</text></g>`;
        bx += 112; }
      host.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, n = this.num(st), ts = this.tests(st);
      const yes = ts.filter((t) => t.ok).map((t) => t.d), no = ts.filter((t) => !t.ok).map((t) => t.d);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hai bàn tay dựng số ${n} — tay trái ${st.dvT} chục, tay phải ${st.dvU} đơn vị.`, hint: 'Đưa hai tay đổi từng chữ số, hoặc +/−.' };
      if (s === 2) return { cap: `Sơ đồ: xét 2 · 5 bằng CHỮ SỐ TẬN CÙNG (${st.dvU}); xét 3 · 9 bằng TỔNG các chữ số (${st.dvT} + ${st.dvU} = ${this.sum(st)}).`, hint: 'Đừng lấy chữ số cuối để xét 3 hay 9 — đó là lỗi kinh điển.' };
      if (s === 3) return { cap: `${n} chia hết cho ${yes.length ? yes.join(' · ') : 'không có số nào trong 2,3,5,9'}${no.length ? `; KHÔNG chia hết cho ${no.join(' · ')}` : ''}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: số ${n} chia hết cho những số nào trong 2, 5, 3, 9? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const n = this.num(st), yes = this.tests(st).filter((t) => t.ok).map((t) => t.d); return `${n} · ${yes.length ? '⋮ ' + yes.join(', ') : 'không ⋮ 2·3·5·9'}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.dvT = clamp(l, 0, 9);
      if (r !== null) st.dvU = clamp(r, 0, 9);
    },
    build3d(st) {
      const g = new THREE.Group(), ten = clamp(st.dvT, 0, 9), un = clamp(st.dvU, 0, 9);
      for (let k = 0; k < ten; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.2, 0.26), new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: .55 })); m.position.set((k - 4) * 0.34, 0.6, -1); g.add(m); }
      for (let k = 0; k < un; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.32), new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: .5 })); m.position.set((k % 5 - 2) * 0.5, 0.2, 1 + Math.floor(k / 5) * 0.5); g.add(m); }
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: piechart (biểu đồ hình quạt) =======================
  // beyond-bank THỨ 3: SGK lớp 5 có mạch "Biểu đồ hình quạt" (đọc quạt → phần trăm của tổng) nhưng
  // bank 39 cụm chưa có → thêm MỘT MODELS MỚI + một dòng LESSONS. Ý cốt + lỗi kinh điển: CẢ hình tròn
  // = 100% của TỔNG; mỗi quạt = số của nhóm CHIA tổng × 100. Hay nhầm "quạt to = nhiều em" mà quên mất
  // chuẩn 100%, hoặc nhầm đọc số tuyệt đối trên quạt. Số em đổi → quạt chia lại đúng tỉ lệ ngay.
  piechart: {
    cats() { return ['Bóng đá', 'Bơi lội', 'Đọc sách', 'Nhảy dây']; },
    colors() { return [['#c65a2e', '#e79a6b'], ['#3f9e57', '#79cf8c'], ['#2f77c2', '#6aa8e6'], ['#7a5aa0', '#b89adb']]; },
    keys() { return ['pc0', 'pc1', 'pc2', 'pc3']; },
    vals(st) { return [st.pc0, st.pc1, st.pc2, st.pc3]; },
    total(st) { const v = this.vals(st); return v[0] + v[1] + v[2] + v[3]; },
    pctTxt(p) { const s = Math.round(p * 10) / 10; return (s % 1 === 0) ? String(s) : s.toFixed(1); },
    pc(st, i) { const t = this.total(st); return t > 0 ? this.pctTxt(this.vals(st)[i] / t * 100) : '0'; },
    mm(st) { const v = this.vals(st); let mi = 0, ma = 0; for (let i = 1; i < 4; i++) { if (v[i] > v[ma]) ma = i; if (v[i] < v[mi]) mi = i; } return { mi, ma }; },
    arc(cx, cy, r, a0, a1) {
      const x0 = cx + r * Math.sin(a0), y0 = cy - r * Math.cos(a0), x1 = cx + r * Math.sin(a1), y1 = cy - r * Math.cos(a1);
      const large = (a1 - a0) > Math.PI ? 1 : 0;
      return `M ${cx.toFixed(2)} ${cy.toFixed(2)} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
    },
    defaults(st, L) { st.pc0 = L.pc0; st.pc1 = L.pc1; st.pc2 = L.pc2; st.pc3 = L.pc3; st.pcSel = (L.pcSel != null ? L.pcSel : 0); },
    geomSig(st) { return 'pc' + this.vals(st).join(':') + ':' + clamp(st.pcSel, 0, 3); },
    params() { const c = this.cats(); return c.map((x, i) => ({ key: this.keys()[i], label: 'Số em · ' + x, min: 0, max: 20 })); },
    ctlHint() { return 'Bấm một nhóm (hoặc một quạt) để CHỌN, giơ 0–5 ngón đặt số em cho nhóm đó, hoặc +/− từng nhóm. Biểu đồ chia lại đúng tỉ lệ ngay.'; },
    draw2d(host, st) {
      const v = this.vals(st), t = this.total(st), col = this.colors(), cats = this.cats(),
        sel = clamp(st.pcSel, 0, 3), W = 548, Hh = 258, cx = 148, cy = 138, r = 96;
      let s = '';
      if (t > 0) {
        let a0 = 0;
        for (let i = 0; i < 4; i++) {
          if (v[i] <= 0) continue;
          const frac = v[i] / t, a1 = a0 + frac * Math.PI * 2, isSel = i === sel, rr = isSel ? r + 6 : r;
          const shape = frac >= 0.9999
            ? `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${col[i][1]}" stroke="${isSel ? 'var(--accent)' : col[i][0]}" stroke-width="${isSel ? 3 : 1.5}"></circle>`
            : `<path d="${this.arc(cx, cy, rr, a0, a1)}" fill="${col[i][1]}" stroke="${isSel ? 'var(--accent)' : col[i][0]}" stroke-width="${isSel ? 3 : 1.5}"></path>`;
          s += `<g data-pcs="${i}" style="cursor:pointer">` + shape + `</g>`;
          if (frac >= 0.06) { const mid = (a0 + a1) / 2, lr = rr * 0.62;
            s += `<text x="${(cx + Math.sin(mid) * lr).toFixed(1)}" y="${(cy - Math.cos(mid) * lr + 4).toFixed(1)}" fill="#0e1b22" font-size="12.5" font-weight="700" text-anchor="middle">${this.pctTxt(frac * 100)}%</text>`; }
          a0 = a1;
        }
      } else {
        s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(242,240,230,.3)" stroke-dasharray="5 5"></circle>`
          + `<text x="${cx}" y="${cy + 4}" fill="rgba(242,240,230,.4)" font-size="13" text-anchor="middle">chưa có số liệu</text>`;
      }
      const lx = 292; let ly = 74;
      s += `<text x="${lx}" y="42" fill="rgba(242,240,230,.72)" font-size="12.5">Bấm một nhóm để chọn:</text>`;
      for (let i = 0; i < 4; i++) { const isSel = i === sel;
        s += `<g data-pcs="${i}" style="cursor:pointer">`
          + `<rect x="${lx - 8}" y="${ly - 16}" width="252" height="30" rx="6" fill="${isSel ? 'rgba(255,255,255,.10)' : 'transparent'}" stroke="${isSel ? 'var(--accent)' : 'rgba(242,240,230,.18)'}" stroke-width="${isSel ? 2 : 1}"></rect>`
          + `<rect x="${lx}" y="${ly - 9}" width="16" height="16" rx="3" fill="${col[i][1]}" stroke="${col[i][0]}"></rect>`
          + `<text x="${lx + 26}" y="${ly + 4}" fill="var(--chalk)" font-size="13">${cats[i]}: ${v[i]} em · ${this.pc(st, i)}%</text></g>`;
        ly += 37; }
      host.innerHTML = `<svg id="piechart" width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">`
        + `<text x="16" y="22" fill="rgba(242,240,230,.72)" font-size="13">Biểu đồ hình quạt — cả hình tròn = ${t} em = 100%</text>`
        + s + `</svg>`;
      const svg = host.querySelector('#piechart');
      svg.querySelectorAll('g[data-pcs]').forEach((g) => g.addEventListener('pointerdown', () => { state.pcSel = +g.dataset.pcs; drawVisual(); render(); }));
    },
    caption(st) {
      const L = cur(), s = st.step, v = this.vals(st), t = this.total(st), cats = this.cats(), { mi, ma } = this.mm(st);
      const list = cats.map((c, i) => `${c} ${this.pc(st, i)}%`).join(', ');
      const diff = t > 0 ? this.pctTxt((v[ma] - v[mi]) / t * 100) : '0';
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: khảo sát sở thích của ${t} em — ${cats.map((c, i) => `${c}: ${v[i]} em`).join(', ')}.`, hint: 'Bấm nhóm để chọn, giơ ngón tay đặt số em cho nhóm đó, hoặc +/−.' };
      if (s === 2) return { cap: `Sơ đồ: lấy số em từng nhóm CHIA tổng ${t} rồi ×100 → ${list}. Các quạt cộng lại đúng 100%.`, hint: 'Cả hình tròn = 100%; quạt to hơn = nhiều phần trăm hơn.' };
      if (s === 3) return { cap: `${cats[ma]} được thích nhất (${this.pc(st, ma)}%), ${cats[mi]} ít nhất (${this.pc(st, mi)}%) — chênh nhau ${diff} phần trăm. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: môn nào chiếm quạt TO nhất, môn nào NHỎ nhất trên biểu đồ này? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const cats = this.cats(), { mi, ma } = this.mm(st);
      return this.total(st) > 0 ? `${cats[ma]} nhiều nhất ${this.pc(st, ma)}% · ${cats[mi]} ít nhất ${this.pc(st, mi)}%` : 'chưa có số liệu'; },
    showFromStep() { return 2; },
    hand(st, f) { st[this.keys()[clamp(st.pcSel, 0, 3)]] = clamp(f, 0, 20); },
    handLabel(f, st) { const cats = this.cats(), i = clamp(st.pcSel, 0, 3); return `→ ${cats[i]} = ${clamp(f, 0, 20)} em`; },
    build3d(st) {
      const g = new THREE.Group(), v = this.vals(st), t = this.total(st), col = this.colors();
      if (t <= 0) return g;
      let a0 = 0;
      for (let i = 0; i < 4; i++) { if (v[i] <= 0) continue; const ang = (v[i] / t) * Math.PI * 2;
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.5, 30, 1, false, a0, ang),
          new THREE.MeshStandardMaterial({ color: parseInt(col[i][1].slice(1), 16), roughness: .55 }));
        g.add(mesh); a0 += ang; }
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: line (biểu đồ đoạn thẳng) =======================
  // beyond-bank THỨ 4: SGK lớp 5 có "Biểu đồ đoạn thẳng" (nhiệt độ trong ngày, số liệu theo thời gian) —
  // họ biểu đồ lớp 4-5 giờ đủ cả BA kiểu: cột (so sánh), quạt (% của tổng), đoạn thẳng (XU THẾ theo thời gian).
  // bank 39 cụm chưa có. Ý cốt + lỗi kinh điển: trục NGANG = thời gian, trục DỌC = đại lượng; đọc giá trị
  // bằng cách DÓNG từ điểm ra trục, KHÔNG nhầm hai trục. Đoạn đi lên = tăng, đi xuống = giảm; điểm cao nhất = lớn nhất.
  line: {
    usesPalm: true,
    times() { return ['6h', '9h', '12h', '15h', '18h']; },
    tn() { return ['6 giờ', '9 giờ', '12 giờ', '15 giờ', '18 giờ']; },
    keys() { return ['lg0', 'lg1', 'lg2', 'lg3', 'lg4']; },
    vals(st) { return [st.lg0, st.lg1, st.lg2, st.lg3, st.lg4]; },
    defaults(st, L) { st.lg0 = L.lg0; st.lg1 = L.lg1; st.lg2 = L.lg2; st.lg3 = L.lg3; st.lg4 = L.lg4; st.lgR = (L.lgR != null ? L.lgR : 2); },
    geomSig(st) { return 'lg' + this.vals(st).join(':'); }, // lgR là vị trí con đọc → paint3d dời qua transform, không rebuild
    palmToValue(st, x) { st.lgR = clamp(Math.round((1 - x) * 4), 0, 4); },
    palmLabel(st) { const v = this.vals(st), r = clamp(st.lgR, 0, 4); return `đọc ${this.tn()[r]}: ${v[r]}°C`; },
    params() { const t = this.times(); const ps = t.map((x, i) => ({ key: this.keys()[i], label: x + ' (°C)', min: 0, max: 40 }));
      ps.push({ key: 'lgR', label: 'Con đọc (mốc 0–4)', min: 0, max: 4 }); return ps; },
    ctlHint() { return 'Bật camera rồi đưa bàn tay NGANG để dời con đọc dọc biểu đồ (quét trái ↔ phải); hoặc bấm vào điểm, hay +/− từng mốc giờ.'; },
    draw2d(host, st) {
      const v = this.vals(st), ts = this.times(), N = 5, ymax = 40,
        X0 = 52, X1 = 512, YT = 26, YB = 208, r = clamp(st.lgR, 0, 4);
      const px = (i) => X0 + (i / (N - 1)) * (X1 - X0), py = (val) => YB - (clamp(val, 0, ymax) / ymax) * (YB - YT);
      let grid = '';
      for (let gv = 0; gv <= ymax; gv += 10) { const y = py(gv).toFixed(1);
        grid += `<line x1="${X0}" y1="${y}" x2="${X1}" y2="${y}" stroke="rgba(242,240,230,.13)" stroke-width="1"></line>`
          + `<text x="${X0 - 8}" y="${(+y + 4).toFixed(1)}" fill="rgba(242,240,230,.6)" font-size="11" text-anchor="end">${gv}°</text>`; }
      let xl = '';
      for (let i = 0; i < N; i++) xl += `<text x="${px(i).toFixed(1)}" y="${YB + 20}" fill="${i === r ? 'var(--accent)' : 'rgba(242,240,230,.6)'}" font-size="12" font-weight="${i === r ? 700 : 400}" text-anchor="middle">${ts[i]}</text>`;
      let poly = ''; for (let i = 0; i < N; i++) poly += `${px(i).toFixed(1)},${py(v[i]).toFixed(1)} `;
      let dots = '';
      for (let i = 0; i < N; i++) { const cx = px(i).toFixed(1), cy = py(v[i]).toFixed(1), hi = i === r;
        dots += `<circle cx="${cx}" cy="${cy}" r="${hi ? 7 : 4.5}" fill="${hi ? 'var(--accent)' : 'rgba(242,240,230,.85)'}" stroke="${hi ? '#0e1b22' : 'none'}" stroke-width="${hi ? 2 : 0}"></circle>`; }
      const rx = px(r).toFixed(1), ry = py(v[r]);
      const reader = `<line x1="${rx}" y1="${ry.toFixed(1)}" x2="${rx}" y2="${YB}" stroke="var(--warn)" stroke-width="1.5" stroke-dasharray="4 3"></line>`
        + `<text x="${rx}" y="${(ry - 12).toFixed(1)}" fill="var(--warn)" font-size="14" font-weight="700" text-anchor="middle">${v[r]}°C</text>`;
      host.innerHTML = `<svg id="line" width="548" height="258" viewBox="0 0 548 258" style="cursor:pointer">`
        + `<text x="16" y="20" fill="rgba(242,240,230,.72)" font-size="13">Nhiệt độ trong một ngày (°C) — trục ngang là GIỜ</text>`
        + `<line x1="${X0}" y1="${YT}" x2="${X0}" y2="${YB}" stroke="var(--chalk)" stroke-width="2"></line>`
        + `<line x1="${X0}" y1="${YB}" x2="${X1}" y2="${YB}" stroke="var(--chalk)" stroke-width="2"></line>`
        + grid + xl
        + `<polyline points="${poly.trim()}" fill="none" stroke="var(--accent)" stroke-width="2.5"></polyline>`
        + reader + dots + `</svg>`;
      const svg = host.querySelector('#line');
      svg.addEventListener('pointerdown', (e) => {
        const rc = svg.getBoundingClientRect();
        const vbX = (e.clientX - rc.left) / rc.width * 548;
        state.lgR = clamp(Math.round((vbX - X0) / (X1 - X0) * (N - 1)), 0, N - 1);
        drawVisual(); render();
      });
    },
    caption(st) {
      const L = cur(), s = st.step, v = this.vals(st), tn = this.tn(), r = clamp(st.lgR, 0, 4);
      let hi = 0, lo = 0; for (let i = 1; i < 5; i++) { if (v[i] > v[hi]) hi = i; if (v[i] < v[lo]) lo = i; }
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: đo nhiệt độ lúc ${tn.join(', ')} → ${v.map((x) => x + '°C').join(', ')}.`, hint: 'Đưa tay ngang dời con đọc, hoặc bấm vào điểm.' };
      if (s === 2) return { cap: `Sơ đồ: nối 5 điểm theo giờ thành một đường gấp khúc. Con đọc đang ở ${tn[r]} — dóng ra trục dọc ta có ${v[r]}°C.`, hint: 'Trục ngang = THỜI GIAN, trục dọc = NHIỆT ĐỘ; dóng đúng trục rồi mới đọc.' };
      if (s === 3) return { cap: `Đường đi LÊN rồi XUỐNG: nóng nhất ${v[hi]}°C lúc ${tn[hi]}, thấp nhất ${v[lo]}°C lúc ${tn[lo]}; ${tn[0]}→${tn[hi]} tăng ${v[hi] - v[0]}°C, ${tn[hi]}→${tn[4]} giảm ${v[hi] - v[4]}°C. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: nhiệt độ CAO NHẤT trong ngày vào lúc mấy giờ? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const v = this.vals(st), r = clamp(st.lgR, 0, 4); return `${this.tn()[r]}: ${v[r]}°C`; },
    showFromStep() { return 2; },
    build3d(st) {
      const g = new THREE.Group(), v = this.vals(st), n = 5, W = 6.4, sc = 0.05, step = W / (n - 1);
      for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * step, h = clamp(v[i], 0, 40) * sc;
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, Math.max(h, 0.02), 0.08), new THREE.MeshStandardMaterial({ color: 0x6f7f8c, roughness: .6 }));
        post.position.set(x, h / 2, 0); g.add(post);
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: .45 }));
        dot.position.set(x, h, 0); g.add(dot); }
      const rd = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 14), new THREE.MeshStandardMaterial({ color: 0xe0483d, roughness: .4 }));
      const r0 = clamp(st.lgR, 0, 4); rd.position.set((r0 - (n - 1) / 2) * step, clamp(v[r0], 0, 40) * sc + 0.2, 0.2);
      g.add(rd); g.userData.rd = rd; g.userData.meta = { W, sc, n, step }; return g;
    },
    paint3d(g, st) { if (!g.userData.rd || !g.userData.meta) return; const { sc, n, step } = g.userData.meta, v = [st.lg0, st.lg1, st.lg2, st.lg3, st.lg4], r = clamp(st.lgR, 0, 4);
      g.userData.rd.position.set((r - (n - 1) / 2) * step, clamp(v[r], 0, 40) * sc + 0.2, 0.2); },
    hand() {},
    handLabel() { return ''; },
  },

  // ======================= Model: svt (tam giác đại lượng S–v–t) =======================
  // beyond-bank THỨ 5: mạch "Đại lượng: Quãng đường – Vận tốc – Thời gian" (lớp 5) dùng TAM GIÁC
  // MAGIQUE: S ở đỉnh, v·t ở đáy. Che ô CẦN TÌM → hiện ngay phép tính (S = v×t; v = S÷t; t = S÷v).
  // bank 39 cụm chưa có. Lỗi kinh điển: nhân/chia NHẦM (tính v mà lấy S×t). Giơ 1/2/3 ngón = chọn
  // che ô S / v / t; hai số còn lại cô đặt bằng +/− → ô bị che TỰ TÍNH, kèm dòng công thức.
  svt: {
    names() { return ['Quãng đường', 'Vận tốc', 'Thời gian']; },
    units() { return ['km', 'km/giờ', 'giờ']; },
    letters() { return ['S', 'v', 't']; },
    keys() { return ['svS', 'svV', 'svT']; },
    defaults(st, L) { st.svS = L.svS; st.svV = L.svV; st.svT = L.svT; st.svAsk = (L.svAsk != null ? L.svAsk : 0); },
    fmt(n) { const s = Math.round(n * 10) / 10; return (s % 1 === 0) ? String(s) : s.toFixed(1); },
    calc(st) { const a = st.svAsk;
      if (a === 0) return st.svV * st.svT;
      if (a === 1) return st.svT > 0 ? st.svS / st.svT : 0;
      return st.svV > 0 ? st.svS / st.svV : 0; },
    formula(st) { const a = st.svAsk, val = this.calc(st), u = this.units()[a], f = this.fmt.bind(this);
      if (a === 0) return `S = v × t = ${f(st.svV)} × ${f(st.svT)} = ${f(val)} ${u}`;
      if (a === 1) return `v = S ÷ t = ${f(st.svS)} ÷ ${f(st.svT)} = ${f(val)} ${u}`;
      return `t = S ÷ v = ${f(st.svS)} ÷ ${f(st.svV)} = ${f(val)} ${u}`; },
    geomSig(st) { return 'svt' + st.svS + ':' + st.svV + ':' + st.svT + ':' + st.svAsk; },
    params() { const K = this.keys(), a = clamp(state.svAsk, 0, 2);
      const defs = { svS: { label: 'S · quãng đường (km)', min: 0, max: 400, step: 10 },
        svV: { label: 'v · vận tốc (km/giờ)', min: 1, max: 120, step: 1 },
        svT: { label: 't · thời gian (giờ)', min: 1, max: 12, step: 1 } };
      const out = []; for (let k = 0; k < 3; k++) { if (k === a) continue; out.push(Object.assign({ key: K[k] }, defs[K[k]])); } return out; },
    ctlHint() { return 'Giơ 1 ngón = tìm QUÃNG ĐƯỜNG, 2 = VẬN TỐC, 3 = THỜI GIAN (che ô đó). Bấm +/− hai số còn lại để đổi đề.'; },
    draw2d(host, st) {
      const a = clamp(st.svAsk, 0, 2), val = this.calc(st), f = this.fmt.bind(this);
      const reg = (letter, idx, cx, cy) => { const isAsk = idx === a;
        const txt = isAsk ? `? = ${f(val)}` : `${letter} = ${f(st[this.keys()[idx]])}`;
        return `<g><rect x="${cx - 62}" y="${cy - 20}" width="124" height="40" rx="7" fill="${isAsk ? 'rgba(255,209,102,.2)' : 'rgba(127,201,191,.14)'}" stroke="${isAsk ? 'var(--accent)' : 'var(--chalk)'}" stroke-width="${isAsk ? 2.5 : 1.5}"></rect>`
          + `<text x="${cx}" y="${cy - 2}" fill="${isAsk ? 'var(--accent)' : 'var(--chalk)'}" font-size="13" font-weight="700" text-anchor="middle">${letter}</text>`
          + `<text x="${cx}" y="${cy + 13}" fill="var(--chalk)" font-size="12" text-anchor="middle">${txt}</text></g>`; };
      host.innerHTML = `<svg id="svt" width="548" height="258" viewBox="0 0 548 258">`
        + `<text x="16" y="20" fill="rgba(242,240,230,.72)" font-size="13">Tam giác đại lượng — che ô cần tìm để hiện phép tính</text>`
        + `<path d="M 274 34 L 110 200 L 438 200 Z" fill="rgba(255,255,255,.04)" stroke="var(--chalk)" stroke-width="2"></path>`
        + `<line x1="181.9" y1="127" x2="366.1" y2="127" stroke="var(--chalk)" stroke-width="1.5"></line>`
        + `<line x1="274" y1="127" x2="274" y2="200" stroke="var(--chalk)" stroke-width="1.5"></line>`
        + reg('S', 0, 274, 82) + reg('v', 1, 210, 165) + reg('t', 2, 338, 165)
        + `<text x="274" y="236" fill="var(--accent)" font-size="15" font-weight="700" text-anchor="middle">${this.formula(st)}</text>`
        + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, a = clamp(st.svAsk, 0, 2), nm = this.names(), val = this.calc(st), f = this.fmt.bind(this);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: một chuyển động đều — biết v = ${f(st.svV)} km/giờ, t = ${f(st.svT)} giờ, S = ${f(st.svS)} km.`, hint: 'Giơ 1/2/3 ngón để chọn ô cần tìm (che nó lại).' };
      if (s === 2) return { cap: `Sơ đồ: tam giác có S ở đỉnh, v và t ở đáy. Muốn tìm ${nm[a]} thì che ô ${this.letters()[a]} — ${a === 0 ? 'hai ô còn lại đứng cạnh nhau nên NHÂN' : 'một ô bị che nên còn phép CHIA'}.`, hint: 'Che ô cần tìm: S = v × t, v = S ÷ t, t = S ÷ v.' };
      if (s === 3) return { cap: `Vậy ${nm[a]} = ${f(val)} ${this.units()[a]}  (${this.formula(st)}). ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: ô đang che (tìm ${nm[a]}) ra bao nhiêu? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const a = clamp(st.svAsk, 0, 2); return `→ ${this.names()[a]} = ${this.fmt(this.calc(st))} ${this.units()[a]}`; },
    showFromStep() { return 2; },
    hand(st, f) { st.svAsk = clamp(f - 1, 0, 2); },
    handLabel(f, st) { return `→ tìm ${this.names()[clamp(f - 1, 0, 2)]}`; },
    build3d(st) {
      const g = new THREE.Group(), a = clamp(st.svAsk, 0, 2);
      const pos = [[0, 1.1, 0], [-1, 0, 0], [1, 0, 0]];
      for (let i = 0; i < 3; i++) { const hex = i === a ? 0xffd166 : 0x7fc9bf;
        const m = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 0.6), new THREE.MeshStandardMaterial({ color: hex, roughness: .5 }));
        m.position.set(pos[i][0], pos[i][1], pos[i][2]); g.add(m); }
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: circle (hình tròn — r, d, chu vi, diện tích) =======================
  // beyond-bank THỨ 6: "Hình tròn / chu vi / diện tích hình tròn" là hình học TRỌNG TÂM lớp 5 mà bank
  // lẫn app trước đây chưa có. Ý cốt + lỗi kinh điển: d = 2r (nhầm r với d), C = π×d = 2πr (hay quên ×2),
  // S = π×r×r (nhầm với chu vi). Tay ngang đổi bán kính → hình to/nhỏ ngay; chu vi "khai triển" thành một
  // đoạn thẳng để thấy C trải đúng π lần đường kính.
  circle: {
    usesPalm: true,
    defaults(st, L) { st.coR = (L.coR != null ? L.coR : 5); },
    fmt(n) { const s = Math.round(n * 100) / 100; if (Number.isInteger(s)) return String(s); let t = s.toFixed(2); if (t.endsWith('0')) t = t.slice(0, -1); return t.replace('.', ','); },
    d(st) { return 2 * clamp(st.coR, 1, 20); },
    C(st) { return 2 * Math.PI * clamp(st.coR, 1, 20); },
    S(st) { const r = clamp(st.coR, 1, 20); return Math.PI * r * r; },
    palmToValue(st, x) { st.coR = clamp(Math.round((1 - x) * 20), 1, 20); },
    palmLabel(st) { return `bán kính ${clamp(st.coR, 1, 20)} → d = ${this.fmt(this.d(st))}`; },
    geomSig() { return 'co'; }, // coR là scale đồng nhất → paint3d, không rebuild
    params() { return [{ key: 'coR', label: 'Bán kính r (đơn vị)', min: 1, max: 20 }]; },
    ctlHint() { return 'Bật camera rồi đưa bàn tay NGANG để đổi bán kính; hoặc bấm vào hình tròn, hay +/− bán kính.'; },
    draw2d(host, st) {
      const r = clamp(st.coR, 1, 20), s = 3.4, cx = 112, cy = 118, R = r * s, d = this.d(st), C = this.C(st), A = this.S(st);
      let spokes = ''; for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2;
        spokes += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * R).toFixed(1)}" y2="${(cy + Math.sin(a) * R).toFixed(1)}" stroke="rgba(242,240,230,.22)" stroke-width="1"></line>`; }
      const circ = `<circle cx="${cx}" cy="${cy}" r="${R.toFixed(1)}" fill="rgba(127,201,191,.18)" stroke="var(--chalk)" stroke-width="2"></circle>`
        + `<circle cx="${cx}" cy="${cy}" r="3" fill="var(--chalk)"></circle>`;
      const dia = `<line x1="${(cx - R).toFixed(1)}" y1="${cy}" x2="${(cx + R).toFixed(1)}" y2="${cy}" stroke="var(--warn)" stroke-width="1.5" stroke-dasharray="4 3"></line>`
        + `<text x="${(cx - R / 2).toFixed(1)}" y="${cy + 16}" fill="var(--warn)" font-size="11.5" text-anchor="middle">d = ${this.fmt(d)}</text>`;
      const rad = `<line x1="${cx}" y1="${cy}" x2="${(cx + R).toFixed(1)}" y2="${cy}" stroke="var(--accent)" stroke-width="2.5"></line>`
        + `<text x="${(cx + R / 2).toFixed(1)}" y="${cy - 6}" fill="var(--accent)" font-size="12" font-weight="700" text-anchor="middle">r = ${this.fmt(r)}</text>`;
      const bx = 16, by = 210, bs = 4.0, bl = C * bs;
      const bar = `<text x="${bx}" y="${by - 8}" fill="rgba(242,240,230,.66)" font-size="11.5">Khai triển 1 vòng = chu vi = π × d:</text>`
        + `<rect x="${bx}" y="${by}" width="${bl.toFixed(1)}" height="11" rx="3" fill="rgba(255,209,102,.28)" stroke="var(--warn)" stroke-width="1.5"></rect>`
        + `<text x="${(bx + 4).toFixed(1)}" y="${by + 24}" fill="var(--accent)" font-size="12" font-weight="700">C = 2 × π × ${this.fmt(r)} ≈ ${this.fmt(C)}</text>`;
      const rx = 292;
      const stats = `<text x="${rx}" y="52" fill="rgba(242,240,230,.7)" font-size="12.5">Bán kính r = ${this.fmt(r)}</text>`
        + `<text x="${rx}" y="80" fill="var(--warn)" font-size="13.5" font-weight="700">Đường kính d = 2 × r = ${this.fmt(d)}</text>`
        + `<text x="${rx}" y="108" fill="var(--accent)" font-size="13.5" font-weight="700">Chu vi C = π × d ≈ ${this.fmt(C)}</text>`
        + `<text x="${rx}" y="136" fill="var(--accent)" font-size="13.5" font-weight="700">Diện tích S = π × r² ≈ ${this.fmt(A)}</text>`
        + `<text x="${rx}" y="158" fill="rgba(242,240,230,.55)" font-size="11">π ≈ 3,14</text>`;
      host.innerHTML = `<svg id="circle" width="548" height="258" viewBox="0 0 548 258" style="cursor:pointer">`
        + `<text x="16" y="20" fill="rgba(242,240,230,.72)" font-size="13">Hình tròn — bán kính quyết định tất cả (π ≈ 3,14)</text>`
        + spokes + circ + dia + rad + bar + stats + `</svg>`;
      const svg = host.querySelector('#circle');
      svg.addEventListener('pointerdown', (e) => {
        const rc = svg.getBoundingClientRect();
        const vbX = (e.clientX - rc.left) / rc.width * 548, vbY = (e.clientY - rc.top) / rc.height * 258;
        state.coR = clamp(Math.round(Math.hypot(vbX - cx, vbY - cy) / s), 1, 20); drawVisual(); render();
      });
    },
    caption(st) {
      const L = cur(), s = st.step, r = clamp(st.coR, 1, 20), f = this.fmt.bind(this);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: một hình tròn có bán kính ${f(r)} — đo từ TÂM ra mép.`, hint: 'Đưa tay ngang đổi bán kính, hoặc bấm vào hình.' };
      if (s === 2) return { cap: `Sơ đồ: đường kính d = 2 × r = ${f(this.d(st))}. Cắt một vòng tròn rồi duỗi thẳng ra thì được đoạn dài đúng chu vi C = π × d.`, hint: 'π ≈ 3,14 = số lần đường kính trải vừa khít một vòng.' };
      if (s === 3) return { cap: `Chu vi C = 2 × π × r ≈ ${f(this.C(st))}; Diện tích S = π × r × r ≈ ${f(this.S(st))}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: với bán kính ${f(r)} thì đường kính dài bao nhiêu? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `d = ${this.fmt(this.d(st))} · C ≈ ${this.fmt(this.C(st))} · S ≈ ${this.fmt(this.S(st))}`; },
    showFromStep() { return 2; },
    hand() {},
    handLabel() { return ''; },
    build3d(st) {
      const g = new THREE.Group(), m = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.4, 36), new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: .5 }));
      m.position.set(0, 0.2, 0); g.add(m); g.userData.disc = m;
      this.paint3d(g, st);
      return g;
    },
    paint3d(g, st) { const r = clamp(st.coR, 1, 20); if (g.userData.disc) g.userData.disc.scale.set(r, 1, r); },
  },
  // beyond-bank 7: DIỆN TÍCH HÌNH TAM GIÁC — chứng minh thị giác "tam giác = ½ hình chữ nhật đáy × cao",
  // chặn LỖI KINH ĐIỂN "quên chia 2". Hai tay: trái = ĐÁY, phải = CHIỀU CAO.
  tri: {
    twoHands: true,
    defaults(st, L) { st.trB = (L.trB != null ? L.trB : 10); st.trH = (L.trH != null ? L.trH : 6); },
    fmt(n) { const s = Math.round(n * 100) / 100; if (Number.isInteger(s)) return String(s); let t = s.toFixed(2); if (t.endsWith('0')) t = t.slice(0, -1); return t.replace('.', ','); },
    b(st) { return clamp(st.trB, 1, 20); },
    h(st) { return clamp(st.trH, 1, 14); },
    rect(st) { return this.b(st) * this.h(st); },
    S(st) { return this.rect(st) / 2; },
    geomSig(st) { return 'tri' + this.b(st) + ':' + this.h(st); },
    params() { return [
      { key: 'trB', label: 'Đáy b (đơn vị)', min: 1, max: 20 },
      { key: 'trH', label: 'Chiều cao h (đơn vị)', min: 1, max: 14 }]; },
    ctlHint() { return 'Tay TRÁI đặt ĐÁY, tay PHẢI đặt CHIỀU CAO (giơ ngón rồi +/− tới 20 | 14). Hai tam giác giống hệt ghép lại = một hình chữ nhật → tam giác chỉ bằng một nửa.'; },
    draw2d(host, st) {
      const b = this.b(st), h = this.h(st), s = Math.min(260 / b, 150 / h, 15);
      const X0 = 84, YB = 214, w = b * s, hh = h * s, top = YB - hh, right = X0 + w, rx = 358;
      const rect = `<rect x="${X0}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${hh.toFixed(1)}" fill="none" stroke="rgba(242,240,230,.4)" stroke-width="1.5" stroke-dasharray="5 4"></rect>`;
      const solid = `<polygon points="${X0},${YB} ${right.toFixed(1)},${YB} ${right.toFixed(1)},${top.toFixed(1)}" fill="rgba(127,201,191,.5)" stroke="var(--chalk)" stroke-width="2.5"></polygon>`;
      const ghost = `<polygon points="${X0},${YB} ${right.toFixed(1)},${top.toFixed(1)} ${X0},${top.toFixed(1)}" fill="rgba(255,209,102,.16)" stroke="var(--warn)" stroke-width="1.5" stroke-dasharray="5 4"></polygon>`;
      const diag = `<line x1="${X0}" y1="${YB}" x2="${right.toFixed(1)}" y2="${top.toFixed(1)}" stroke="var(--accent)" stroke-width="1.5"></line>`;
      const ra = `<path d="M ${right.toFixed(1)} ${(YB - 12).toFixed(1)} L ${(right - 12).toFixed(1)} ${(YB - 12).toFixed(1)} L ${(right - 12).toFixed(1)} ${YB}" fill="none" stroke="var(--chalk)" stroke-width="1.5"></path>`;
      const labB = `<text x="${(X0 + w / 2).toFixed(1)}" y="${YB + 22}" fill="var(--accent)" font-size="13" font-weight="700" text-anchor="middle">đáy b = ${this.fmt(b)}</text>`;
      const labH = `<text x="${(right + 8).toFixed(1)}" y="${(top + hh / 2).toFixed(1)}" fill="var(--warn)" font-size="13" font-weight="700">cao h = ${this.fmt(h)}</text>`;
      const half = `<text x="${(X0 + w * 0.3).toFixed(1)}" y="${(YB - hh * 0.24).toFixed(1)}" fill="var(--chalk)" font-size="12.5" font-weight="700" text-anchor="middle">½</text>`;
      const panel = `<text x="${rx}" y="46" fill="rgba(242,240,230,.72)" font-size="12">Hình chữ nhật = b × h</text>`
        + `<text x="${rx}" y="64" fill="var(--warn)" font-size="13" font-weight="700">= ${this.fmt(this.rect(st))}</text>`
        + `<text x="${rx}" y="92" fill="var(--chalk)" font-size="12">Ghép 2 tam giác giống hệt →</text>`
        + `<text x="${rx}" y="108" fill="var(--chalk)" font-size="12">đúng hình chữ nhật ấy</text>`
        + `<text x="${rx}" y="136" fill="var(--accent)" font-size="13.5" font-weight="700">S = đáy × cao ÷ 2</text>`
        + `<text x="${rx}" y="156" fill="var(--accent)" font-size="13.5" font-weight="700">= ${this.fmt(b)} × ${this.fmt(h)} ÷ 2</text>`
        + `<text x="${rx}" y="178" fill="var(--accent)" font-size="15" font-weight="700">= ${this.fmt(this.S(st))}</text>`
        + `<text x="${rx}" y="200" fill="rgba(255,209,102,.8)" font-size="11">phần mờ = tam giác thứ hai</text>`;
      host.innerHTML = `<svg id="tri" width="548" height="258" viewBox="0 0 548 258" style="cursor:pointer">`
        + `<text x="16" y="20" fill="rgba(242,240,230,.72)" font-size="13">Hình tam giác = một nửa hình chữ nhật (đáy × chiều cao)</text>`
        + rect + ghost + solid + diag + ra + labB + labH + half + panel + `</svg>`;
      const svg = host.querySelector('#tri');
      svg.addEventListener('pointerdown', (e) => {
        const rc = svg.getBoundingClientRect();
        const vbX = (e.clientX - rc.left) / rc.width * 548, vbY = (e.clientY - rc.top) / rc.height * 258;
        state.trB = clamp(Math.round((vbX - X0) / s), 1, 20);
        state.trH = clamp(Math.round((YB - vbY) / s), 1, 14);
        drawVisual(); render();
      });
    },
    caption(st) {
      const L = cur(), s = st.step, b = this.b(st), h = this.h(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: một tam giác có đáy ${b} và chiều cao ${h}. Dựng bằng hai tay — tay trái kéo ĐÁY, tay phải dựng CAO.`, hint: 'Đưa hai tay đổi đáy/cao, hoặc bấm +/−.' };
      if (s === 2) return { cap: `Sơ đồ: ghép thêm một tam giác GIỐNG HẰNG (phần mờ) vào theo đường chéo thì được đúng hình chữ nhật ${b} × ${h}. Tam giác chỉ bằng MỘT NỬA hình chữ nhật đó.`, hint: 'Đó là lý do công thức có "÷ 2" — đừng quên chia đôi!' };
      if (s === 3) return { cap: `S = đáy × cao ÷ 2 = ${b} × ${h} ÷ 2 = ${this.fmt(this.S(st))}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: tam giác đáy ${b}, cao ${h} có diện tích bao nhiêu? Cô đếm tay giơ, hoặc bấm +/−.`, hint: '' };
    },
    value(st) { return `S = ${this.fmt(this.b(st))} × ${this.fmt(this.h(st))} ÷ 2 = ${this.fmt(this.S(st))}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.trB = clamp(l, 1, 20);
      if (r !== null) st.trH = clamp(r, 1, 14);
    },
    build3d(st) {
      const g = new THREE.Group(), b = this.b(st), h = this.h(st), sc = Math.min(4 / b, 2.2 / h, 0.6);
      const shape = new THREE.Shape();
      shape.moveTo(0, 0); shape.lineTo(b * sc, 0); shape.lineTo(b * sc, h * sc); shape.lineTo(0, 0);
      const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.6, bevelEnabled: false }),
        new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.5 }));
      mesh.position.set(-b * sc / 2, 0, -0.3); g.add(mesh); return g;
    },
    paint3d() {},
  },
});

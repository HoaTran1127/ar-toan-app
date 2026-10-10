// ---- tiep MODELS: gop vao object MODELS (giu nguyen thu tu key) ----
Object.assign(MODELS, {
  // beyond-bank 8: DIỆN TÍCH HÌNH THANG — chứng minh "xoay 1 hình thang giống hệt → hình bình hành đáy (a+b)".
  // Hai tay: trái = ĐÁY NHỎ b, phải = ĐÁY LỚN a; chiều cao h qua +/−. Chặn lỗi "quên cộng hai đáy / quên chia 2".
  trap: {
    twoHands: true,
    defaults(st, L) { st.tpA = (L.tpA != null ? L.tpA : 12); st.tpB = (L.tpB != null ? L.tpB : 6); st.tpH = (L.tpH != null ? L.tpH : 5); },
    fmt(n) { const s = Math.round(n * 100) / 100; if (Number.isInteger(s)) return String(s); let t = s.toFixed(2); if (t.endsWith('0')) t = t.slice(0, -1); return t.replace('.', ','); },
    a(st) { return clamp(st.tpA, 1, 20); },
    b(st) { return clamp(st.tpB, 1, 20); },
    h(st) { return clamp(st.tpH, 1, 14); },
    sum(st) { return this.a(st) + this.b(st); },
    S(st) { return this.sum(st) * this.h(st) / 2; },
    geomSig(st) { return 'trap' + this.a(st) + ':' + this.b(st) + ':' + this.h(st); },
    params() { return [
      { key: 'tpA', label: 'Đáy lớn a (đơn vị)', min: 1, max: 20 },
      { key: 'tpB', label: 'Đáy nhỏ b (đơn vị)', min: 1, max: 20 },
      { key: 'tpH', label: 'Chiều cao h (đơn vị)', min: 1, max: 14 }]; },
    ctlHint() { return 'Tay TRÁI đặt ĐÁY NHỎ, tay PHẢI đặt ĐÁY LỚN; chiều cao chỉnh bằng +/− (tới 20 | 14). Hai hình thang giống hệt ghép thành hình bình hành đáy (a + b) → hình thang bằng một nửa.'; },
    draw2d(host, st) {
      const a = this.a(st), b = this.b(st), hh = this.h(st), sm = this.sum(st);
      const s = Math.min(470 / (sm + Math.abs(a - b) / 2), 150 / hh, 15);
      const YB = 186, off = (a - b) * s / 2, X0 = 34 - Math.min(0, off), top = YB - hh * s, footX = X0 + off;
      const A1 = X0 + ',' + YB, B1 = (X0 + a * s).toFixed(1) + ',' + YB;
      const C1 = (X0 + off + b * s).toFixed(1) + ',' + top.toFixed(1), D1 = (X0 + off).toFixed(1) + ',' + top.toFixed(1);
      const P1 = (X0 + sm * s).toFixed(1) + ',' + YB, P3 = (X0 + off + sm * s).toFixed(1) + ',' + top.toFixed(1);
      const solid = `<polygon points="${A1} ${B1} ${C1} ${D1}" fill="rgba(127,201,191,.5)" stroke="var(--chalk)" stroke-width="2.5"></polygon>`;
      const ghost = `<polygon points="${P1} ${B1} ${C1} ${P3}" fill="rgba(255,209,102,.16)" stroke="var(--warn)" stroke-width="1.5" stroke-dasharray="5 4"></polygon>`;
      const axis = `<line x1="${B1.split(',')[0]}" y1="${YB}" x2="${C1.split(',')[0]}" y2="${top.toFixed(1)}" stroke="var(--accent)" stroke-width="2"></line>`;
      const hline = `<line x1="${footX.toFixed(1)}" y1="${top.toFixed(1)}" x2="${footX.toFixed(1)}" y2="${YB}" stroke="rgba(242,240,230,.5)" stroke-width="1.3" stroke-dasharray="3 3"></line>`;
      const hRa = `<path d="M ${footX.toFixed(1)} ${YB - 10} L ${(footX + 10).toFixed(1)} ${YB - 10} L ${(footX + 10).toFixed(1)} ${YB}" fill="none" stroke="rgba(242,240,230,.55)" stroke-width="1.2"></path>`;
      const labB = `<text x="${(X0 + a * s / 2).toFixed(1)}" y="${YB - 7}" fill="var(--accent)" font-size="12.5" font-weight="700" text-anchor="middle">a = ${this.fmt(a)}</text>`;
      const labT = `<text x="${(X0 + off + b * s / 2).toFixed(1)}" y="${(top - 5).toFixed(1)}" fill="var(--warn)" font-size="12.5" font-weight="700" text-anchor="middle">b = ${this.fmt(b)}</text>`;
      const labH = `<text x="${(footX + 5).toFixed(1)}" y="${((top + YB) / 2).toFixed(1)}" fill="rgba(242,240,230,.8)" font-size="12" font-weight="700">h = ${this.fmt(hh)}</text>`;
      const by = YB + 15;
      const bracket = `<line x1="${X0}" y1="${by}" x2="${(X0 + sm * s).toFixed(1)}" y2="${by}" stroke="var(--chalk)" stroke-width="1.3"></line>`
        + `<line x1="${X0}" y1="${by - 4}" x2="${X0}" y2="${by + 4}" stroke="var(--chalk)" stroke-width="1.3"></line>`
        + `<line x1="${(X0 + sm * s).toFixed(1)}" y1="${by - 4}" x2="${(X0 + sm * s).toFixed(1)}" y2="${by + 4}" stroke="var(--chalk)" stroke-width="1.3"></line>`
        + `<text x="${(X0 + sm * s / 2).toFixed(1)}" y="${by + 15}" fill="var(--chalk)" font-size="12" font-weight="700" text-anchor="middle">đáy hình bình hành = a + b = ${this.fmt(sm)}</text>`;
      const formula = `<text x="28" y="243" fill="var(--accent)" font-size="13.5" font-weight="700">S = (a + b) × h ÷ 2 = (${this.fmt(a)} + ${this.fmt(b)}) × ${this.fmt(hh)} ÷ 2 = ${this.fmt(this.S(st))}</text>`;
      host.innerHTML = `<svg id="trap" width="548" height="258" viewBox="0 0 548 258">`
        + `<text x="16" y="18" fill="rgba(242,240,230,.72)" font-size="13">Hình thang = một nửa hình bình hành đáy (đáy lớn + đáy nhỏ)</text>`
        + ghost + hline + hRa + solid + axis + labB + labT + labH + bracket + formula + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, a = this.a(st), b = this.b(st), hh = this.h(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: mặt tường hình thang — ĐÁY LỚN ${a} (dưới), ĐÁY NHỎ ${b} (trên), CHIỀU CAO ${hh}.`, hint: 'Tay trái đặt đáy nhỏ, tay phải đặt đáy lớn, +/− cho chiều cao.' };
      if (s === 2) return { cap: `Sơ đồ: quay một hình thang GIỐNG HẸT (phần mờ) áp vào cạnh nghiêng thì được đúng HÌNH BÌNH HÀNH có đáy = a + b = ${this.sum(st)}, cao = ${hh}. Hình thang chỉ bằng MỘT NỬA hình bình hành ấy.`, hint: 'Đó là lý do: CỘNG hai đáy rồi × cao rồi ÷ 2.' };
      if (s === 3) return { cap: `S = (đáy lớn + đáy nhỏ) × cao ÷ 2 = (${a} + ${b}) × ${hh} ÷ 2 = ${this.fmt(this.S(st))}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: hình thang đáy lớn ${a}, đáy nhỏ ${b}, cao ${hh} có diện tích bao nhiêu? Cô đếm tay giơ, hoặc +/−.`, hint: '' };
    },
    value(st) { return `S = (${this.fmt(this.a(st))} + ${this.fmt(this.b(st))}) × ${this.fmt(this.h(st))} ÷ 2 = ${this.fmt(this.S(st))}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.tpB = clamp(l, 1, 20);
      if (r !== null) st.tpA = clamp(r, 1, 20);
    },
    build3d(st) {
      const g = new THREE.Group(), a = this.a(st), b = this.b(st), hh = this.h(st);
      const sc = Math.min(3.2 / (a + b), 1.6 / hh, 0.28), off = (a - b) * sc / 2;
      const shape = new THREE.Shape();
      shape.moveTo(0, 0); shape.lineTo(a * sc, 0); shape.lineTo(off + b * sc, hh * sc); shape.lineTo(off, hh * sc); shape.lineTo(0, 0);
      const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false }),
        new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.5 }));
      mesh.position.set(-a * sc / 2, 0, -0.25); g.add(mesh); return g;
    },
    paint3d() {},
  },
  // beyond-bank 9: DIỆN TÍCH XUNG QUANH & TOÀN PHẦN HÌNH HỘP CHỮ NHẬT — mở hộp thành LƯỚI 6 mặt,
  // tách rõ 4 mặt bên (xung quanh) khỏi 2 mặt đáy. Chặn LỖI KINH ĐIỂN "nhầm xung quanh với toàn phần".
  sa: {
    twoHands: true,
    defaults(st, L) { st.saA = (L.saA != null ? L.saA : 6); st.saB = (L.saB != null ? L.saB : 4); st.saC = (L.saC != null ? L.saC : 3); },
    fmt(n) { const s = Math.round(n * 100) / 100; if (Number.isInteger(s)) return String(s); let t = s.toFixed(2); if (t.endsWith('0')) t = t.slice(0, -1); return t.replace('.', ','); },
    a(st) { return clamp(st.saA, 1, 20); },
    b(st) { return clamp(st.saB, 1, 20); },
    c(st) { return clamp(st.saC, 1, 20); },
    Sxq(st) { return 2 * (this.a(st) + this.b(st)) * this.c(st); },
    Sdq(st) { return this.a(st) * this.b(st) * 2; },
    Stp(st) { return this.Sxq(st) + this.Sdq(st); },
    V(st) { return this.a(st) * this.b(st) * this.c(st); },
    geomSig(st) { return 'sa' + this.a(st) + ':' + this.b(st) + ':' + this.c(st); },
    params() { return [
      { key: 'saA', label: 'Chiều dài a', min: 1, max: 20 },
      { key: 'saB', label: 'Chiều rộng b', min: 1, max: 20 },
      { key: 'saC', label: 'Chiều cao c', min: 1, max: 20 }]; },
    ctlHint() { return 'Tay TRÁI đặt CHIỀU DÀI, tay PHẢI đặt CHIỀU RỘNG; CHIỀU CAO chỉnh bằng +/− (tới 20). Mở hộp thành LƯỚI 6 mặt: 4 mặt bên (xanh) = xung quanh, 2 đáy (vàng) thêm vào = toàn phần.'; },
    draw2d(host, st) {
      const a = this.a(st), b = this.b(st), c = this.c(st), f = this.fmt.bind(this);
      const s = Math.min(470 / (2 * (a + b)), 145 / (2 * b + c), 14);
      const nx = 30, ny = 32, as = a * s, bs = b * s, cs = c * s, stripW = 2 * (a + b) * s, stripY = ny + bs;
      const teal = 'rgba(127,201,191,.42)', gold = 'rgba(255,209,102,.5)';
      const cell = (x, y, w, hh, fill, txt) => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${hh.toFixed(1)}" fill="${fill}" stroke="var(--chalk)" stroke-width="1.5"></rect>`
        + (w > 30 && hh > 15 ? `<text x="${(x + w / 2).toFixed(1)}" y="${(y + hh / 2 + 3.5).toFixed(1)}" fill="#0e1b22" font-size="10.5" font-weight="700" text-anchor="middle">${txt}</text>` : '');
      let g = cell(nx, ny, as, bs, gold, 'đáy')
        + cell(nx, stripY, as, cs, teal, 'a×c')
        + cell(nx + as, stripY, bs, cs, teal, 'b×c')
        + cell(nx + as + bs, stripY, as, cs, teal, 'a×c')
        + cell(nx + 2 * as + bs, stripY, bs, cs, teal, 'b×c')
        + cell(nx, ny + bs + cs, as, bs, gold, 'đáy');
      const dim = `<text x="${(nx + as / 2).toFixed(1)}" y="${(stripY + cs + 12).toFixed(1)}" fill="var(--accent)" font-size="11" font-weight="700" text-anchor="middle">a=${a}</text>`
        + `<text x="${(nx + as + bs / 2).toFixed(1)}" y="${(stripY + cs + 12).toFixed(1)}" fill="var(--accent)" font-size="11" font-weight="700" text-anchor="middle">b=${b}</text>`
        + `<text x="${(nx + stripW + 6).toFixed(1)}" y="${(stripY + cs / 2 + 4).toFixed(1)}" fill="var(--accent)" font-size="11" font-weight="700">c=${c}</text>`;
      const info = `<text x="20" y="198" fill="var(--ok)" font-size="12.5" font-weight="700">XUNG QUANH = 4 mặt bên = (a + b) × 2 × c = (${a} + ${b}) × 2 × ${c} = ${f(this.Sxq(st))}</text>`
        + `<text x="20" y="219" fill="var(--warn)" font-size="12.5" font-weight="700">HAI ĐÁY = a × b × 2 = ${a} × ${b} × 2 = ${f(this.Sdq(st))}</text>`
        + `<text x="20" y="240" fill="var(--chalk)" font-size="13.5" font-weight="700">TOÀN PHẦN = xung quanh + hai đáy = ${f(this.Sxq(st))} + ${f(this.Sdq(st))} = ${f(this.Stp(st))}</text>`;
      host.innerHTML = `<svg id="sa" width="548" height="258" viewBox="0 0 548 258">`
        + `<text x="16" y="18" fill="rgba(242,240,230,.72)" font-size="12.5">Hình hộp mở thành lưới 6 mặt — xanh = 4 mặt bên (xung quanh), vàng = 2 đáy</text>`
        + g + dim + info + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, a = this.a(st), b = this.b(st), c = this.c(st), f = this.fmt.bind(this);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: một cái HỘP chữ nhật dài ${a}, rộng ${b}, cao ${c} (hộp quà, bể cá, phong bì...).`, hint: 'Tay trái đặt chiều dài, tay phải đặt chiều rộng, +/− cho chiều cao.' };
      if (s === 2) return { cap: `Sơ đồ: mở hộp ra thành LƯỚI 6 mặt. Chỉ 4 mặt bên (xanh) mới là DIỆN TÍCH XUNG QUANH = (a + b) × 2 × c = ${f(this.Sxq(st))}; 2 mặt đáy (vàng) KHÔNG nằm trong xung quanh.`, hint: 'Nhầm Sxq với Stp là lỗi hay gặp — để ý đúng 4 mặt xanh thôi.' };
      if (s === 3) return { cap: `Sxq = ${f(this.Sxq(st))}; hai đáy = ${f(this.Sdq(st))}; Stp = Sxq + hai đáy = ${f(this.Stp(st))}. (Thể tích V = a × b × c = ${f(this.V(st))}.) ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: hộp dài ${a}, rộng ${b}, cao ${c} có diện tích TOÀN PHẦN là bao nhiêu? (đừng nhầm với xung quanh!)`, hint: '' };
    },
    value(st) { return `Sxq = ${this.fmt(this.Sxq(st))} · Stp = ${this.fmt(this.Stp(st))}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.saA = clamp(l, 1, 20);
      if (r !== null) st.saB = clamp(r, 1, 20);
    },
    build3d(st) {
      const g = new THREE.Group(), a = this.a(st), b = this.b(st), c = this.c(st);
      const sc = Math.min(3.4 / Math.max(a, b, c), 0.7);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(a * sc, b * sc, c * sc), new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.5 }));
      mesh.position.set(0, (b * sc) / 2, 0); g.add(mesh); return g;
    },
    paint3d() {},
  },
  // beyond-bank 10: THỨ TỰ THỰC HIỆN PHÉP TÍNH — một biểu thức 3 số, hai tay đặt a·b, +/− đặt c và DẠNG.
  // Dạy "ngoặc trước → rồi × ÷ → cuối + −" bằng HAI BƯỚC CÓ THỨ TỰ + một CÁCH SAI gạch đỏ. Chặn đúng lỗi
  // kinh điển "cứ đọc trái→phải mà tính" và "thấy số cộng đẹp thì nhảy vào cộng trước".
  order: {
    twoHands: true,
    defaults(st, L) { st.ordA = (L.ordA != null ? L.ordA : 2); st.ordB = (L.ordB != null ? L.ordB : 3); st.ordC = (L.ordC != null ? L.ordC : 4); st.ordK = (L.ordK != null ? L.ordK : 0); },
    fmt(n) { const s = Math.round(n * 100) / 100; if (Number.isInteger(s)) return String(s); let t = s.toFixed(2); if (t.endsWith('0')) t = t.slice(0, -1); return t.replace('.', ','); },
    a(st) { return clamp(st.ordA, 1, 9); },
    b(st) { return clamp(st.ordB, 1, 9); },
    c(st) { return clamp(st.ordC, 1, 9); },
    k(st) { return clamp(Math.round(st.ordK), 0, 2); },
    spec(st) {
      const a = this.a(st), b = this.b(st), c = this.c(st), k = this.k(st);
      if (k === 1) return { dang: '(a + b) × c', text: `(${a} + ${b}) × ${c}`, uuTien: 'DẤU NGOẶC làm trước hết', step1: `① trong ngoặc: ${a} + ${b} = ${a + b}`, step2: `② ${a + b} × ${c} = ${(a + b) * c}`, duong: (a + b) * c, saiText: `${a} + ${b} × ${c}`, saiVal: a + b * c, saiLyDo: 'bỏ ngoặc, nhảy sang phép × trước — SAI: mọi thứ TRONG NGOẶC phải tính trước.' };
      if (k === 2) return { dang: 'a × b + c', text: `${a} × ${b} + ${c}`, uuTien: '× và ÷ làm trước + và −', step1: `① ${a} × ${b} = ${a * b}`, step2: `② ${a * b} + ${c} = ${a * b + c}`, duong: a * b + c, saiText: `${a} × (${b} + ${c})`, saiVal: a * (b + c), saiLyDo: `thích cộng ${b} + ${c} cho đẹp rồi mới nhân — SAI: × phải chạy trước +.` };
      return { dang: 'a + b × c', text: `${a} + ${b} × ${c}`, uuTien: '× và ÷ làm trước + và −', step1: `① ${b} × ${c} = ${b * c}`, step2: `② ${a} + ${b * c} = ${a + b * c}`, duong: a + b * c, saiText: `(${a} + ${b}) × ${c}`, saiVal: (a + b) * c, saiLyDo: 'đọc trái→phải nên cộng trước rồi nhân — SAI: phép × chạy trước phép +' };
    },
    geomSig(st) { return 'ord' + this.a(st) + this.b(st) + this.c(st) + ':' + this.k(st); },
    params() { return [
      { key: 'ordA', label: 'Số a', min: 1, max: 9 },
      { key: 'ordB', label: 'Số b', min: 1, max: 9 },
      { key: 'ordC', label: 'Số c', min: 1, max: 9 },
      { key: 'ordK', label: 'Dạng (0:a+b×c · 1:(a+b)×c · 2:a×b+c)', min: 0, max: 2 }]; },
    ctlHint() { return 'Tay TRÁI đặt a, tay PHẢI đặt b; số c và DẠNG biểu thức chỉnh bằng +/−. Xem phép nào được ưu tiên chạy TRƯỚC, rồi đọc kết quả từng bước.'; },
    draw2d(host, st) {
      const sp = this.spec(st), f = this.fmt.bind(this);
      const gold = 'rgba(255,209,102,.16)', teal = 'rgba(127,201,191,.20)';
      const box1 = `<rect x="26" y="80" width="228" height="42" rx="6" fill="${gold}" stroke="var(--warn)" stroke-width="1.6"></rect>`
        + `<text x="40" y="107" fill="var(--chalk)" font-size="14" font-weight="700">${sp.step1}</text>`;
      const arrow = `<text x="258" y="107" fill="var(--accent)" font-size="20" font-weight="700">→</text>`;
      const box2 = `<rect x="286" y="80" width="236" height="42" rx="6" fill="${teal}" stroke="var(--ok)" stroke-width="1.6"></rect>`
        + `<text x="300" y="107" fill="var(--chalk)" font-size="14" font-weight="700">${sp.step2}</text>`;
      const rule = `<text x="26" y="46" fill="var(--warn)" font-size="13.5" font-weight="700">Ưu tiên: ① DẤU NGOẶC  →  ② × và ÷  →  ③ + và −</text>`;
      const expr = `<text x="26" y="72" fill="var(--accent)" font-size="20" font-weight="700">${sp.text} = ?</text>`
        + `<text x="300" y="72" fill="rgba(242,240,230,.7)" font-size="13" font-weight="700">dạng ${sp.dang}</text>`;
      const res = `<text x="26" y="150" fill="var(--ok)" font-size="18" font-weight="700">Kết quả ĐÚNG: ${sp.text} = ${f(sp.duong)}</text>`;
      const wrong = `<rect x="26" y="164" width="496" height="66" rx="6" fill="rgba(231,76,60,.10)" stroke="var(--bad)" stroke-width="1.4" stroke-dasharray="6 4"></rect>`
        + `<text x="38" y="188" fill="var(--bad)" font-size="14" font-weight="700">❌ Cách SAI hay gặp: ${sp.saiText} = ${f(sp.saiVal)}</text>`
        + `<text x="38" y="212" fill="rgba(242,240,230,.82)" font-size="12.5">Vì sao sai: ${sp.saiLyDo}.</text>`;
      host.innerHTML = `<svg id="order" width="548" height="258" viewBox="0 0 548 258">`
        + `<text x="16" y="20" fill="rgba(242,240,230,.72)" font-size="12.5">Thứ tự thực hiện phép tính — làm ĐÚNG THỨ TỰ, không đọc bừa từ trái sang</text>`
        + rule + expr + box1 + arrow + box2 + res + wrong + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, sp = this.spec(st), f = this.fmt.bind(this);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: cả lớp cùng tính một biểu thức ${sp.text}. Hỏi: phép nào làm TRƯỚC?`, hint: 'Tay trái đặt a, tay phải đặt b, +/− cho c và đổi dạng.' };
      if (s === 2) return { cap: `Sơ đồ: ${sp.uuTien}. Bước ① ${sp.step1.replace('① ', '')}, rồi bước ② ${sp.step2.replace('② ', '')}.`, hint: 'Đó là thứ tự — ngoặc trước, × ÷ trước, + − sau.' };
      if (s === 3) return { cap: `${sp.text} = ${f(sp.duong)}. Nếu tính sai thứ tự (${sp.saiText}) sẽ ra ${f(sp.saiVal)} — ${sp.saiLyDo}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: ${sp.text} bằng bao nhiêu? (nhớ đúng thứ tự!) Cô đếm tay giơ, hoặc +/− đổi biểu thức.`, hint: '' };
    },
    value(st) { const sp = this.spec(st); return `${sp.text} = ${this.fmt(sp.duong)}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.ordA = clamp(l, 1, 9);
      if (r !== null) st.ordB = clamp(r, 1, 9);
    },
    build3d(st) {
      const g = new THREE.Group(), n = clamp(Math.round(this.spec(st).duong), 1, 30), cols = 5, sc = 0.5, cell = 0.62;
      const mat = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.5 });
      for (let i = 0; i < n; i++) { const r = Math.floor(i / cols), c = i % cols;
        const m = new THREE.Mesh(new THREE.BoxGeometry(sc, sc, sc), mat);
        m.position.set((c - (cols - 1) / 2) * cell, r * cell + sc / 2, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  // beyond-bank 11: CHU VI vs DIỆN TÍCH HÌNH CHỮ NHẬT — cùng một miếng đất a×b, nhưng "đi vòng quanh" (viền, cm)
  // khác hẳn "lấp kín mặt" (số ô, cm²). Chặn đúng lỗi kinh điển "nhầm chu vi với diện tích" (cộng 2 cạnh rồi nhân 2
  // nhưng gọi là diện tích, hoặc lấy dài×rộng rồi gọi là chu vi).
  rect: {
    twoHands: true,
    defaults(st, L) { st.rcA = (L.rcA != null ? L.rcA : 6); st.rcB = (L.rcB != null ? L.rcB : 4); },
    fmt(n) { const s = Math.round(n * 100) / 100; if (Number.isInteger(s)) return String(s); let t = s.toFixed(2); if (t.endsWith('0')) t = t.slice(0, -1); return t.replace('.', ','); },
    a(st) { return clamp(st.rcA, 1, 12); },
    b(st) { return clamp(st.rcB, 1, 12); },
    P(st) { return 2 * (this.a(st) + this.b(st)); },
    S(st) { return this.a(st) * this.b(st); },
    geomSig(st) { return 'rect' + this.a(st) + 'x' + this.b(st); },
    params() { return [
      { key: 'rcA', label: 'Chiều dài a (cm)', min: 1, max: 12 },
      { key: 'rcB', label: 'Chiều rộng b (cm)', min: 1, max: 12 }]; },
    ctlHint() { return 'Tay TRÁI đặt CHIỀU DÀI, tay PHẢI đặt CHIỀU RỘNG (tới 12). Viền vàng = Chu vi (đi vòng quanh, đo bằng cm); lưới ô tô = Diện tích (đếm ô 1 cm²).'; },
    draw2d(host, st) {
      const a = this.a(st), b = this.b(st);
      const s = Math.min(360 / a, 118 / b), w = a * s, h = b * s, x0 = 66, y0 = 34;
      let cells = '';
      for (let i = 0; i < a; i++) for (let j = 0; j < b; j++)
        cells += `<rect x="${(x0 + i * s).toFixed(1)}" y="${(y0 + j * s).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" fill="rgba(127,201,191,.30)" stroke="rgba(242,240,230,.35)" stroke-width="0.8"></rect>`;
      const border = `<rect x="${x0}" y="${y0}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="none" stroke="var(--warn)" stroke-width="4"></rect>`;
      const labA = `<text x="${(x0 + w / 2).toFixed(1)}" y="${(y0 - 6).toFixed(1)}" fill="var(--accent)" font-size="13" font-weight="700" text-anchor="middle">dài = ${a} cm</text>`;
      const labB = `<text x="${(x0 - 8)}" y="${(y0 + h / 2).toFixed(1)}" fill="var(--warn)" font-size="12" font-weight="700" text-anchor="end">rộng ${b}</text>`;
      const info = `<text x="20" y="182" fill="var(--warn)" font-size="13" font-weight="700">CHU VI = đi vòng quanh = (a + b) × 2 = (${a} + ${b}) × 2 = ${this.P(st)} cm   (đơn vị: cm)</text>`
        + `<text x="20" y="204" fill="var(--ok)" font-size="13" font-weight="700">DIỆN TÍCH = lấp kín = a × b = ${a} × ${b} = ${this.S(st)} cm²   (đơn vị: cm² — số ô)</text>`
        + `<text x="20" y="228" fill="var(--accent)" font-size="12.5" font-weight="700">Cùng một hình nhưng HAI thứ khác nhau: viền đo bằng cm, mặt đong bằng số ô cm².</text>`;
      host.innerHTML = `<svg id="rect" width="548" height="258" viewBox="0 0 548 258">`
        + `<text x="16" y="16" fill="rgba(242,240,230,.72)" font-size="12.5">Chu vi = độ dài đường viền xung quanh · Diện tích = số ô vuông phủ kín mặt</text>`
        + cells + border + labA + labB + info + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, a = this.a(st), b = this.b(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: một miếng đất / mặt bàn hình chữ nhật dài ${a} cm, rộng ${b} cm.`, hint: 'Tay trái đặt chiều dài, tay phải đặt chiều rộng.' };
      if (s === 2) return { cap: `Sơ đồ: chạy một vòng theo VIỀN vàng = CHU VI = (${a} + ${b}) × 2 = ${this.P(st)} cm. Lấp đầy bằng LƯỚI Ô = DIỆN TÍCH = ${a} × ${b} = ${this.S(st)} ô cm². Hai việc KHÁC nhau.`, hint: 'Đừng nhầm: chu vi chỉ là đường bao, chưa lấp mặt.' };
      if (s === 3) return { cap: `Chu vi = ${this.P(st)} cm; Diện tích = ${this.S(st)} cm². ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: hình chữ nhật dài ${a}, rộng ${b} — DIỆN TÍCH là bao nhiêu cm²? (đừng lấy chu vi!)`, hint: '' };
    },
    value(st) { return `P = ${this.P(st)} cm · S = ${this.S(st)} cm²`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.rcA = clamp(l, 1, 12);
      if (r !== null) st.rcB = clamp(r, 1, 12);
    },
    build3d(st) {
      const g = new THREE.Group(), a = this.a(st), b = this.b(st), sc = Math.min(4 / Math.max(a, b), 0.6);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(a * sc, 0.12, b * sc), new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.5 }));
      g.add(mesh); return g;
    },
    paint3d() {},
  },
  // beyond-bank 12: CHIA MỘT PHÂN SỐ CHO SỐ TỰ NHIÊN. Cùng một trục, thanh trên tô a/b (vàng), thanh dưới cắt
  // mỗi ô thành n ô con rồi lấy a ô (xanh) → phần tô NGẮN ĐI n LẦN. Insight: tử giữ nguyên, MẪU nhân n.
  // Chặn lỗi "chia tử" (3/4 : 2 → 1,5/4 vô lý) và "nhân cả tử".
  fracdiv: {
    twoHands: true,
    defaults(st, L) { st.fdNum = (L.fdNum != null ? L.fdNum : 3); st.fdDen = (L.fdDen != null ? L.fdDen : 4); st.fdDiv = (L.fdDiv != null ? L.fdDiv : 2); },
    fmt(n) { const s = Math.round(n * 100) / 100; if (Number.isInteger(s)) return String(s); let t = s.toFixed(2); if (t.endsWith('0')) t = t.slice(0, -1); return t.replace('.', ','); },
    a(st) { return clamp(st.fdNum, 1, 6); },
    b(st) { return clamp(st.fdDen, 2, 8); },
    n(st) { return clamp(st.fdDiv, 2, 6); },
    dn(st) { return this.b(st) * this.n(st); },
    q(st) { return this.a(st) / this.dn(st); },
    geomSig(st) { return 'fracdiv' + this.a(st) + '_' + this.b(st) + '_' + this.n(st); },
    params() { return [
      { key: 'fdNum', label: 'Tử số a', min: 1, max: 6 },
      { key: 'fdDen', label: 'Mẫu số b', min: 2, max: 8 },
      { key: 'fdDiv', label: 'Số chia n', min: 2, max: 6 }]; },
    ctlHint() { return 'Tay TRÁI đặt TỬ (số ô tô), tay PHẢI đặt MẪU (số ô); số chia n chỉnh bằng +/− (2→6). Thanh dưới = phép chia: phần tô ngắn đi n lần vì mẫu × n.'; },
    draw2d(host, st) {
      const a = this.a(st), b = this.b(st), n = this.n(st), dn = this.dn(st);
      const W = 428, x0 = 64, top = 50, bot = 122, ch = 30, bw = W / b, cw = W / dn;
      let gtop = ''; for (let j = 0; j < b; j++) { const f = j < a ? 'rgba(255,209,102,.55)' : 'rgba(242,240,230,.06)'; gtop += `<rect x="${(x0 + j * bw).toFixed(1)}" y="${top}" width="${bw.toFixed(1)}" height="${ch}" fill="${f}" stroke="var(--chalk)" stroke-width="1"></rect>`; }
      let gbot = ''; for (let j = 0; j < dn; j++) { const f = j < a ? 'rgba(127,201,191,.62)' : 'rgba(242,240,230,.06)'; gbot += `<rect x="${(x0 + j * cw).toFixed(1)}" y="${bot}" width="${cw.toFixed(1)}" height="${ch}" fill="${f}" stroke="rgba(242,240,230,.4)" stroke-width="0.6"></rect>`; }
      let sep = ''; for (let c = 1; c < b; c++) { const xx = (x0 + c * n * cw).toFixed(1); sep += `<line x1="${xx}" y1="${bot}" x2="${xx}" y2="${bot + ch}" stroke="var(--chalk)" stroke-width="1.2" stroke-dasharray="4 3"></line>`; }
      const labTop = `<text x="${x0}" y="${top - 6}" fill="var(--warn)" font-size="12.5" font-weight="700">${a}/${b}  (tô ${a} trên ${b} ô)</text>`;
      const labBot = `<text x="${x0}" y="${bot - 6}" fill="var(--ok)" font-size="12.5" font-weight="700">÷ ${n}: mỗi ô cắt thành ${n} → ${b}×${n} = ${dn} ô, vẫn lấy ${a} ô (nhỏ hơn)</text>`;
      const res = `<text x="20" y="186" fill="var(--chalk)" font-size="14.5" font-weight="700">${a}/${b} ÷ ${n} = ${a}/(${b} × ${n}) = ${a}/${dn} = ${this.fmt(this.q(st))}</text>`;
      const note = `<text x="20" y="210" fill="rgba(242,240,230,.82)" font-size="12">Tử GIỮ NGUYÊN (${a}); MẪU nhân ${n} thành ${dn} — mỗi ô nhỏ hơn ${n} lần nên phần tô ngắn đi đúng ${n} lần.</text>`;
      host.innerHTML = `<svg id="fracdiv" width="548" height="258" viewBox="0 0 548 258">`
        + `<text x="16" y="16" fill="rgba(242,240,230,.72)" font-size="12.5">Chia phân số cho số tự nhiên = thu hẹp phần đã tô đi n lần</text>`
        + labTop + gtop + labBot + gbot + sep + res + note + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, a = this.a(st), b = this.b(st), n = this.n(st), dn = this.dn(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: có ${a}/${b} cái bánh, chia đều cho ${n} bạn. Mỗi bạn được bao nhiêu phần cái bánh?`, hint: 'Tay trái đặt tử, tay phải đặt mẫu, +/− cho số bạn.' };
      if (s === 2) return { cap: `Sơ đồ: thanh vàng = ${a}/${b}. Chia cho ${n} → cắt mỗi ô thành ${n} ô con (${dn} ô), mỗi bạn lấy ${a} ô con = ${a}/${dn}. Phần xanh ngắn hơn phần vàng đúng ${n} lần.`, hint: 'Tử giữ nguyên, MẪU × ' + n + '.' };
      if (s === 3) return { cap: `${a}/${b} ÷ ${n} = ${a}/${dn} = ${this.fmt(this.q(st))}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: ${a}/${b} chia cho ${n} bằng mấy phần mấy? (đừng chia tử!)`, hint: '' };
    },
    value(st) { return `${this.a(st)}/${this.b(st)} ÷ ${this.n(st)} = ${this.a(st)}/${this.dn(st)} = ${this.fmt(this.q(st))}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.fdNum = clamp(l, 1, 6);
      if (r !== null) st.fdDen = clamp(r, 2, 8);
    },
    build3d(st) {
      const g = new THREE.Group(), a = this.a(st), dn = this.dn(st), sc = Math.min(3.2 / dn, 0.3);
      const gold = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.5 }), teal = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.5 });
      for (let j = 0; j < dn; j++) { const m = new THREE.Mesh(new THREE.BoxGeometry(sc * 0.9, 0.3, 0.6), j < a ? gold : teal); m.position.set((j - (dn - 1) / 2) * sc, 0, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  // beyond-bank 13: DỊCH DẤU PHẨY khi nhân/chia 10·100·1000. Giơ ngón chọn phép; số hiện thành Ô CHỮ SỐ với
  // Ô DẤU PHẨY sáng, so TRƯỚC/SAU → thấy dấu phẩy trượt mấy ô & khi nào chèn/bớt số 0. Chặn lỗi "dịch sai số
  // chữ số" và "cứ nhân chia từng chữ số như số tự nhiên".
  dotshift: {
    defaults(st, L) { st.dsWhich = (L.dsWhich != null ? L.dsWhich : 0); st.dsK = (L.dsK != null ? L.dsK : 1); },
    fmt(n) { const s = Math.round(n * 100) / 100; if (Number.isInteger(s)) return String(s); let t = s.toFixed(2); if (t.endsWith('0')) t = t.slice(0, -1); return t.replace('.', ','); },
    k(st) { return clamp(Math.round(st.dsK), -2, 3); },
    presets() { return [{ base: 1234, pos0: 2 }, { base: 36, pos0: 1 }, { base: 25, pos0: 0 }, { base: 1457, pos0: 2 }]; },
    vf(base, e) { const d = String(base); if (e >= 0) return d + '0'.repeat(e); const neg = -e; let s = d; if (s.length <= neg) s = '0'.repeat(neg - s.length + 1) + s; return s.slice(0, s.length - neg) + ',' + s.slice(s.length - neg); },
    preset(st) { const p = this.presets()[clamp(Math.round(st.dsWhich), 0, 3)]; const len = String(p.base).length; return { base: p.base, len, pos0: p.pos0, orig: this.vf(p.base, -(len - p.pos0)) }; },
    exp(st) { const P = this.preset(st); return this.k(st) - (P.len - P.pos0); },
    after(st) { const P = this.preset(st); return this.vf(P.base, this.exp(st)); },
    opMenu() { return [0, 1, 2, 3, -1, -2]; },
    opLabel(k) { return k === 0 ? '× 1' : k === 1 ? '× 10' : k === 2 ? '× 100' : k === 3 ? '× 1000' : k === -1 ? ': 10' : ': 100'; },
    geomSig(st) { return 'dot' + clamp(Math.round(st.dsWhich), 0, 3) + ':' + this.k(st); },
    params() { return [{ key: 'dsWhich', label: 'Số thập phân gốc (0-3)', min: 0, max: 3 }]; },
    ctlHint() { return 'Giơ 0–5 ngón để CHỌN phép: 0→×1, 1→×10, 2→×100, 3→×1000, 4→:10, 5→:100. +/− đổi số gốc (4 preset). Xem ô DẤU PHẨY trượt sang phải/trái.'; },
    hand(st, f) { const m = this.opMenu(); st.dsK = m[clamp(Math.round(f), 0, m.length - 1)]; },
    handLabel(f, st) { const m = this.opMenu(); return '→ ' + this.opLabel(m[clamp(Math.round(f), 0, m.length - 1)]); },
    draw2d(host, st) {
      const P = this.preset(st), k = this.k(st), after = this.after(st), op = this.opLabel(k);
      const boxes = (str, y, hot) => { let x = 60, out = ''; for (const ch of str) { if (ch === ',') { out += `<text x="${(x + 2)}" y="${y + 22}" fill="${hot ? 'var(--accent)' : 'var(--warn)'}" font-size="24" font-weight="700">,</text>`; x += 15; } else { out += `<rect x="${x}" y="${y}" width="27" height="27" fill="rgba(242,240,230,.06)" stroke="var(--chalk)" stroke-width="1.2"></rect>` + `<text x="${(x + 13.5)}" y="${y + 19}" fill="var(--chalk)" font-size="17" font-weight="700" text-anchor="middle">${ch}</text>`; x += 29; } } return out; };
      const shift = k > 0 ? `trượt sang PHẢI ${k} chữ số` : k < 0 ? `trượt sang TRÁI ${-k} chữ số` : 'đứng yên (× 1)';
      const head = `<text x="16" y="15" fill="rgba(242,240,230,.72)" font-size="12.5">Nhân / chia số thập phân với 10 · 100 · 1000 = TRƯỢT dấu phẩy, giữ nguyên thứ tự chữ số</text>`;
      const labB = `<text x="16" y="46" fill="var(--warn)" font-size="12" font-weight="700">TRƯỚC</text>` + boxes(P.orig, 34, false);
      const opEl = `<text x="300" y="80" fill="var(--ok)" font-size="20" font-weight="700">${op} →</text>`;
      const labA = `<text x="16" y="112" fill="var(--accent)" font-size="12" font-weight="700">SAU</text>` + boxes(after, 100, true);
      const formula = `<text x="20" y="162" fill="var(--chalk)" font-size="16" font-weight="700">${P.orig} ${op} = ${after}</text>`;
      const note = `<text x="20" y="188" fill="rgba(242,240,230,.82)" font-size="12.5">Dấu phẩy ${shift}. Thiếu chữ số thì VIẾT THÊM số 0 (nhân) hoặc dời vào phần thập phân (chia); bản thân các chữ số không đổi.</text>`;
      host.innerHTML = `<svg id="dotshift" width="548" height="258" viewBox="0 0 548 258">` + head + labB + opEl + labA + formula + note + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, P = this.preset(st), k = this.k(st), after = this.after(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: cô có số ${P.orig}. Giơ ngón tay để chọn phép tính: 0→×1, 1→×10, 2→×100, 3→×1000, 4→:10, 5→:100.`, hint: 'Đếm ngón = chọn phép. +/− đổi số gốc.' };
      if (s === 2) return { cap: `Sơ đồ: ${P.orig} ${this.opLabel(k)} = ${after}. Dấu phẩy ${k > 0 ? 'dịch sang PHẢI ' + k + ' ô' : k < 0 ? 'dịch sang TRÁI ' + (-k) + ' ô' : 'đứng yên'}.`, hint: 'Không đổi chữ số, chỉ đổi chỗ dấu phẩy.' };
      if (s === 3) return { cap: `${P.orig} ${this.opLabel(k)} = ${after}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: ${P.orig} ${this.opLabel(k)} bằng bao nhiêu? Cô đếm tay giơ, hoặc +/− đổi số.`, hint: '' };
    },
    value(st) { const P = this.preset(st); return `${P.orig} ${this.opLabel(this.k(st))} = ${this.after(st)}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const g = new THREE.Group(), after = this.after(st), dg = [...after].filter(c => c !== ','), n = Math.max(dg.length, 1), sc = Math.min(3.4 / n, 0.5);
      const mat = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.5 });
      for (let j = 0; j < n; j++) { const m = new THREE.Mesh(new THREE.BoxGeometry(sc * 0.85, sc * 0.6, sc * 0.6), mat); m.position.set((j - (n - 1) / 2) * sc, 0, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  // beyond-bank 14: CỘNG · TRỪ hai phân số KHÁC mẫu số. Hai tay = hai TỬ số (mẫu số bằng +/−). Hai băng giấy được
  // CẮT LẠI trên cùng lưới chung (mẫu chung = BCNN) → thấy ô to hoá nhiều ô bé, rồi CỘNG/TRỪ số ô tô trên cùng cỡ ô.
  // Chặn lỗi kinh điển "cộng cả tử lẫn mẫu" (1/2 + 1/3 ≠ 2/5) và "quy đồng sai mẫu chung".
  fracdiff: {
    twoHands: true,
    defaults(st, L) {
      st.fmN1 = (L.fmN1 != null ? L.fmN1 : 1); st.fmD1 = (L.fmD1 != null ? L.fmD1 : 2);
      st.fmN2 = (L.fmN2 != null ? L.fmN2 : 1); st.fmD2 = (L.fmD2 != null ? L.fmD2 : 3);
      st.fmOp = (L.fmOp != null ? L.fmOp : 1);
    },
    gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; },
    lcm(a, b) { return Math.round(a / this.gcd(a, b) * b); },
    eff(st) {
      const d1 = clamp(Math.round(st.fmD1), 2, 9), d2 = clamp(Math.round(st.fmD2), 2, 9);
      const L = this.lcm(d1, d2), k1 = L / d1, k2 = L / d2;
      const n1 = clamp(Math.round(st.fmN1), 0, d1), n2 = clamp(Math.round(st.fmN2), 0, d2);
      const f1 = n1 * k1, f2 = n2 * k2;
      const add = Math.round(st.fmOp) >= 1;
      const R = add ? f1 + f2 : f1 - f2;
      const g = this.gcd(R, L);
      return { d1, d2, L, k1, k2, n1, n2, f1, f2, add, R, rr: R / g, rl: L / g };
    },
    geomSig(st) { const e = this.eff(st); return `fm${e.n1},${e.d1}|${e.n2},${e.d2}|${e.add ? 1 : 0}`; },
    params() { return [{ key: 'fmD1', label: 'Mẫu số 1', min: 2, max: 9 }, { key: 'fmD2', label: 'Mẫu số 2', min: 2, max: 9 }, { key: 'fmOp', label: 'Phép (1=cộng, 0=trừ)', min: 0, max: 1 }]; },
    ctlHint() { return 'HAI TAY = hai TỬ số (trái = tử phân số 1, phải = tử phân số 2). Mẫu số và phép +/− bằng dải +/−. Hai băng tự cắt lại trên LƯỚI CHUNG để nhìn rõ ô to thành ô bé.'; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.fmN1 = clamp(Math.round(l), 0, clamp(Math.round(st.fmD1), 2, 9));
      if (r !== null) st.fmN2 = clamp(Math.round(r), 0, clamp(Math.round(st.fmD2), 2, 9));
    },
    draw2d(host, st) {
      const e = this.eff(st), W = 428, x0 = 44, BH = 26;
      const bar = (y, cells, fill, color) => { const cw = W / cells; let s = ''; for (let i = 0; i < cells; i++) { s += `<rect x="${(x0 + i * cw).toFixed(1)}" y="${y}" width="${(cw - 1.5).toFixed(1)}" height="${BH}" fill="${i < fill ? color : 'rgba(242,240,230,.05)'}" stroke="var(--chalk)" stroke-width="1"></rect>`; } return s; };
      const sign = e.add ? '+' : '−';
      const row1 = `<text x="12" y="44" fill="var(--warn)" font-size="12" font-weight="700">① ${e.n1}/${e.d1}</text>` + bar(26, e.d1, e.n1, 'var(--warn)');
      const row2 = `<text x="12" y="80" fill="var(--accent)" font-size="12" font-weight="700">② ${e.n2}/${e.d2}</text>` + bar(62, e.d2, e.n2, 'var(--accent)');
      const cut = `<text x="12" y="120" fill="rgba(242,240,230,.72)" font-size="12">QUY ĐỒNG về mẫu chung ${e.L} (mỗi ô ① ×${e.k1}, mỗi ô ② ×${e.k2})</text>`;
      const row3 = `<text x="12" y="138" fill="var(--warn)" font-size="12" font-weight="700">= ${e.f1}/${e.L}</text>` + bar(120, e.L, e.f1, 'var(--warn)');
      const row4 = `<text x="12" y="174" fill="var(--accent)" font-size="12" font-weight="700">= ${e.f2}/${e.L}</text>` + bar(156, e.L, e.f2, 'var(--accent)');
      const resFill = e.R > 0 ? Math.min(e.R, e.L) : 0;
      const row5 = `<text x="12" y="212" fill="var(--ok)" font-size="12" font-weight="700">${e.R}/${e.L}${e.rl !== e.L ? ' = ' + e.rr + '/' + e.rl : ''}</text>` + bar(194, e.L, resFill, 'var(--ok)');
      const wrong = e.d1 + e.d2 > 0 ? `<text x="12" y="240" fill="var(--err)" font-size="12.5" font-weight="700">❌ SAI: ${e.n1}/${e.d1} ${sign} ${e.n2}/${e.d2} ≠ ${e.add ? e.n1 + e.n2 : e.n1 - e.n2}/${e.d1 + e.d2} (không được cộng/trừ MẪU số)</text>` : '';
      host.innerHTML = `<svg id="fracdiff" width="548" height="258" viewBox="0 0 548 258">` + row1 + row2 + cut + row3 + row4 + row5 + wrong + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, e = this.eff(st), sign = e.add ? '+' : '−';
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hai băng giấy — băng ① chia ${e.d1} ô tô ${e.n1}, băng ② chia ${e.d2} ô tô ${e.n2}. Ô của hai băng TO NHỎ khác nhau nên chưa cộng được ngay.`, hint: 'Muốn cộng, hai băng phải có Ô BẰNG NHAU → quy đồng.' };
      if (s === 2) return { cap: `Sơ đồ: quy đồng về mẫu chung ${e.L} → ① = ${e.f1}/${e.L}, ② = ${e.f2}/${e.L}. Bây giờ ${e.n1}/${e.d1} ${sign} ${e.n2}/${e.d2} = ${e.f1} ${sign} ${e.f2} (${e.L}) = ${e.R}/${e.L}.`, hint: 'Cộng/trừ chỉ số Ô TÔ (tử), mẫu chung giữ nguyên.' };
      if (s === 3) return { cap: `Phép tính: ${e.n1}/${e.d1} ${sign} ${e.n2}/${e.d2} = ${e.R}/${e.L}${e.rl !== e.L ? ' = ' + e.rr + '/' + e.rl : ''}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp: ${e.n1}/${e.d1} ${sign} ${e.n2}/${e.d2} bằng bao nhiêu? Đổi hai tử bằng hai tay, mẫu và phép tính bằng +/−.`, hint: '' };
    },
    value(st) { const e = this.eff(st); return `${e.n1}/${e.d1} ${e.add ? '+' : '−'} ${e.n2}/${e.d2} = ${e.R}/${e.L}${e.rl !== e.L ? ' = ' + e.rr + '/' + e.rl : ''}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const e = this.eff(st), n = clamp(Math.max(e.R, 0), 0, 40), sc = n > 0 ? Math.min(3.4 / n, 0.5) : 0.5;
      const g = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.5 });
      for (let j = 0; j < n; j++) { const m = new THREE.Mesh(new THREE.BoxGeometry(sc * 0.85, sc * 0.6, sc * 0.6), mat); m.position.set((j - (n - 1) / 2) * sc, 0, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },
  // beyond-bank 15: NHÂN HAI SỐ THẬP PHÂN bằng LƯỚI DIỆN TÍCH. Lưới 10×10 = 1 (100 ô = 1 phần trăm). Tô m HÀNG (0,m)
  // giao với n CỘT (0,n) → phần giao m×n ô sáng = tích (phần trăm). Học sinh thấy 0,3×0,4 = 12 ô = 0,12 và vì sao
  // "1 + 1 = 2" — tích có SỐ CHỮ SỐ THẬP PHÂN bằng TỔNG số chữ số thập phân của hai thừa số. Chặn lỗi đếm sai chữ số ở
  // tích và lầm tưởng "nhân luôn làm số to ra" (nhân hai số < 1 thì tích BÉ đi).
  decarea: {
    twoHands: true,
    defaults(st, L) { st.daM = (L.daM != null ? L.daM : 3); st.daN = (L.daN != null ? L.daN : 4); },
    mv(st) { return clamp(Math.round(st.daM), 1, 9); },
    nv(st) { return clamp(Math.round(st.daN), 1, 9); },
    pv(st) { return this.mv(st) * this.nv(st); },
    vnf(x) { const s = Math.round(x * 100) / 100; if (Number.isInteger(s)) return String(s); let t = s.toFixed(2); if (t.endsWith('0')) t = t.slice(0, -1); return t.replace('.', ','); },
    geomSig(st) { return `da${this.mv(st)},${this.nv(st)}`; },
    params() { return [{ key: 'daM', label: 'Thừa số 1 (phần mười)', min: 1, max: 9 }, { key: 'daN', label: 'Thừa số 2 (phần mười)', min: 1, max: 9 }]; },
    ctlHint() { return 'HAI TAY = hai THỪA SỐ (trái = số HÀNG, phải = số CỘT, mỗi bàn tay 1→9 ô phần mười). Phần GIAO sáng = tích. Nhân hai số bé hơn 1 thì tích càng BÉ.'; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.daM = clamp(Math.round(l), 1, 9);
      if (r !== null) st.daN = clamp(Math.round(r), 1, 9);
    },
    draw2d(host, st) {
      const m = this.mv(st), n = this.nv(st), P = this.pv(st);
      const x0 = 150, y0 = 30, cs = 18, G = 10 * cs;
      let grid = '';
      for (let i = 0; i <= 10; i++) {
        const gx = x0 + i * cs, gy = y0 + i * cs, w = i === 5 ? 2 : 0.7, op = i === 5 ? 0.9 : 0.45;
        grid += `<line x1="${gx}" y1="${y0}" x2="${gx}" y2="${y0 + G}" stroke="var(--chalk)" stroke-width="${w}" opacity="${op}"></line>`;
        grid += `<line x1="${x0}" y1="${gy}" x2="${x0 + G}" y2="${gy}" stroke="var(--chalk)" stroke-width="${w}" opacity="${op}"></line>`;
      }
      const rowBand = `<rect x="${x0}" y="${y0}" width="${G}" height="${m * cs}" fill="rgba(240,196,92,.24)"></rect>`;
      const colBand = `<rect x="${x0}" y="${y0}" width="${n * cs}" height="${G}" fill="rgba(127,201,191,.22)"></rect>`;
      const over = `<rect x="${x0}" y="${y0}" width="${n * cs}" height="${m * cs}" fill="var(--ok)" opacity="0.85" stroke="var(--chalk)" stroke-width="1.4"></rect>`;
      const frame = `<rect x="${x0}" y="${y0}" width="${G}" height="${G}" fill="none" stroke="var(--chalk)" stroke-width="2"></rect>`;
      const topLab = `<text x="${x0 + (n * cs) / 2}" y="${y0 - 8}" fill="var(--accent)" font-size="12.5" font-weight="700" text-anchor="middle">0,${n} → ${n} cột</text>`;
      const leftLab = `<text x="132" y="${y0 + (m * cs) / 2 + 4}" fill="var(--warn)" font-size="12.5" font-weight="700" text-anchor="end">0,${m} ↓ ${m} hàng</text>`;
      const head = `<text x="150" y="18" fill="rgba(242,240,230,.72)" font-size="12">Lưới 100 ô = 1 → mỗi ô nhỏ là 0,01 (một phần trăm)</text>`;
      const res = `<text x="360" y="52" fill="var(--chalk)" font-size="15" font-weight="700">0,${m} × 0,${n}</text>`
        + `<text x="360" y="76" fill="var(--ok)" font-size="15" font-weight="700">= ${P} ô = ${P}/100</text>`
        + `<text x="360" y="100" fill="var(--accent)" font-size="18" font-weight="700">= ${this.vnf(P / 100)}</text>`;
      const rule = `<text x="20" y="242" fill="rgba(242,240,230,.82)" font-size="12">Quy tắc: 1 chữ số thập phân × 1 chữ số thập phân → tích có 1 + 1 = 2 chữ số thập phân (bỏ chữ số 0 tận cùng nếu có).</text>`;
      host.innerHTML = `<svg id="decarea" width="548" height="258" viewBox="0 0 548 258">` + head + rowBand + colBand + over + grid + frame + topLab + leftLab + res + rule + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, m = this.mv(st), n = this.nv(st), P = this.pv(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: một ô vuông lớn = 1, chia thành 100 ô nhỏ (mỗi ô = 0,01). Tô ${m} hàng = 0,${m}, rồi ${n} cột = 0,${n}.`, hint: 'Đếm số ô nơi HÀNG và CỘT chồng lên nhau.' };
      if (s === 2) return { cap: `Sơ đồ: ${m} hàng × ${n} cột = ${P} ô sáng, mà mỗi ô = 0,01 → 0,${m} × 0,${n} = ${P}/100 = ${this.vnf(P / 100)}.`, hint: 'Tích có 2 chữ số thập phân (1 + 1).' };
      if (s === 3) return { cap: `Phép tính: 0,${m} × 0,${n} = ${this.vnf(P / 100)}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp: 0,${m} × 0,${n} bằng bao nhiêu? Đếm ${P} ô sáng rồi đổi ra số thập phân.`, hint: '' };
    },
    value(st) { const m = this.mv(st), n = this.nv(st), P = this.pv(st); return `0,${m} × 0,${n} = ${this.vnf(P / 100)}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const P = this.pv(st), n = clamp(P, 1, 81), sc = Math.min(3.6 / Math.ceil(Math.sqrt(n)), 0.5), side = Math.ceil(Math.sqrt(n));
      const g = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.5 });
      for (let j = 0; j < n; j++) { const r = Math.floor(j / side), c = j % side; const msh = new THREE.Mesh(new THREE.BoxGeometry(sc * 0.8, sc * 0.3, sc * 0.8), mat); msh.position.set((c - (side - 1) / 2) * sc, 0, (r - (side - 1) / 2) * sc); g.add(msh); }
      return g;
    },
    paint3d() {},
  },
  // ======================= Model: decadd (cộng · trừ số thập phân — thẳng dấu phẩy, beyond-bank) =======================
  // Ý cốt: học trò cộng 34 + 25 = 59 rồi KHÔNG biết đặt dấu phẩy, hoặc quên nhớ 1 khi phần mười ≥ 10,
  // hoặc quên mượn 1 khi phần mười trừ không đủ. Mô hình = thanh ĐỘ DÀI trên thước (trực quan) + CỘT ĐẶT
  // TÍNH thẳng dấu phẩy (thuật toán), hai hàng số luôn có một ĐƯỜNG ĐỨT QUA DẤU PHẨY để nhấn "thẳng hàng".
  decadd: {
    keys() { return ['dcAW', 'dcAT', 'dcBW', 'dcBT']; },
    g(st) { return this.keys().map((k) => clamp(Math.round(st[k]), 0, 9)); },
    dfmt(v) { const neg = v < 0; v = Math.abs(Math.round(v)); const w = Math.floor(v / 10), t = v % 10; return (neg ? '−' : '') + w + ',' + t; },
    res(st) {
      const [aw, at, bw, bt] = this.g(st), sa = aw * 10 + at, sb = bw * 10 + bt, add = Math.round(clamp(st.dcOp, 0, 1)) >= 1;
      const sr = add ? sa + sb : sa - sb, ok = sr >= 0, m = Math.abs(sr);
      const carry = add && (at + bt >= 10), borrow = !add && ok && (at < bt);
      return { aw, at, bw, bt, sa, sb, add, sr, ok, carry, borrow, wd: Math.floor(m / 10), td: m % 10 };
    },
    defaults(st, L) { st.dcAW = (L.dcAW != null ? L.dcAW : 3); st.dcAT = (L.dcAT != null ? L.dcAT : 4); st.dcBW = (L.dcBW != null ? L.dcBW : 2); st.dcBT = (L.dcBT != null ? L.dcBT : 5); st.dcOp = (L.dcOp != null ? L.dcOp : 1); st.dcSel = (L.dcSel != null ? L.dcSel : 0); },
    geomSig(st) { return 'dc' + this.g(st).join('') + Math.round(clamp(st.dcOp, 0, 1)) + clamp(Math.round(st.dcSel), 0, 3); },
    params() { return [{ key: 'dcAW', label: 'Số 1 · phần đơn vị', min: 0, max: 9 }, { key: 'dcAT', label: 'Số 1 · phần mười', min: 0, max: 9 }, { key: 'dcBW', label: 'Số 2 · phần đơn vị', min: 0, max: 9 }, { key: 'dcBT', label: 'Số 2 · phần mười', min: 0, max: 9 }, { key: 'dcOp', label: 'Phép (1 = cộng, 0 = trừ)', min: 0, max: 1 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bấm một CHỮ SỐ để chọn ô, giơ 0–9 ngón đặt chữ số đó, hoặc +/− từng ô. Phần mười ≥ 10 khi CỘNG → NHỚ 1 sang đơn vị; khi TRỪ mà phần mười bên trên nhỏ hơn → MƯỢN 1 (tức 10 phần mười) của hàng đơn vị.'; },
    hand(st, f) { st[this.keys()[clamp(Math.round(st.dcSel), 0, 3)]] = clamp(Math.round(f), 0, 9); },
    handLabel(f, st) { const nm = ['đơn vị của số 1', 'phần mười của số 1', 'đơn vị của số 2', 'phần mười của số 2']; return '→ ' + clamp(Math.round(f), 0, 9) + ' (' + nm[clamp(Math.round(st.dcSel), 0, 3)] + ')'; },
    draw2d(host, st) {
      const r = this.res(st), sel = clamp(Math.round(st.dcSel), 0, 3);
      const x0 = 24, x1 = 250, upx = (x1 - x0) / 20, baseY = 92, barH = 20;
      const X = (v) => x0 + (v / 10) * upx;
      const rulerTitle = `<text x="${x0}" y="${baseY - barH - 24}" fill="rgba(242,240,230,.72)" font-size="11.5">Thước đề-xi-mét (mỗi vạch nhỏ = 0,1 dm)</text>`;
      let ticks = '';
      for (let u = 0; u <= 20; u++) { const tx = X(u * 10), big = u % 5 === 0;
        ticks += `<line x1="${tx.toFixed(1)}" y1="${baseY}" x2="${tx.toFixed(1)}" y2="${baseY + (big ? 8 : 4)}" stroke="var(--chalk)" stroke-width="${big ? 1.4 : 0.7}" opacity="${big ? 0.85 : 0.4}"></line>`;
        if (big) ticks += `<text x="${tx.toFixed(1)}" y="${baseY + 20}" fill="rgba(242,240,230,.55)" font-size="10" text-anchor="middle">${u}</text>`; }
      const axis = `<line x1="${x0}" y1="${baseY}" x2="${x1}" y2="${baseY}" stroke="var(--chalk)" stroke-width="1.4" opacity="0.75"></line>`;
      let bars = '';
      if (r.add) {
        const ax = X(0), aw = X(r.sa), bEnd = X(r.sr);
        bars += `<rect x="${ax.toFixed(1)}" y="${baseY - barH}" width="${Math.max(0, aw - ax).toFixed(1)}" height="${barH}" fill="rgba(127,201,191,.8)" stroke="var(--chalk)" stroke-width="1.2"></rect>`;
        bars += `<rect x="${aw.toFixed(1)}" y="${baseY - barH}" width="${Math.max(0, bEnd - aw).toFixed(1)}" height="${barH}" fill="rgba(240,196,92,.8)" stroke="var(--chalk)" stroke-width="1.2"></rect>`;
        bars += `<text x="${((ax + aw) / 2).toFixed(1)}" y="${baseY - barH - 4}" fill="var(--accent)" font-size="12" font-weight="700" text-anchor="middle">${this.dfmt(r.sa)}</text>`;
        bars += `<text x="${((aw + bEnd) / 2).toFixed(1)}" y="${baseY - barH - 4}" fill="var(--warn)" font-size="12" font-weight="700" text-anchor="middle">+${this.dfmt(r.sb)}</text>`;
        bars += `<line x1="${bEnd.toFixed(1)}" y1="${baseY - barH - 1}" x2="${bEnd.toFixed(1)}" y2="${baseY + 2}" stroke="var(--ok)" stroke-width="2.2"></line>`;
        bars += `<text x="${bEnd.toFixed(1)}" y="${baseY + 34}" fill="var(--ok)" font-size="13" font-weight="700" text-anchor="middle">= ${this.dfmt(r.sr)}</text>`;
      } else if (r.ok) {
        const ax = X(0), aw = X(r.sa), bs = X(r.sb);
        bars += `<rect x="${ax.toFixed(1)}" y="${baseY - barH}" width="${Math.max(0, bs - ax).toFixed(1)}" height="${barH}" fill="rgba(240,90,90,.45)" stroke="var(--warn)" stroke-width="1.2"></rect>`;
        bars += `<rect x="${bs.toFixed(1)}" y="${baseY - barH}" width="${Math.max(0, aw - bs).toFixed(1)}" height="${barH}" fill="var(--ok)" opacity="0.85" stroke="var(--chalk)" stroke-width="1.2"></rect>`;
        bars += `<text x="${((ax + bs) / 2).toFixed(1)}" y="${baseY - barH - 4}" fill="var(--warn)" font-size="12" font-weight="700" text-anchor="middle">−${this.dfmt(r.sb)}</text>`;
        bars += `<text x="${((bs + aw) / 2).toFixed(1)}" y="${baseY + 34}" fill="var(--ok)" font-size="13" font-weight="700" text-anchor="middle">còn ${this.dfmt(r.sr)}</text>`;
      } else {
        bars += `<text x="${x0}" y="${baseY - barH - 6}" fill="var(--warn)" font-size="11.5" font-weight="700">⚠ Số bị trừ ${this.dfmt(r.sa)} phải ≥ số trừ ${this.dfmt(r.sb)}.</text>`;
        bars += `<text x="${x0}" y="${baseY + 4}" fill="rgba(242,240,230,.7)" font-size="11">Ở tiểu học kết quả chưa âm — cô chọn số trên lớn hơn.</text>`;
      }
      const cT = 322, cO = 360, cP = 416, cmX = 390, boxW = 32, boxH = 30;
      const ryA = 74, ryB = 112, hrY = 140, ryR = 172;
      const cell = (i, cx, cy, val) => { const on = i === sel;
        return `<g data-dc="${i}" style="cursor:pointer"><rect x="${(cx - boxW / 2).toFixed(0)}" y="${(cy - boxH / 2).toFixed(0)}" width="${boxW}" height="${boxH}" rx="4" fill="${on ? 'rgba(240,196,92,.22)' : 'rgba(255,255,255,.04)'}" stroke="${on ? 'var(--accent)' : 'rgba(242,240,230,.28)'}" stroke-width="${on ? 2 : 1}"></rect>`
          + `<text x="${cx}" y="${cy + 5}" fill="var(--chalk)" font-size="17" font-weight="700" text-anchor="middle">${val}</text></g>`; };
      const st2 = (cx, cy, ch) => `<text x="${cx}" y="${cy + 5}" fill="var(--chalk)" font-size="16" font-weight="700" text-anchor="middle">${ch}</text>`;
      let tbl = `<text x="${cT - 30}" y="18" fill="rgba(242,240,230,.72)" font-size="11.5">Đặt tính (thẳng dấu phẩy)</text>`;
      tbl += `<text x="${cO}" y="42" fill="var(--accent)" font-size="11.5" text-anchor="middle">ĐV</text>`;
      tbl += `<text x="${cP}" y="42" fill="var(--warn)" font-size="11.5" text-anchor="middle">PM</text>`;
      tbl += `<line x1="${cmX}" y1="50" x2="${cmX}" y2="${ryR + 18}" stroke="var(--accent)" stroke-dasharray="3 3" stroke-width="1.2" opacity="0.6"></line>`;
      tbl += cell(0, cO, ryA, r.aw) + st2(cmX, ryA, ',') + cell(1, cP, ryA, r.at);
      tbl += `<text x="${cT - 24}" y="${ryB + 5}" fill="var(--chalk)" font-size="17" font-weight="700" text-anchor="middle">${r.add ? '+' : '−'}</text>`;
      tbl += cell(2, cO, ryB, r.bw) + st2(cmX, ryB, ',') + cell(3, cP, ryB, r.bt);
      tbl += `<line x1="${cT - 30}" y1="${hrY}" x2="${cP + boxW / 2}" y2="${hrY}" stroke="var(--chalk)" stroke-width="1.6"></line>`;
      if (r.ok) { const tDigit = r.wd >= 10 ? st2(cT, ryR, Math.floor(r.wd / 10)) : ''; tbl += tDigit + st2(cO, ryR, r.wd % 10) + st2(cmX, ryR, ',') + st2(cP, ryR, r.td); }
      else { tbl += `<text x="${(cO + 26)}" y="${ryR + 5}" fill="var(--warn)" font-size="15" font-weight="700" text-anchor="middle">? , ?</text>`; }
      if (r.carry) tbl += `<text x="${cP}" y="${ryA - 16}" fill="var(--ok)" font-size="10.5" font-weight="700" text-anchor="middle">nhớ 1 ↖</text>`;
      if (r.borrow) tbl += `<text x="${cP}" y="${ryB - 20}" fill="var(--warn)" font-size="10.5" font-weight="700" text-anchor="middle">mượn 1 (= 10 PM)</text>`;
      const selLab = `<text x="${cT - 30}" y="${ryR + 40}" fill="var(--accent)" font-size="11">Đang chọn: ${['ĐV số 1', 'PM số 1', 'ĐV số 2', 'PM số 2'][sel]} — giơ 0–9 ngón để đặt.</text>`;
      const rule1 = `<text x="16" y="216" fill="rgba(242,240,230,.85)" font-size="12">Thẳng hàng DẤU PHẨY rồi cộng/trừ như số tự nhiên. 10 phần mười = 1 đơn vị.</text>`;
      const rule2 = `<text x="16" y="234" fill="var(--warn)" font-size="11.5">❌ Lỗi hay gặp: quên NHỚ 1 (phần mười ≥ 10) hoặc quên MƯỢN 1, hoặc quên dấu phẩy ở kết quả.</text>`;
      host.innerHTML = `<svg id="decadd" width="548" height="258" viewBox="0 0 548 258">` + rulerTitle + ticks + axis + bars + tbl + selLab + rule1 + rule2 + `</svg>`;
      const svg = host.querySelector('#decadd');
      if (svg && svg.querySelectorAll) svg.querySelectorAll('g[data-dc]').forEach((g) => g.addEventListener('pointerdown', () => { state.dcSel = +g.dataset.dc; drawVisual(); render(); }));
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.res(st);
      const e1 = this.dfmt(r.sa), e2 = this.dfmt(r.sb), res = r.ok ? this.dfmt(r.sr) : '?', sign = r.add ? '+' : '−';
      const pmNote = r.carry ? `Phần mười ${r.at} + ${r.bt} = ${r.at + r.bt} → NHỚ 1 sang đơn vị.` : r.borrow ? `Phần mười ${r.at} trừ ${r.bt} không đủ → MƯỢN 1 (= 10 phần mười) của đơn vị.` : 'Phần mười vừa đủ — không nhớ, không mượn.';
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hai dải giấy dài ${e1} dm và ${e2} dm. ${r.add ? 'Nối tiếp nhau thì' : 'Dải dài hơn hơn dải ngắn là'} bao nhiêu đề-xi-mét?`, hint: 'Nhìn phần mười: ≥ 10 thì nhớ, không đủ thì mượn.' };
      if (s === 2) return { cap: `Sơ đồ: ${r.add ? `dải ${e1} nối tiếp dải ${e2} → mũi tên dừng ở ${res} dm` : `dải ${e1} cắt bỏ ${e2} dm → còn lại ${res} dm`}. ${pmNote}`, hint: `Ở cột đặt tính, dấu phẩy của ${e1}, ${e2} và ${res} thẳng hàng trên một đường đứt.` };
      if (s === 3) return { cap: `Phép tính: ${e1} ${sign} ${e2} = ${res}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp: ${e1} ${sign} ${e2} bằng bao nhiêu? Đặt thẳng dấu phẩy, xử lí phần mười trước (nhớ/mượn), rồi đọc kết quả.`, hint: '' };
    },
    value(st) { const r = this.res(st); return `${this.dfmt(r.sa)} ${r.add ? '+' : '−'} ${this.dfmt(r.sb)} = ${r.ok ? this.dfmt(r.sr) : 'số trên phải ≥ số dưới'}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const r = this.res(st), n = clamp(Math.abs(r.sr), 1, 100), side = Math.ceil(Math.sqrt(n)), sc = Math.min(3.6 / side, 0.5);
      const g = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color: r.add ? 0x7fc9bf : 0xf0c45c, roughness: 0.5 });
      for (let j = 0; j < n; j++) { const rr = Math.floor(j / side), c = j % side; const msh = new THREE.Mesh(new THREE.BoxGeometry(sc * 0.8, sc * 0.3, sc * 0.8), mat); msh.position.set((c - (side - 1) / 2) * sc, 0, (rr - (side - 1) / 2) * sc); g.add(msh); }
      return g;
    },
    paint3d() {},
  },
  // ======================= Model: natdivdec (chia STN cho STN ra thương thập phân — beyond-bank) =======================
  // Ý cốt: học trò DỪNG ở "thương dư" khi đề bài cần số thập phân. Khi còn dư thì THÊM 0 vào bên phải phần dư rồi chia
  // TIẾP → ra chữ số hàng phần mười. 7 : 2 = 3 (dư 1) → 10 : 2 = 5 → 3,5. Cắt phần dư thành 10 phần mười, chia đều các phần.
  natdivdec: {
    res(st) { const a = clamp(Math.round(st.ndA), 1, 20), b = clamp(Math.round(st.ndB), 2, 5); const q = Math.floor(a / b), r = a - q * b; const t = Math.floor((r * 10) / b), r2 = r * 10 - t * b; const full = Math.round((a / b) * 100) / 100; return { a, b, q, r, t, r2, full, exact: Math.abs(full * b - a) < 1e-9 }; },
    fmt2(x) { const s = Math.round(x * 100) / 100; if (Number.isInteger(s)) return String(s); let t = s.toFixed(2); if (t.endsWith('0')) t = t.slice(0, -1); return t.replace('.', ','); },
    defaults(st, L) { st.ndA = (L.ndA != null ? L.ndA : 7); st.ndB = (L.ndB != null ? L.ndB : 2); },
    geomSig(st) { const d = this.res(st); return 'nd' + d.a + ',' + d.b; },
    params() { return [{ key: 'ndA', label: 'Số bị chia', min: 1, max: 20 }, { key: 'ndB', label: 'Số chia (số phần chia đều)', min: 2, max: 5 }]; },
    toggles() { return []; },
    ctlHint() { return 'Giơ 2–5 ngón = SỐ CHIA (chia thành mấy phần đều nhau); +/− đặt số bị chia và số chia. Phần còn DƯ được cắt thành 10 phần mười rồi chia tiếp.'; },
    hand(st, f) { st.ndB = clamp(Math.round(f), 2, 5); },
    handLabel(f) { return '→ chia cho ' + clamp(Math.round(f), 2, 5) + ' phần'; },
    draw2d(host, st) {
      const d = this.res(st);
      const us = 15, gp = 2, x0 = 16, yu = 44;
      let units = '';
      for (let j = 0; j < d.a; j++) { const col = j % 10, row = Math.floor(j / 10); const x = x0 + col * (us + gp), y = yu + row * (us + 4); const whole = j < d.q * d.b; units += `<rect x="${x}" y="${y}" width="${us}" height="${us}" fill="${whole ? 'rgba(127,201,191,.85)' : 'rgba(240,143,107,.85)'}" stroke="var(--chalk)" stroke-width="1"></rect>`; }
      const rows = Math.max(1, Math.ceil(d.a / 10));
      const below = yu + rows * (us + 4) + 8;
      const uLbl = `<text x="${x0}" y="${yu - 8}" fill="rgba(242,240,230,.72)" font-size="12">${d.a} ô — ${d.r > 0 ? `xanh: chia đều ${d.b} phần · cam: ${d.r} ô còn dư` : 'chia đều, không còn dư'}</text>`;
      const qval = d.a / d.b, px = 15, barX = x0, barY = below, bw = Math.max(2, qval * px);
      let bar = `<text x="${barX}" y="${barY - 4}" fill="var(--accent)" font-size="12" font-weight="700">Mỗi phần (thương) = ${d.q},${d.t}${d.exact ? '' : '…'}</text>`;
      bar += `<rect x="${barX}" y="${barY}" width="${bw.toFixed(1)}" height="16" fill="rgba(127,201,191,.75)" stroke="var(--chalk)"></rect>`;
      for (let k = 1; k <= Math.floor(qval); k++) bar += `<line x1="${(barX + k * px).toFixed(1)}" y1="${barY}" x2="${(barX + k * px).toFixed(1)}" y2="${barY + 16}" stroke="rgba(242,240,230,.45)" stroke-width="1"></line>`;
      if (d.t > 0) bar += `<rect x="${(barX + d.q * px).toFixed(1)}" y="${barY}" width="${((d.t / 10) * px).toFixed(1)}" height="16" fill="var(--warn)" opacity="0.9"></rect>`;
      const remY = barY + 32;
      let rem = '';
      if (d.r > 0) {
        rem += `<text x="${x0}" y="${remY}" fill="var(--warn)" font-size="12" font-weight="700">Dư ${d.r} ô → cắt mỗi ô 10 phần mười = ${d.r * 10} phần; chia đều ${d.b} phần → mỗi phần ${d.t} phần mười${d.r2 > 0 ? `, còn dư ${d.r2}` : ', vừa hết'}.</text>`;
        const sx = x0, sy = remY + 5, w = 12, g2 = 2, show = Math.min(d.r * 10, 20);
        for (let j = 0; j < show; j++) { const filled = j < d.t; rem += `<rect x="${sx + j * (w + g2)}" y="${sy}" width="${w}" height="10" fill="${filled ? 'var(--warn)' : 'rgba(242,240,230,.14)'}" stroke="var(--chalk)" stroke-width="0.6"></rect>`; }
      } else {
        rem += `<text x="${x0}" y="${remY}" fill="var(--ok)" font-size="12" font-weight="700">Chia hết, không còn dư — thương là số tự nhiên.</text>`;
      }
      const exX = 344;
      const eq = `<text x="${exX}" y="58" fill="var(--chalk)" font-size="20" font-weight="700">${d.a} : ${d.b}</text>`
        + `<text x="${exX}" y="86" fill="var(--ok)" font-size="20" font-weight="700">= ${this.fmt2(d.full)}</text>`
        + `<text x="${exX}" y="112" fill="rgba(242,240,230,.85)" font-size="12">1) ${d.a} : ${d.b} = ${d.q} dư ${d.r}</text>`
        + `<text x="${exX}" y="132" fill="rgba(242,240,230,.85)" font-size="12">2) viết dấu phẩy, thêm 0 → ${d.r}0</text>`
        + `<text x="${exX}" y="152" fill="rgba(242,240,230,.85)" font-size="12">3) ${d.r * 10} : ${d.b} = ${d.t}${d.r2 > 0 ? ' dư ' + d.r2 : ''}</text>`;
      const err = `<text x="${x0}" y="240" fill="var(--warn)" font-size="11.5">❌ Lỗi hay gặp: dừng ở "${d.q} dư ${d.r}" khi đề cần thương thập phân → phải thêm 0 chia tiếp → ${this.fmt2(d.full)}.</text>`;
      host.innerHTML = `<svg id="natdivdec" width="548" height="258" viewBox="0 0 548 258">` + uLbl + units + bar + rem + eq + err + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: có ${d.a} chiếc bánh chia đều cho ${d.b} bạn → mỗi bạn ${d.q} cái nguyên, còn thừa ${d.r} cái. Chia tiếp cái thừa thế nào?`, hint: d.r > 0 ? 'Cắt phần thừa thành 10 phần bằng nhau rồi mới chia.' : 'Chia vừa hết, không còn phần thừa.' };
      if (s === 2) return { cap: `Sơ đồ: ${d.r > 0 ? `cắt ${d.r} cái thừa thành ${d.r * 10} phần mười, chia đều ${d.b} phần → mỗi bạn ${d.t} phần mười${d.r2 > 0 ? ` (còn dư ${d.r2}, lại thêm 0 chia tiếp)` : ''}` : 'mỗi bạn đúng ' + d.q + ' cái, vừa hết'}. Thương = ${d.q},${d.t}${d.exact ? '' : '…'}.`, hint: 'Viết DẤU PHẨY vào thương ngay khi bắt đầu chia phần thừa.' };
      if (s === 3) return { cap: `Phép tính: ${d.a} : ${d.b} = ${this.fmt2(d.full)}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp: ${d.a} : ${d.b} bằng bao nhiêu? Chia đến hết phần nguyên, còn dư thì THÊM 0 chia tiếp ra phần thập phân.`, hint: '' };
    },
    value(st) { const d = this.res(st); return `${d.a} : ${d.b} = ${this.fmt2(d.full)}${d.exact ? '' : '…'}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), n = clamp(d.a, 1, 20), side = Math.ceil(Math.sqrt(n)), sc = Math.min(3.6 / side, 0.55);
      const g = new THREE.Group(), matT = new THREE.MeshStandardMaterial({ color: 0x7fc9bf, roughness: 0.5 }), matW = new THREE.MeshStandardMaterial({ color: 0xf08f6b, roughness: 0.5 });
      for (let j = 0; j < n; j++) { const rr = Math.floor(j / side), c = j % side; const msh = new THREE.Mesh(new THREE.BoxGeometry(sc * 0.8, sc * 0.3, sc * 0.8), j < d.q * d.b ? matT : matW); msh.position.set((c - (side - 1) / 2) * sc, 0, (rr - (side - 1) / 2) * sc); g.add(msh); }
      return g;
    },
    paint3d() {},
  },
  // ======================= Model: lenunits (bảng đơn vị đo độ dài km·hm·dam·m·dm·cm·mm — beyond-bank) =======================
  // Ý cốt: CÙNG MỘT độ dài nhưng mỗi đơn vị cho một CON SỐ khác nhau; hai đơn vị LIỀN NHAU hơn kém đúng 10 lần.
  // Bậc thang 7 hàng: đơn vị càng xuống dưới (càng nhỏ) thì số đo càng LỚN (×10 mỗi bậc), ngược lại :10.
  lenunits: {
    U: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'],
    mp() { return [1000, 100, 10, 1, 0.1, 0.01, 0.001]; },
    lvf(x) { const r = Math.round(x * 1e6) / 1e6; if (Number.isInteger(r)) return String(r); let t = r.toFixed(6).replace(/0+$/, ''); if (t.endsWith('.')) t = t.slice(0, -1); return t.replace('.', ','); },
    noun(u) { return ['quãng đường giữa hai tỉnh', 'thửa ruộng', 'chiều ngang lớp học', 'bảng lớp', 'gang tay người lớn', 'chiếc bút chì', 'hạt thóc'][clamp(u, 0, 6)]; },
    res(st) { const u = clamp(Math.round(st.luUnit), 0, 6), num = clamp(Math.round(st.luNum), 1, 20); const cnt = []; for (let i = 0; i < 7; i++) cnt.push(num * Math.pow(10, i - u)); return { u, num, meters: num * this.mp()[u], cnt }; },
    defaults(st, L) { st.luNum = (L.luNum != null ? L.luNum : 3); st.luUnit = (L.luUnit != null ? L.luUnit : 3); },
    geomSig(st) { const d = this.res(st); return 'lu' + d.num + ',' + d.u; },
    params() { return [{ key: 'luNum', label: 'Số đo ở đơn vị đang chọn', min: 1, max: 20 }, { key: 'luUnit', label: 'Đơn vị đang chọn (bậc)', min: 0, max: 6 }]; },
    toggles() { return []; },
    ctlHint() { return 'Bấm một BẬC trên thang để chọn đơn vị đang đo; giơ 1–9 ngón đặt con số; +/− chỉnh. Mỗi bậc liền nhau ×10.'; },
    hand(st, f) { st.luNum = clamp(Math.round(f), 1, 20); },
    handLabel(f) { return '→ số đo = ' + clamp(Math.round(f), 1, 20); },
    draw2d(host, st) {
      const d = this.res(st);
      const yb = (i) => 42 + i * 27;
      let rows = '', x10 = '';
      for (let i = 0; i < 7; i++) {
        const on = i === d.u, isM = i === 3, y = yb(i);
        rows += `<g data-lu="${i}" style="cursor:pointer"><rect x="16" y="${y - 17}" width="190" height="24" rx="3" fill="${on ? 'rgba(240,196,92,.20)' : (isM ? 'rgba(127,201,191,.10)' : 'rgba(255,255,255,.03)')}" stroke="${on ? 'var(--accent)' : 'rgba(242,240,230,.14)'}" stroke-width="${on ? 2 : 1}"></rect>`
          + `<text x="26" y="${y - 1}" font-size="13" font-weight="${on ? 700 : 500}" fill="${on ? 'var(--accent)' : 'var(--chalk)'}">${this.U[i]}</text>`
          + `<text x="198" y="${y - 1}" text-anchor="end" font-size="15" font-weight="${on ? 800 : 500}" fill="${on ? 'var(--accent)' : 'rgba(242,240,230,.92)'}">${this.lvf(d.cnt[i])}</text></g>`;
        if (i < 6) x10 += `<text x="209" y="${y + 12}" font-size="8.5" fill="rgba(242,240,230,.45)">×10</text>`;
      }
      const eq = `<text x="232" y="38" fill="rgba(242,240,230,.7)" font-size="12">Cùng MỘT độ dài, mỗi đơn vị một số:</text>`
        + `<text x="232" y="66" fill="var(--accent)" font-size="22" font-weight="800">${this.lvf(d.num)} ${this.U[d.u]}</text>`
        + `<text x="232" y="94" fill="var(--chalk)" font-size="17">= ${this.lvf(d.meters)} m</text>`
        + `<text x="232" y="118" fill="var(--chalk)" font-size="15">= ${this.lvf(d.cnt[6])} mm</text>`
        + `<text x="232" y="150" fill="rgba(242,240,230,.85)" font-size="12.5">Hai đơn vị LIỀN NHAU hơn kém 10 lần.</text>`
        + `<text x="232" y="170" fill="rgba(242,240,230,.85)" font-size="12.5">Xuống bậc (đơn vị nhỏ hơn) → số ×10.</text>`
        + `<text x="232" y="190" fill="rgba(242,240,230,.85)" font-size="12.5">Lên bậc (đơn vị to hơn) → số :10.</text>`;
      const err = `<text x="16" y="244" fill="var(--warn)" font-size="11.5">❌ Nhầm: 3 m = 30 mm? Sai. m → mm là XUỐNG 3 bậc = ×1000 → 3 m = 3000 mm.</text>`;
      host.innerHTML = `<svg id="lenunits" width="548" height="258" viewBox="0 0 548 258">`
        + `<text x="16" y="20" fill="var(--chalk)" font-size="13" font-weight="700">Bậc thang đơn vị đo độ dài</text>`
        + rows + x10 + eq + err + `</svg>`;
      const svg = host.querySelector('#lenunits');
      if (svg && svg.querySelectorAll) svg.querySelectorAll('g[data-lu]').forEach((g) => g.addEventListener('pointerdown', () => { state.luUnit = +g.dataset.lu; drawVisual(); render(); }));
    },
    caption(st) {
      const L = cur(), s = st.step, d = this.res(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${this.noun(d.u)} dài ${this.lvf(d.num)} ${this.U[d.u]}. Đo bằng ${this.U[d.u]} thì được đúng ${d.num} đoạn; nhưng đổi sang ${this.U[Math.min(6, d.u + 1)]} (đơn vị bé hơn một bậc) thì con số sẽ lớn gấp mấy lần?`, hint: 'Đơn vị nhỏ hơn ⇒ cùng độ dài ⇒ số đo lớn hơn (×10 mỗi bậc).' };
      if (s === 2) return { cap: `Sơ đồ bậc thang: ${this.lvf(d.num)} ${this.U[d.u]} = ${this.lvf(d.meters)} m. Dọc cột trái, xuống một bậc thì số ×10, lên một bậc thì số :10 — vì hai đơn vị độ dài liền nhau luôn hơn kém nhau đúng 10 lần.`, hint: 'Đếm số bậc giữa hai đơn vị để biết nhân/chia bao nhiêu lần 10.' };
      if (s === 3) return { cap: `Phép tính: ${this.lvf(d.num)} ${this.U[d.u]} = ${this.lvf(d.meters)} m = ${this.lvf(d.cnt[6])} mm. ` + L.chot, hint: '' };
      return { cap: `Cả lớp: ${this.lvf(d.num)} ${this.U[d.u]} bằng bao nhiêu mét? Đi từ ${this.U[d.u]} tới mét là ${Math.abs(3 - d.u)} bậc, ${d.u < 3 ? ('xuống nên ×1' + '0'.repeat(3 - d.u)) : (d.u > 3 ? ('lên nên :1' + '0'.repeat(d.u - 3)) : 'bằng mét rồi')}.`, hint: '' };
    },
    value(st) { const d = this.res(st); return `${this.lvf(d.num)} ${this.U[d.u]} = ${this.lvf(d.meters)} m`; },
    showFromStep() { return 2; },
    build3d(st) {
      const d = this.res(st), g = new THREE.Group();
      const matSel = new THREE.MeshStandardMaterial({ color: 0xf0c45c, roughness: 0.5 }), matDim = new THREE.MeshStandardMaterial({ color: 0x4d635a, roughness: 0.6 });
      for (let i = 0; i < 7; i++) { const step = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.18, 0.6), i === d.u ? matSel : matDim); step.position.set(0, 1.7 - i * 0.5, (i - 3) * 0.78); g.add(step); }
      const n = Math.min(d.num, 20), topY = 1.7 - d.u * 0.5 + 0.34, z = (d.u - 3) * 0.78;
      for (let j = 0; j < n; j++) { const col = j % 8, rw = Math.floor(j / 8); const c = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), matSel); c.position.set(-1.4 + col * 0.4, topY + rw * 0.34, z); g.add(c); }
      return g;
    },
    paint3d() {},
  },
});

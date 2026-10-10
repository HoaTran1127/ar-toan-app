// ---- tiep MODELS: gop vao object MODELS (giu nguyen thu tu key) ----
Object.assign(MODELS, {
  // ======================= Model: prob (xác suất — hộp bóng màu) =======================
  // Repo xac-suat: "liệt kê hết kết quả có thể rồi đếm kết quả thuận lợi"; "không thuận lợi = không
  // thể, mọi kết quả thuận lợi = chắc chắn". Hộp có bóng đỏ/xanh/vàng; bấm màu để ĐỔI câu hỏi,
  // giơ ngón tay = số bóng màu đang hỏi. P = thuận lợi / tổng.
  prob: {
    colors() { return [['đỏ', '#e0483d', 0xe0483d], ['xanh', '#4d9de0', 0x4d9de0], ['vàng', '#ffd166', 0xffd166]]; },
    keys() { return ['pR', 'pB', 'pY']; },
    counts(st) { return [st.pR, st.pB, st.pY]; },
    total(st) { return st.pR + st.pB + st.pY; },
    defaults(st, L) { st.pR = L.pR; st.pB = L.pB; st.pY = L.pY; st.pAsk = L.pAsk; },
    word(st) { const c = this.counts(st)[st.pAsk], t = this.total(st);
      if (t === 0) return 'hộp trống'; if (c === 0) return 'KHÔNG THỂ'; if (c === t) return 'CHẮC CHẮN';
      if (c/t > 0.5) return 'CÓ THỂ (nhiều khả năng)'; if (c/t < 0.5) return 'CÓ THỂ (ít khả năng)';
      return 'CÓ THỂ (khả năng ngang nhau)'; },
    geomSig(st) { return 'prob' + st.pR + st.pB + st.pY; },
    params() { const cs = this.colors(); return [
      { key:'pR', label:'Bóng ' + cs[0][0], min:0, max:8 }, { key:'pB', label:'Bóng ' + cs[1][0], min:0, max:8 },
      { key:'pY', label:'Bóng ' + cs[2][0], min:0, max:8 }]; },
    ctlHint() { return 'Bấm một màu để đổi câu hỏi, giơ 0–5 ngón đặt số bóng màu đó, hoặc +/− từng màu.'; },
    draw2d(host, st) {
      const cs = this.colors(), cnt = this.counts(st), t = this.total(st), ask = st.pAsk;
      const W = 528, Hh = 250, jarX = 34, jarY = 66, jarW = 214, jarH = 158;
      let balls = ''; let i = 0;
      for (let c = 0; c < 3; c++) for (let k = 0; k < cnt[c]; k++) { const bx = jarX + 26 + (i%6)*30, by = jarY + 26 + Math.floor(i/6)*30; i++;
        balls += `<circle cx="${bx}" cy="${by}" r="12" fill="${cs[c][1]}" stroke="${c===ask?'#fff':'rgba(0,0,0,.35)'}" stroke-width="${c===ask?2.5:1}"></circle>`; }
      let legend = ''; const lx = 280;
      for (let c = 0; c < 3; c++) { const yy = 84 + c*46, sel = c === ask;
        legend += `<g data-ask="${c}" style="cursor:pointer">`
          + `<rect x="${lx-10}" y="${yy-20}" width="220" height="38" rx="6" fill="${sel?'rgba(255,255,255,.10)':'transparent'}" stroke="${sel?'var(--accent)':'rgba(242,240,230,.18)'}" stroke-width="${sel?2:1}"></rect>`
          + `<circle cx="${lx+8}" cy="${yy}" r="12" fill="${cs[c][1]}"></circle>`
          + `<text x="${lx+28}" y="${yy+5}" fill="var(--chalk)" font-size="15">Bóng ${cs[c][0]}: ${cnt[c]} quả</text></g>`; }
      const cAsk = cnt[ask];
      let result = `<text x="${lx}" y="232" fill="var(--accent)" font-size="16" font-weight="700">Rút bóng ${cs[ask][0]}: ${cAsk}/${t} = ${this.word(st)}</text>`;
      host.innerHTML = `<svg id="prob" width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">`
        + `<rect x="${jarX}" y="${jarY}" width="${jarW}" height="${jarH}" rx="14" fill="rgba(255,255,255,.05)" stroke="var(--chalk)" stroke-width="2"></rect>`
        + `<text x="${jarX}" y="${jarY-10}" fill="rgba(242,240,230,.7)" font-size="13">Hộp kín · tổng ${t} quả</text>`
        + balls + legend
        + `<line x1="${lx-10}" y1="70" x2="${lx+210}" y2="70" stroke="rgba(242,240,230,.2)"></line>`
        + `<text x="${lx}" y="58" fill="rgba(242,240,230,.6)" font-size="13">Bấm để đổi câu hỏi:</text>`
        + result + `</svg>`;
      const svg = host.querySelector('#prob');
      svg.querySelectorAll('g[data-ask]').forEach(g => g.addEventListener('pointerdown', () => { state.pAsk = +g.dataset.ask; drawVisual(); render(); }));
    },
    caption(st) {
      const L = cur(), s = st.step, cs = this.colors(), cnt = this.counts(st), t = this.total(st), ask = st.pAsk, c = cnt[ask];
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hộp có ${cnt[0]} bóng đỏ, ${cnt[1]} bóng xanh, ${cnt[2]} bóng vàng (tổng ${t} quả).`, hint: 'Bấm màu để đổi câu hỏi, giơ ngón tay đặt số bóng màu đó.' };
      if (s === 2) return { cap: `Sơ đồ: liệt kê hết ${t} kết quả có thể. Rút 1 quả thì ${c} kết quả thuận lợi cho màu '${cs[ask][0]}'.`, hint: 'Đếm TẤT cả kết quả có thể, rồi mới đếm thuận lợi.' };
      if (s === 3) return { cap: `Vậy rút bóng '${cs[ask][0]}' là ${this.word(st)}. P = ${c}/${t}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: rút bóng ${cs[ask][0]} là chắc chắn, có thể, hay không thể? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const cs = this.colors(); return `${this.word(st)} · P(${cs[st.pAsk][0]}) = ${this.counts(st)[st.pAsk]}/${this.total(st)}`; },
    showFromStep() { return 2; },
    hand(st, f) { st[this.keys()[st.pAsk]] = clamp(f, 0, 8); },
    handLabel(f, st) { const cs = this.colors(); return `→ bóng ${cs[st.pAsk][0]} = ${clamp(f, 0, 8)}`; },
    build3d(st) {
      const g = new THREE.Group(), cnt = this.counts(st); let i = 0;
      for (let c = 0; c < 3; c++) for (let k = 0; k < cnt[c]; k++) {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12), new THREE.MeshStandardMaterial({ color: this.colors()[c][2], roughness: .45 }));
        s.position.set((i%6 - 2.5)*0.8, 0.85 - Math.floor(i/6)*0.8, (c-1)*0.85); i++; g.add(s); }
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: lines (hai đường thẳng vuông góc / song song) =======================
  // Repo vuong-goc-song-song (props): "kéo dài hết bảng mà không gặp nhau thì SONG SONG; gặp nhau
  // và ê-ke khít góc thì VUÔNG GÓC". Lỗi hay gặp (error-notes): "kết luận song song khi chưa kéo
  // dài hai đường". d cố định nằm ngang; đưa tay ngang xoay d′; bật "Kéo dài" mới thấy thật gặp hay không.
  lines: {
    usesPalm: true,
    defaults(st, L) { st.lnAng = L.lnAng; st.lnExt = L.lnExt; },
    rel(st) { if (st.lnAng === 0) return 'song-song'; if (st.lnAng === 90) return 'vuong-goc'; return 'cat-nhau'; },
    relText(st) { const r = this.rel(st);
      return r === 'song-song' ? 'SONG SONG' : r === 'vuong-goc' ? 'VUÔNG GÓC' : 'CẮT NHAU (không vuông góc)'; },
    palmToValue(st, x) { st.lnAng = clamp(Math.round((1 - x) * 6) * 15, 0, 90); },
    palmLabel(st) { return `d′ nghiêng ${st.lnAng}° → ${this.relText(st)}`; },
    geomSig(st) { return 'lines'; }, // lnAng là pose xoay → paint3d áp qua transform, không rebuild
    params() { return [{ key:'lnAng', label:'Độ nghiêng của d′ (°)', min:0, max:90, step:15 }]; },
    toggles() { return [{ key:'lnExt', label:'Kéo dài hai đường hết bảng' }]; },
    ctlHint() { return 'Đưa tay ngang xoay đường d′, hoặc +/− chỉnh độ nghiêng. Bật "Kéo dài" để chắc chắn hai đường có gặp nhau không.'; },
    draw2d(host, st) {
      const W = 548, Hh = 250, dy = 100, dx0 = 30, dx1 = 518;
      const cx = 274, cy = 176, th = st.lnAng * Math.PI / 180;
      const hl = st.lnExt ? 520 : 108;
      const cos = Math.cos(th), sin = Math.sin(th);
      const p1 = [cx - hl*cos, cy + hl*sin], p2 = [cx + hl*cos, cy - hl*sin];
      const r = this.rel(st);
      let dot = '';
      if (st.lnAng !== 0 && st.lnExt && sin > 1e-6) { const t = (cy - dy)/sin; const ix = cx + t*cos;
        if (ix >= dx0 && ix <= dx1) dot = `<circle cx="${ix.toFixed(1)}" cy="${dy}" r="6" fill="var(--warn)"></circle>`; }
      let mark = '';
      if (r === 'vuong-goc') mark = `<path d="M ${cx+16},${dy} L ${cx+16},${dy-16} L ${cx},${dy-16}" fill="none" stroke="var(--accent)" stroke-width="2.5"></path>`
        + `<circle cx="${cx}" cy="${dy}" r="6" fill="var(--accent)"></circle>`;
      const dlbl = `<text x="${dx1+4}" y="${dy+4}" fill="var(--chalk)" font-size="16" font-weight="700">d</text>`;
      const up = p2[1] < p1[1] ? p2 : p1;
      const dplbl = `<text x="${clamp(up[0], dx0, dx1-14)+6}" y="${clamp(up[1], 16, Hh-30)}" fill="var(--chalk)" font-size="16" font-weight="700">d′</text>`;
      let extra = '';
      if (!st.lnExt && r === 'cat-nhau') extra = `<text x="${W/2}" y="26" fill="var(--warn)" font-size="13" text-anchor="middle">Đoạn ngắn chưa chạm nhau — nhưng phải KÉO DÀI mới chắc chắn!</text>`;
      else if (st.lnExt && r === 'song-song') extra = `<text x="${W/2}" y="26" fill="var(--accent)" font-size="13" text-anchor="middle">Kéo dài mãi hai đường vẫn cách đều → không bao giờ gặp nhau.</text>`;
      const verdict = `<text x="${W/2}" y="${Hh-8}" fill="${r==='song-song'?'var(--chalk)':r==='vuong-goc'?'var(--accent)':'var(--warn)'}" font-size="20" font-weight="700" text-anchor="middle">${this.relText(st)}</text>`;
      host.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">`
        + `<line x1="${dx0}" y1="${dy}" x2="${dx1}" y2="${dy}" stroke="rgba(95,176,165,.95)" stroke-width="2.5"></line>`
        + `<line x1="${p1[0].toFixed(1)}" y1="${p1[1].toFixed(1)}" x2="${p2[0].toFixed(1)}" y2="${p2[1].toFixed(1)}" stroke="rgba(255,209,102,.95)" stroke-width="2.5"></line>`
        + dlbl + dplbl + dot + mark + extra + verdict + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, r = this.rel(st), ang = st.lnAng;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: trên bảng có hai đường thẳng vẽ phấn d (nằm ngang) và d′ (đang nghiêng ${ang}° so với d).`, hint: 'Đưa tay ngang xoay d′, hoặc +/− chỉnh độ nghiêng.' };
      if (s === 2) { const base = r === 'song-song'
          ? `Kéo dài mãi mà d và d′ vẫn cách đều, không gặp nhau → hai đường SONG SONG.`
          : r === 'vuong-goc'
          ? `d và d′ gặp nhau, ê-ke khít đúng góc vuông → hai đường VUÔNG GÓC.`
          : (st.lnExt ? `Kéo dài thì d và d′ gặp nhau nhưng ê-ke không khít → CẮT NHAU (không vuông góc).`
                      : `Nhìn đoạn ngắn thì chúng chưa chạm — nhưng ĐỪNG vội nói song song! Bật "Kéo dài" để kiểm chứng đã.`);
        return { cap: `Sơ đồ: ${base}`, hint: 'Quy tắc vàng: phải KÉO DÀI hết bảng rồi mới được kết luận.' };
      }
      if (s === 3) return { cap: `Kết luận: d và d′ ${r==='song-song'?'song song với nhau' : r==='vuong-goc'?'vuông góc với nhau':'cắt nhau (không vuông góc)'}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: hai đường này song song, vuông góc, hay chỉ cắt nhau? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `${st.lnAng}° · ${this.relText(st)}`; },
    showFromStep() { return 2; },
    hand() {},
    handLabel() { return ''; },
    build3d(st) {
      const g = new THREE.Group();
      const teal = new THREE.MeshStandardMaterial({ color: 0x5fb0a5, roughness: .5 });
      const gold = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: .5 });
      const d = new THREE.Mesh(new THREE.BoxGeometry(6, 0.12, 0.12), teal); d.position.set(0, 0.7, 0); g.add(d);
      const pivot = new THREE.Group(); pivot.position.set(0, -0.4, 0); g.add(pivot);
      const dprime = new THREE.Mesh(new THREE.BoxGeometry(6, 0.12, 0.12), gold); pivot.add(dprime);
      pivot.rotation.z = st.lnAng * Math.PI / 180;
      g.userData.pivot = pivot;
      return g;
    },
    paint3d(g, st) { if (g.userData.pivot) g.userData.pivot.rotation.z = st.lnAng * Math.PI / 180; },
  },

  // ======================= Model: groups (chia đều và số dư — băng chuyền + khay) =======================
  // Repo chia (props): "băng chuyền chở đồ vật và dãy khay nhóm bằng nhau; đếm số khay chia đều làm
  // thương; số vật không đủ chia còn nằm lại trên băng chuyền làm số dư"; "số dư luôn nhỏ hơn số chia".
  // Đưa tay ngang đặt số kẹo trên băng; +/− chỉnh số khay. Kẹo được phát mỗi khay một cái cho tới khi
  // không đủ chia nữa → mỗi khay q cái (thương), r cái còn trên băng (số dư).
  groups: {
    usesPalm: true,
    defaults(st, L) { st.dvSo = L.dvSo; st.dvNhom = L.dvNhom; },
    q(st) { return Math.floor(st.dvSo / Math.max(1, st.dvNhom)); },
    r(st) { return st.dvSo - this.q(st) * Math.max(1, st.dvNhom); },
    palmToValue(st, x) { st.dvSo = clamp(Math.round((1 - x) * 20), 0, 20); },
    palmLabel(st) { return `${st.dvSo} cái kẹo → ${st.dvSo} : ${st.dvNhom} = ${this.q(st)} (dư ${this.r(st)})`; },
    geomSig(st) { return 'groups' + st.dvSo + ':' + st.dvNhom; },
    params() { return [
      { key:'dvSo', label:'Số kẹo (số bị chia)', min:0, max:20 },
      { key:'dvNhom', label:'Số khay (số chia)', min:2, max:6 }]; },
    ctlHint() { return 'Đưa tay ngang đặt số kẹo trên băng chuyền, hoặc +/− cho số kẹo và số khay. Kẹo chia dần vào từng khay, phần chưa đủ chia nằm lại ở ô nét đứt.'; },
    draw2d(host, st) {
      const S = st.dvSo, N = Math.max(1, st.dvNhom), q = this.q(st), r = this.r(st);
      const W = 548, Hh = 250, beltY = 26, beltH = 44;
      let s = `<rect x="16" y="${beltY}" width="${W-32}" height="${beltH}" rx="8" fill="rgba(95,176,165,.16)" stroke="var(--chalk)" stroke-width="1.5"></rect>`;
      s += `<text x="24" y="${beltY+17}" fill="rgba(242,240,230,.6)" font-size="12">Băng chuyền · ${S} cái kẹo</text>`;
      const lx0 = W - 44 - Math.max(r, 1) * 26;
      for (let k = 0; k < r; k++) s += `<circle cx="${lx0+k*26+12}" cy="${beltY+beltH/2}" r="10" fill="rgba(224,121,31,.9)" stroke="var(--chalk)" stroke-width="1"></circle>`;
      if (r > 0) s += `<rect x="${lx0-6}" y="${beltY+5}" width="${r*26+6}" height="${beltH-10}" fill="none" stroke="var(--warn)" stroke-width="1.5" stroke-dasharray="6 4"></rect>`
        + `<text x="${lx0-6}" y="${beltY-2}" fill="var(--warn)" font-size="11">số dư ${r} &lt; ${N}</text>`;
      const tY = 140, tH = 94, step = Math.min(96, (W-40)/N), tw = step-14;
      for (let i = 0; i < N; i++) { const tx = 20 + i*step;
        s += `<rect x="${tx.toFixed(1)}" y="${tY}" width="${tw.toFixed(1)}" height="${tH}" rx="6" fill="rgba(242,240,230,.06)" stroke="var(--chalk)" stroke-width="1.5"></rect>`;
        for (let k = 0; k < q; k++) { const ccx = tx+tw/2+(k%2?11:-11), ccy = tY+15+Math.floor(k/2)*17;
          s += `<circle cx="${ccx.toFixed(1)}" cy="${ccy.toFixed(1)}" r="9" fill="rgba(255,209,102,.85)" stroke="var(--chalk)" stroke-width="1"></circle>`; }
        s += `<text x="${(tx+tw/2).toFixed(1)}" y="${tY+tH+13}" fill="var(--chalk)" font-size="12" text-anchor="middle">khay ${i+1}: ${q}</text>`;
      }
      s += `<text x="${W/2}" y="122" fill="var(--accent)" font-size="17" font-weight="700" text-anchor="middle">${S} : ${N} = ${q} (dư ${r})</text>`;
      host.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, S = st.dvSo, N = st.dvNhom, q = this.q(st), r = this.r(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: trên băng chuyền có ${S} cái kẹo, cần chia đều vào ${N} khay.`, hint: 'Đưa tay ngang đặt số kẹo, +/− chỉnh số khay.' };
      if (s === 2) return { cap: `Sơ đồ: phát lần lượt mỗi khay 1 cái cho tới khi không đủ chia nữa. Mỗi khay được ${q} cái → thương = ${q}. Còn ${r} cái nằm lại trên băng → số dư = ${r} (luôn nhỏ hơn số chia ${N}).`, hint: r>0 ? 'Thử giảm số kẹo tới mức chia hết để số dư bằng 0.' : 'Đúng chia hết — không còn kẹo thừa.' };
      if (s === 3) return { cap: `Phép tính: ${S} : ${N} = ${q} (dư ${r}). Kiểm tra: ${N} × ${q} = ${N*q}, rồi ${S} − ${N*q} = ${r}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: ${S} chia ${N} được mấy, còn dư mấy? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `${st.dvSo} : ${st.dvNhom} = ${this.q(st)} (dư ${this.r(st)})`; },
    showFromStep() { return 2; },
    hand() {},
    handLabel() { return ''; },
    build3d(st) {
      const g = new THREE.Group(), S = st.dvSo, N = Math.max(1, st.dvNhom), q = this.q(st), r = this.r(st);
      const candyM = () => new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: .5 });
      const trayM = new THREE.MeshStandardMaterial({ color: 0x3a4a52, roughness: .6 });
      const stepX = 1.15, rows = Math.max(1, Math.ceil(q/2)), depth = rows*0.42 + 0.25;
      for (let i = 0; i < N; i++) { const x = (i-(N-1)/2)*stepX;
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, depth), trayM); plate.position.set(x, -0.06, 0); g.add(plate);
        for (let k = 0; k < q; k++) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), candyM());
          c.position.set(x + (k%2 ? 0.24 : -0.24), 0.21, -depth/2 + 0.32 + Math.floor(k/2)*0.42); g.add(c); }
      }
      const rx = (N-1)/2*stepX + 0.95;
      const plate2 = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.9), new THREE.MeshStandardMaterial({ color: 0x5fb0a5, roughness: .6 })); plate2.position.set(rx, -0.06, 0); g.add(plate2);
      for (let k = 0; k < r; k++) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.32), new THREE.MeshStandardMaterial({ color: 0xe0791f, roughness: .5 }));
        c.position.set(rx - 0.22 + (k%2 ? 0.44 : 0), 0.22, -0.2 + Math.floor(k/2)*0.45); g.add(c); }
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: fracops (cộng trừ phân số cùng mẫu — trên TRỤC, HAI TAY) =======================
  // Repo cong-tru-phan-so (props): "các thanh phân số cùng mẫu trượt trên một trục; cộng là nối tiếp hai
  // đoạn, trừ là chồng ngược; đếm tổng phần tô làm tử số, GIỮ NGUYÊN mẫu số; vượt một thanh đầy → hỗn số".
  // Trục dài đúng 2 "cái" để phần vượt 1 cái hiện ra ngay. Lỗi hay gặp: cộng luôn mẫu số.
  fracops: {
    twoHands: true,
    defaults(st, L) { st.foD = L.foD; st.foN1 = L.foN1; st.foN2 = L.foN2; st.foOp = L.foOp; },
    eff(st) { const D = Math.max(2, st.foD); return { D, n1: Math.min(st.foN1, D), n2: Math.min(st.foN2, D), add: !!st.foOp }; },
    raw(st) { const e = this.eff(st); return e.add ? e.n1 + e.n2 : Math.max(0, e.n1 - e.n2); },
    gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t; } return a || 1; },
    resultText(st) { const e = this.eff(st), num = this.raw(st), den = e.D;
      if (num === 0) return '0'; const g = this.gcd(num, den); const sn = num / g, sd = den / g;
      const w = Math.floor(sn / sd), r = sn % sd;
      if (w > 0 && r > 0) return `${w} ${r}/${sd}`; if (w > 0 && r === 0) return `${w}`; return `${sn}/${sd}`; },
    geomSig(st) { const e = this.eff(st); return 'fo' + e.D + ':' + e.n1 + ',' + e.n2 + (e.add ? '+' : '-'); },
    params() { return [
      { key:'foN1', label:'Tử số PS 1', min:0, max:8 }, { key:'foN2', label:'Tử số PS 2', min:0, max:8 },
      { key:'foD', label:'Mẫu số chung', min:2, max:8 }]; },
    toggles() { return [{ key:'foOp', label:'Phép tính: + (cộng) / − (trừ)' }]; },
    ctlHint() { return 'Giơ HAI tay: trái = tử số phần 1, phải = tử số phần 2. Mẫu số chung bấm +/−; gạt công tắc để đổi +/−. Hai băng nối tiếp nhau trên CÙNG trục.'; },
    draw2d(host, st) {
      const e = this.eff(st), D = e.D, n1 = e.n1, n2 = e.n2, add = e.add;
      const W = 560, Hh = 250, pad = 48, L = 430, cw = L / D, axisY = 156, bh = 44, y = 92;
      const X = (j) => (pad + j * cw);
      let s = '';
      for (let u = 0; u < 2 * D; u++) s += `<rect x="${X(u).toFixed(1)}" y="${y}" width="${cw.toFixed(1)}" height="${bh}" fill="none" stroke="rgba(242,240,230,.16)" stroke-width="1"></rect>`;
      const put = (j, fill) => { s += `<rect x="${X(j).toFixed(1)}" y="${y}" width="${cw.toFixed(1)}" height="${bh}" fill="${fill}"></rect>`; };
      if (add) { for (let j = 0; j < n1; j++) put(j, 'rgba(95,176,165,.72)'); for (let j = n1; j < n1 + n2; j++) put(j, 'rgba(255,209,102,.82)'); }
      else { const kept = Math.max(0, n1 - n2); for (let j = 0; j < kept; j++) put(j, 'rgba(95,176,165,.72)');
        for (let j = kept; j < n1; j++) { put(j, 'rgba(224,121,31,.5)');
          s += `<line x1="${X(j).toFixed(1)}" y1="${y}" x2="${(X(j)+cw).toFixed(1)}" y2="${y+bh}" stroke="var(--chalk)" stroke-width="1.2"></line>`
            + `<line x1="${(X(j)+cw).toFixed(1)}" y1="${y}" x2="${X(j).toFixed(1)}" y2="${y+bh}" stroke="var(--chalk)" stroke-width="1.2"></line>`; } }
      s += `<line x1="${X(D).toFixed(1)}" y1="${y-16}" x2="${X(D).toFixed(1)}" y2="${y+bh+8}" stroke="var(--accent)" stroke-width="2"></line>`
        + `<text x="${((X(0)+X(D))/2).toFixed(1)}" y="${y-20}" fill="rgba(242,240,230,.72)" font-size="12" text-anchor="middle">1 cái = ${D} phần</text>`;
      s += `<line x1="${pad}" y1="${axisY}" x2="${X(2*D).toFixed(1)}" y2="${axisY}" stroke="var(--chalk)" stroke-width="1.5"></line>`;
      for (let u = 0; u <= 2; u++) s += `<line x1="${X(u*D).toFixed(1)}" y1="${axisY-6}" x2="${X(u*D).toFixed(1)}" y2="${axisY+6}" stroke="var(--chalk)" stroke-width="1.5"></line>`
        + `<text x="${X(u*D).toFixed(1)}" y="${axisY+20}" fill="rgba(242,240,230,.6)" font-size="11" text-anchor="middle">${u}</text>`;
      const mid = add ? Math.floor(n2/2) : Math.max(0,n1-n2) + Math.floor(n2/2);
      s += `<text x="${X(mid).toFixed(1)}" y="${y+bh+16}" fill="var(--chalk)" font-size="12" text-anchor="middle">${n2}/${D}</text>`
        + `<text x="${X(n1/2).toFixed(1)}" y="${y-4}" fill="var(--chalk)" font-size="12" text-anchor="middle">${n1}/${D}</text>`;
      const sign = add ? '+' : '−';
      s += `<text x="${W/2}" y="${Hh-12}" fill="var(--accent)" font-size="18" font-weight="700" text-anchor="middle">${n1}/${D} ${sign} ${n2}/${D} = ${this.resultText(st)}</text>`;
      host.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, e = this.eff(st), D = e.D, n1 = e.n1, n2 = e.n2, add = e.add;
      const sign = add ? 'thêm' : 'bớt';
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: một cái bánh chia ${D} phần bằng nhau. Lần thứ nhất ăn ${n1} phần (${n1}/${D}), lần thứ hai ${sign} ${n2} phần (${n2}/${D}).`, hint: 'Giơ HAI tay để đặt số phần mỗi lần, mẫu số bấm +/−, gạt +/− để đổi phép tính.' };
      if (s === 2) return { cap: `Sơ đồ: đặt hai thanh trên CÙNG một trục ${D} phần. Mẫu số không đổi vì các phần vẫn cắt từ cùng một cái. ${add ? `Nối tiếp ${n1} rồi ${n2} phần = ${this.raw(st)} phần${this.raw(st) > D ? ' → VƯỢT 1 cái, hiện phần nguyên (hỗn số).' : ''}.` : `Chồng ngược bớt ${n2} phần của ${n1} phần → còn ${this.raw(st)} phần.`}`, hint: 'CHỈ cộng/trừ tử số — TUYỆT đối không cộng mẫu số.' };
      if (s === 3) return { cap: `Phép tính: ${n1}/${D} ${add ? '+' : '−'} ${n2}/${D} = ${this.resultText(st)}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: ${n1}/${D} ${add ? '+' : '−'} ${n2}/${D} bằng bao nhiêu? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const e = this.eff(st); return `${e.n1}/${e.D} ${e.add ? '+' : '−'} ${e.n2}/${e.D} = ${this.resultText(st)}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      const D = Math.max(2, st.foD);
      if (l !== null) st.foN1 = clamp(l, 0, D);
      if (r !== null) st.foN2 = clamp(r, 0, D);
    },
    build3d(st) {
      const g = new THREE.Group(), e = this.eff(st), D = e.D, cw = 2 * 0.5; const total = 2 * D;
      const cellW = 3.6 / total;
      for (let j = 0; j < total; j++) { let col = 0x3a4a52;
        if (e.add) { if (j < e.n1) col = 0x5fb0a5; else if (j < e.n1 + e.n2) col = 0xffd166; }
        else { const kept = Math.max(0, e.n1 - e.n2); if (j < kept) col = 0x5fb0a5; else if (j < e.n1) col = 0xe0791f; }
        const m = new THREE.Mesh(new THREE.BoxGeometry(cellW * 0.9, 0.5, 0.7), new THREE.MeshStandardMaterial({ color: col, roughness: .55 }));
        m.position.set(-1.8 + cellW * (j + 0.5), 0, 0); g.add(m); }
      const div = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.62, 0.82), new THREE.MeshStandardMaterial({ color: 0xffffff })); div.position.set(0, 0, 0); g.add(div);
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: pic (biểu đồ tranh — 1 hình = mấy đơn vị) =======================
  // Repo bieu-do-tranh (props): "khung chú giải 1 hình = k đơn vị; số hình × k; nửa hình = nửa giá trị".
  // Lỗi hay gặp (error-notes): "đếm hình rồi đoán ngay, bỏ qua khung chú giải". Bắt đọc chú giải trước.
  pic: {
    names() { return ['Kẹo', 'Bi', 'Búp bê', 'Ô tô']; },
    colors() { return ['#5fb0a5', '#ffd166', '#e07a5f', '#4d9de0']; },
    cols() { return [0x5fb0a5, 0xffd166, 0xe07a5f, 0x4d9de0]; },
    keys() { return ['pi0', 'pi1', 'pi2', 'pi3']; },
    counts(st) { return [st.pi0, st.pi1, st.pi2, st.pi3]; },
    sel(st) { return clamp(st.piSel, 0, 3); },
    total(st, j) { const c = this.counts(st)[j], u = Math.max(1, st.piU); return c * u + (st.piH && j === this.sel(st) ? Math.round(u / 2) : 0); },
    defaults(st, L) { st.piU = L.piU; st.piH = L.piH; st.piSel = L.piSel; st.pi0 = L.pi0; st.pi1 = L.pi1; st.pi2 = L.pi2; st.pi3 = L.pi3; },
    geomSig(st) { return 'pic' + st.piU + ':' + this.counts(st).join(',') + ':' + this.sel(st) + (st.piH ? 'h' : ''); },
    params() { return [
      { key:'piU', label:'Một hình = mấy cái', min:1, max:10 },
      { key:'piSel', label:'Hàng đang chọn', min:0, max:3 }]; },
    toggles() { return [{ key:'piH', label:'Thêm NỬA hình cho hàng đang chọn' }]; },
    ctlHint() { return 'Giơ 0–8 ngón = số HÌNH của hàng đang chọn; chọn hàng và đổi "một hình = mấy cái" bằng +/−; gạt để thêm nửa hình.'; },
    glyph(cx, cy, r, col, half) { return half
      ? `<path d="M${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} Z" fill="${col}" stroke="rgba(0,0,0,.35)" stroke-width="1"></path>`
      : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" stroke="rgba(0,0,0,.35)" stroke-width="1"></circle>`; },
    draw2d(host, st) {
      const nm = this.names(), col = this.colors(), cnt = this.counts(st), sel = this.sel(st), U = Math.max(1, st.piU);
      const W = 560, Hh = 250, x0 = 150, rowY = (j) => 74 + j * 42, slot = 28;
      let s = `<text x="16" y="26" fill="rgba(242,240,230,.7)" font-size="13">Khung chú giải (ĐỌC TRƯỚC):</text>`
        + this.glyph(120, 22, 10, '#cbd3d8', false)
        + `<text x="138" y="27" fill="var(--accent)" font-size="15" font-weight="700">= ${U} cái</text>`;
      for (let j = 0; j < 4; j++) {
        const y = rowY(j), on = j === sel;
        s += `<rect x="8" y="${y - 16}" width="${W - 16}" height="32" rx="6" fill="${on ? 'rgba(255,255,255,.08)' : 'transparent'}" stroke="${on ? 'var(--accent)' : 'transparent'}" stroke-width="${on ? 2 : 0}"></rect>`
          + `<text x="16" y="${y + 5}" fill="var(--chalk)" font-size="14">${nm[j]}</text>`;
        for (let k = 0; k < cnt[j]; k++) s += this.glyph(x0 + k * slot + 11, y, 11, col[j], false);
        if (st.piH && on) s += this.glyph(x0 + cnt[j] * slot + 11, y, 11, col[j], true);
      }
      const tv = this.total(st, sel);
      s += `<text x="${W / 2}" y="238" fill="var(--accent)" font-size="17" font-weight="700" text-anchor="middle">Hàng ${nm[sel]}: ${cnt[sel]} hình × ${U}${st.piH ? ' + nửa hình (' + Math.round(U / 2) + ')' : ''} = ${tv} cái</text>`;
      host.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, cnt = this.counts(st), sel = this.sel(st), U = Math.max(1, st.piU), nm = this.names()[sel], tv = this.total(st, sel);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: biểu đồ tranh có 4 hàng, mỗi hàng vẽ các HÌNH giống nhau cho một loại đồ vật (hàng đang chọn: ${nm}).`, hint: 'Giơ 0–8 ngón để đặt số HÌNH của hàng đang chọn.' };
      if (s === 2) return { cap: `Sơ đồ: ĐỌC KHUNG CHÚ GIẢI TRƯỚC — 1 hình = ${U} cái${st.piH ? ', và nửa hình = ' + Math.round(U / 2) + ' cái' : ''}. Đừng nhìn số hình mà đoán ngay.`, hint: 'Chú giải quyết định giá trị, không phải số hình.' };
      if (s === 3) return { cap: `Phép tính: hàng ${nm} có ${cnt[sel]} hình × ${U}${st.piH ? ' + nửa hình ' + Math.round(U / 2) : ''} = ${tv} cái. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: hàng ${nm} thật ra có bao nhiêu cái? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const cnt = this.counts(st), sel = this.sel(st); return `${this.names()[sel]}: ${cnt[sel]}×${Math.max(1, st.piU)}${st.piH ? '+½' : ''} = ${this.total(st, sel)} cái`; },
    showFromStep() { return 2; },
    hand(st, f) { st[this.keys()[this.sel(st)]] = clamp(f, 0, 8); },
    handLabel(f, st) { return `→ số HÌNH hàng '${this.names()[this.sel(st)]}' = ${clamp(f, 0, 8)}`; },
    build3d(st) {
      const g = new THREE.Group(), cnt = this.counts(st), sel = this.sel(st), cols = this.cols(); let i = 0;
      for (let j = 0; j < 4; j++) for (let k = 0; k < cnt[j]; k++) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(j === sel ? 0.34 : 0.28, 16, 12), new THREE.MeshStandardMaterial({ color: cols[j], roughness: .5 }));
        m.position.set((k - 2) * 0.8, 1.0 - j * 0.55, 0); g.add(m); }
      if (st.piH) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), new THREE.MeshStandardMaterial({ color: cols[sel], roughness: .5 })); m.position.set((cnt[sel] - 2) * 0.8 + 0.4, 1.0 - sel * 0.55, 0); m.scale.x = 0.5; g.add(m); }
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: motion (hai xe ngược chiều — S = (v1+v2) × t) =======================
  // Repo chuyen-dong: "quãng đường = vận tốc × thời gian; hai xe ngược chiều thì mỗi giờ khoảng cách
  // ngắn đi đúng bằng TỔNG hai vận tốc → gặp nhau sau S : (v1+v2) giờ". Đưa tay ngang cho xe chạy.
  motion: {
    usesPalm: true,
    fmt(n) { return ('' + (Math.round(n * 100) / 100)).replace('.', ','); },
    mt(st) { const S = Math.max(1, st.mtS), v1 = st.mtV1, v2 = st.mtV2, sum = v1 + v2, tmeet = S / sum;
      const t = clamp(st.mtT, 0, tmeet); return { S, v1, v2, sum, tmeet, t, d1: v1 * t, d2: v2 * t, gap: S - (v1 + v2) * t }; },
    defaults(st, L) { st.mtS = L.mtS; st.mtV1 = L.mtV1; st.mtV2 = L.mtV2; st.mtT = L.mtT; },
    palmToValue(st, x) { const sum = Math.max(1, st.mtV1 + st.mtV2), tmeet = st.mtS / sum; st.mtT = clamp(Math.round((1 - x) * tmeet * 4) / 4, 0, tmeet); },
    palmLabel(st) { const m = this.mt(st); return `đã đi ${this.fmt(m.t)} giờ · còn ${this.fmt(m.gap)} km`; },
    geomSig(st) { return 'motion' + st.mtS + ':' + st.mtV1 + ':' + st.mtV2; },
    params() { return [
      { key:'mtT', label:'Thời gian đã đi (giờ)', min:0, max:6 },
      { key:'mtV1', label:'Vận tốc xe A (km/giờ)', min:10, max:80 },
      { key:'mtV2', label:'Vận tốc xe B (km/giờ)', min:10, max:80 },
      { key:'mtS', label:'Tổng quãng đường (km)', min:40, max:240 }]; },
    ctlHint() { return 'Đưa bàn tay ngang cho hai xe chạy tới lúc gặp nhau; đổi quãng đường và hai vận tốc bằng +/−.'; },
    GEO() { return { W:560, H:250, xA:56, xB:504, y:120 }; },
    draw2d(host, st) {
      const g = this.GEO(), m = this.mt(st), f = this.fmt.bind(this);
      const X = (km) => (g.xA + (km / m.S) * (g.xB - g.xA));
      const x1 = X(m.d1), x2 = X(m.S - m.d2), met = m.gap < 0.5;
      let s = `<text x="${g.xA}" y="34" fill="var(--chalk)" font-size="14">A (0 km)</text>`
        + `<text x="${g.xB}" y="34" fill="var(--chalk)" font-size="14" text-anchor="end">B (${m.S} km)</text>`;
      // đường + vùng còn cách nhau
      s += `<line x1="${g.xA}" y1="${g.y}" x2="${g.xB}" y2="${g.y}" stroke="var(--chalk)" stroke-width="3"></line>`;
      if (!met) s += `<rect x="${x1}" y="${g.y-9}" width="${(x2-x1).toFixed(1)}" height="18" fill="rgba(95,176,165,.22)" stroke="rgba(242,240,230,.25)" stroke-dasharray="4 3"></rect>`
        + `<text x="${((x1+x2)/2).toFixed(1)}" y="${g.y-16}" fill="rgba(242,240,230,.7)" font-size="12" text-anchor="middle">còn ${f(m.gap)} km</text>`;
      // vạch quãng đường mỗi xe đi được
      s += `<line x1="${g.xA}" y1="${g.y+30}" x2="${x1.toFixed(1)}" y2="${g.y+30}" stroke="#5fb0a5" stroke-width="6"></line>`
        + `<text x="${g.xA}" y="${g.y+48}" fill="#7fc9bf" font-size="12">xe A đi ${f(m.d1)} km</text>`;
      s += `<line x1="${g.xB}" y1="${g.y+56}" x2="${x2.toFixed(1)}" y2="${g.y+56}" stroke="#ffd166" stroke-width="6"></line>`
        + `<text x="${g.xB}" y="${g.y+74}" fill="#ffd166" font-size="12" text-anchor="end">xe B đi ${f(m.d2)} km</text>`;
      // hai xe
      s += `<path d="M ${(x1-14).toFixed(1)} ${g.y-10} L ${(x1+6).toFixed(1)} ${g.y-10} L ${(x1+14).toFixed(1)} ${g.y} L ${(x1+6).toFixed(1)} ${g.y+10} L ${(x1-14).toFixed(1)} ${g.y+10} Z" fill="#5fb0a5"></path>`;
      s += `<path d="M ${(x2+14).toFixed(1)} ${g.y-10} L ${(x2-6).toFixed(1)} ${g.y-10} L ${(x2-14).toFixed(1)} ${g.y} L ${(x2-6).toFixed(1)} ${g.y+10} L ${(x2+14).toFixed(1)} ${g.y+10} Z" fill="#ffd166"></path>`;
      if (met) s += `<line x1="${x1.toFixed(1)}" y1="${g.y-40}" x2="${x1.toFixed(1)}" y2="${g.y}" stroke="var(--warn)" stroke-width="3"></line>`
        + `<text x="${x1.toFixed(1)}" y="${g.y-46}" fill="var(--warn)" font-size="15" font-weight="700" text-anchor="middle">GẶP NHAU</text>`;
      s += `<text x="${g.W/2}" y="208" fill="var(--chalk)" font-size="15" text-anchor="middle">Mỗi giờ hai xe gần nhau thêm ${m.v1} + ${m.v2} = ${m.sum} km (tổng hai vận tốc)</text>`;
      s += `<text x="${g.W/2}" y="234" fill="var(--accent)" font-size="17" font-weight="700" text-anchor="middle">Gặp nhau sau ${m.S} : ${m.sum} = ${f(m.tmeet)} giờ · cách A ${f(m.v1 * m.tmeet)} km</text>`;
      host.innerHTML = `<svg id="motion" width="${g.W}" height="${g.H}" viewBox="0 0 ${g.W} ${g.H}" style="cursor:pointer">` + s + `</svg>`;
      const svg = host.querySelector('#motion');
      svg.addEventListener('pointerdown', (e) => { const r = svg.getBoundingClientRect();
        const vbX = (e.clientX - r.left) / r.width * g.W; const km = (vbX - g.xA) / (g.xB - g.xA) * m.S;
        state.mtT = clamp(km / m.sum, 0, m.tmeet); drawVisual(); render(); });
    },
    caption(st) {
      const L = cur(), s = st.step, m = this.mt(st), f = this.fmt.bind(this);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hai xe xuất phát từ hai đầu con đường dài ${m.S} km, đi NGƯỢC chiều — xe A ${m.v1} km/giờ, xe B ${m.v2} km/giờ.`, hint: 'Đưa tay ngang để cho hai xe chạy.' };
      if (s === 2) return { cap: `Sơ đồ: mỗi giờ cả hai lại gần nhau thêm ${m.v1} + ${m.v2} = ${m.sum} km. Đấy là TỔNG hai vận tốc, không phải một vận tốc.`, hint: 'Khoảng cách ngắn đi bằng tổng, vì hai xe đi ngược chiều.' };
      if (s === 3) return { cap: `Phép tính: thời gian gặp = ${m.S} : ${m.sum} = ${f(m.tmeet)} giờ. Gặp nhau cách A ${m.v1} × ${f(m.tmeet)} = ${f(m.v1 * m.tmeet)} km. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: sau mấy giờ thì hai xe gặp nhau? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const m = this.mt(st), f = this.fmt.bind(this); return `gặp sau ${f(m.tmeet)} giờ · cách A ${f(m.v1 * m.tmeet)} km`; },
    showFromStep() { return 2; },
    build3d(st) {
      const g = new THREE.Group(), len = 6, m = this.mt(st);
      const road = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 0.5), new THREE.MeshStandardMaterial({ color: 0x9fb0bd, roughness: .7 })); road.position.y = 0; g.add(road);
      const mk = (col) => { const c = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.34, 0.44), new THREE.MeshStandardMaterial({ color: col, roughness: .45 })); c.position.y = 0.25; g.add(c); return c; };
      const c1 = mk(0x5fb0a5), c2 = mk(0xffd166);
      const px = (km) => -len / 2 + (km / m.S) * len;
      c1.position.x = px(m.d1); c2.position.x = px(m.S - m.d2);
      g.userData = { c1, c2, px };
      return g;
    },
    paint3d(g, st) { if (!g.userData || !g.userData.c1) return; const m = this.mt(st); g.userData.c1.position.x = g.userData.px(m.d1); g.userData.c2.position.x = g.userData.px(m.S - m.d2); },
  },

  // ======================= Model: scale (tỉ lệ bản đồ — 1 cm = k mét thật) =======================
  // Repo ti-le-ban-do: "độ dài thật = số đo trên bản đồ × hệ số tỉ lệ; phải đọc thước tỉ lệ trước".
  // Hai vạch CÙNG ĐỘ DÀI vật lý nhưng khác NHÃN (cm ↔ m) để thấy bản đồ chỉ là thu nhỏ.
  scale: {
    usesPalm: true,
    defaults(st, L) { st.scCm = L.scCm; st.scReal = L.scReal; },
    real(st) { return Math.max(0, st.scCm) * Math.max(1, st.scReal); },
    palmToValue(st, x) { st.scCm = clamp(Math.round((1 - x) * 8), 0, 8); },
    palmLabel(st) { return `đo ${st.scCm} cm → thật ${this.real(st)} m`; },
    geomSig(st) { return 'scale' + st.scReal + ':' + st.scCm; },
    params() { return [
      { key:'scCm', label:'Đo trên bản đồ (cm)', min:0, max:8 },
      { key:'scReal', label:'Một cm = mấy mét thật', min:2, max:50 }]; },
    ctlHint() { return 'Đưa bàn tay ngang (hoặc bấm +/− Thời gian đo) để "đo" đoạn trên bản đồ 0–8 cm; đổi hệ số "một cm = mấy mét" bằng +/−.'; },
    GEO() { return { W:560, H:250, x0:60, x1:470, yMap:74, yReal:150 }; },
    draw2d(host, st) {
      const g = this.GEO(), cm = clamp(st.scCm, 0, 8), k = Math.max(1, st.scReal), real = this.real(st);
      const span = g.x1 - g.x0, cmX = (c) => g.x0 + (c / 8) * span;
      let s = `<text x="${g.x0}" y="30" fill="var(--chalk)" font-size="14">BẢN ĐỒ</text>`
        + `<rect x="${cmX(0)}" y="${g.yMap-11}" width="${(cmX(cm)-cmX(0)).toFixed(1)}" height="22" fill="rgba(95,176,165,.6)"></rect>`
        + `<line x1="${g.x0}" y1="${g.yMap}" x2="${g.x1}" y2="${g.yMap}" stroke="var(--chalk)" stroke-width="2"></line>`;
      for (let c = 0; c <= 8; c++) s += `<line x1="${cmX(c).toFixed(1)}" y1="${g.yMap-6}" x2="${cmX(c).toFixed(1)}" y2="${g.yMap+6}" stroke="rgba(242,240,230,.5)"></line>`
        + `<text x="${cmX(c).toFixed(1)}" y="${g.yMap+20}" fill="rgba(242,240,230,.55)" font-size="10" text-anchor="middle">${c}</text>`;
      s += `<text x="${g.x0}" y="118" fill="var(--chalk)" font-size="14">NGOÀI ĐỜI THẬT</text>`
        + `<rect x="${cmX(0)}" y="${g.yReal-11}" width="${(cmX(cm)-cmX(0)).toFixed(1)}" height="22" fill="rgba(255,209,102,.6)"></rect>`
        + `<line x1="${g.x0}" y1="${g.yReal}" x2="${g.x1}" y2="${g.yReal}" stroke="var(--chalk)" stroke-width="2"></line>`
        + `<text x="${cmX(cm).toFixed(1)}" y="${g.yReal+22}" fill="var(--accent)" font-size="13" text-anchor="middle">${real} m</text>`;
      s += `<rect x="${g.x1-2}" y="26" width="86" height="40" rx="6" fill="none" stroke="var(--warn)" stroke-width="1.5"></rect>`
        + `<text x="${g.x1+41}" y="42" fill="var(--warn)" font-size="12" text-anchor="middle">THƯỚC TỈ LỆ</text>`
        + `<text x="${g.x1+41}" y="59" fill="var(--warn)" font-size="13" font-weight="700" text-anchor="middle">1 cm = ${k} m</text>`;
      s += `<text x="${g.W/2}" y="216" fill="var(--chalk)" font-size="15" text-anchor="middle">Độ dài thật = số đo trên bản đồ × hệ số tỉ lệ</text>`;
      s += `<text x="${g.W/2}" y="240" fill="var(--accent)" font-size="18" font-weight="700" text-anchor="middle">${cm} cm × ${k} = ${real} m</text>`;
      host.innerHTML = `<svg id="scale" width="${g.W}" height="${g.H}" viewBox="0 0 ${g.W} ${g.H}" style="cursor:pointer">` + s + `</svg>`;
      const svg = host.querySelector('#scale');
      svg.addEventListener('pointerdown', (e) => { const r = svg.getBoundingClientRect();
        const vbX = (e.clientX - r.left) / r.width * g.W; state.scCm = clamp(Math.round((vbX - g.x0) / span * 8), 0, 8); drawVisual(); render(); });
    },
    caption(st) {
      const L = cur(), s = st.step, cm = clamp(st.scCm, 0, 8), k = Math.max(1, st.scReal), real = this.real(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: trên bản đồ, đoạn đường đo được ${cm} cm. Bản đồ chỉ là hình THU NHỎ của thực tế.`, hint: 'Đưa tay ngang để đổi số đo trên bản đồ.' };
      if (s === 2) return { cap: `Sơ đồ: ĐỌC THƯỚC TỈ LỆ TRƯỚC — 1 cm trên bản đồ ứng với ${k} m ngoài đời. Hai vạch dài bằng nhau nhưng mỗi vạch tính bằng một đơn vị khác nhau.`, hint: 'Không có thước tỉ lệ thì chưa đổi được ra độ dài thật.' };
      if (s === 3) return { cap: `Phép tính: độ dài thật = ${cm} × ${k} = ${real} m. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: đoạn ${cm} cm trên bản đồ ra ${k} m ngoài đời thì dài bao nhiêu mét? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `${clamp(st.scCm,0,8)} cm × ${Math.max(1, st.scReal)} = ${this.real(st)} m`; },
    showFromStep() { return 2; },
    build3d(st) {
      const g = new THREE.Group(), cm = clamp(st.scCm, 0, 8), len = 3.2, mlen = (cm / 8) * len, left = -len / 2;
      const bar = (col, y, w) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, 0.4), new THREE.MeshStandardMaterial({ color: col, roughness: .55 })); b.position.set(left + w / 2, y, 0); g.add(b); };
      bar(0x3a4a52, 0.7, len); bar(0x5fb0a5, 0.7, Math.max(0.02, mlen));
      bar(0x3a4a52, -0.3, len); bar(0xffd166, -0.3, Math.max(0.02, mlen));
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: fracof (tìm phân số của một số — chia NHÓM rồi lấy) =======================
  // Repo phan-so-cua-mot-so: "chia số đó cho mẫu số ra giá trị MỘT PHẦN, rồi nhân tử số;
  // phải chia thành nhóm bằng nhau TRƯỚC rồi mới lấy phần". Khác pie: đây là MỘT TẬP rời rạc N đối tượng.
  fracof: {
    fmt(n) { return ('' + (Math.round(n * 100) / 100)).replace('.', ','); },
    eff(st) { const Total = Math.max(1, st.fcTotal), Den = clamp(st.fcDen, 2, 12), Tu = clamp(st.fcTu, 0, Den);
      const part = Total / Den; return { Total, Den, Tu, part, taken: Math.round(part * Tu * 100) / 100 }; },
    defaults(st, L) { st.fcTotal = L.fcTotal; st.fcDen = L.fcDen; st.fcTu = L.fcTu; },
    geomSig(st) { const e = this.eff(st); return 'fracof' + e.Total + ':' + e.Den + ':' + e.Tu; },
    params() { return [
      { key:'fcTu', label:'Số nhóm lấy (tử số)', min:0, max:8 },
      { key:'fcDen', label:'Chia thành mấy nhóm (mẫu số)', min:2, max:8 },
      { key:'fcTotal', label:'Tổng số đối tượng', min:4, max:24 }]; },
    ctlHint() { return 'Giơ 0–(mẫu số) ngón = số nhóm lấy; đổi tổng số đối tượng và số nhóm bằng +/−.'; },
    draw2d(host, st) {
      const e = this.eff(st), { Total, Den, Tu, part, taken } = e, f = this.fmt.bind(this);
      const W = 560, Hh = 250, pad = 26, topY = 78, step = Math.min(20, (W - 2 * pad) / Total), r = Math.min(8, step * 0.4);
      const X = (j) => pad + j * step + step / 2;
      let s = `<text x="${pad}" y="34" fill="var(--chalk)" font-size="14">Tập ${Total} đối tượng — chia ${Den} nhóm bằng nhau, lấy ${Tu} nhóm</text>`;
      // vạch ngăn nhóm
      for (let g = 1; g < Den; g++) { const bx = pad + (part * g) * step;
        s += `<line x1="${bx.toFixed(1)}" y1="${topY-16}" x2="${bx.toFixed(1)}" y2="${topY+16}" stroke="rgba(242,240,230,.35)" stroke-dasharray="3 3"></line>`; }
      // các chấm
      for (let j = 0; j < Total; j++) { const gi = Math.floor(j / part + 1e-9); const on = gi < Tu;
        s += `<circle cx="${X(j).toFixed(1)}" cy="${topY}" r="${r.toFixed(1)}" fill="${on ? '#5fb0a5' : 'rgba(242,240,230,.22)'}" stroke="${on ? '#bfeee8' : 'rgba(242,240,230,.35)'}" stroke-width="1"></circle>`; }
      // ngoặc phần lấy
      if (Tu > 0) { const xa = pad, xb = pad + (part * Tu) * step;
        s += `<rect x="${xa.toFixed(1)}" y="${topY-20}" width="${(xb-xa).toFixed(1)}" height="40" fill="none" stroke="var(--accent)" stroke-width="2" rx="4"></rect>`; }
      s += `<text x="${W/2}" y="150" fill="var(--chalk)" font-size="15" text-anchor="middle">Một phần = ${Total} : ${Den} = ${f(part)}</text>`;
      s += `<text x="${W/2}" y="205" fill="var(--accent)" font-size="18" font-weight="700" text-anchor="middle">${Tu}/${Den} của ${Total} = ${f(part)} × ${Tu} = ${f(taken)}</text>`;
      host.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, e = this.eff(st), f = this.fmt.bind(this);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hòm có ${e.Total} đồng vàng. "${e.Tu}/${e.Den} hòm" nghĩa là chia đều hòm ra ${e.Den} nhóm rồi lấy ${e.Tu} nhóm.`, hint: 'Giơ ngón tay để đặt số nhóm lấy.' };
      if (s === 2) return { cap: `Sơ đồ: CHIA ${e.Total} thành ${e.Den} nhóm BẰNG NHAU trước — mỗi nhóm ${e.Total} : ${e.Den} = ${f(e.part)} cái. Rồi mới LẤY ${e.Tu} nhóm.`, hint: 'Phải chia nhóm đều TRƯỚC, không lấy bừa từng cái.' };
      if (s === 3) return { cap: `Phép tính: ${e.Tu}/${e.Den} của ${e.Total} = ${e.Total} : ${e.Den} × ${e.Tu} = ${f(e.taken)}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: ${e.Tu}/${e.Den} của ${e.Total} bằng bao nhiêu? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const e = this.eff(st), f = this.fmt.bind(this); return `${e.Tu}/${e.Den} của ${e.Total} = ${f(e.taken)}`; },
    showFromStep() { return 2; },
    hand(st, f) { st.fcTu = clamp(f, 0, Math.max(2, st.fcDen)); },
    handLabel(f, st) { const Den = clamp(st.fcDen, 2, 12); return `→ lấy ${clamp(f, 0, Den)}/${Den} nhóm`; },
    build3d(st) {
      const g = new THREE.Group(), e = this.eff(st), Total = e.Total, cols = Math.min(8, Math.ceil(Math.sqrt(Total)));
      for (let j = 0; j < Total; j++) { const gi = Math.floor(j / e.part + 1e-9), on = gi < e.Tu;
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12), new THREE.MeshStandardMaterial({ color: on ? 0x5fb0a5 : 0x3a4a52, roughness: .5 }));
        m.position.set((j % cols - (cols - 1) / 2) * 0.62, 0.7 - Math.floor(j / cols) * 0.62, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: recipe (gấp / giảm khẩu phần theo tỉ số) =======================
  // Repo gap-giam-khau-phan: "mọi nguyên liệu cùng nhân MỘT hệ số thì TỈ SỐ giữa chúng không đổi;
  // hệ số = khẩu phần mới : khẩu phần cũ". Đưa tay ngang đổi số người ăn → cả ba cốc cùng × hệ số.
  recipe: {
    usesPalm: true,
    ING() { return [['Gạo', 1], ['Nước', 2], ['Cà chua', 3]]; },
    fmt(n) { return ('' + (Math.round(n * 100) / 100)).replace('.', ','); },
    fac(st) { const b = Math.max(1, st.rpBase), nn = Math.max(1, st.rpNew); return nn / b; },
    defaults(st, L) { st.rpBase = L.rpBase; st.rpNew = L.rpNew; },
    palmToValue(st, x) { st.rpNew = clamp(Math.round((1 - x) * 12), 1, 12); },
    palmLabel(st) { return `${st.rpNew} người · hệ số × ${this.fmt(this.fac(st))}`; },
    geomSig(st) { return 'recipe' + st.rpBase + ':' + st.rpNew; },
    params() { return [
      { key:'rpNew', label:'Số người ăn (khẩu phần mới)', min:1, max:12 },
      { key:'rpBase', label:'Số người (công thức gốc)', min:1, max:8 }]; },
    ctlHint() { return 'Đưa bàn tay ngang (hoặc +/−) đổi số người ăn; cả ba nguyên liệu cùng nhân một hệ số, TỈ SỐ giữa chúng không đổi.'; },
    draw2d(host, st) {
      const ing = this.ING(), f = this.fmt.bind(this), base = Math.max(1, st.rpBase), nf = Math.max(1, st.rpNew), factor = this.fac(st);
      const W = 560, Hh = 250, x0 = 120, len = 340, rowY = (i) => 78 + i * 52, maxV = Math.max(3 * factor, 3, 6);
      const bar = (x, w, col, y, h) => `<rect x="${x.toFixed(1)}" y="${y}" width="${Math.max(0, w).toFixed(1)}" height="${h}" rx="3" fill="${col}"></rect>`;
      let s = `<text x="16" y="30" fill="var(--chalk)" font-size="14">${base} người → ${nf} người (hệ số = ${nf} : ${base} = ${f(factor)})</text>`
        + `<text x="${x0}" y="50" fill="#7fc9bf" font-size="11">cũ</text><text x="${x0+40}" y="50" fill="#ffd166" font-size="11">mới (× ${f(factor)})</text>`;
      for (let i = 0; i < ing.length; i++) { const y = rowY(i), amt = ing[i][1], scaled = amt * factor;
        s += `<text x="14" y="${y+13}" fill="var(--chalk)" font-size="13">${ing[i][0]}</text>`
          + `<rect x="${x0}" y="${y-6}" width="${len}" height="26" fill="rgba(255,255,255,.05)" stroke="rgba(242,240,230,.14)"></rect>`
          + bar(x0, (amt / maxV) * len, 'rgba(95,176,165,.55)', y-4, 10)
          + bar(x0, (scaled / maxV) * len, 'rgba(255,209,102,.8)', y+8, 10)
          + `<text x="${(x0 + (scaled / maxV) * len + 6).toFixed(1)}" y="${y+17}" fill="#ffd166" font-size="12">${f(scaled)}</text>`;
      }
      s += `<text x="${W/2}" y="234" fill="var(--accent)" font-size="15" font-weight="700" text-anchor="middle">Tỉ số ${ing.map(x=>x[1]).join(' : ')} giữa các nguyên liệu KHÔNG đổi</text>`;
      host.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}" style="cursor:ew-resize">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, ing = this.ING(), f = this.fmt.bind(this), base = Math.max(1, st.rpBase), nf = Math.max(1, st.rpNew), factor = this.fac(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: công thức gốc cho ${base} người cần ${ing.map(x=>x[1] + ' ' + x[0]).join(', ')}.`, hint: 'Đưa tay ngang để đổi số người ăn.' };
      if (s === 2) return { cap: `Sơ đồ: nhà có ${nf} người → hệ số = ${nf} : ${base} = ${f(factor)}. Muốn gấp khẩu phần thì MỖI nguyên liệu đều × cùng một hệ số.`, hint: 'Cùng × một hệ số ⇒ TỈ số giữa các nguyên liệu giữ nguyên.' };
      if (s === 3) return { cap: `Phép tính: ${ing.map(x=>x[0] + ' ' + x[1] + ' × ' + f(factor) + ' = ' + f(x[1] * factor)).join('; ')}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: ${nf} người thì cần bao nhiêu ${ing[0][0].toLowerCase()}? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `hệ số = ${Math.max(1, st.rpNew)} : ${Math.max(1, st.rpBase)} = ${this.fmt(this.fac(st))}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const g = new THREE.Group(), ing = this.ING(), factor = this.fac(st), maxV = Math.max(3 * factor, 6), cols = [0x5fb0a5, 0x9fd0e0, 0xe0483d];
      for (let i = 0; i < ing.length; i++) { const scaled = ing[i][1] * factor, h = (scaled / maxV) * 2.2 + 0.2;
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.7, h, 0.7), new THREE.MeshStandardMaterial({ color: cols[i], roughness: .5 }));
        m.position.set((i - 1) * 1.1, h / 2 - 0.8, 0); g.add(m); }
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: units (tấn-tạ-yến-kg — cân đổi đơn vị) =======================
  // Repo 'Tấn, tạ, ki-lô-gam, gam và cân hai đĩa' (dòng 39–41): cùng con số 3 nhưng
  // 3 TẤN ≠ 3 KG → "phải đổi về cùng đơn vị trước khi so sánh"; mỗi bậc ×/÷ đúng 10.
  units: {
    twoHands: true,
    UNITS() { return [['kg', 1], ['yến', 10], ['tạ', 100], ['tấn', 1000]]; },
    fmtKg(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); },
    kg(st, side) { const u = this.UNITS(), val = side === 'L' ? st.unL : st.unR, idx = clamp(side === 'L' ? st.unLu : st.unRu, 0, 3); return val * u[idx][1]; },
    uName(st, side) { return this.UNITS()[clamp(side === 'L' ? st.unLu : st.unRu, 0, 3)][0]; },
    defaults(st, L) { st.unL = L.unL; st.unLu = L.unLu; st.unR = L.unR; st.unRu = L.unRu; },
    geomSig(st) { return 'units' + st.unL + ':' + st.unLu + ':' + st.unR + ':' + st.unRu; },
    params() { return [
      { key: 'unL', label: 'Đĩa trái · số đo', min: 0, max: 9 },
      { key: 'unLu', label: 'Đĩa trái · đơn vị (0 kg · 1 yến · 2 tạ · 3 tấn)', min: 0, max: 3 },
      { key: 'unR', label: 'Đĩa phải · số đo', min: 0, max: 9 },
      { key: 'unRu', label: 'Đĩa phải · đơn vị (0 kg · 1 yến · 2 tạ · 3 tấn)', min: 0, max: 3 }]; },
    ctlHint() { return 'Giơ HAI tay đặt số đo mỗi đĩa (trái/phải); chọn ĐƠN VỊ mỗi đĩa bằng +/−. Cùng con số nhưng khác đơn vị thì cân lệch.'; },
    tiltDeg(st) { const a = this.kg(st, 'L'), b = this.kg(st, 'R'); if (a === b) return 0;
      const mag = clamp(Math.log10((Math.max(a, b) + 1e-9) / (Math.min(a, b) + 1e-9)) / 3, 0, 1) * 22; return a > b ? mag : -mag; },
    verdict(st) { const a = this.kg(st, 'L'), b = this.kg(st, 'R'); return a === b ? '=' : (a > b ? '>' : '<'); },
    draw2d(host, st) {
      const kgL = this.kg(st, 'L'), kgR = this.kg(st, 'R'), v = this.verdict(st);
      const cx = 260, cy = 88, HL = 168, SL = 54, W = 520, H = 300;
      const rad = this.tiltDeg(st) * Math.PI / 180;
      const lx = cx - HL * Math.cos(rad), ly = cy + HL * Math.sin(rad);
      const rx = cx + HL * Math.cos(rad), ry = cy - HL * Math.sin(rad);
      const pan = (px, py) => `<path d="M ${px - 34} ${py} Q ${px} ${py + 24} ${px + 34} ${py} Z" fill="rgba(255,255,255,.12)" stroke="var(--chalk)" stroke-width="2"></path>`;
      const weight = (px, py, val, unit, fill) => { const w = 46, h = 34, bx = px - w / 2, by = py - h - 2;
        return `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="#d9a520"></rect>`
          + `<text x="${px.toFixed(1)}" y="${(by + h / 2 + 6).toFixed(1)}" fill="#10201c" font-size="15" font-weight="700" text-anchor="middle">${val} ${unit}</text>`; };
      const lab = (px, py, kgl) => `<text x="${px.toFixed(1)}" y="${(py + SL + 40).toFixed(1)}" fill="rgba(242,240,230,.7)" font-size="13" text-anchor="middle">= ${this.fmtKg(kgl)} kg</text>`;
      const nTip = { x: cx + 46 * Math.sin(rad), y: cy - 46 * Math.cos(rad) };
      host.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
        + `<line x1="${cx}" y1="${cy - 6}" x2="${cx}" y2="${cy - 56}" stroke="rgba(242,240,230,.35)" stroke-width="2" stroke-dasharray="4 4"></line>`
        + `<line x1="${lx}" y1="${ly}" x2="${rx}" y2="${ry}" stroke="var(--chalk)" stroke-width="5" stroke-linecap="round"></line>`
        + `<line x1="${lx.toFixed(1)}" y1="${ly.toFixed(1)}" x2="${lx.toFixed(1)}" y2="${(ly + SL).toFixed(1)}" stroke="var(--chalk)" stroke-width="1.5"></line>`
        + `<line x1="${rx.toFixed(1)}" y1="${ry.toFixed(1)}" x2="${rx.toFixed(1)}" y2="${(ry + SL).toFixed(1)}" stroke="var(--chalk)" stroke-width="1.5"></line>`
        + pan(lx, ly + SL) + weight(lx, ly + SL, st.unL, this.uName(st, 'L'), '#7fc9bf')
        + pan(rx, ry + SL) + weight(rx, ry + SL, st.unR, this.uName(st, 'R'), '#9fd0e0')
        + lab(lx, ly + SL, kgL) + lab(rx, ry + SL, kgR)
        + `<polygon points="${cx - 14},${cy + 18} ${cx + 14},${cy + 18} ${cx},${cy}" fill="var(--chalk)"></polygon>`
        + `<line x1="${cx}" y1="${cy}" x2="${nTip.x.toFixed(1)}" y2="${nTip.y.toFixed(1)}" stroke="var(--warn)" stroke-width="3"></line>`
        + `<text x="${cx}" y="${H - 10}" fill="var(--accent)" font-size="22" font-weight="700" text-anchor="middle">${this.fmtKg(kgL)} kg  ${v}  ${this.fmtKg(kgR)} kg</text>`
        + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, v = this.verdict(st), uL = this.uName(st, 'L'), uR = this.uName(st, 'R');
      const kgL = this.kg(st, 'L'), kgR = this.kg(st, 'R'), f = this.fmtKg.bind(this);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: đĩa trái ${st.unL} ${uL}, đĩa phải ${st.unR} ${uR}. Cùng một con số mà chưa chắc nặng như nhau.`, hint: 'Giơ HAI tay đặt số đo mỗi đĩa; đổi đơn vị bằng +/−.' };
      if (s === 2) return { cap: `Sơ đồ: phải ĐỔI VỀ CÙNG ĐƠN VỊ mới so được. Trái ${st.unL} ${uL} = ${f(kgL)} kg; phải ${st.unR} ${uR} = ${f(kgR)} kg → ${f(kgL)} ${v} ${f(kgR)}; đĩa ${kgL === kgR ? 'thăng bằng' : (v === '>' ? 'trái hạ xuống' : 'phải hạ xuống')}.`, hint: 'Đơn vị to hơn thì nặng hơn, dù số đo nhỏ.' };
      if (s === 3) return { cap: `Phép tính: mỗi bậc kg→yến→tạ→tấn là ×/÷ đúng 10; 1 tấn = 10 tạ = 100 yến = 1000 kg. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: 2 tấn đổi ra bao nhiêu ki-lô-gam? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const f = this.fmtKg.bind(this); return `${st.unL} ${this.uName(st, 'L')} = ${f(this.kg(st, 'L'))} kg  ${this.verdict(st)}  ${st.unR} ${this.uName(st, 'R')} = ${f(this.kg(st, 'R'))} kg`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; // màn chiếu mirror qua CSS → đảo trục
        if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.unL = clamp(l, 0, 9);
      if (r !== null) st.unR = clamp(r, 0, 9);
    },
    build3d(st) {
      const g = new THREE.Group(), pivot = new THREE.Group();
      pivot.rotation.z = this.tiltDeg(st) * Math.PI / 180; g.add(pivot); g.userData.pivot = pivot;
      const chalk = new THREE.MeshStandardMaterial({ color: 0xf2f0e6, roughness: .6 }), HL = 2.0;
      pivot.add(new THREE.Mesh(new THREE.BoxGeometry(HL * 2, 0.12, 0.12), chalk));
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.9, 12), chalk); post.position.set(0, -0.5, 0); pivot.add(post);
      const drop = (side, val, unit) => { const x = side * HL;
        const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.55, 0.14, 20), new THREE.MeshStandardMaterial({ color: 0x9fb0bd, roughness: .55 }));
        pan.position.set(x, -0.9, 0); pivot.add(pan);
        const k = Math.log10(Math.max(1, val) * this.UNITS()[clamp(unit, 0, 3)][1]) + 0.5, s = clamp(0.25 + 0.16 * k, 0.3, 1.1);
        const cube = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), new THREE.MeshStandardMaterial({ color: side < 0 ? 0x5fb0a5 : 0x8fbcd4, roughness: .5 }));
        cube.position.set(x, -0.9 - s / 2 - 0.05, 0); pivot.add(cube);
      };
      drop(-1, st.unL, st.unLu); drop(1, st.unR, st.unRu);
      return g;
    },
    paint3d(g, st) { if (g.userData.pivot) g.userData.pivot.rotation.z = this.tiltDeg(st) * Math.PI / 180; },
  },

  // ======================= Model: dec (so sánh số thập phân theo cột dấu phẩy) =======================
  // Repo 'thap-phan-can-bang': 0,5 vs 0,48 — nhiều chữ số HƠN chưa chắc LỚN HƠN.
  // Xếp THẲNG CỘT dấu phẩy, so từ trái sang phải, cột ĐẦU TIÊN khác nhau quyết định; thêm 0 cuối không đổi.
  dec: {
    twoHands: true,
    COLS: ['đơn vị', 'phần mười', 'phần trăm', 'phần nghìn'],
    defaults(st, L) { st.aU = L.aU; st.a1 = L.a1; st.a2 = L.a2; st.a3 = L.a3; st.bU = L.bU; st.b1 = L.b1; st.b2 = L.b2; st.b3 = L.b3; },
    digs(st, side) { return side === 'A' ? [st.aU, st.a1, st.a2, st.a3] : [st.bU, st.b1, st.b2, st.b3]; },
    val(st, side) { const d = this.digs(st, side); return d[0] + (d[1] * 100 + d[2] * 10 + d[3]) / 1000; },
    str(st, side) { const d = this.digs(st, side); const frac = ('' + d[1] + d[2] + d[3]).replace(/0+$/, ''); return d[0] + (frac ? ',' + frac : ''); },
    firstDiff(st) { const A = this.digs(st, 'A'), B = this.digs(st, 'B');
      for (let i = 0; i < 4; i++) if (A[i] !== B[i]) return { i, a: A[i], b: B[i], v: A[i] > B[i] ? '>' : '<' };
      return { i: -1, v: '=' }; },
    geomSig(st) { return 'dec' + this.digs(st, 'A').join('') + this.digs(st, 'B').join(''); },
    params() { return [
      { key: 'aU', label: 'A · đơn vị', min: 0, max: 9 }, { key: 'a1', label: 'A · phần mười', min: 0, max: 9 },
      { key: 'a2', label: 'A · phần trăm', min: 0, max: 9 }, { key: 'a3', label: 'A · phần nghìn', min: 0, max: 9 },
      { key: 'bU', label: 'B · đơn vị', min: 0, max: 9 }, { key: 'b1', label: 'B · phần mười', min: 0, max: 9 },
      { key: 'b2', label: 'B · phần trăm', min: 0, max: 9 }, { key: 'b3', label: 'B · phần nghìn', min: 0, max: 9 }]; },
    ctlHint() { return 'Chỉnh từng chữ số bằng +/−. Bật camera giơ HAI tay: tay trái đặt CỘT PHẦN MƯỜI của A, tay phải của B — cột hay quyết định nhất.'; },
    draw2d(host, st) {
      const xs = [150, 250, 320, 390], commaX = 190, ay = 120, by = 185, cw = 54, W = 560, H = 270;
      const fd = this.firstDiff(st);
      const cell = (cx, cy, d, hl) => `<rect x="${(cx - cw / 2).toFixed(0)}" y="${cy - 26}" width="${cw}" height="52" rx="7" fill="${hl ? 'rgba(255,143,107,.18)' : 'rgba(255,255,255,.05)'}" stroke="${hl ? 'var(--warn)' : 'rgba(242,240,230,.18)'}" stroke-width="${hl ? 3 : 1}"></rect>`
        + `<text x="${cx}" y="${cy + 10}" fill="var(--chalk)" font-size="30" font-weight="700" text-anchor="middle">${d}</text>`;
      let s = `<text x="16" y="24" fill="rgba(242,240,230,.55)" font-size="12">A = ${this.str(st, 'A')} · B = ${this.str(st, 'B')} — xếp thẳng cột, so từ trái sang phải</text>`;
      for (let i = 0; i < 4; i++) s += `<text x="${xs[i]}" y="52" fill="#7fc9bf" font-size="12" text-anchor="middle">${this.COLS[i]}</text>`;
      const hl = (i) => fd.i === i;
      for (let i = 0; i < 4; i++) s += cell(xs[i], ay, this.digs(st, 'A')[i], hl(i)) + cell(xs[i], by, this.digs(st, 'B')[i], hl(i));
      s += `<circle cx="${commaX}" cy="${ay}" r="5" fill="var(--chalk)"></circle><circle cx="${commaX}" cy="${by}" r="5" fill="var(--chalk)"></circle>`
        + `<line x1="${commaX}" y1="60" x2="${commaX}" y2="${H - 46}" stroke="rgba(242,240,230,.3)" stroke-width="1.5" stroke-dasharray="5 5"></line>`;
      if (fd.i >= 0) { const bx = xs[fd.i]; s += `<rect x="${bx - cw / 2 - 6}" y="${ay - 32}" width="${cw + 12}" height="${by - ay + 64}" fill="none" stroke="var(--warn)" stroke-width="2" rx="9"></rect>`
        + `<text x="${bx}" y="${ay - 40}" fill="var(--warn)" font-size="12" font-weight="700" text-anchor="middle">cột quyết định</text>`; }
      const verdict = fd.v === '=' ? '=  (bằng nhau)' : `${this.str(st, 'A')} ${fd.v} ${this.str(st, 'B')}`;
      s += `<text x="${W / 2}" y="${H - 16}" fill="var(--accent)" font-size="26" font-weight="700" text-anchor="middle">${verdict}</text>`;
      host.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, fd = this.firstDiff(st), A = this.str(st, 'A'), B = this.str(st, 'B');
      const why = fd.i < 0 ? 'hai số bằng nhau' : `cột ${this.COLS[fd.i]}: ${fd.a} ${fd.v} ${fd.b}`;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: hai số cần so là ${A} và ${B}. ${B.replace(',', '').length > A.replace(',', '').length ? 'B nhiều chữ số hơn mà chưa chắc đã lớn hơn.' : 'Nhiều chữ số hơn chưa chắc đã lớn hơn.'}`, hint: 'Chỉnh chữ số bằng +/−, hoặc giơ hai tay đặt cột phần mười.' };
      if (s === 2) return { cap: `Sơ đồ: xếp THẲNG CỘT dấu phẩy rồi so từng hàng từ TRÁI sang PHẢI. Cột đầu tiên khác nhau quyết định → ${why}.`, hint: 'Chỉ cần một cột hơn là số đó lớn hơn, bất kể các cột sau.' };
      if (s === 3) return { cap: `Phép tính: ${A} ${fd.v} ${B} (${why}). Thêm 0 vào cuối phần thập phân (vd. ${A} = ${this.val(st, 'A').toFixed(3).replace('.', ',')}) thì giá trị KHÔNG đổi. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: 0,7 và 0,72 — số nào lớn hơn? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const fd = this.firstDiff(st); return `${this.str(st, 'A')} ${fd.v} ${this.str(st, 'B')}${fd.i >= 0 ? ' · cột ' + this.COLS[fd.i] : ''}`; },
    showFromStep() { return 2; },
    hand2(st, hands) {
      let l = null, r = null;
      for (const h of hands) { const sx = 1 - h.x; // màn chiếu mirror qua CSS → đảo trục
        if (sx < 0.5) { if (l === null || h.f > l) l = h.f; } else { if (r === null || h.f > r) r = h.f; } }
      if (l !== null) st.a1 = clamp(l, 0, 9);
      if (r !== null) st.b1 = clamp(r, 0, 9);
    },
    build3d(st) {
      const g = new THREE.Group(), mx = 10, mk = (color, x) => { const m = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1, 0.9), new THREE.MeshStandardMaterial({ color, roughness: .5 })); m.position.set(x, 0, 0); g.add(m); return m; };
      g.userData.a = mk(0x5fb0a5, -1.2); g.userData.b = mk(0xe0483d, 1.2);
      const set = (m, val) => { const h = (val / mx) * 2.6 + 0.05; m.scale.y = h; m.position.y = -1.3 + h / 2; };
      set(g.userData.a, this.val(st, 'A')); set(g.userData.b, this.val(st, 'B')); g.userData.set = set;
      return g;
    },
    paint3d(g, st) { if (g.userData.set) { g.userData.set(g.userData.a, this.val(st, 'A')); g.userData.set(g.userData.b, this.val(st, 'B')); } },
  },

  // ======================= Model: parity (số chẵn – số lẻ — ghép đôi) =======================
  // Repo 'chan-le': xếp n bạn thành từng đôi, còn 1 đứng một mình = LẺ;
  // chỉ CHỮ SỐ TẬN CÙNG quyết định (0,2,4,6,8 → chẵn; 1,3,5,7,9 → lẻ).
  parity: {
    usesPalm: true,
    defaults(st, L) { st.pn = L.pn; },
    palmToValue(st, x) { st.pn = clamp(Math.round((1 - x) * 24), 0, 24); },
    palmLabel(st) { return `${st.pn} bạn → ${st.pn % 2 === 0 ? 'CHẴN' : 'LẺ'}`; },
    geomSig(st) { return 'parity' + st.pn; },
    params() { return [{ key: 'pn', label: 'Số bạn', min: 0, max: 24 }]; },
    ctlHint() { return 'Đưa bàn tay ngang (hoặc +/−) đổi số bạn; các bạn được GHÉP THÀNH ĐÔI — còn dư 1 bạn đứng một mình là số LẺ.'; },
    isEven(n) { return n % 2 === 0; },
    draw2d(host, st) {
      const n = clamp(st.pn, 0, 24), pairs = Math.floor(n / 2), rem = n % 2, last = n % 10;
      const W = 560, colPerRow = 4, slotW = 128, x0 = 44, y0 = 70, rowH = 62;
      const total = pairs + rem; let s = '';
      const dot = (cx, cy, solo) => `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="15" fill="${solo ? 'var(--warn)' : 'var(--accent)'}" ${solo ? 'stroke="#ffcf9f" stroke-dasharray="4 3" stroke-width="2"' : 'stroke="#d9a520"'}></circle>`;
      for (let p = 0; p < pairs; p++) { const col = p % colPerRow, row = Math.floor(p / colPerRow);
        const bx = x0 + col * slotW, by = y0 + row * rowH;
        s += `<path d="M ${bx} ${by} Q ${bx + 20} ${by - 24} ${bx + 40} ${by}" fill="none" stroke="rgba(242,240,230,.4)" stroke-width="2"></path>` + dot(bx, by, false) + dot(bx + 40, by, false); }
      if (rem) { const col = pairs % colPerRow, row = Math.floor(pairs / colPerRow);
        const bx = x0 + col * slotW + 20, by = y0 + row * rowH;
        s += dot(bx, by, true) + `<text x="${bx}" y="${by - 22}" fill="var(--warn)" font-size="11" text-anchor="middle">một mình</text>`; }
      const Hh = y0 + Math.ceil(total / colPerRow) * rowH + 90;
      // dải chữ số 0–9, tô màu theo chẵn/lẻ, đóng khung chữ số tận cùng của n
      let strip = '';
      for (let d = 0; d < 10; d++) { const dx = 30 + d * 52, even = d % 2 === 0, mark = d === last;
        strip += `<rect x="${dx}" y="0" width="40" height="40" rx="6" fill="${even ? 'rgba(95,176,165,.5)' : 'rgba(224,72,61,.5)'}" ${mark ? 'stroke="var(--chalk)" stroke-width="3"' : ''}></rect>`
          + `<text x="${dx + 20}" y="27" fill="#fff" font-size="20" font-weight="700" text-anchor="middle">${d}</text>`; }
      s += `<g transform="translate(0, ${Hh - 66})">${strip}</g>`
        + `<text x="${W / 2}" y="${Hh - 14}" fill="var(--accent)" font-size="22" font-weight="700" text-anchor="middle">${n} = 2 × ${pairs} + ${rem} → số ${n % 2 === 0 ? 'CHẴN' : 'LẺ'} (tận cùng ${last}: ${last % 2 === 0 ? 'chẵn' : 'lẻ'})</text>`;
      host.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}" style="cursor:ew-resize">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, n = clamp(st.pn, 0, 24), pairs = Math.floor(n / 2), rem = n % 2, last = n % 10;
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: xếp ${n} bạn thành từng đôi để múa. Ghép được ${pairs} đôi${rem ? ', còn 1 bạn đứng một mình' : ', không ai đứng một mình'}.`, hint: 'Đưa tay ngang để đổi số bạn, hoặc bấm +/−.' };
      if (s === 2) return { cap: `Sơ đồ: ${n} = 2 × ${pairs} + ${rem}. ${rem ? 'Còn dư 1 → KHÔNG ghép hết được nên là số LẺ.' : 'Ghép hết, không dư → số CHẴN.'} Nhìn dải chữ số 0–9: chỉ cần xét CHỮ SỐ TẬN CÙNG ${last}.`, hint: '0 · 2 · 4 · 6 · 8 → chẵn (xanh); 1 · 3 · 5 · 7 · 9 → lẻ (đỏ).' };
      if (s === 3) return { cap: `Kết luận: ${n} là số ${rem ? 'LẺ' : 'CHẴN'} vì tận cùng là ${last}. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: số ${n + 1} là chẵn hay lẻ? (gợi ý: nhìn chữ số tận cùng). Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { const n = clamp(st.pn, 0, 24); return `${n} = 2 × ${Math.floor(n / 2)} + ${n % 2} → ${n % 2 === 0 ? 'chẵn' : 'lẻ'}`; },
    showFromStep() { return 2; },
    build3d(st) {
      const g = new THREE.Group(), n = clamp(st.pn, 0, 24), pairs = Math.floor(n / 2), rem = n % 2;
      const cols = 5, slotX = (i) => (i % cols - (cols - 1) / 2) * 1.1, slotY = (i) => 1.2 - Math.floor(i / cols) * 1.0;
      const sph = (x, y, solo) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 14), new THREE.MeshStandardMaterial({ color: solo ? 0xff8f6b : 0x5fb0a5, roughness: .5 })); m.position.set(x, y, 0); g.add(m); };
      for (let p = 0; p < pairs; p++) { const bx = slotX(p), by = slotY(p); sph(bx - 0.28, by, false); sph(bx + 0.28, by, false); }
      if (rem) sph(slotX(pairs), slotY(pairs), true);
      return g;
    },
    paint3d() {},
  },

  // ======================= Model: threeforms (1/2 = 0,5 = 50% — ba dạng viết) =======================
  // Repo 'chuyen-dong-f-d-p' = "Ba dạng viết của cùng một giá trị": dóng ba băng trên MỘT trục → trùng khít.
  threeforms: {
    usesPalm: true,
    DENS() { return [2, 4, 5, 10, 20, 25, 50, 100]; },
    D(st) { return this.DENS()[clamp(st.tfDI, 0, 7)]; },
    N(st) { return clamp(st.tfN, 0, this.D(st)); },
    frac(st) { return this.N(st) / this.D(st); },
    fmtDec(st) { let s = (Math.round(this.frac(st) * 100) / 100).toFixed(2).replace(/0+$/, '').replace(/\.$/, ''); return s.replace('.', ',') || '0'; },
    pct(st) { return Math.round(this.frac(st) * 100); },
    defaults(st, L) { st.tfDI = L.tfDI; st.tfN = L.tfN; },
    palmToValue(st, x) { st.tfN = clamp(Math.round((1 - x) * this.D(st)), 0, this.D(st)); },
    palmLabel(st) { return `${this.N(st)}/${this.D(st)} = ${this.fmtDec(st)} = ${this.pct(st)}%`; },
    geomSig(st) { return 'threeforms' + this.D(st) + ':' + this.N(st); },
    params() { return [
      { key: 'tfDI', label: 'Mẫu số (2·4·5·10·20·25·50·100)', min: 0, max: 7 },
      { key: 'tfN', label: 'Tử số / số phần lấy', min: 0, max: 100 }]; },
    ctlHint() { return 'Đưa bàn tay ngang để tô lượng chung; chọn MẪU SỐ bằng +/−. Ba băng phân số · thập phân · phần trăm luôn dóng về CÙNG một vạch.'; },
    draw2d(host, st) {
      const D = this.D(st), N = this.N(st), f = this.frac(st);
      const W = 560, x0 = 60, x1 = 520, len = x1 - x0, dv = x0 + f * len;
      const band = (y, fill, label, lab) => {
        let cells = '';
        if (label === 'frac' && D <= 20) { for (let i = 1; i < D; i++) { const xx = x0 + (i / D) * len; cells += `<line x1="${xx.toFixed(1)}" y1="${y}" x2="${xx.toFixed(1)}" y2="${y + 30}" stroke="rgba(255,255,255,.25)"></line>`; } }
        if (label !== 'frac') { for (let i = 1; i < 10; i++) { const xx = x0 + (i / 10) * len; cells += `<line x1="${xx.toFixed(1)}" y1="${y}" x2="${xx.toFixed(1)}" y2="${y + 30}" stroke="rgba(255,255,255,.22)"></line>`; } }
        return `<rect x="${x0}" y="${y}" width="${len}" height="30" fill="rgba(255,255,255,.05)" stroke="rgba(242,240,230,.28)"></rect>`
          + `<rect x="${x0}" y="${y}" width="${(f * len).toFixed(1)}" height="30" fill="${fill}"></rect>` + cells
          + `<text x="14" y="${y + 20}" fill="var(--chalk)" font-size="12">${lab.t}</text>`
          + `<text x="${x1 + 4}" y="${y + 20}" fill="${lab.c}" font-size="14" font-weight="700">${lab.v}</text>`;
      };
      let s = `<text x="${W / 2}" y="24" fill="rgba(242,240,230,.55)" font-size="12" text-anchor="middle">cùng một lượng — dóng ba băng trên một trục 0 → 1</text>`;
      s += band(44, 'rgba(95,176,165,.7)', 'frac', { t: 'PS', c: '#5fb0a5', v: `${N}/${D}` });
      s += band(104, 'rgba(255,209,102,.7)', 'dec', { t: 'STP', c: '#ffd166', v: this.fmtDec(st) });
      s += band(164, 'rgba(127,201,191,.7)', 'pct', { t: '%', c: '#7fc9bf', v: `${this.pct(st)}%` });
      // đường dóng chung tại f
      s += `<line x1="${dv.toFixed(1)}" y1="40" x2="${dv.toFixed(1)}" y2="200" stroke="var(--warn)" stroke-width="2.5" stroke-dasharray="5 4"></line>`
        + `<circle cx="${dv.toFixed(1)}" cy="210" r="6" fill="var(--warn)"></circle>`
        + `<text x="${dv.toFixed(1)}" y="228" fill="var(--warn)" font-size="12" font-weight="700" text-anchor="middle">trùng khít</text>`
        + `<line x1="${x0}" y1="200" x2="${x1}" y2="200" stroke="var(--chalk)" stroke-width="1.5"></line>`
        + `<text x="${x0}" y="214" fill="rgba(242,240,230,.6)" font-size="11" text-anchor="middle">0</text>`
        + `<text x="${x1}" y="214" fill="rgba(242,240,230,.6)" font-size="11" text-anchor="middle">1</text>`
        + `<text x="${W / 2}" y="256" fill="var(--accent)" font-size="22" font-weight="700" text-anchor="middle">${N}/${D} = ${this.fmtDec(st)} = ${this.pct(st)}%</text>`;
      host.innerHTML = `<svg width="${W}" height="270" viewBox="0 0 ${W} 270" style="cursor:ew-resize">` + s + `</svg>`;
    },
    caption(st) {
      const L = cur(), s = st.step, N = this.N(st), D = this.D(st), dc = this.fmtDec(st), p = this.pct(st);
      if (s === 0) return { cap: L.khoi_dong, hint: 'Bấm "Bước tiếp" sang phần Vật thật.' };
      if (s === 1) return { cap: `Vật thật: ${N}/${D}, ${dc} và ${p}% là BA cách viết của CÙNG một lượng (một cái bánh được tô ${p} phần trăm).`, hint: 'Đưa tay ngang để tô, chọn mẫu số bằng +/−.' };
      if (s === 2) return { cap: `Sơ đồ: dóng ba băng (phân số · số thập phân · phần trăm) trên MỘT trục 0→1. Đầu phần tô của cả ba trùng khít tại cùng một vạch → đúng là MỘT thứ, không phải ba thứ.`, hint: 'Đổi mẫu số (2,4,5,10,20,25,50,100) thì cả ba vẫn dóng về một chỗ.' };
      if (s === 3) return { cap: `Phép tính: ${N}/${D} = ${N} : ${D} = ${dc}; ${dc} = ${p}/100 = ${p}%. ` + L.chot, hint: '' };
      return { cap: `Cả lớp trả lời: 3/4 viết ra số thập phân và phần trăm là bao nhiêu? Cô đếm tay giơ, hoặc bấm +1/+5.`, hint: '' };
    },
    value(st) { return `${this.N(st)}/${this.D(st)} = ${this.fmtDec(st)} = ${this.pct(st)}%`; },
    showFromStep() { return 2; },
    build3d(st) {
      const g = new THREE.Group(), f = this.frac(st), cols = [0x5fb0a5, 0xffd166, 0x7fc9bf];
      for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(4.2 * f + 0.05, 0.5, 0.9), new THREE.MeshStandardMaterial({ color: cols[i], roughness: .5 }));
        m.position.set(-2.1 + (4.2 * f) / 2, 0, (1 - i) * 1.2); g.add(m); }
      return g;
    },
    paint3d() {},
  },

});

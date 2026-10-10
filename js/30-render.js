
// ======================= Bật/tắt miếng (chỉ pie) =======================
function toggleSect(i) {
  if (MDL() !== MODELS.pie || state.step < 1) return;
  state.shaded[i] = !state.shaded[i];
  drawVisual(); render();
}

// ======================= Vẽ 2D =======================
function drawVisual() { MDL().draw2d($('visual'), state); }

// ======================= Bỏ phiếu (classVote) =======================
function renderVote() {
  const c = state.vote.correct, w = state.vote.wrong;
  $('vCorrect').textContent = c; $('vWrong').textContent = w;
  const recorded = c + w; // TỔNG SỐ ĐÁP ÁN ĐÃ GHI NHẬN — cùng dân số với tỉ lệ
  const sum = $('voteSummary');
  if (recorded === 0) { sum.textContent = 'chưa ghi nhận đáp án nào'; return; }
  const wrongRatio = `${Math.round((w/recorded)*100)}% số đáp án đã ghi nhận sai`;
  const needReteach = w/recorded > 1/3;
  let line = `Tổng đã ghi nhận: ${recorded} đáp án · ${wrongRatio}` + (needReteach ? ' — GỢI Ý: giảng lại bước SƠ ĐỒ' : '');
  // Vòng 31: chỉ dòng đối chiếu N/M cần sĩ số; tỉ lệ trên số ĐÃ GHI NHẬN (M-free) vẫn hiện khi M trống.
  if (state.M != null) {
    line = (recorded < state.M ? `mới ghi nhận ${recorded}/${state.M} em — có thể chưa đủ để kết luận. ` : `đã ghi nhận ${recorded}/${state.M} em. `) + line;
  }
  sum.textContent = line;
}

// ======================= Điều khiển mô hình (stepper) =======================
function renderModelControls() {
  const host = $('modelControls'), m = MDL();
  const steps = m.params().map(p =>
    `<div class="prow"><span class="plabel">${p.label}</span>
      <button class="mini" data-dec="${p.key}">−</button>
      <span class="pval" id="pv_${p.key}">${state[p.key]}</span>
      <button class="mini" data-inc="${p.key}">+</button></div>`).join('');
  const T = m.toggles ? m.toggles() : [];
  const togs = T.map(t =>
    `<label class="prow small"><input type="checkbox" data-tog="${t.key}" ${state[t.key] ? 'checked' : ''}/> ${t.label}</label>`).join('');
  host.innerHTML = steps + togs + `<div class="muted small" style="margin-top:4px">${m.ctlHint()}</div>`;
  host.querySelectorAll('button[data-dec],button[data-inc]').forEach(b => b.addEventListener('click', () => {
    const inc = b.hasAttribute('data-inc'), k = b.dataset.inc || b.dataset.dec;
    const p = m.params().find(x => x.key === k);
    state[k] = clamp(state[k] + (inc ? 1 : -1) * (p.step || 1), p.min, p.max);
    if (k === 'den') state.shaded = Array.from({ length: state.den }, (_, i) => i < state.shaded.filter(Boolean).length);
    render();
  }));
  host.querySelectorAll('input[data-tog]').forEach(cb => cb.addEventListener('change', () => { state[cb.dataset.tog] = cb.checked; render(); }));
}

// ======================= Kết xuất =======================
// ======================= Bài tập LUYỆN TẬP (bước 5) =======================
const EXKEY = {"tan-ta-kg-can":"khoi-luong","thap-phan":"thap-phan-khai-niem","chuyen-dong":"chuyen-dong-de","gap-giam-khau-phan":"ti-so-dau-bep","ba-dang-viet":"chuyen-dong-f-d-p","doc-bang-so-lieu":"bang-so-lieu"};
// Bai tap LUYEN TAP verbatim tu tools/data/examples.mjs cua bank giao an.
// key = bank cluster; EXKEY o tren map id bai trong app sang dung key.
const EX = {"phan-so-dau":[{"prompt":"Hình vuông chia 8 phần bằng nhau, tô màu 3 phần. Phân số chỉ phần tô màu?","choices":["3/8","8/3","3/5"],"answer":"3/8","explanation":"Mẫu số là tổng số phần bằng nhau (8), tử số là số phần được lấy (3).","errorTag":"tu_so_mau_so_dao_nguoc"},{"prompt":"Phân số nào lớn hơn 1?","choices":["7/5","5/7","6/6"],"answer":"7/5","explanation":"Lớn hơn 1 khi tử số lớn hơn mẫu số; 6/6 bằng 1, 5/7 bé hơn 1.","errorTag":"so_sanh_theo_so_phan_tu_thoi"}],"nhan":[{"prompt":"Tính nhẩm 24 × 11.","choices":["264","246","242"],"answer":"264","explanation":"24 × 11 = 2 (2+4) 4 = 264: viết tổng hai chữ số vào giữa.","errorTag":"nham_11_sai_quy_tac"},{"prompt":"Tính 305 × 20.","choices":["6 100","610","6 010"],"answer":"6 100","explanation":"305 × 2 = 610, nhân tiếp với 10 → thêm một chữ số 0 ở tận cùng: 6100.","errorTag":"quen_them_chu_so_0"}],"dien-tich-don-vi":[{"prompt":"Hình chữ nhật 7 cm × 4 cm có diện tích bao nhiêu?","choices":["28 cm²","22 cm²","28 cm"],"answer":"28 cm²","explanation":"7 × 4 = 28 ô vuông 1 cm². 22 cm là chu vi (7+4)×2 — đừng nhầm hai đại lượng.","errorTag":"nham_chu_vi_thanh_dien_tich"},{"prompt":"Đếm lưới: hình tô phủ 14 ô vuông 1 cm² và 4 nửa ô. Diện tích?","choices":["16 cm²","18 cm²","14 cm²"],"answer":"16 cm²","explanation":"4 nửa ô ghép thành 2 ô nguyên; 14 + 2 = 16 cm².","errorTag":"dem_o_chuong_lac"}],"lam-tron":[{"prompt":"Làm tròn 28 653 đến hàng nghìn.","choices":["28 000","29 000","28 700"],"answer":"29 000","explanation":"Chữ số hàng trăm là 6 (>= 5) nên hàng nghìn tăng 28 lên 29, các chữ số sau thành 0.","errorTag":"quên_lam_tron_khi_bang_5"},{"prompt":"Số nào trên tia số được làm tròn thành 40 000?","choices":["34 500","39 480","45 200"],"answer":"39 480","explanation":"Vùng làm tròn về 40 000 là từ 35 000 đến 44 999; 34 500 về 30 000, 45 200 về 50 000.","errorTag":"doc_thước_sai_vach"}],"hang-so":[{"prompt":"Số nào có chữ số 7 ở hàng chục nghìn?","choices":["748 560","174 560","480 756"],"answer":"748 560","explanation":"Ở 748 560 chữ số 7 đứng hàng chục nghìn vì đếm từ phải sang: 0-đơn vị, 6-chục, 5-trăm, 8-nghìn, 4-chục nghìn, 7-trăm nghìn. Ờ sai: 174 560 có 7 ở hàng nghìn.","errorTag":"doc_nham_hang"},{"prompt":"Viết số gồm 3 trăm nghìn, 5 chục nghìn, 0 nghìn, 2 trăm, 4 chục, 1 đơn vị.","choices":["350 241","352 241","305 241"],"answer":"350 241","explanation":"Hàng nghìn bằng 0 nên vẫn phải viết chữ số 0 ở vị trí đó: 3-5-0 / 2-4-1.","errorTag":"thieu_hang_trong"}],"hinh-binh-hanh":[{"prompt":"Hình bình hành có đáy 8 cm, chiều cao 5 cm. Diện tích?","choices":["40 cm²","26 cm²","13 cm²"],"answer":"40 cm²","explanation":"S = đáy × chiều cao = 8 × 5 = 40 cm². Chiều cao là khoảng cách vuông góc giữa hai đáy, không phải cạnh bên.","errorTag":"dung-canh-ben-lam-chenh-cao"},{"prompt":"Hình bình hành đáy 12 cm, cạnh bên 7 cm. Chu vi?","choices":["38 cm","84 cm","19 cm"],"answer":"38 cm","explanation":"P = (12 + 7) × 2 = 38 cm.","errorTag":"nham-chu-vi-dien-tich"}],"tat-ca":[{"prompt":"Biểu thức nào có giá trị bằng 25 × (4 + 6)?","choices":["25 × 4 + 25 × 6","25 × 4 + 6","(25 + 4) × 6"],"answer":"25 × 4 + 25 × 6","explanation":"Tính chất phân phối của phép nhân đối với phép cộng: nhân 25 với từng số hạng rồi cộng lại = 100 + 150 = 250.","errorTag":"doi_tinh_chat_nham"},{"prompt":"Chọn đáp án: 360 : (9 × 4) bằng?","choices":["10","16","90"],"answer":"10","explanation":"Trong ngoặc trước: 9 × 4 = 36, rồi 360 : 36 = 10. Nếu tính 360 : 9 = 40 rồi mới × 4 sẽ sai.","errorTag":"nhan_sai_thu_tu_thuc_hien"}],"thoi-gian":[{"prompt":"Đồng hồ chỉ kim ngắn giữa số 8 và 9, kim dài chỉ số 6. Là mấy giờ?","choices":["8 giờ 30 phút","6 giờ 40 phút","8 giờ 6 phút"],"answer":"8 giờ 30 phút","explanation":"Kim dài chỉ số 6 nghĩa là 30 phút (mỗi số = 5 phút), không phải 6 phút.","errorTag":"kim_ngan_kim_dai_nguoc"},{"prompt":"Bộ phim bắt đầu 19 giờ 45 phút, kéo dài 1 giờ 25 phút. Kết thúc lúc nào?","choices":["21 giờ 10 phút","20 giờ 10 phút","20 giờ 30 phút"],"answer":"21 giờ 10 phút","explanation":"45 + 25 = 70 phút = 1 giờ 10 phút; 19 + 1 + 1 = 21 giờ.","errorTag":"nham_1gio_60_phut"}],"goc":[{"prompt":"Góc có số đo 125° là góc gì?","choices":["Góc tù","Góc nhọn","Góc bẹt"],"answer":"Góc tù","explanation":"Góc nhọn < 90°, vuông = 90°, tù trong khoảng 90°–180°, bẹt = 180°.","errorTag":"nham_goc_tu_goc_nhon"},{"prompt":"Thước đo góc chỉ cạnh thứ hai qua vạch 40, cạnh đầu ở vạch 0 bên trong. Số đo góc?","choices":["40°","140°","50°"],"answer":"40°","explanation":"Đọc theo thang đo trùng với cạnh đi qua 0; đọc thang ngược sẽ ra 140°.","errorTag":"doc_o_vach_ngoai"}],"the-tich":[{"prompt":"Hình hộp chữ nhật 5 cm × 4 cm × 3 cm. Thể tích?","choices":["60 cm³","47 cm³","94 cm³"],"answer":"60 cm³","explanation":"V = 5 × 4 × 3 = 60 cm³; 47 là chu vi-related, 94 là diện tích toàn phần của bộ ba mặt.","errorTag":"nham_the_tich_voi_dien_tich_mat"},{"prompt":"Kho 12 cm × 5 cm × 4 cm chứa bao nhiêu khối lập phương 1 cm³?","choices":["240","60","120"],"answer":"240","explanation":"Mỗi lớp 12 × 5 = 60 khối, có 4 lớp → 240 khối = thể tích 240 cm³.","errorTag":"dem_lap_phuong_thieu_lo"}],"thap-phan-khai-niem":[{"prompt":"Số 3,05 đọc là?","choices":["ba phẩy không năm","ba phẩy năm","ba mươi lăm phần nghìn"],"answer":"ba phẩy không năm","explanation":"Đọc từng chữ số sau dấu phẩy; số 0 ở hàng phần mười phải được đọc.","errorTag":"doc_phan_thap_phan_tram"},{"prompt":"Phân số 7/100 viết thành số thập phân?","choices":["0,07","0,7","7,0"],"answer":"0,07","explanation":"Mẫu 100 → hai chữ số sau dấu phẩy.","errorTag":"gia_tri_tuong_ung_hang_thap_phan"}],"phan-tram":[{"prompt":"Tính 15% của 240 kg.","choices":["36 kg","34 kg","150 kg"],"answer":"36 kg","explanation":"240 : 100 × 15 = 36 kg.","errorTag":"tinh_phan_tram_cua_mot_so_sai_buoc"},{"prompt":"Áo 500 000 đồng giảm 20%. Giá phải trả?","choices":["400 000 đồng","100 000 đồng","480 000 đồng"],"answer":"400 000 đồng","explanation":"Giảm 100 000 đồng nên trả 400 000 đồng; 100 000 chỉ là phần giảm.","errorTag":"tru_giam_gia_nham_cong_tru"}],"bieu-do-cot":[{"prompt":"Biểu đồ cột, 1 ô = 5 quyển. Lớp 4A cao 6 ô. Lớp 4A có bao nhiêu quyển?","choices":["30","6","35"],"answer":"30","explanation":"Phải nhân theo chú giải tỉ lệ: 6 × 5 = 30 quyển.","errorTag":"dem_o_sai_ty_le"},{"prompt":"Cột tháng 4 cao 90, cột tháng 5 cao 60. Tháng 4 nhiều hơn tháng 5 bao nhiêu?","choices":["30","150","20"],"answer":"30","explanation":"So sánh hai cột bằng cách trừ chiều cao: 90 − 60 = 30.","errorTag":"so_sanh_chieu_cao_khong_cung_goc"}],"bang-so-lieu":[{"prompt":"Bảng số cây của 4 lớp: 32, 28, 41, 35. Trung bình cộng?","choices":["34 cây","35 cây","36 cây"],"answer":"34 cây","explanation":"(32 + 28 + 41 + 35) : 4 = 136 : 4 = 34.","errorTag":"tinh_trung_binh_cong_sai"},{"prompt":"Dãy số liệu 15, 8, 15, 22, 8 có bao nhiêu giá trị khác nhau?","choices":["3","5","2"],"answer":"3","explanation":"Giá trị khác nhau là 8, 15, 22 — đếm theo giá trị distinct, không đếm số ô.","errorTag":"dem_trung_gia_tri"}],"ti-so-tong-hieu":[{"prompt":"Tổng hai số 45, tỉ số 4/5. Hai số là?","choices":["20 và 25","15 và 30","18 và 27"],"answer":"20 và 25","explanation":"Tổng số phần 4 + 5 = 9; một phần 45 : 9 = 5; số bé 20, số lớn 25.","errorTag":"thieu_buoc_tinh_tong_so_phan"},{"prompt":"Hiệu hai số 12, tỉ số 2/5. Số lớn?","choices":["20","32","8"],"answer":"20","explanation":"Hiệu số phần 5 − 2 = 3; một phần 12 : 3 = 4; số lớn 4 × 5 = 20.","errorTag":"nham_ti_so_thanh_hieu_so"}],"hinh-thoi":[{"prompt":"Hình thoi có hai đường chéo 6 cm và 8 cm. Diện tích?","choices":["24 cm²","48 cm²","14 cm²"],"answer":"24 cm²","explanation":"S = (6 × 8) : 2 = 24 cm². Quên chia 2 là lỗi phổ biến.","errorTag":"quen-chia-2-tich-hai-duong-cheo"},{"prompt":"Hình thoi có cạnh 5 cm. Chu vi?","choices":["20 cm","25 cm","10 cm"],"answer":"20 cm","explanation":"Bốn cạnh bằng nhau nên P = 5 × 4 = 20 cm.","errorTag":"doi-deu-dai-hai-chenh"}],"phan-so-bang-nhau":[{"prompt":"Rút gọn 18/24 được phân số tối giản?","choices":["3/4","9/12","6/8"],"answer":"3/4","explanation":"Chia cả tử và mẫu cho ƯCLN(18, 24) = 6 → 3/4. 9/12 và 6/8 vẫn rút gọn tiếp được nên chưa tối giản.","errorTag":"rut_gon_chua_het"},{"prompt":"Phân số nào bằng 2/5?","choices":["4/10","2/10","5/2"],"answer":"4/10","explanation":"Nhân cả tử và mẫu của 2/5 với 2 được 4/10. 2/10 rút gọn thành 1/5, còn 5/2 là phân số đảo ngược.","errorTag":"nhan_chia_tu_ma_khong_cung_so"}],"quy-dong-mau":[{"prompt":"Quy đồng mẫu số 1/4 và 2/6 (MSCNN = 12). Kết quả?","choices":["3/12 và 4/12","2/8 và 4/12","3/12 và 2/12"],"answer":"3/12 và 4/12","explanation":"12 : 4 = 3 → 1/4 = 3/12; 12 : 6 = 2 → 2/6 = 4/12. Nhân cả tử lẫn mẫu cùng một số.","errorTag":"doi_mau_quen_doi_tu"},{"prompt":"Mẫu số chung nhỏ nhất của 1/6 và 1/8 là?","choices":["24","48","14"],"answer":"24","explanation":"MSCNN là BCNN(6, 8) = 24. Dùng 48 vẫn quy đồng được nhưng chưa gọn nhất.","errorTag":"chon_mau_chung_khong_phai_MNBC"}],"xac-suat":[{"prompt":"Hộp có 5 bóng đỏ và 3 bóng xanh. Rút 1 bóng, khả năng nào chắc chắn xảy ra?","choices":["Rút được bóng đỏ hoặc xanh","Rút được bóng đỏ","Rút được bóng vàng"],"answer":"Rút được bóng đỏ hoặc xanh","explanation":"Trong hộp chỉ có đỏ và xanh nên rút thế nào cũng được một trong hai màu: chắc chắn. Còn màu vàng là không thể.","errorTag":"nham_co_the_kha_chac"},{"prompt":"Hộp 2 đỏ, 8 xanh: rút 1 bóng màu nào có khả năng cao hơn?","choices":["Xanh","Đỏ","Bằng nhau"],"answer":"Xanh","explanation":"So số kết quả thuận lợi: 8 > 2 nên khả năng rút bóng xanh cao hơn.","errorTag":"dem_khong_het_mau"}],"vuong-goc-song-song":[{"prompt":"Hai đường không cắt nhau dù kéo dài về hai phía thì quan hệ là?","choices":["Song song","Vuông góc","Cắt nhau"],"answer":"Song song","explanation":"Song song là không bao giờ cắt nhau; vuông góc là cắt nhau tạo góc 90°.","errorTag":"keo_dai_nghi_la_song_song"},{"prompt":"Kẻ đường thẳng đi qua điểm O trên đường d và cắt d tạo góc 90°. Đường đó gọi là?","choices":["Đường vuông góc với d","Đường song song với d","Đường chéo"],"answer":"Đường vuông góc với d","explanation":"Vì đi qua O và cắt d tại góc vuông nên d’ được gọi là đường vuông góc với d.","errorTag":"qua_tam_dinh_khi_ke"}],"chia":[{"prompt":"850 : 4 được thương và số dư là?","choices":["212 dư 2","213","212 dư 6"],"answer":"212 dư 2","explanation":"8 : 4 = 2; 5 : 4 = 1 dư 1; 10 : 4 = 2 dư 2. Số dư bao giờ cũng nhỏ hơn số chia nên \"dư 6\" vô lý.","errorTag":"bo_qua_so_du"},{"prompt":"Chia đều 47 quyển vở cho 5 bạn. Mỗi bạn mấy quyển, còn mấy quyển?","choices":["9 quyển, dư 2","10 quyển","7 quyển, dư 12"],"answer":"9 quyển, dư 2","explanation":"47 : 5 = 9 dư 2. Không thể chia 10 vì 10 × 5 = 50 > 47; dư 12 vô lý vì 12 > 5.","errorTag":"thuong_khong_nguyen_to"}],"cong-tru-phan-so":[{"prompt":"Tính 3/7 + 2/7.","choices":["5/7","5/14","6/14"],"answer":"5/7","explanation":"Cộng hai phân số cùng mẫu: cộng tử, giữ nguyên mẫu → 5/7. Không được cộng mẫu.","errorTag":"cong_tu_voi_mau"},{"prompt":"Tính 5/6 − 1/3 rồi rút gọn.","choices":["1/2","4/3","3/2"],"answer":"1/2","explanation":"Quy đồng 1/3 = 2/6, rồi 5/6 − 2/6 = 3/6 = 1/2. Quên rút gọn là lỗi hay gặp.","errorTag":"ket_qua_khong_rut_gon"}],"bieu-do-tranh":[{"prompt":"Biểu đồ tranh, chú giải \"1 🍊 = 4 quả\". Hàng của Lan có 3 hình. Lan có bao nhiêu quả?","choices":["12","3","7"],"answer":"12","explanation":"Đọc chú giải trước: 3 × 4 = 12 quả.","errorTag":"quen_nhan_cua_1_hinh"},{"prompt":"Hàng Nam có 2 hình rưỡi, 1 hình = 4 que kem. Nam có bao nhiêu que?","choices":["10","8","12"],"answer":"10","explanation":"Nửa hình = 4 : 2 = 2 que; 2 hình = 8 que; tổng 8 + 2 = 10 que.","errorTag":"chia_le_chinh_xac"}],"chuyen-dong-de":[{"prompt":"Xe đi 90 km trong 1,5 giờ. Vận tốc?","choices":["60 km/giờ","45 km/giờ","135 km/giờ"],"answer":"60 km/giờ","explanation":"v = s : t = 90 : 1,5 = 60 km/giờ.","errorTag":"nham_cong_tru_van_toc"},{"prompt":"Hai xe cách nhau 180 km, đi ngược chiều với vận tốc 40 và 50 km/giờ. Sau bao lâu gặp nhau?","choices":["2 giờ","3 giờ 36 phút","4 giờ"],"answer":"2 giờ","explanation":"Tổng vận tốc 90 km/giờ; 180 : 90 = 2 giờ.","errorTag":"quen_tru_thoi_gian_di_tru"}],"ti-le-ban-do":[{"prompt":"Bản đồ tỉ lệ 1 : 10 000, hai điểm cách nhau 4 cm trên bản đồ. Ngoài thực tế?","choices":["400 m","40 m","4 000 m"],"answer":"400 m","explanation":"4 cm × 10 000 = 40 000 cm = 400 m. Phải đổi cm ra m ở bước cuối.","errorTag":"doi_don_vi_cm_km"},{"prompt":"Quãng đường thật 6 km, bản đồ tỉ lệ 1 : 100 000. Trên bản đồ dài bao nhiêu cm?","choices":["6 cm","60 cm","0,6 cm"],"answer":"6 cm","explanation":"6 km = 600 000 cm; 600 000 : 100 000 = 6 cm.","errorTag":"nham_chieu_dai_thuc_te"}],"phan-so-cua-mot-so":[{"prompt":"Tìm 2/5 của 30 kg gạo.","choices":["12 kg","75 kg","6 kg"],"answer":"12 kg","explanation":"30 : 5 × 2 = 12 kg. Chia theo mẫu số trước rồi nhân theo tử số.","errorTag":"chia_thieu_bang_so_phan_chia"},{"prompt":"Lớp có 28 bạn, 3/4 số bạn thích bơi. Có bao nhiêu bạn thích bơi?","choices":["21 bạn","37 bạn","7 bạn"],"answer":"21 bạn","explanation":"28 : 4 = 7, 7 × 3 = 21 bạn.","errorTag":"do_dai_cac_phan_bang_nhau"}],"ti-so-dau-bep":[{"prompt":"Công thức cho 2 người: 300 g gạo. Nấu cho 6 người cần bao nhiêu gạo?","choices":["900 g","600 g","1 800 g"],"answer":"900 g","explanation":"Gấp 3 lần (6 : 2 = 3), nên 300 × 3 = 900 g. Nhân cả hệ số cho mọi nguyên liệu.","errorTag":"gap_doi_khong_gap_den_4"},{"prompt":"Lúa : nước = 1 : 2. Nấu 150 g lúa cần bao nhiêu nước?","choices":["300 ml","150 ml","75 ml"],"answer":"300 ml","explanation":"Nước gấp đôi lúa: 150 × 2 = 300 ml.","errorTag":"nham_ti_so_thanh_phep_chia_don_vi"}],"khoi-luong":[{"prompt":"3 tấn 5 tạ = ... kg","choices":["3 500 kg","350 kg","30 500 kg"],"answer":"3 500 kg","explanation":"1 tấn = 1000 kg nên 3 tấn = 3000 kg; 1 tạ = 100 kg nên 5 tạ = 500 kg. Cộng lại 3500 kg.","errorTag":"doi_don_vi_thieu_so_0"},{"prompt":"So sánh: 2 tạ 60 kg ... 260 kg","choices":[">","<","="],"answer":"=","explanation":"Đổi về cùng đơn vị trước khi so sánh: 2 tạ = 200 kg, cộng 60 kg = 260 kg.","errorTag":"san_nhau_don_vi_tru_khi_so_sanh"}],"thap-phan-can-bang":[{"prompt":"So sánh 4,05 ... 4,5","choices":["<",">","="],"answer":"<","explanation":"Viết cùng số chữ số: 4,05 và 4,50 → 05 < 50 nên 4,05 < 4,5.","errorTag":"so_sanh_hang_phan_muoi_thoi"},{"prompt":"Số nào bằng 7,20?","choices":["7,2","7,02","72"],"answer":"7,2","explanation":"Bỏ chữ số 0 ở tận cùng bên phải phần thập phân thì giá trị không đổi.","errorTag":"dau_bang_nhau_tru_so_0"}],"chan-le":[{"prompt":"Số 487 là số chẵn hay số lẻ?","choices":["Chẵn","Lẻ"],"answer":"Lẻ","explanation":"Chỉ cần nhìn chữ số tận cùng: 7 là số lẻ nên 487 lẻ. Các chữ số phía trước không ảnh hưởng.","errorTag":"xet_hang_chuc_thay_vi_don_vi"},{"prompt":"Tổng 245 + 348 là chẵn hay lẻ?","choices":["Chẵn","Lẻ"],"answer":"Lẻ","explanation":"Chẵn + lẻ = lẻ. 245 lẻ, 348 chẵn nên tổng lẻ; thử lại: 593.","errorTag":"tinh_chat_chan_le_nham"}],"chuyen-dong-f-d-p":[{"prompt":"Phân số nào bằng 0,25?","choices":["1/4","2/5","1/2"],"answer":"1/4","explanation":"1 : 4 = 0,25 và 25%. Ba cách viết cùng một giá trị.","errorTag":"nham_ty_le_10_100_1000"},{"prompt":"3/5 viết dưới dạng phần trăm?","choices":["60%","30%","35%"],"answer":"60%","explanation":"3 : 5 = 0,6; 0,6 × 100 = 60%.","errorTag":"them_so_0_ben_phai_sai_gia_tri"}],"bai-toan-nhieu-buoc":[{"prompt":"5 cái bút hết 45 000 đồng. 8 cái bút cùng loại hết bao nhiêu tiền?","choices":["72 000 đồng","56 000 đồng","80 000 đồng"],"answer":"72 000 đồng","explanation":"Rút về đơn vị: 1 cái = 45 000 : 5 = 9 000 đồng; 8 cái = 9 000 × 8 = 72 000 đồng.","errorTag":"chon_sai_phep_tinh"},{"prompt":"Tổng hai số 96, tỉ số 3 : 5. Số lớn là?","choices":["60","36","48"],"answer":"60","explanation":"Tổng số phần bằng nhau 3 + 5 = 8; một phần = 96 : 8 = 12; số lớn = 12 × 5 = 60.","errorTag":"thieu_buoc_tinh_tong_so_phan"}],"so-sanh-sap-xep":[{"prompt":"Sắp xếp tăng dần: 65 412 · 65 142 · 6 541 · 654 120","answer":"6 541 < 65 142 < 65 412 < 654 120","explanation":"Số ít chữ số hơn thì nhỏ hơn. Hai số 5 chữ số có cùng 65 nghìn thì so hàng nghìn: 1 < 4.","errorTag":"so_sanh_khong_cung_hang"},{"prompt":"Chọn dấu đúng: 1 299 999 ... 1 300 001","choices":[">","<","="],"answer":"<","explanation":"So từ trái sang: hàng triệu và trăm nghìn bằng nhau (1, 3), hàng chục nghìn 9 < 0? Không — 1 299 999 có trăm nghìn là 2, còn 1 300 001 có trăm nghìn là 3, nên số trước bé hơn.","errorTag":"dau_lon_hon_be_hon"}],"cong-tru":[{"prompt":"Tính 50 003 − 27 846.","choices":["22 157","23 157","22 257"],"answer":"22 157","explanation":"Ở hàng nghìn phải mượn 1 của hàng chục nghìn rồi mới trừ; 10 − 3 = 7, 9 − 4 = 5, 9 − 8 = 1, 4 − 7 không được nên mượn 5 = 10 → 14 − 7 = 7? Kiểm tra lại theo cột dọc, kết quả 22 157.","errorTag":"thieu_muon"},{"prompt":"Giá trị biểu thức 12 000 − (2 350 + 1 650) là?","choices":["8 000","11 000","6 000"],"answer":"8 000","explanation":"Tính trong ngoặc trước: 2 350 + 1 650 = 4 000, rồi 12 000 − 4 000 = 8 000.","errorTag":"tinh_trai_thu_tu_khong_co ngoặc"}],"on-tap-toan-4":[{"prompt":"Số gồm 4 triệu, 0 trăm nghìn, 7 nghìn, 5 chục?","choices":["4 007 050","4 070 050","4 700 500"],"answer":"4 007 050","explanation":"Viết đủ cả ba lớp, hàng nào thiếu thì ghi 0.","errorTag":"thieu_hang_trong"},{"prompt":"Tính nhanh: 25 × 9 × 4.","choices":["900","360","225"],"answer":"900","explanation":"Đổi chỗ 25 × 4 = 100 rồi × 9 = 900 (tính chất giao hoán).","errorTag":"nhan_sai_thu_tu_thuc_hien"}],"boss-cong-thu":[{"prompt":"Giai đoạn 1: Tính 125 × 8.","choices":["1 000","1 0000","960"],"answer":"1 000","explanation":"125 × 8 = 1000 vì 125 × 4 = 500 rồi × 2.","errorTag":"nhan_sai_thu_tu_thuc_hien"},{"prompt":"Giai đoạn 2: Diện tích hình thoi có hai đường chéo 10 cm và 6 cm.","choices":["30 cm²","60 cm²","16 cm²"],"answer":"30 cm²","explanation":"(10 × 6) : 2 = 30 cm²; giai đoạn này kiểm tra việc nhớ chia 2.","errorTag":"quen-chia-2-tich-hai-duong-cheo"}],"hinh-hoc-on-tap":[{"prompt":"Hình tròn đường kính 8 cm. Bán kính?","choices":["4 cm","16 cm","25,12 cm"],"answer":"4 cm","explanation":"Bán kính = đường kính : 2.","errorTag":"goi_ten_hinh_sai"},{"prompt":"Hình hộp 6 dm × 4 dm × 2 dm. Diện tích xung quanh?","choices":["40 dm²","80 dm²","88 dm²"],"answer":"80 dm²","explanation":"Chu vi đáy (6 + 4) × 2 = 20 dm; Sxq = 20 × 2 = 80 dm².","errorTag":"nham_cong_thuc_chu_vi_dien_tich"}],"on-tap-toan-5":[{"prompt":"Tính 3,5 × 4,2.","choices":["14,7","14,70","1,47"],"answer":"14,7","explanation":"Bỏ dấu phẩy: 35 × 42 = 1470; đếm 2 chữ số thập phân → 14,70 = 14,7.","errorTag":"thieu_dau_phay_thap_phan"},{"prompt":"Một lớp 40 bạn, 60% thích toán. Có bao nhiêu bạn?","choices":["24 bạn","26 bạn","16 bạn"],"answer":"24 bạn","explanation":"40 : 100 × 60 = 24. Kiểm tra: 60% của 40 phải nhỏ hơn 40.","errorTag":"tinh_phan_tram_cua_mot_so_sai_buoc"}]};
// Tiền Việt Nam không có trong examples.mjs của bank → tác 2 câu SGK-style riêng cho bài mới.
EX['tien-viet-nam'] = [
  { prompt: 'Trong ví có 2 tờ 5 000 đồng và 3 tờ 2 000 đồng. Hỏi trong ví có tất cả bao nhiêu tiền?', choices: ['16 000 đồng', '14 000 đồng', '10 000 đồng'], answer: '16 000 đồng', explanation: 'Đếm theo từng mệnh giá: 2 × 5 000 = 10 000; 3 × 2 000 = 6 000; cộng lại 10 000 + 6 000 = 16 000 đồng.', errorTag: 'cong-nham-menh-gia' },
  { prompt: 'Món hàng giá 25 000 đồng, bạn Lan đưa cô bán hàng tờ 50 000 đồng. Cô bán hàng phải thối lại bao nhiêu tiền?', choices: ['25 000 đồng', '35 000 đồng', '75 000 đồng'], answer: '25 000 đồng', explanation: 'Tiền thối = tiền trả − giá tiền = 50 000 − 25 000 = 25 000 đồng (không cộng hai số lên).', errorTag: 'cong-thay-vi-tru-tien-thoi' },
];
// Dấu hiệu chia hết không có trong examples.mjs của bank → 2 câu SGK-style tự tác.
EX['dau-hieu-chia-het'] = [
  { prompt: 'Số 63 có chia hết cho 3 không? Vì sao?', choices: ['Có, vì 6 + 3 = 9 chia hết cho 3', 'Có, vì chữ số tận cùng là 3', 'Không, vì 63 là số lẻ'], answer: 'Có, vì 6 + 3 = 9 chia hết cho 3', explanation: 'Muốn xét chia hết cho 3, lấy TỔNG các chữ số: 6 + 3 = 9, mà 9 ⋮ 3 nên 63 ⋮ 3.', errorTag: 'xet-chu-so-tan-cung-thay-vi-tong' },
  { prompt: 'Số nào dưới đây chia hết cho CẢ 2 và 5?', choices: ['30', '25', '12'], answer: '30', explanation: 'Chia hết cho cả 2 và 5 ⇔ chữ số tận cùng là 0. Chỉ có 30 tận cùng bằng 0.', errorTag: 'quen-dau-hieu-ket-hop-tan-cung-0' },
];
// Biểu đồ hình quạt không có trong examples.mjs của bank → 2 câu SGK-style tự tác.
EX['bieu-do-hinh-quat'] = [
  { prompt: 'Một biểu đồ hình quạt cho biết 25% số em lớp 5 thích bơi lội. Lớp có 20 em. Hỏi có bao nhiêu em thích bơi lội?', choices: ['5 em', '10 em', '4 em'], answer: '5 em', explanation: '25% của 20 = 20 × 25 / 100 = 5 em.', errorTag: 'tinh-sai-phan-tram-cua-mot-so' },
  { prompt: 'Trong biểu đồ hình quạt, cả hình tròn đại diện cho bao nhiêu phần trăm?', choices: ['100%', '50%', 'Bằng số nhóm'], answer: '100%', explanation: 'Cả hình tròn là toàn bộ = 100%; các quạt cộng lại đúng 100%, không phụ thuộc số nhóm.', errorTag: 'khong-biet-ca-hinh-tron-bang-100-phan-tram' },
];
// Biểu đồ đoạn thẳng không có trong examples.mjs của bank → 2 câu SGK-style tự tác.
EX['bieu-do-doan-thang'] = [
  { prompt: 'Nhiệt độ lúc 6 giờ là 20°C, lúc 12 giờ là 31°C. Từ 6 giờ đến 12 giờ nhiệt độ TĂNG bao nhiêu độ?', choices: ['11°C', '9°C', '51°C'], answer: '11°C', explanation: 'Đoạn đi lên, độ tăng = hiệu hai giá trị: 31 − 20 = 11°C (lấy hiệu, không cộng hai số).', errorTag: 'cong-thay-vi-tru-khoang-tang' },
  { prompt: 'Muốn biết lúc nào nhiệt độ CAO NHẤT trên biểu đồ đoạn thẳng, em nhìn vào đâu?', choices: ['Điểm cao nhất của đường', 'Điểm ngoài cùng bên phải', 'Đoạn nằm ngang dài nhất'], answer: 'Điểm cao nhất của đường', explanation: 'Trục DỌC là nhiệt độ, nên điểm cao nhất = nhiệt độ lớn nhất; trục ngang chỉ là giờ.', errorTag: 'nham-truc-doc-voi-truc-ngang' },
];
// Đại lượng S–v–t không có trong examples.mjs của bank → 2 câu SGK-style tự tác.
EX['dai-luong-s-v-t'] = [
  { prompt: 'Một ô tô đi đều với vận tốc 45 km/giờ trong 3 giờ. Hỏi ô tô đi được bao nhiêu ki-lô-mét?', choices: ['135 km', '48 km', '15 km'], answer: '135 km', explanation: 'Quãng đường = vận tốc × thời gian: S = v × t = 45 × 3 = 135 km.', errorTag: 'cong-thay-vi-nhan-when-tinh-quat-duong' },
  { prompt: 'Một người đi xe máy được 120 km trong 3 giờ. Vận tốc của người đó là bao nhiêu?', choices: ['40 km/giờ', '360 km/giờ', '117 km/giờ'], answer: '40 km/giờ', explanation: 'Vận tốc = quãng đường ÷ thời gian: v = S ÷ t = 120 ÷ 3 = 40 km/giờ (CHIA, không nhân).', errorTag: 'nhan-thay-vi-chia-tinh-van-toc' },
];
// Hình tròn không có trong examples.mjs của bank → 2 câu SGK-style tự tác.
EX['hinh-tron'] = [
  { prompt: 'Một hình tròn có bán kính 4 cm. Hỏi đường kính của nó dài bao nhiêu xăng-ti-mét?', choices: ['8 cm', '4 cm', '12,56 cm'], answer: '8 cm', explanation: 'Đường kính gấp đôi bán kính: d = 2 × r = 2 × 4 = 8 cm.', errorTag: 'nham-ban-kinh-bang-duong-kinh' },
  { prompt: 'Một hình tròn có bán kính 2 cm. Chu vi của nó là bao nhiêu? (lấy π ≈ 3,14)', choices: ['12,56 cm', '6,28 cm', '4 cm'], answer: '12,56 cm', explanation: 'Chu vi C = 2 × π × r = 2 × 3,14 × 2 = 12,56 cm (đừng quên nhân 2).', errorTag: 'quen-nhan-2-trong-cong-thuc-chu-vi' },
];
// Diện tích tam giác không có trong examples.mjs của bank → 2 câu SGK-style tự tác.
EX['dien-tich-tam-giac'] = [
  { prompt: 'Một hình tam giác có đáy 8 cm và chiều cao 5 cm. Diện tích của nó là bao nhiêu?', choices: ['20 cm²', '40 cm²', '13 cm²'], answer: '20 cm²', explanation: 'S = đáy × cao ÷ 2 = 8 × 5 ÷ 2 = 20 cm². Tính 8 × 5 = 40 rồi QUÊN chia 2 là chưa cắt đôi hình chữ nhật.', errorTag: 'quen-chia-doi-khi-tinh-dien-tich-tam-giac' },
  { prompt: 'Vì sao diện tích hình tam giác bằng đáy × chiều cao RỒI CHIA 2?', choices: ['Vì ghép 2 tam giác giống hệt thành 1 hình chữ nhật', 'Vì tam giác luôn nhỏ hơn hình vuông', 'Vì chiều cao luôn ngắn hơn đáy'], answer: 'Vì ghép 2 tam giác giống hệt thành 1 hình chữ nhật', explanation: 'Hai tam giác giống hệt ghép theo đường chéo tạo thành hình chữ nhật đáy × cao, nên một tam giác chỉ bằng MỘT NỬA → công thức có "÷ 2".', errorTag: 'khong-hieu-vi-sao-chia-2' },
];
// Diện tích hình thang không có trong examples.mjs của bank → 2 câu SGK-style tự tác.
EX['dien-tich-hinh-thang'] = [
  { prompt: 'Một hình thang có đáy lớn 12 cm, đáy nhỏ 8 cm, chiều cao 6 cm. Diện tích của nó là bao nhiêu?', choices: ['60 cm²', '120 cm²', '26 cm²'], answer: '60 cm²', explanation: 'S = (đáy lớn + đáy nhỏ) × cao ÷ 2 = (12 + 8) × 6 ÷ 2 = 20 × 6 ÷ 2 = 60 cm². Phải CỘNG hai đáy trước, rồi nhân cao, rồi chia 2.', errorTag: 'cong-thieu-day-hoac-quen-chia-2-hinh-thang' },
  { prompt: 'Vì sao diện tích hình thang bằng (đáy lớn + đáy nhỏ) × chiều cao RỒI CHIA 2?', choices: ['Vì hai hình thang giống hệt ghép thành hình bình hành đáy (a + b)', 'Vì hình thang có bốn cạnh', 'Vì chiều cao luôn ngắn hơn đáy'], answer: 'Vì hai hình thang giống hệt ghép thành hình bình hành đáy (a + b)', explanation: 'Quay một hình thang giống hệt áp vào cạnh nghiêng → được hình bình hành có đáy bằng TỔNG hai đáy (a + b), cao h. Hình thang = một nửa, nên S = (a + b) × h ÷ 2.', errorTag: 'khong-hieu-vi-sao-cong-hai-day-roi-chia-2' },
];
// Diện tích hình hộp chữ nhật không có trong examples.mjs của bank → 2 câu SGK-style tự tác.
EX['dien-tich-hinh-hop'] = [
  { prompt: 'Một hộp chữ nhật có chiều dài 6 cm, chiều rộng 4 cm, chiều cao 3 cm. Diện tích XUNG QUANH của hộp là bao nhiêu?', choices: ['60 cm²', '108 cm²', '72 cm²'], answer: '60 cm²', explanation: 'Sxq = (dài + rộng) × 2 × cao = (6 + 4) × 2 × 3 = 60 cm². Xung quanh chỉ tính 4 MẶT BÊN, chưa cộng hai đáy.', errorTag: 'tinh-nham-xung-quanh-thanh-toan-phan' },
  { prompt: 'Với hộp ở trên (dài 6, rộng 4, cao 3), diện tích TOÀN PHẦN là bao nhiêu?', choices: ['108 cm²', '60 cm²', '48 cm²'], answer: '108 cm²', explanation: 'Stp = Sxq + 2 × (dài × rộng) = 60 + 2 × (6 × 4) = 60 + 48 = 108 cm². Toàn phần phải CỘNG thêm hai mặt đáy vào diện tích xung quanh.', errorTag: 'quen-cong-hai-day-khi-tinh-toan-phan' },
];
EX['thu-tu-tinh'] = [
  { prompt: 'Tính: 4 + 5 × 3 = ?', choices: ['27', '19', '15'], answer: '19', explanation: 'Không có ngoặc nên × chạy trước: 5 × 3 = 15, rồi 4 + 15 = 19. Đọc trái→phải (4 + 5 = 9 rồi × 3 = 27) là SAI thứ tự.', errorTag: 'doc-trai-sang-phai-quen-nhan-truoc' },
  { prompt: 'Tính: (6 + 2) × 5 = ?', choices: ['16', '40', '34'], answer: '40', explanation: 'Có DẤU NGOẶC nên làm trong ngoặc trước: 6 + 2 = 8, rồi 8 × 5 = 40. Bỏ ngoặc nhảy sang 2 × 5 = 10 rồi cộng 6 = 16 là SAI.', errorTag: 'bo-ngoac-tinh-nhan-truoc' },
];
EX['chu-vi-dien-tich-hcn'] = [
  { prompt: 'Một mảnh vườn hình chữ nhật dài 8 m, rộng 5 m. Người ta đóng hàng RÀO quanh vườn. Chiều dài hàng rào là bao nhiêu?', choices: ['26 m', '40 m', '13 m'], answer: '26 m', explanation: 'Hàng rào chạy QUANH vườn = chu vi = (8 + 5) × 2 = 26 m. Đừng lấy 8 × 5 = 40 (đó là diện tích, không phải độ dài đường bao).', errorTag: 'nham_dien_tich_thanh_chu_vi' },
  { prompt: 'Với mảnh vườn dài 8 m, rộng 5 m ở trên, diện tích trồng rau là bao nhiêu?', choices: ['40 m²', '26 m²', '13 m²'], answer: '40 m²', explanation: 'Diện tích = dài × rộng = 8 × 5 = 40 m² (số ô vuông 1 m² phủ kín mặt vườn). 26 m là chu vi hàng rào — đơn vị m chứ không phải m².', errorTag: 'nham_chu_vi_thanh_dien_tich' },
];
EX['chia-phan-so-cho-so-tu-nhien'] = [
  { prompt: 'Tính: 3/4 : 2 = ?', choices: ['3/8', '3/2', '1/4'], answer: '3/8', explanation: 'Giữ nguyên tử 3, nhân mẫu với 2: 4 × 2 = 8 → 3/8. Không được chia tử cho 2 (3 : 2 ra 1,5 vô lý) cũng không nhân tử.', errorTag: 'chia_tu_thay_vi_nhan_mau' },
  { prompt: 'Tính: 2/5 : 3 = ?', choices: ['2/15', '6/5', '2/8'], answer: '2/15', explanation: 'Tử giữ nguyên 2, mẫu nhân 3: 5 × 3 = 15 → 2/15. Chia phân số cho số tự nhiên làm phần lấy nhỏ đi 3 lần.', errorTag: 'nham_cach_chia_phan_so' },
];
EX['nhan-chia-10-100-1000'] = [
  { prompt: 'Tính: 2,5 × 100 = ?', choices: ['250', '25', '2500'], answer: '250', explanation: 'Nhân 100 → dịch dấu phẩy sang PHẢI 2 chữ số (100 có 2 số 0): 2,5 → 25 → 250 (thêm 1 chữ số 0 vì hết chỗ). Các chữ số 2 và 5 không đổi.', errorTag: 'dich_sai_so_chu_so' },
  { prompt: 'Tính: 3,7 : 10 = ?', choices: ['0,37', '37', '0,037'], answer: '0,37', explanation: 'Chia 10 → dịch dấu phẩy sang TRÁI 1 chữ số: 3,7 → 0,37 (thiếu chỗ bên trái thì viết thêm chữ số 0 ở trước dấu phẩy).', errorTag: 'dich_nguon_huong_trai_phai' },
  { prompt: 'Tính: 0,45 × 1000 = ?', choices: ['450', '45', '4,5'], answer: '450', explanation: 'Nhân 1000 → dịch dấu phẩy sang PHẢI 3 chữ số: 0,45 → 4,5 → 45 → 450 (thêm 1 số 0). Thứ tự chữ số 4, 5 giữ nguyên.', errorTag: 'dich_sai_so_chu_so' },
];
EX['cong-tru-phan-so-khac-mau'] = [
  { prompt: 'Tính: 1/2 + 1/3 = ?', choices: ['5/6', '2/5', '2/6'], answer: '5/6', explanation: 'Mẫu chung 6: 1/2 = 3/6, 1/3 = 2/6 → 3/6 + 2/6 = 5/6. KHÔNG được lấy (1+1)/(2+3) = 2/5 — mẫu số KHÔNG cộng được.', errorTag: 'cong_ca_tu_va_mau' },
  { prompt: 'Tính: 3/4 + 1/2 = ?', choices: ['5/4', '4/6', '5/6'], answer: '5/4', explanation: 'Mẫu chung 4: 1/2 = 2/4 → 3/4 + 2/4 = 5/4 (băng giấy tô vượt 1 lần, kết quả là phân số lớn hơn 1). Giữ mẫu chung, chỉ cộng tử.', errorTag: 'quy_dong_sai_mau_chung' },
  { prompt: 'Tính: 2/3 − 1/6 = ?', choices: ['1/2', '3/6', '1/3'], answer: '1/2', explanation: 'Mẫu chung 6: 2/3 = 4/6 → 4/6 − 1/6 = 3/6 = 1/2 (rút gọn). Trừ tử số trên cùng mẫu chung rồi mới rút gọn.', errorTag: 'tru_ca_tu_va_mau' },
];
EX['nhan-hai-so-thap-phan'] = [
  { prompt: 'Tính: 0,3 × 0,4 = ?', choices: ['0,12', '1,2', '0,7'], answer: '0,12', explanation: 'Bỏ dấu phẩy: 3 × 4 = 12. Hai thừa số có tất cả 1 + 1 = 2 chữ số thập phân → tách 2 chữ số: 0,12. Trên lưới: 3 hàng × 4 cột = 12 ô = 12 phần trăm.', errorTag: 'dem_sai_so_chu_thap_phan' },
  { prompt: 'Tính: 0,5 × 0,6 = ?', choices: ['0,3', '0,03', '3'], answer: '0,3', explanation: '5 × 6 = 30 → tách 2 chữ số thập phân = 0,30 = 0,3 (bỏ chữ số 0 tận cùng). Lưới: 5 hàng × 6 cột = 30 ô = 0,30.', errorTag: 'khong_tru_so_0_du' },
  { prompt: 'Tính: 0,7 × 0,2 = ?', choices: ['0,14', '1,4', '0,9'], answer: '0,14', explanation: '7 × 2 = 14, tích có 1 + 1 = 2 chữ số thập phân → 0,14. Tích nhỏ hơn cả 0,7 và 0,2 vì nhân với số bé hơn 1.', errorTag: 'nham_tich_lon_hon_thua_so' },
];
EX['cong-tru-so-thap-phan'] = [
  { prompt: 'Tính: 3,4 + 2,5 = ?', choices: ['5,9', '5,19', '59'], answer: '5,9', explanation: 'Thẳng dấu phẩy: phần mười 4 + 5 = 9 (bé hơn 10 nên KHÔNG nhớ), đơn vị 3 + 2 = 5 → 5,9.', errorTag: 'quen_dau_phay_o_ket_qua' },
  { prompt: 'Tính: 5,6 + 2,7 = ?', choices: ['8,3', '7,13', '8,13'], answer: '8,3', explanation: 'Phần mười 6 + 7 = 13 → viết 3 NHỚ 1. Đơn vị 5 + 2 + 1 (nhớ) = 8 → 8,3. KHÔNG được viết 7,13.', errorTag: 'quen_nho_1_khi_tong_phan_muoi_du_10' },
  { prompt: 'Tính: 5,2 − 2,7 = ?', choices: ['2,5', '3,5', '2,4'], answer: '2,5', explanation: 'Phần mười 2 trừ 7 không được → MƯỢN 1 của đơn vị (thành 12 − 7 = 5). Đơn vị còn 4 − 2 = 2 → 2,5.', errorTag: 'quen_muon_1_khi_tru_khong_du' },
];
EX['chia-so-tu-nhien-ra-so-thap-phan'] = [
  { prompt: 'Tính: 7 : 2 = ?', choices: ['3,5', '3 dư 1', '3,2'], answer: '3,5', explanation: '7 : 2 = 3 còn dư 1. Viết dấu phẩy, thêm 0 vào 1 thành 10; 10 : 2 = 5 → 3,5. Không dừng ở "3 dư 1".', errorTag: 'dung_o_so_du_khi_can_thuong_thap_phan' },
  { prompt: 'Tính: 5 : 4 = ?', choices: ['1,25', '1,2', '1 dư 1'], answer: '1,25', explanation: '5 : 4 = 1 dư 1 → thêm 0: 10 : 4 = 2 dư 2 → thêm 0 nữa: 20 : 4 = 5 → 1,25. Phải chia TIẾP hai lượt để ra hai chữ số thập phân.', errorTag: 'ngung_qua_somuoi_chi_mot_chu_so' },
  { prompt: 'Tính: 1 : 2 = ?', choices: ['0,5', '0,2', '2'], answer: '0,5', explanation: '1 nhỏ hơn 2 nên thương bắt đầu bằng 0, rồi 1 thêm 0 thành 10; 10 : 2 = 5 → 0,5.', errorTag: 'quen_viet_0_o_hang_don_vi' },
];
EX['don-vi-do-do-dai'] = [
  { prompt: 'Đổi: 4 m = ? cm', choices: ['40', '400', '4000'], answer: '400', explanation: 'Từ m xuống cm là 2 bậc (m → dm → cm) nên ×10 rồi ×10 = ×100 → 4 × 100 = 400 cm.', errorTag: 'dem_sai_so_bac_x10' },
  { prompt: 'Đổi: 3 km = ? m', choices: ['30', '300', '3000'], answer: '3000', explanation: 'km → hm → dam → m là 3 bậc XUỐNG → ×1000 → 3 km = 3000 m (chú ý km gấp mét 1000 lần, không phải 100).', errorTag: 'nham_km_gap_m_100_lan' },
  { prompt: 'Đổi: 50 cm = ? m', choices: ['0,5', '5', '500'], answer: '0,5', explanation: 'cm lên m là 2 bậc LÊN → :10 rồi :10 = :100 → 50 : 100 = 0,5 m. Đơn vị to hơn thì số đo nhỏ đi.', errorTag: 'nham_chieu_len_xuong_cua_bac' },
];
EX['don-vi-do-dien-tich'] = [
  { prompt: 'Đổi: 2 m² = ? dm²', choices: ['20', '200', '2000'], answer: '200', explanation: 'm² → dm² là 1 bậc XUỐNG và đơn vị diện tích ×100 mỗi bậc → 2 × 100 = 200 dm² (KHÔNG phải ×10 như độ dài).', errorTag: 'dung_quan_he_x10_cua_do_dai_cho_dien_tich' },
  { prompt: 'Đổi: 5 cm² = ? mm²', choices: ['50', '500', '5000'], answer: '500', explanation: 'cm² → mm² là 1 bậc xuống, ×100 → 5 × 100 = 500 mm².', errorTag: 'dung_quan_he_x10_cua_do_dai_cho_dien_tich' },
  { prompt: 'Đổi: 3 km² = ? m²', choices: ['3000', '300000', '3000000'], answer: '3000000', explanation: 'km² → m² là 3 bậc xuống, mỗi bậc ×100 → ×100³ = ×1000000 → 3 km² = 3 000 000 m².', errorTag: 'nham_km2_gap_m2_1000_lan' },
];
EX['don-vi-do-the-tich'] = [
  { prompt: 'Đổi: 1 dm³ = ? cm³', choices: ['10', '100', '1000'], answer: '1000', explanation: 'Thể tích nhảy ×1000 mỗi bậc (cả BA chiều ×10 → 10×10×10 = 1000). 1 dm³ = 1000 cm³. Mà 1 dm³ đúng bằng 1 lít.', errorTag: 'dung_x100_cua_dien_tich_cho_the_tich' },
  { prompt: 'Đổi: 2 m³ = ? dm³', choices: ['20', '200', '2000'], answer: '2000', explanation: 'm³ → dm³ là 1 bậc xuống, ×1000 → 2 × 1000 = 2000 dm³. KHÔNG dùng ×100 như diện tích.', errorTag: 'dung_x100_cua_dien_tich_cho_the_tich' },
  { prompt: 'Đổi: 5000 cm³ = ? dm³', choices: ['0,5', '5', '50'], answer: '5', explanation: 'cm³ → dm³ là đi LÊN một bậc nên CHIA 1000 → 5000 : 1000 = 5 dm³ (= 5 lít).', errorTag: 'nhan_thay_chi_vu_muon_khi_len_bac' },
];
EX['ti-le-thuan'] = [
  { prompt: 'x và y tỉ lệ thuận. x gấp 3 lần thì y?', choices: ['gấp 3 lần', 'thêm 3', 'gấp 6 lần'], answer: 'gấp 3 lần', explanation: 'Tỉ lệ thuận: y = k·x. x ×3 thì y ×3 đúng bằng nhau. KHÔNG phải cộng thêm 3.', errorTag: 'cong_them_thay_vi_gap_len' },
  { prompt: 'x = 4 thì y = 12 (tỉ lệ thuận). Hệ số k = y : x là?', choices: ['3', '8', '16'], answer: '3', explanation: 'k = y : x = 12 : 4 = 3, không đổi. Vậy y = 3·x.', errorTag: 'tim_sai_he_so_tile_thuan' },
  { prompt: 'Mỗi bút 5 000 đồng. 4 bút hết? (số tiền ∼ số bút)', choices: ['20 000 đồng', '9 000 đồng', '24 000 đồng'], answer: '20 000 đồng', explanation: 'Số tiền tỉ lệ thuận số bút: 5 000 × 4 = 20 000 đồng. (9 000 là lấy 5 000 + 4 — sai vì cộng.)', errorTag: 'cong_le_the_nhan' },
];
EX['ti-le-nghich'] = [
  { prompt: 'x và y tỉ lệ nghịch, x = 3 thì y = 4. Tích x·y không đổi bằng?', choices: ['12', '7', '1'], answer: '12', explanation: 'Tỉ lệ nghịch: x·y = A không đổi. A = 3 × 4 = 12. Vậy khi x = 6 thì y = 12 : 6 = 2.', errorTag: 'nham_tich_thuong_cua_tile_nghich' },
  { prompt: 'Số người làm và số ngày xong (tỉ lệ nghịch). 2 người hết 6 ngày. 3 người hết?', choices: ['4 ngày', '9 ngày', '12 ngày'], answer: '4 ngày', explanation: 'Tích không đổi: 2 × 6 = 12 (người·ngày). 3 người → 12 : 3 = 4 ngày. Nhiều người hơn thì ÍT ngày đi.', errorTag: 'nham_nghich_thanh_thuan_cong_them' },
  { prompt: 'Đại lượng này gấp 2 lần, đại lượng kia RÚT đi 2 lần. Hai đại lượng đó…', choices: ['tỉ lệ nghịch', 'tỉ lệ thuận', 'không liên quan'], answer: 'tỉ lệ nghịch', explanation: 'Gấp đôi ↔ rút một nửa (tích không đổi) là DẤU HIỆU tỉ lệ nghịch. Tỉ lệ thuận là cùng gấp lên.', errorTag: 'nham_hai_loai_ti_le' },
];
EX['don-vi-do-thoi-gian'] = [
  { prompt: 'Đổi: 2 giờ = ? phút', choices: ['120 phút', '100 phút', '200 phút'], answer: '120 phút', explanation: '1 giờ = 60 phút nên 2 giờ = 2 × 60 = 120 phút. KHÔNG phải 100 hay 200 — thời gian nhảy ×60 chứ không phải ×100.', errorTag: 'doi_gio_phut_nham_x100' },
  { prompt: '1 giờ 30 phút viết thành số thập phân (giờ) là?', choices: ['1,5 giờ', '1,3 giờ', '1,30 giờ'], answer: '1,5 giờ', explanation: '30 phút = 30 : 60 = 0,5 giờ, nên 1 giờ 30 phút = 1,5 giờ. Không viết 1,3 vì 30 phút không phải 0,3 giờ.', errorTag: 'doc_phut_nhu_phan_tram' },
  { prompt: 'Phải: 1,5 giờ bằng bao nhiêu?', choices: ['1 giờ 30 phút', '1 giờ 50 phút', '15 phút'], answer: '1 giờ 30 phút', explanation: 'Phần 0,5 giờ = 0,5 × 60 = 30 phút. Vậy 1,5 giờ = 1 giờ 30 phút, KHÔNG phải 1 giờ 50 phút.', errorTag: 'nham_1gio5_la_1gio50' },
];
EX['hon-so'] = [
  { prompt: 'Hỗn số 2 1/3 viết thành phân số là?', choices: ['7/3', '6/3', '2/3'], answer: '7/3', explanation: 'Lấy phần nguyên × mẫu + tử: 2 × 3 + 1 = 7, mẫu giữ nguyên 3. Vậy 2 1/3 = 7/3. Không phải 6/3 (quên cộng tử) hay 2/3.', errorTag: 'doi_hon_so_nham_cong' },
  { prompt: 'Phân số 5/2 viết thành hỗn số là?', choices: ['2 1/2', '2 2/2', '5 1/2'], answer: '2 1/2', explanation: 'Lấy tử CHIA mẫu: 5 : 2 = 2 dư 1. Thương 2 là phần nguyên, dư 1 là tử, mẫu giữ nguyên 2. Vậy 5/2 = 2 1/2. Không phải 5 1/2.', errorTag: 'nham_tu_la_phan_nguyen' },
  { prompt: '8/3 bằng hỗn số nào?', choices: ['2 2/3', '3 2/3', '2 1/3'], answer: '2 2/3', explanation: '8 : 3 = 2 dư 2, nên 8/3 = 2 2/3. Kiểm lại: 2 × 3 + 2 = 8 đúng.', errorTag: 'chia_mau_nham_du' },
];
EX['phan-so-thap-phan'] = [
  { prompt: 'Viết 7/100 thành số thập phân.', choices: ['0,07', '0,7', '7,0'], answer: '0,07', explanation: 'Mẫu 100 có HAI chữ số 0 nên viết HAI chữ số sau dấu phẩy; 7 đứng ở hàng phần trăm → 0,07. 0,7 là 7/10.', errorTag: 'khong_dem_so_0_o_mau' },
  { prompt: 'Số thập phân 0,5 ứng với phân số nào?', choices: ['5/10', '5/100', '5/5'], answer: '5/10', explanation: 'Chữ số 5 ở hàng PHẦN MƯỜI (một chữ số sau phẩy) → mẫu 10 → 5/10. 5/100 = 0,05.', errorTag: 'hang_phan_muoi_nham_thanh_tram' },
  { prompt: 'Rút gọn: 50/100 viết thành số thập phân là?', choices: ['0,5', '0,50', 'Cả A và B đều đúng'], answer: 'Cả A và B đều đúng', explanation: '50/100 = 0,50 = 0,5 — thêm/bớt chữ số 0 ở TẬN CÙNG bên phải không đổi giá trị. Đây chính là chỗ 0,5 và 0,50 bằng nhau.', errorTag: 'so_0_tan_cung_doi_gia_tri' },
];
EX['nhan-so-0'] = [
  { prompt: 'Tính nhẩm: 20 × 5.', choices: ['100', '50', '1 000'], answer: '100', explanation: 'Bỏ 1 chữ số 0: 2 × 5 = 10, viết lại 1 chữ số 0 → 100. Không phải 50 (thiếu một chữ số 0) hay 1 000 (viết dư).', errorTag: 'quen_viet_lai_so_0' },
  { prompt: 'Tính nhẩm: 300 × 4.', choices: ['1 200', '120', '12 000'], answer: '1 200', explanation: '300 có HAI chữ số 0. Bỏ 0: 3 × 4 = 12, viết lại 2 chữ số 0 → 1 200. Quên một chữ số 0 là ra 120 (sai).', errorTag: 'thieu_so_0_viet_lai' },
  { prompt: 'Tính nhẩm: 40 × 60.', choices: ['2 400', '240', '24 000'], answer: '2 400', explanation: 'Mỗi thừa số có 1 chữ số 0, tổng 2 chữ số 0. Bỏ 0: 4 × 6 = 24, viết lại 2 chữ số 0 → 2 400.', errorTag: 'cong_nham_so_0_hai_thua_so' },
];
EX['cong-nhom-tron'] = [
  { prompt: 'Tính nhanh: 18 + 25 + 2.', choices: ['45', '40', '65'], answer: '45', explanation: 'Nhóm 18 + 2 = 20 (tròn chục) trước, rồi 20 + 25 = 45. Cộng 18 + 25 trước thì phải nhớ, chậm và dễ sai.', errorTag: 'khong_nhom_tron_chuc' },
  { prompt: 'Tính nhanh: 34 + 19 + 6.', choices: ['59', '58', '69'], answer: '59', explanation: 'Tận cùng 4 và 6 bù nhau về 0: nhóm 34 + 6 = 40, rồi 40 + 19 = 59.', errorTag: 'nham_cap_bu_nhau' },
  { prompt: 'Tổng của 27 + 43 + 15 bằng:', choices: ['85', '75', '95'], answer: '85', explanation: '(27 + 43) + 15 = 70 + 15 = 85. Ghép 27 với 43 (7 và 3 bù thành 10) ra 70 tròn chục rồi mới cộng 15.', errorTag: 'quen_nhom_so_hang' },
];
EX['hieu-va-ti'] = [
  { prompt: 'Hiệu hai số là 12, tỉ số của chúng là 3 : 1. Số lớn là:', choices: ['18', '6', '12'], answer: '18', explanation: 'Lệch 3 − 1 = 2 phần = 12 → 1 phần = 6. Số lớn = 3 × 6 = 18 (số bé = 6). Chia cho TỔNG 4 phần là sai.', errorTag: 'chia_cho_tong_phan' },
  { prompt: 'Hai số hơn nhau 15, số lớn gấp 4 lần số bé (4 : 1). Số bé là:', choices: ['5', '15', '3'], answer: '5', explanation: 'Lệch 4 − 1 = 3 phần = 15 → 1 phần = 5 chính là số bé; số lớn = 4 × 5 = 20.', errorTag: 'chia_sai_hieu_so_phan' },
  { prompt: 'Số lớn hơn số bé 30 và có tỉ số 5 : 3. Tổng hai số là:', choices: ['120', '60', '90'], answer: '120', explanation: 'Lệch 5 − 3 = 2 phần = 30 → 1 phần = 15. Số lớn = 75, số bé = 45, tổng = 120.', errorTag: 'tinh_nham_tong_phan' },
];
EX['tong-va-hieu'] = [
  { prompt: 'Tổng hai số 40, hiệu 10. Số lớn là:', choices: ['25', '15', '30'], answer: '25', explanation: 'Số lớn = (tổng + hiệu) : 2 = (40 + 10) : 2 = 25. Số bé = (40 − 10) : 2 = 15.', errorTag: 'doi_nghe_cong_tru' },
  { prompt: 'Hai số có tổng 90 và hiệu 20. Số bé là:', choices: ['35', '55', '70'], answer: '35', explanation: 'Số bé = (tổng − hiệu) : 2 = (90 − 20) : 2 = 35; số lớn = (90 + 20) : 2 = 55.', errorTag: 'doi_nghe_cong_tru' },
  { prompt: 'Anh hơn em 4 tuổi, tổng số tuổi hai anh em 30. Tuổi em là:', choices: ['13', '17', '26'], answer: '13', explanation: 'Tuổi em (bé) = (30 − 4) : 2 = 13; tuổi anh (lớn) = (30 + 4) : 2 = 17.', errorTag: 'nham_ai_be_ai_lon' },
];
EX['day-so-cach-deu'] = [
  { prompt: 'Dãy số 2, 5, 8, 11, … Số hạng thứ 10 là:', choices: ['29', '30', '32'], answer: '29', explanation: 'Công số 3. Số hạng thứ 10 = 2 + (10 − 1) × 3 = 2 + 27 = 29. Sai 30 là vì lấy 10 × 3 mà quên số đầu và (n − 1).', errorTag: 'nhan_n_thay_vi_n_tru_1' },
  { prompt: 'Dãy số 1, 4, 7, … Số hạng thứ 12 là:', choices: ['34', '36', '37'], answer: '34', explanation: 'Công số 3. Số hạng thứ 12 = 1 + (12 − 1) × 3 = 1 + 33 = 34. (Lấy 12 × 3 = 36 là sai.)', errorTag: 'nhan_n_thay_vi_n_tru_1' },
  { prompt: 'Dãy 3, 7, 11, …, 27 có bao nhiêu số hạng?', choices: ['7', '6', '8'], answer: '7', explanation: 'Số số hạng = (27 − 3) : 4 + 1 = 24 : 4 + 1 = 7. Đừng quên + 1 (đếm cả số đầu).', errorTag: 'quen_tru_1_khi_dem' },
];
EX['rut-gon-phan-so'] = [
  { prompt: 'Rút gọn 12/18 ta được phân số tối giản:', choices: ['2/3', '3/2', '6/9'], answer: '2/3', explanation: 'ƯCLN(12, 18) = 6 → 12 ÷ 6 = 2, 18 ÷ 6 = 3 → 2/3. 6/9 mới chia 2 nên CHƯA tối giản.', errorTag: 'rut_chua_toi_gian' },
  { prompt: 'Rút gọn 15/25 ta được:', choices: ['3/5', '5/3', '1/5'], answer: '3/5', explanation: 'Cùng chia cho 5: 15 ÷ 5 = 3, 25 ÷ 5 = 5 → 3/5.', errorTag: 'chi_chia_tu_quen_mau' },
  { prompt: 'Rút gọn 8/12 ta được phân số tối giản:', choices: ['2/3', '4/6', '3/4'], answer: '2/3', explanation: 'ƯCLN(8, 12) = 4 → 8 ÷ 4 = 2, 12 ÷ 4 = 3 → 2/3 (4/6 chưa tối giản).', errorTag: 'rut_chua_toi_gian' },
];
EX['so-sanh-hai-phan-so'] = [
  { prompt: 'So sánh 3/4 … 5/6 (điền dấu):', choices: ['<', '>', '='], answer: '<', explanation: 'Nhân chéo: 3 × 6 = 18, 5 × 4 = 20. Vì 18 < 20 nên 3/4 < 5/6. Sai phổ biến: thấy 3 < 5 nên chắc 3/4 < 5/6 — tử số chưa nói lên gì khi mẫu khác nhau.', errorTag: 'so_tu_khi_mau_khac_nhau' },
  { prompt: 'So sánh 5/6 … 3/4 (điền dấu):', choices: ['<', '>', '='], answer: '>', explanation: 'Nhân chéo: 5 × 4 = 20, 3 × 6 = 18. Vì 20 > 18 nên 5/6 > 3/4.', errorTag: 'so_tu_khi_mau_khac_nhau' },
  { prompt: 'So sánh 2/4 … 3/6 (điền dấu):', choices: ['<', '>', '='], answer: '=', explanation: 'Nhân chéo: 2 × 6 = 12, 3 × 4 = 12. Hai tích bằng nhau nên 2/4 = 3/6 (cùng rút về 1/2).', errorTag: 'so_tu_khi_mau_khac_nhau' },
];
EX['bieu-thuc-chua-chu'] = [
  { prompt: 'Với a = 8, giá trị của biểu thức a + 5 là:', choices: ['13', '12', '53'], answer: '13', explanation: 'Thay a = 8 → 8 + 5 = 13. 53 là lỗi ghép chữ số (8 và 5 viết cạnh) thay vì cộng.', errorTag: 'ghep_chu_so_thay_vi_tinh' },
  { prompt: 'Với a = 6, b = 4, giá trị của a × b là:', choices: ['24', '10', '64'], answer: '24', explanation: 'Thay a = 6, b = 4 → 6 × 4 = 24. 10 là a + b (nhầm phép).', errorTag: 'nham_phep_trong_bieu_thuc' },
  { prompt: 'Với a = 5, giá trị của biểu thức 3 × a + 2 là:', choices: ['17', '7', '15'], answer: '17', explanation: 'Thay a = 5: 3 × 5 + 2. Nhân trước: 3 × 5 = 15, rồi 15 + 2 = 17. Tính 3 + 2 = 5 rồi × 5 = 25 hoặc 5 + 2 = 7 đều sai thứ tự.', errorTag: 'nham_phep_trong_bieu_thuc' },
];
EX['nhan-nham-11-25-99'] = [
  { prompt: 'Nhẩm nhanh: 24 × 11 = ?', choices: ['264', '242', '240'], answer: '264', explanation: '24 × 11 = 24 × 10 + 24 = 240 + 24 = 264. Nhầm "thêm 0" chỉ cho 240 (thiếu 1 nhóm 24); 242 là ghép chữ số sai.', errorTag: 'nham_11_sai_quy_tac' },
  { prompt: 'Nhẩm nhanh: 16 × 25 = ?', choices: ['400', '40', '160'], answer: '400', explanation: '16 × 25 = 16 × 100 : 4 = 1600 : 4 = 400. Quên chia 4 (để 1600) hoặc chia sai hàng (40) là lỗi phổ biến.', errorTag: 'nham_25_quen_chia_4' },
  { prompt: 'Nhẩm nhanh: 45 × 99 = ?', choices: ['4455', '4500', '495'], answer: '4455', explanation: '45 × 99 = 45 × 100 − 45 = 4500 − 45 = 4455. 4500 là quên trừ 45 (99 ≠ 100).', errorTag: 'nham_99_quen_tru_a' },
];
EX['tinh-chat-nhan'] = [
  { prompt: 'Tính nhanh 25 × 9 × 4 bằng cách nhóm lại:', choices: ['900', '90', '9000'], answer: '900', explanation: '(25 × 4) × 9 = 100 × 9 = 900. Nhóm 25 với 4 ra tròn trăm rồi nhân 9. 90 là thiếu một chữ số 0 (nhầm 100 thành 10); 9000 là thừa 0.', errorTag: 'nhom_sai_cap_thua_so' },
  { prompt: 'Tính nhanh 125 × 7 × 8:', choices: ['7000', '700', '175'], answer: '7000', explanation: '125 × 8 = 1000 (giao hoán để 125 cạnh 8), rồi 1000 × 7 = 7000. 700 là quên một chữ số 0; 175 là mới tính 25 × 7 mà quên nhóm 125 × 8.', errorTag: 'nhom_sai_cap_thua_so' },
  { prompt: 'Tính nhanh 5 × 32 × 2:', choices: ['320', '160', '3200'], answer: '320', explanation: '(5 × 2) × 32 = 10 × 32 = 320. Nhóm 5 với 2 (số chẵn) ra tròn chục. 160 là 5 × 32 rồi quên × 2; 3200 là thừa 0.', errorTag: 'nhom_sai_cap_thua_so' },
];
EX['lam-tron-so-thap-phan'] = [
  { prompt: 'Làm tròn 4,7 đến hàng đơn vị được:', choices: ['5', '4', '4,7'], answer: '5', explanation: 'Chữ số ngay sau hàng đơn vị là 7 (phần mười), 7 ≥ 5 → cộng 1 vào 4 được 5 rồi bỏ phần thập phân. Đáp án 4 là quên làm tròn, 4,7 là giữ nguyên.', errorTag: 'lam_tron_quen_xem_chu_so_sau' },
  { prompt: 'Làm tròn 2,34 đến hàng phần mười được:', choices: ['2,3', '2,4', '2,34'], answer: '2,3', explanation: 'Chỉ nhìn chữ số phần trăm = 4; 4 < 5 nên GIỮ hàng phần mười là 3 → 2,3. 2,4 là cộng nhầm, 2,34 là chưa bỏ hàng phần trăm.', errorTag: 'lam_tron_sai_hang' },
  { prompt: 'Làm tròn 6,85 đến hàng phần mười được:', choices: ['6,9', '6,8', '7'], answer: '6,9', explanation: 'Chữ số phần trăm = 5, bằng 5 → cộng 1 vào phần mười: 8 + 1 = 9 → 6,9. 6,8 là quên công 1; 7 là làm tròn overshoot tới tận đơn vị.', errorTag: 'lam_tron_day_chuyen' },
];
EX['nhan-hai-chu-so-dien-tich'] = [
  { prompt: 'Dùng 4 tích riêng phần: 23 × 12 = ?', choices: ['276', '206', '270'], answer: '276', explanation: '(20+3)×(10+2) = 20×10 + 20×2 + 3×10 + 3×2 = 200 + 40 + 30 + 6 = 276. 206 là chỉ lấy hai ô góc (200 + 6), bỏ quên hai ô chéo (40 và 30); 270 là quên ô 3×2 = 6.', errorTag: 'bo_quen_o_cheo' },
  { prompt: 'Dùng 4 tích riêng phần: 34 × 11 = ?', choices: ['374', '340', '344'], answer: '374', explanation: '30×10 + 30×1 + 4×10 + 4×1 = 300 + 30 + 40 + 4 = 374. 340 là chỉ tính 34×10 rồi quên nhân tiếp phần 1; 344 là bỏ sót ô 30×1 = 30.', errorTag: 'bo_quen_o_cheo' },
  { prompt: 'Dùng 4 tích riêng phần: 45 × 12 = ?', choices: ['540', '530', '450'], answer: '540', explanation: '40×10 + 40×2 + 5×10 + 5×2 = 400 + 80 + 50 + 10 = 540. 530 là quên ô 5×2 = 10; 450 là chỉ lấy 45×10, bỏ hết ô hàng đơn vị của 12.', errorTag: 'bo_quen_o_don_vi' },
];
EX['quy-dong-mau-so'] = [
  { prompt: 'Quy đồng 1/2 và 1/3 về mẫu chung 6, được:', choices: ['3/6 và 2/6', '1/6 và 1/6', '2/6 và 3/6'], answer: '3/6 và 2/6', explanation: '1/2 = (1×3)/(2×3) = 3/6; 1/3 = (1×2)/(3×2) = 2/6. Nhân CẢ tử và mẫu, nên tử cũng đổi. 1/6 và 1/6 là lỗi chỉ đổi mẫu mà quên nhân tử; 2/6 và 3/6 là ghép nhầm thừa số.', errorTag: 'quen_nhan_tu' },
  { prompt: 'Quy đồng 2/3 và 1/4 về mẫu chung 12, được:', choices: ['8/12 và 3/12', '2/12 và 1/12', '8/12 và 3/4'], answer: '8/12 và 3/12', explanation: '2/3 = (2×4)/(3×4) = 8/12; 1/4 = (1×3)/(4×3) = 3/12. 2/12 và 1/12 quên nhân tử; 8/12 và 3/4 là mới quy đồng phân số thứ nhất, bỏ phân số thứ hai.', errorTag: 'quen_nhan_tu' },
  { prompt: 'Quy đồng 3/4 và 5/6 về mẫu chung nhỏ nhất 12, được:', choices: ['9/12 và 10/12', '3/12 và 5/12', '9/12 và 10/24'], answer: '9/12 và 10/12', explanation: 'BCNN(4,6)=12. 3/4 = (3×3)/(4×3) = 9/12; 5/6 = (5×2)/(6×2) = 10/12. 3/12 và 5/12 quên nhân tử; 10/24 nhân mẫu gấp đôi mức cần (24 ≠ 12).', errorTag: 'chon_mau_chung_sai' },
];
EX['rut-ve-don-vi'] = [
  { prompt: 'Mua 6 quyển vở hết 54 nghìn đồng. Mua 4 quyển như thế hết bao nhiêu?', choices: ['36 nghìn', '24 nghìn', '90 nghìn'], answer: '36 nghìn', explanation: 'Rút về đơn vị: 1 quyển = 54 : 6 = 9 nghìn; 4 quyển = 9 × 4 = 36 nghìn. 24 là lấy 6 × 4 (quên chia ra giá 1 quyển); 90 là lấy 54 + 6 × ... nhảy sai phép.', errorTag: 'bo_buoc_rut_don_vi' },
  { prompt: '5 bao gạo nặng 175 kg. Hỏi 3 bao như thế nặng bao nhiêu kg?', choices: ['105 kg', '35 kg', '875 kg'], answer: '105 kg', explanation: '1 bao = 175 : 5 = 35 kg; 3 bao = 35 × 3 = 105 kg. 35 kg mới là khối lượng 1 bao (dừng ở bước rút về đơn vị); 875 là lấy 175 × 5, nhân nhầm lên thay vì chia.', errorTag: 'dung_lai_o_gia_tri_1_phan' },
  { prompt: 'Ô tô đi 3 giờ được 120 km. Hỏi đi 5 giờ (cùng vận tốc) được bao nhiêu km?', choices: ['200 km', '72 km', '40 km'], answer: '200 km', explanation: 'Mỗi giờ đi được 120 : 3 = 40 km; 5 giờ = 40 × 5 = 200 km. 40 km là quảng đường 1 giờ; 72 là lấy 120 : 5 × 3, đảo sai số giờ.', errorTag: 'nhap_lan_so_gio' },
];
EX['ucln-bcnn'] = [
  { prompt: 'ƯCLN(12, 18) và BCNN(12, 18) lần lượt là:', choices: ['6 và 36', '3 và 6', '6 và 216'], answer: '6 và 36', explanation: 'ƯCLN(12,18)=6. BCNN = 12 × 18 ÷ 6 = 216 ÷ 6 = 36 (kiểm: 36 × 6 = 216 = 12 × 18). 3 và 6 sai cả hai; 6 và 216 là lấy nguyên tích làm BCNN, quên chia ƯCLN.', errorTag: 'bcnn_lay_tich_quen_chia_ucln' },
  { prompt: 'BCNN(4, 6) bằng bao nhiêu?', choices: ['12', '24', '2'], answer: '12', explanation: 'ƯCLN(4,6)=2 nên BCNN = 4 × 6 ÷ 2 = 12. Bội của 4: 4,8,12…; bội của 6: 6,12… gặp nhau ở 12. 24 = 4×6 quên chia 2; 2 là lấy nhầm ƯCLN.', errorTag: 'nham_ucln_voi_bcnn' },
  { prompt: 'Rút gọn tỉ số 15 : 24 được:', choices: ['5 : 8', '3 : 5', '15 : 24'], answer: '5 : 8', explanation: 'ƯCLN(15,24)=3; chia cả hai vế cho 3 được 5 : 8. 3 : 5 là nhầm số chia; để nguyên 15 : 24 là chưa rút gọn hết.', errorTag: 'quyen_ucln_khi_rut_gon' },
];
EX['phan-phoi'] = [
  { prompt: 'Tính 4 × (5 + 3) theo tính chất phân phối:', choices: ['32', '23', '12'], answer: '32', explanation: '4 × (5 + 3) = 4×5 + 4×3 = 20 + 12 = 32 (kiểm: 4 × 8 = 32). 23 là lấy 4×5 + 3 — chỉ nhân số ngoài với số hạng ĐẦU rồi cộng, quên nhân 4 với 3; 12 là chỉ tính 4×3, bỏ mảng 4×5.', errorTag: 'chi_nhan_so_hang_dau' },
  { prompt: 'Tính 6 × (10 + 2):', choices: ['72', '62', '60'], answer: '72', explanation: '6 × (10 + 2) = 6×10 + 6×2 = 60 + 12 = 72 (kiểm: 6 × 12 = 72). 62 là lấy 6×10 + 2, quên nhân 6 với 2; 60 là chỉ tính 6×10.', errorTag: 'thieu_nhan_so_hang_thu_hai' },
  { prompt: 'Mẹo tính nhanh 25 × (4 + 6):', choices: ['250', '106', '150'], answer: '250', explanation: '25 × (4 + 6) = 25×4 + 25×6 = 100 + 150 = 250 (gọn hơn: 25 × 10 = 250). 106 là lấy 25×4 + 6, quên nhân 25 với 6; 150 là chỉ phần 25×6.', errorTag: 'truyen_thang_khong_nhan' },
];
EX['gap-giam-so-lan'] = [
  { prompt: 'Gấp 6 lên 3 lần được:', choices: ['18', '9', '21'], answer: '18', explanation: 'Gấp 3 lần = nhân 3: 6 × 3 = 18. 9 là lấy 6 + 3 (cộng thay vì nhân); 21 là 6 × 3 + 3 (gấp xong lại cộng thêm).', errorTag: 'cong_thay_vi_nhan' },
  { prompt: 'Giảm 24 đi 4 lần được:', choices: ['6', '20', '96'], answer: '6', explanation: 'Giảm 4 lần = chia 4: 24 : 4 = 6. 20 là lấy 24 − 4 (trừ thay vì chia); 96 là 24 × 4 (nhầm giảm thành GẤP 4 lần).', errorTag: 'tru_thay_vi_chia' },
  { prompt: 'Đoạn B dài gấp 5 lần đoạn A = 7 cm. Đoạn B dài:', choices: ['35 cm', '12 cm', '2 cm'], answer: '35 cm', explanation: 'Gấp 5 lần = 7 × 5 = 35 cm. 12 là 7 + 5; 2 là 7 − 5 (nhầm gấp thành cộng/trừ). Kiểm lại tỉ số: 35 : 7 = 5 lần.', errorTag: 'nham_gap_thanh_cong' },
];
EX['phan-so-voi-1'] = [
  { prompt: 'Phân số 7/4 so với 1:', choices: ['Lớn hơn 1', 'Bằng 1', 'Bé hơn 1'], answer: 'Lớn hơn 1', explanation: 'Tử 7 > mẫu 4 nên 7/4 > 1. Thật ra 7 : 4 = 1 dư 3 nên 7/4 = 1 + 3/4. Chọn "bé hơn 1" là nhầm quy tắc (lấy mẫu so tử); "bằng 1" chỉ đúng khi tử bằng mẫu.', errorTag: 'lam_lan_tu_voi_mau' },
  { prompt: 'Phân số nào bằng đúng 1?', choices: ['5/5', '5/7', '7/5'], answer: '5/5', explanation: 'Phân số bằng 1 khi tử = mẫu: 5/5 = 1. 5/7 < 1 (tử bé hơn mẫu); 7/5 > 1 (tử lớn hơn mẫu).', errorTag: 'tu_khong_bang_mau' },
  { prompt: 'Phân số 5/7 so với 1:', choices: ['Bé hơn 1', 'Lớn hơn 1', 'Bằng 1'], answer: 'Bé hơn 1', explanation: 'Tử 5 < mẫu 7 nên 5/7 < 1 (lấy ít hơn đủ một phần của một đơn vị). Sai lầm hay gặp: tưởng "mẫu 7 to nên phân số to" — phải so tử với mẫu, không so mẫu với tử.', errorTag: 'nham_mau_lon_la_ps_lon' },
];
EX['tb-cong-day-cach-deu'] = [
  { prompt: 'Trung bình cộng của dãy 1, 3, 5, 7, 9 là:', choices: ['5', '9', '25'], answer: '5', explanation: 'Dãy cách đều nên TBC = (số đầu + số cuối) : 2 = (1 + 9) : 2 = 5, đúng bằng số chính giữa. 9 là lấy số LỚN NHẤT (sai); 25 là lấy TỔNG (1+3+5+7+9) mà quên chia cho 5.', errorTag: 'lay_tong_quen_chia' },
  { prompt: 'Trung bình cộng của dãy 2, 4, 6, 8, 10, 12 là:', choices: ['7', '12', '42'], answer: '7', explanation: '(số đầu + số cuối) : 2 = (2 + 12) : 2 = 7. Dãy có 6 số (chẵn) nên TBC nằm GIỮA hai số chính giữa 6 và 8, không trùng một số hạng nào. 12 là số lớn nhất; 42 là tổng mà quên chia 6.', errorTag: 'nham_so_lon_nhat_la_tbc' },
  { prompt: 'Một dãy cách đều có 5 số, trung bình cộng bằng 8. Tổng của dãy đó là:', choices: ['40', '13', '8'], answer: '40', explanation: 'Tổng = trung bình cộng × số số hạng = 8 × 5 = 40. 13 là lấy 8 + 5; 8 là nhầm trung bình cộng thành tổng.', errorTag: 'nham_tbc_thanh_tong' },
];
EX['bieu-do-cot-doi'] = [
  { prompt: 'Biểu đồ cột đôi: Lớp 4A (12 trai, 8 gái), Lớp 4B (10 trai, 12 gái). Tổng số bạn LỚP 4A là:', choices: ['20 bạn', '22 bạn', '12 bạn'], answer: '20 bạn', explanation: 'Cộng HAI cột của ĐÚNG nhóm 4A: 12 + 8 = 20 bạn. 22 là tổng của 4B (nhầm nhóm); 12 mới là số trai, chưa cộng gái.', errorTag: 'cong_nham_nhom' },
  { prompt: 'Lớp nào có NHIỀU bạn GÁI hơn và hơn mấy bạn? (4A: 8 gái; 4B: 12 gái)', choices: ['4B, hơn 4 bạn', '4A, hơn 4 bạn', '4B, hơn 12 bạn'], answer: '4B, hơn 4 bạn', explanation: 'So CẶP cột gái: 4B 12 > 4A 8, chênh 12 − 8 = 4 bạn. "4A hơn" là đọc ngược chiều cao; "hơn 12" là lấy cả giá trị thay vì HIỆU hai cột.', errorTag: 'thieu_tru_khi_so_sanh' },
  { prompt: 'Cả HAI lớp có tất cả bao nhiêu bạn? (4A = 20; 4B = 22)', choices: ['42 bạn', '22 bạn', '20 bạn'], answer: '42 bạn', explanation: 'Lấy tổng từng nhóm rồi cộng: 20 + 22 = 42 bạn. 22 và 20 là tổng của TỪNG nhóm riêng lẻ, chưa gộp cả hai lớp.', errorTag: 'dung_o_tong_mot_nhom' },
];
function exOf() { const k = EXKEY[state.lesson] || state.lesson; const a = EX[k]; return (a && a.length) ? a : null; }
function renderEx() {
  const sec = $('exSec'), arr = exOf();
  if (state.step !== 4 || !arr || state.boardWiped) { sec.style.display = 'none'; sec.innerHTML = ''; return; }
  sec.style.display = 'block';
  const i = clamp(state.exIdx, 0, arr.length - 1); state.exIdx = i; const q = arr[i];
  let html = `<div class="ex-tag">LUYỆN TẬP · câu ${i + 1}/${arr.length}</div><div class="ex-q">${esc(q.prompt)}</div>`;
  if (q.choices && q.choices.length) {
    html += '<div class="ex-choices">' + q.choices.map((c, ci) => {
      const picked = state.exPick === c, good = picked && c === q.answer;
      const cls = picked ? (good ? 'ex-chosen good' : 'ex-chosen bad') : 'ex-chosen';
      return `<button class="${cls}" data-ex="${esc(c)}"><b>${ci + 1}.</b> ${esc(c)}</button>`; }).join('') + '</div>';
    if (!state.exReveal) html += `<div class="hint">Cô bấm vào đáp án, hoặc cả lớp <b>giơ k ngón = chọn phương án số ${q.choices.length}</b> trở xuống (các phương án đã đánh số 1, 2, 3…). Máy bỏ sót thì cô ghi nhận thêm bằng +1/+5.</div>`;
  } else if (!state.exReveal) {
    html += `<button class="ex-reveal" data-exrev="1">Xem đáp án</button>`;
  }
  if (state.exReveal) {
    html += `<div class="ex-ans">Đáp án: ${esc(q.answer)}</div><div class="ex-exp">${esc(q.explanation)}</div>`;
    if (q.errorTag) html += `<div class="hint">Lỗi hay mắc: ${esc(String(q.errorTag).replace(/_/g, ' '))}.</div>`;
  }
  if (arr.length > 1) html += `<div class="ex-nav"><button data-exnav="prev"${i === 0 ? ' disabled' : ''}>‹ Câu trước</button><button data-exnav="next"${i === arr.length - 1 ? ' disabled' : ''}>Câu sau ›</button></div>`;
  sec.innerHTML = html;
}

function render() {
  const m = MDL();
  $('phaseLabel').textContent = PHASES[state.step];
  $('lessonTitle').textContent = state.boardWiped ? '(bảng đã lau)' : cur().ten;
  drawStepline();
  const { cap, hint } = m.caption(state);
  const showText = !state.boardWiped;
  $('caption').textContent = showText ? cap : '';
  $('boardHint').textContent = showText ? hint : '';
  const vo = $('valueOut');
  if (state.step >= m.showFromStep() && showText) { vo.style.display = 'block'; vo.innerHTML = m.value(state); }
  else vo.style.display = 'none';
  const ceil = ceilingFor(state.M);
  $('ceilingOut').textContent = ceil == null ? 'trần lượt lên bảng: (chưa có sĩ số)'
    : `trần lượt lên bảng: ${ceil} (clamp(round(${state.M}/3), 12, 16))`;
  $('classSizeNote').style.visibility = state.M == null ? 'visible' : 'hidden';
  $('voteSec').style.display = state.step === 4 ? 'block' : 'none';
  renderModelControls();
  renderVote();
  renderEx();
  drawVisual();
  sync3D();
}

// Render NHẸ cho frame palm (tay lái): chỉ cập nhật số liệu tại chỗ + 2D/3D,
// KHÔNG rebuild innerHTML của modelControls/exSec → giữ nguyên listener,
// nút bấm không bị thay giữa chừng. Chỉ gọi khi giá trị tay lái thực sự đổi.
function renderPalmFrame(m) {
  for (const p of m.params()) {
    const el = document.getElementById('pv_' + p.key);
    if (el) el.textContent = state[p.key];
  }
  const { cap, hint } = m.caption(state);
  const showText = !state.boardWiped;
  $('caption').textContent = showText ? cap : '';
  $('boardHint').textContent = showText ? hint : '';
  const vo = $('valueOut');
  if (state.step >= m.showFromStep() && showText) { vo.style.display = 'block'; vo.innerHTML = m.value(state); }
  else vo.style.display = 'none';
  drawVisual();
  sync3D();
}

function drawStepline() {
  $('stepline').innerHTML = PHASES.map((_, i) =>
    `<span class="${i < state.step ? 'done' : i === state.step ? 'cur' : ''}" title="${PHASES[i]}"></span>`).join('');
}


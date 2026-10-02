# ar-toan-app — App giảng bài Toán bằng AR (lớp 4)

Một **ứng dụng HTML chạy thật** (không phải prompt) để giáo viên trình bày trên
màn chiếu: dùng webcam + nhận diện bàn tay (MediaPipe HandLandmarker) để đếm tay
cả lớp **và để ngón tay điều khiển mô hình 3D**, đồng thời tự **lùi về điều khiển
bằng chuột / màn 2D** khi máy không có camera hoặc không tải được thư viện 3D.

Đây là dự án tách biệt, sinh ra từ repo prompt MiTi (`../repo`). Repo `../repo`
vẫn giữ vai trò xuất prompt cho Gemini Canvas; thư mục này là bản app thật với **bộ
giáo án Toán 4–5** (chọn bài trong dải của cô) — khởi đầu là *Phân số ban đầu*.

## Chạy thử

Mở `index.html` bằng trình duyệt (Chrome/Edge). Vì app gọi `getUserMedia` và CDN
MediaPipe, tốt nhất phục vụ qua HTTP:

```bash
npx serve .        # hoặc: python -m http.server
```

Không có camera hoặc CDN bị chặn thì app **vẫn chạy đầy đủ bằng chuột** — cô bấm
`+1/+5` để ghi nhận đáp án.

## Mô hình 3D và tay điều khiển (Vòng 33)

Từ bước **VẬT THẬT** trở đi, màn chiếu hiện song song **bánh 2D (SVG)** và **khối
3D (Three.js)** của cùng một phân số `số phần tô / tổng số phần`.

- **Số ngón tay giơ lên = tử số**: bật camera, giơ 3 ngón → khối 3D sáng đúng 3
  miếng (và bánh 2D cập nhật theo). Đây là ý "dùng tay điều khiển mô hình".
- **Đưa bàn tay ngang = xoay khối 3D**: vị trí ngang của lòng bàn tay điều khiển
  góc xoay, học sinh thấy rõ các phần bằng nhau từ mọi phía.
- **Hai tay = hai vế của cân** (model `balance`): giơ bàn tay trái thì đĩa trái
  nhận số ngón đó, bàn tay phải cho đĩa phải; đĩa nặng hơn hạ xuống, kim lệch khỏi
  vạch giữa, đúng ý "hai vế như hai đĩa cân" trong repo.
- Tắt công tắc "dùng ngón tay điều khiển mô hình" nếu cô chỉ muốn đếm tay để bỏ
  phiếu mà không muốn ngón tay làm thay đổi mô hình.

**Lùi dần về không mất bài** (bất biến của app): Three.js nạp **động trong
`try/catch`** (`import(.../three@0.160.0/three.module.js)`). Mạng CDN bị chặn hoặc
máy không mở được WebGL thì ô 3D hiện dòng báo lỗi nhẹ và **toàn bộ app 2D + chuột
vẫn chạy bình thường** — cô bấm miếng để tô, kéo không được thì đã có màn 2D.

## Đa bài học, đa mô hình (Vòng 34)

App không còn code cứng một bài. Dải của cô có **bộ chọn Bài học**; mỗi bài trỏ tới
một **mô hình** (`MODELS`) và một dòng dữ liệu (`LESSONS`) — thêm chữ, `khoi_dong`,
`chot` lấy thật từ repo `../repo` (`tools/data/lessons.mjs`, `tools/data/props.mjs`).

Bốn mươi hai mô hình đang có:

| model | dùng cho | 2D | 3D | tay điều khiển |
|-------|----------|----|----|----------------|
| `pie` | phân số | bánh tròn tô phần | khối quạt 3D | số ngón = số phần tô |
| `array` | phép nhân (chấm), diện tích (ô vuông) | lưới chấm/ô | lưới khối hộp | số ngón = số hàng |
| `numline` | làm tròn số, so sánh trên tia số | tia số + lá cờ | ray 3D + khối nón cờ | đưa tay ngang = dời cờ |
| `sticks` | giá trị theo hàng, cộng trừ có nhớ | bó chục + que lẻ | trụ + que 3D | số ngón = que lẻ |
| `shear` | diện tích hình bình hành (cắt–ghép) | hình bình hành nghiêng + chữ nhật ghép | khối trượt 3D | đưa tay ngang = nghiêng hình |
| `balance` | hai vế / tìm số chưa biết (tính chất đẳng thức) | cân hai đĩa nghiêng + chồng khối | trụ xoay + hai đĩa + chồng khối 3D | **hai tay**: trái = vế trái, phải = vế phải |
| `clock` | đọc giờ – phút, khoảng thời gian | mặt đồng hồ 60 vạch, hai kim | đĩa + niềng + hai kim xoay | bấm/kéo mặt đồng hồ quay kim phút |
| `goc` | góc nhọn–vuông–tù–bẹt, đo bằng thước nửa tròn | thước nữa vòng có vạch 10° + quạt góc | quạt tròn (sector) + hai cạnh | đưa tay ngang = mở rộng góc |
| `cube` | thể tích (cm³), dài × rộng × cao | hộp khối vẽ phối cảnh | chồng khối lập phương 1 cm³ | số ngón = số tầng |
| `grid100` | **số thập phân** và **phần trăm** (1 model, 2 bài) | lưới 100 ô, mỗi hàng 10 = 1 phần mười | 100 viên lát tô màu | đưa tay ngang = kéo vạch trượt chọn số ô |
| `bar` | biểu đồ cột, đọc–so sánh số liệu | cột dọc có kẻ ô + đường dóng ngang sang trục | các cột khối hộp xếp chồng | số ngón = chiều cao cột đang chọn |
| `mean` | trung bình cộng (bảng số liệu) | cột ô + **mực nước trung bình**, phần thừa (cam) / chỗ trống (viền) | các cột khối hộp + ván nước trong suốt ở độ cao TB | đưa tay ngang = đặt chiều cao cột đang chọn |
| `tape` | **sơ đồ đoạn thẳng** tìm hai số khi biết tổng & tỉ số | thanh TỔNG = (a+b) phần bằng nhau, tách 2 hàng theo tỉ số | (a+b) khối lập phương, tô 2 màu theo hai số | đưa tay ngang = đổi giá trị MỘT PHẦN (tổng đổi theo) |
| `rhomb` | diện tích hình thoi (hai đường chéo) | thoi + 2 đường chéo vuông góc + chữ nhật bao nửa | phiến thoi khối + 2 thanh chéo | đưa tay ngang = đổi đường chéo d₁ (S đổi theo) |
| `fracbar` | **hai phân số bằng nhau** và **quy đồng mẫu số** (1 model, 2 bài) | hai băng chia phần trên CÙNG trục + vạch dóng đầu tô | hai hàng ô khối, tô theo tử số | **hai tay**: trái = tử số PS 1, phải = tử số PS 2 |
| `prob` | xác suất (chắc chắn / có thể / không thể), khả năng rút bóng | hộp bóng 3 màu + bảng tỉ lệ `số bóng màu : tổng` | các quả cầu màu xếp trong hộp | số ngón = số bóng **màu đang chọn** |
| `lines` | hai đường thẳng vuông góc / song song | hai đường phấn + chế độ **kéo dài hết bảng** + ê-ke góc vuông | hai thanh 3D, một thanh xoay theo góc | đưa tay ngang = **xoay độ nghiêng của d′** |
| `groups` | chia đều và số dư (băng chuyền + khay) | băng chở kẹo → N khay mỗi khay q cái, r cái còn trong **ô nét đứt** | khay + khối kẹo + khay số dư | đưa tay ngang = đặt **số kẹo trên băng** |
| `fracops` | **cộng / trừ hai phân số cùng mẫu** | hai băng tô trên CÙNG trục (vàng = phần cộng, gạch chéo cam = phần trừ) + tổng hiệu rút gọn / hỗn số | hai hàng ô khối + vạch ngăn đơn vị | **hai tay**: trái = tử số PS 1, phải = tử số PS 2 |
| `pic` | biểu đồ tranh: **một hình = mấy đơn vị** | 4 hàng hình + **khung chú giải** (1 hình = k cái) + nửa hình tính nửa giá trị | các hàng bi màu, hàng đang chọn to hơn | số ngón = **số HÌNH của hàng đang chọn** |
| `motion` | **hai xe ngược chiều**: quãng đường = (v₁+v₂) × thời gian | con đường A→B, hai xe chạy lại gần, **vùng còn cách nhau** + gạch "GẶP NHAU" | mặt đường + hai khối xe trượt trên trục | đưa tay ngang = **cho hai xe chạy** tới lúc gặp |
| `scale` | **tỉ lệ bản đồ** và độ dài thật | hai vạch CÙNG ĐỘ DÀI (cm ↔ m) + **thước tỉ lệ** "1 cm = k m" | hai thanh song song tô theo số đo | đưa tay ngang = **đo đoạn trên bản đồ** (0–8 cm) |
| `fracof` | **tìm phân số của một số** (tập rời rạc) | N chấm chia thành Den **nhóm bằng nhau** (vạch ngăn), tô Tu nhóm | N viên bi xếp lưới, nhóm đang lấy tô màu | số ngón = **số nhóm lấy** (tử số) |
| `recipe` | **gấp / giảm khẩu phần** theo tỉ số nguyên liệu | mỗi nguyên liệu hai vạch (cũ→mới) cùng × **hệ số = người mới : người cũ** | ba cốc nước dâng theo hệ số | đưa tay ngang = **đổi số người ăn** |
| `units` | **tấn · tạ · yến · kg** (đổi đơn vị khối lượng, so sánh) | cân hai đĩa nghiêng, mỗi đĩa một bao "{số} {đơn vị}" + dòng "**= … kg**" | trụ xoay + hai đĩa + **quả cân to theo log kg** | **hai tay**: trái = số đo đĩa trái, phải = đĩa phải (đơn vị chỉnh bằng +/−) |
| `dec` | **so sánh số thập phân** theo cột dấu phẩy (0,5 vs 0,48) | hai hàng 4 ô thẳng cột (đơn vị\|, \|mười\|trăm\|nghìn), **cột đầu tiên khác nhau** đóng khung cam "quyết định" | hai thanh cao theo giá trị, thanh lớn hơn nhô cao | **hai tay**: trái = cột phần mười của A, phải = của B |
| `parity` | **số chẵn – số lẻ** (nhìn chữ số tận cùng) | n bạn ghép thành từng **đôi** (vòng nối), dư 1 bạn khoanh nét đứt "một mình"; dải 0–9 tô xanh (chẵn) / đỏ (lẻ), đóng khung chữ số tận cùng | các quả cầu xếp từng đôi, quả lẻ màu cam riêng | đưa tay ngang = **đổi số bạn** (0–24) |
| `threeforms` | **ba dạng viết của cùng một giá trị** (1/2 = 0,5 = 50%) | ba băng **trên MỘT trục 0→1** (phân số tô N/D · thập phân 10 ô · phần trăm), **đường dóng cam** chung chỉ "trùng khít" | ba phiến dài theo cùng một tỉ số f | đưa tay ngang = **tô lượng chung**; +/− đổi mẫu số (2·4·5·10·20·25·50·100) |
| `steps` | **bài toán nhiều bước** + sơ đồ đoạn thẳng | chuỗi hộp lời giải dựng đứng, **mỗi bước một phép tính kèm đơn vị** (3 × 12 = 36 chiếc → 36 : 4 = 9 chiếc), bước chưa mở là ô **nét đứt "?"**, bước cuối gắn **→ ĐÁP SỐ** | các thanh lời giải xếp chồng, mở dần, thanh cuối cam | đưa tay ngang = **mở dần từng bước** |
| `numcmp` | **so sánh / sắp xếp số có nhiều chữ số** | hai hàng **ô chữ số** (ô đầu tô số, ô sau để "·"), hàng **dài hơn = nhiều chữ số hơn = chắc chắn lớn hơn**; hai hàng bằng dài thì so **chữ số đầu** | hai hàng khối lập phương, khối đầu cao theo chữ số | **hai tay**: trái = chữ số đầu A, phải = chữ số đầu B (+/− đổi số chữ số) |
| `dtable` | **đọc bảng số liệu** không nhầm hàng / cột | bảng điểm 4 bạn × 3 môn + cột TB; **dải vàng** theo hàng, **dải xám** theo cột, **ô cam** = nơi hai dải cắt nhau | lưới ô khối 4×4, ô cắt nhau nhô cao màu vàng | **hai tay**: trái = chọn HÀNG, phải = chọn CỘT (+/− dịch từng ô) |
| `borrow` | **trừ có mượn** (và nhớ) bằng bó que | 3 hàng que: **số bị trừ / số trừ / hiệu**; khi hàng đơn vị không đủ, vẽ MƯỢN 1 bó rồi **cởi thành đúng 10 que** (dải "+10" xanh), kèm dòng phân tích từng hàng | bó chục (trụ) + que lẻ (thanh) của hiệu | **hai tay**: trái = que lẻ số bị trừ, phải = số que phải bớt (+/− đổi bó chục) |
| `chooser` | **bài ôn tập / tổng hợp**: chọn đúng **chiến lược · công thức · vật thật** TRƯỚC khi tính (1 model, 4 bài) | N **thẻ phương án** đánh số; thẻ đang chọn viền vàng (đúng) / đỏ (chưa khớp), bên dưới là lời giải thích + dòng verdict | N khối, khối đang chọn nhô cao, đúng = vàng / sai = đỏ | **số ngón = số phương án** (1 ngón → phương án 1) |
| `money` | **Tiền Việt Nam** (beyond-bank): đếm ví theo mệnh giá + tính tiền thối khi mua hàng | 4 **xấp tờ bạc** màu theo mệnh giá (2 000 · 5 000 · 10 000 · 20 000), mỗi xấp ghi "{n} tờ = {n×mệnh giá}", đóng/xanh dòng verdict **VỪA ĐỦ / THỐI / THIẾU** | 4 chồng thẻ 3D theo mệnh giá | bấm xấp để chọn, **số ngón = số tờ** của xấp đang chọn; +/− từng loại và giá món hàng |
| `divis` | **Dấu hiệu chia hết 2·5·3·9** (beyond-bank) | ô **hàng chục \| hàng đơn vị** + 4 **huy hiệu** `n ⋮ d` (✓ vàng / ✗ đỏ), ghi rõ 2·5 nhìn **tận cùng**, 3·9 nhìn **tổng** | trụ hàng chục + khối hàng đơn vị | **hai tay**: trái = chữ số chục, phải = chữ số đơn vị; đổi số → 4 dấu hiệu cập nhật ngay |
| `piechart` | **Biểu đồ hình quạt** (beyond-bank): mỗi nhóm = một quạt, đọc **% của tổng** | vòng tròn chia quạt theo tỉ lệ + **chú giải** từng nhóm "{n} em · {p}%"; quạt đang chọn **lồi ra** & viền vàng, trong quạt ghi % (bỏ ghi nếu quạt quá nhỏ) | 4 lát **trụ tròn** (CylinderGeometry theo góc) xếp thành chiếc bánh | bấm quạt/chú giải để chọn, **số ngón = số em** của nhóm đang chọn; +/− từng nhóm → quạt chia lại đúng tỉ lệ |
| `line` | **Biểu đồ đoạn thẳng** (beyond-bank): đọc **xu thế theo thời gian** (nhiệt độ trong ngày) | trục ngang = GIỜ, trục dọc = °C; **5 điểm** nối thành đường gấp khúc + lưới ngang; **con đọc** (gạch đứt cam) chỉ mốc đang xem, dóng ra trục dọc đọc đúng giá trị | 5 cột + 5 khối cầu, cầu đỏ = con đọc | **lòng bàn tay ngang** quét trái↔phải để dời con đọc; hoặc bấm vào điểm, +/− từng giờ |
| `svt` | **Tam giác đại lượng S–v–t** (beyond-bank): che ô cần tìm → ra phép tính | **tam giác**: S ở chóp, v·t ở đáy (kẻ gạch ngang + dọc chia 3 ô); ô ĐANG CHE nền vàng ghi `? = kết quả`, hai ô kia hiện số; dưới tam giác là **dòng công thức** đầy đủ | 3 hộp, hộp đang che màu vàng, hai hộp xanh | **giơ ngón = chọn ô che**: 1 → S, 2 → v, 3 → t; +/− hai số còn lại đổi đề → ô che tự tính |
| `circle` | **Hình tròn** (beyond-bank): bán kính → đường kính, chu vi, diện tích | vòng tròn + 12 nan hoa; **bán kính r** (cạnh vàng, tâm→mép), **đường kính d = 2r** (nét đứt cam ngang qua tâm); dưới là **chu vi khai triển** thành một đoạn thẳng = π×d; cột phải ghi d, C = 2πr, S = πr² (π ≈ 3,14) | đĩa trụ (CylinderGeometry) to/nhỏ theo r | **lòng bàn tay ngang** đổi bán kính; hoặc bấm vào hình (khoảng cách tới tâm = r), +/− bán kính |
| `tri` | **Diện tích hình tam giác** (beyond-bank): đáy × chiều cao rồi **chia 2** | **hình chữ nhật** nét đứt (đáy × cao) bao lấy **tam giác đặc** (nửa dưới-trái) + **tam giác mờ giống hệt** (nửa trên-phải); **đường chéo** vàng là chỗ cắt; ô vuông góc ở đỉnh, nhãn **đáy b** (cạnh dưới) và **cao h** (cạnh đứng); cột phải: chữ nhật = b×h, rồi **S = đáy × cao ÷ 2** | lăng trụ tam giác (Shape + ExtrudeGeometry) to/nhỏ theo đáy & cao | **hai tay**: tay TRÁI đặt ĐÁY, tay PHẢI đặt CHIỀU CAO (giơ ngón rồi +/− tới 20 \| 14); hoặc bấm vào hình |
| `trap` | **Diện tích hình thang** (beyond-bank): (đáy lớn + đáy nhỏ) × chiều cao ÷ 2 | **hình thang đặc** (đáy lớn a dưới, đáy nhỏ b trên) + **hình thang mờ giống hệt** quay 180° áp vào **cạnh nghiêng** (cam) → thành **hình bình hành** có đáy **a + b**; dấu ngoặc dưới ghi "đáy hình bình hành = a + b", đường cao nét đứt + ô vuông; dưới cùng dòng **S = (a + b) × h ÷ 2** | lăng trụ thang (Shape + ExtrudeGeometry) theo hai đáy & cao | **hai tay**: tay TRÁI đặt ĐÁY NHỎ, tay PHẢI đặt ĐÁY LỚN; chiều cao bằng +/− (tới 20 \| 14) |
| `sa` | **D. tích xung quanh & toàn phần hình hộp chữ nhật** (beyond-bank) | **lưới khai triển 6 mặt** của hộp a×b×c: dải 4 **mặt bên** (xanh) kề nhau = a·c·b·c·a·c·b·c + **2 mặt đáy** (vàng) gắn trên/dưới; nhãn a, b, c; ba dòng: **XUNG QUANH = (a+b)×2×c**, **HAI ĐÁY = a×b×2**, **TOÀN PHẦN = xung quanh + hai đáy** | hộp chữ nhật (BoxGeometry) to/nhỏ theo ba chiều | **hai tay**: trái = CHIỀU DÀI, phải = CHIỀU RỘNG; CHIỀU CAO bằng +/− (tới 20) |

Bài hiện có (48 bài · 42 model — phủ kín toàn bộ 39 giáo án trong bank, **CỘNG 9 bài beyond-bank** *Tiền Việt Nam* (money) + *Dấu hiệu chia hết* (divis) + *Biểu đồ hình quạt* (piechart) + *Biểu đồ đoạn thẳng* (line) + *Đại lượng S–v–t* (svt) + *Hình tròn* (circle) + *Diện tích tam giác* (tri) + *Diện tích hình thang* (trap) + *Diện tích hình hộp* (sa), mỗi bài đều có bài tập LUYỆN TẬP): *Phân số ban đầu* (pie), *Phép nhân* + *Diện tích ô vuông*
(·array), *Làm tròn* (numline), *Giá trị theo hàng* (sticks), *Hình bình hành* (shear),
*Hai vế như hai đĩa cân* (balance), *Đọc giờ phút* (clock), *Đo góc* (goc), *Thể tích*
(cube), **hai bài dùng chung `grid100`**: *Số thập phân* (25/100 = 0,25) + *Phần trăm*
(áo 200k giảm 20% → trả 160k), *Lập biểu đồ cột* (bar — Táo/Cam/Xoài/Na, kẻ **đường dóng
ngang** từ đỉnh cột ra trục để **đọc đúng vạch, cấm ước lượng bằng mắt**), và *Trung bình
cộng* (mean — 7/4/6/3 → san đều ra **mực nước 5**; phần thừa màu cam ở cột cao dịch xuống
chỗ trống ở cột thấp, rồi `tổng : số phần = 20 : 4 = 5`), và *Tìm hai số khi biết tổng & tỉ số*
(tape — **sơ đồ đoạn thẳng**: anh gấp đôi em, tổng 30 bi → 1 + 2 = 3 phần bằng nhau, mỗi phần
`30 : 3 = 10` nên em 10, anh 20), và *Diện tích hình thoi* (rhomb — hai đường chéo vuông góc,
nối chéo chia 4 tam giác, ghép ra nửa hình chữ nhật bao: `d₁ × d₂ : 2 = 6 × 4 : 2 = 12 cm²`), và **hai bài dùng chung `fracbar`**: *Hai phân số bằng nhau* (1/2 = 2/4) + *Quy đồng mẫu để so sánh* (1/3 > 1/4) — hai băng chia phần trên **cùng một trục**, đầu phần tô trùng khít ⟺ bằng nhau, và *Xác suất* (prob — hộp bóng 3 màu: chọn màu, đếm số bóng → `số bóng : tổng`, tự xếp loại **KHÔNG THỂ / CÓ THỂ (ít · ngang nhau · nhiều) / CHẮC CHẮN**, đúng ý repo là **không được bỏ qua khả năng ngang nhau**), và *Hai đường vuông góc – song song* (lines — d nằm ngang, đưa tay xoay d′; **phải bật "Kéo dài hết bảng"** mới được kết luận: cách đều mãi → SONG SONG, gặp nhau + ê-ke khít → VUÔNG GÓC — chặn đúng lỗi repo "kết luận song song khi chưa kéo dài"), và *Chia đều và số dư* (groups — băng chuyền 17 kẹo chia vào 5 khay: phát mỗi khay một cái tới khi không đủ chia → mỗi khay 3 (thương), còn 2 nằm lại trong **ô nét đứt** = số dư, và `số dư 2 < số chia 5`), và *Cộng trừ phân số cùng mẫu* (fracops — hai phân số **cùng mẫu số** đặt trên **cùng một trục**, hai tay lần lượt đặt hai tử số; tô vàng phần **cộng**, gạch chéo cam phần **trừ** → `1/4 + 2/4 = 3/4`; dạy đúng ý repo là **CHỈ cộng/trừ tử số, tuyệt đối không cộng mẫu số**, và khi tổng vượt 1 đơn vị thì đổi ra **hỗn số** `3/4 + 3/4 = 1 1/2`), và *Biểu đồ tranh: một hình bằng mấy đơn vị* (pic — **khung chú giải 1 hình = k cái** đặt lên TRƯỚC để đọc; mỗi hàng là các hình giống nhau, hàng đang chọn giơ 0–8 ngón đặt số hình → `số hình × k`; bật **nửa hình** thì tính `+½k`, đúng ý repo là **đừng đếm hình rồi đoán, phải mở chú giải ra đọc trước**), và *Hai xe ngược chiều* (motion — hai xe xuất phát hai đầu con đường dài S km, đi ngược chiều nhau; **mỗi giờ khoảng cách ngắn đi đúng bằng TỔNG hai vận tốc** v₁+v₂, nên gặp nhau sau `S : (v₁+v₂)` giờ, cách A `v₁ × thời-gian-gặp` km; đưa tay ngang cho hai xe chạy, vùng còn cách nhau thu hẹp dần tới vạch GẶP NHAU), và *Tỉ lệ bản đồ* (scale — bản đồ chỉ là hình **thu nhỏ**: hai vạch **cùng một độ dài vật lý** nhưng một bên nhãn cm, một bên nhãn m; **phải đọc thước tỉ lệ "1 cm = k m" trước**, rồi `độ dài thật = số đo bản đồ × k` → đo 3 cm × 10 = 30 m, đúng ý repo là không có thước tỉ lệ thì chưa đổi ra đời thật được), và *Tìm phân số của một số* (fracof — một **tập rời rạc** N đối tượng, **CHIA đều thành Den nhóm trước** (mỗi nhóm = `N : Den`), rồi **LẤY Tu nhóm** → `N : Den × Tu` → `1/3 của 12 = 4`; chặn lỗi "lấy bừa từng cái" bằng cách bắt chia nhóm bằng nhau trước, giơ ngón tay đặt số nhóm lấy), và *Gấp / giảm khẩu phần* (recipe — công thức gốc cho 2 người thành 6 người: **hệ số = 6 : 2 = 3**, MỖI nguyên liệu đều × 3 (Gạo 1→3, Nước 2→6, Cà chua 3→9) nên **tỉ số 1:2:3 giữa chúng KHÔNG đổi**; đưa tay ngang đổi số người, kể cả giảm (hệ số < 1), đúng ý repo là cùng nhân một hệ số thì tỉ số nguyên liệu giữ nguyên), và *Tấn · tạ · ki-lô-gam và cân hai đĩa* (units — **cùng con số 3** nhưng 3 TẤN ≠ 3 KG: mỗi đĩa một bao "{số} {đơn vị}", app **tự đổi cả hai về kg** (1 tấn = 10 tạ = 100 yến = 1000 kg, mỗi bậc ×/÷ đúng 10) rồi nghiêng cân về phía nặng hơn → đúng ý repo là **phải đổi về cùng đơn vị trước khi so sánh**; hai tay đặt số đo mỗi đĩa, +/− chọn đơn vị kg/yến/tạ/tấn), và *So sánh số thập phân theo cột dấu phẩy* (dec — 0,5 vs 0,48: **nhiều chữ số hơn chưa chắc lớn hơn**; xếp hai số **thẳng cột dấu phẩy** thành bốn ô đơn vị\|phần mười\|phần trăm\|phần nghìn, so **từ trái sang phải**, ô **đầu tiên khác nhau** được đóng khung cam vì nó **quyết định** → cột phần mười 5 > 4 nên **0,5 > 0,48**; thêm 0 vào cuối (0,5 = 0,500) giá trị không đổi, đúng ý repo), và *Số chẵn số lẻ nhìn ở chữ số tận cùng* (parity — xếp 15 bạn **ghép thành từng đôi**: được 7 đôi **dư 1 bạn đứng một mình** (khoanh nét đứt) → số **LẺ**; `n = 2 × q + r`, chỉ cần nhìn **chữ số tận cùng** (dải 0–9 tô xanh=chẵn / đỏ=lẻ) là biết chẵn hay lẻ, không cần đếm hết — đúng ý repo "ghép hết thành đôi là chẵn, còn một mình là lẻ"), và *Ba dạng viết của cùng một giá trị* (threeforms — **1/2 = 0,5 = 50%** là MỘT thứ chứ không phải ba thứ: dóng ba băng **trên cùng một trục 0→1** (băng phân số tô N trên D ô, băng thập phân 10 phần bằng nhau, băng phần trăm), một **đường dóng cam** chung đi qua đầu cả ba phần tô → **trùng khít** = cùng một lượng; chọn mẫu số 2·4·5·10·20·25·50·100 thì cả ba vẫn dóng về một chỗ, đúng ý repo "phân số thập phân, số thập phân và phần trăm là ba cách viết của cùng một lượng"), và *Bài toán nhiều bước và sơ đồ đoạn thẳng* (steps — đề 4 dòng: "3 hộp × 12 chiếc, chia đều 4 tổ"; **vẽ sơ đồ trước rồi tính**: đưa tay ngang **mở dần từng bước**, mỗi bước là MỘT phép tính **kèm đơn vị** (bước 1 `3 × 12 = 36 chiếc` → bước 2 `36 : 4 = 9 chiếc`), bước chưa mở là ô nét đứt "→ phải có kết quả bước trước", **đáp số nằm ở bước cuối** — đúng ý repo chặn lỗi "nhìn đề là nhảy ngay vào một phép tính"), và *So sánh · sắp xếp số có nhiều chữ số* (numcmp — hai bạn thi viết số, một người 5 chữ số một người 6 chữ số: **chưa cần đọc hết số**, cứ nhìn **hàng ô dài hơn là nhiều chữ số hơn → chắc chắn lớn hơn**; hai hàng **bằng độ dài** thì mới so tiếp **từ hàng lớn nhất xuống**, ở đây so chữ số đầu → đúng ý repo chặn lỗi "thấy số bắt đầu bằng 9 là vội kết luận to hơn" (9 một chữ số vẫn nhỏ hơn 10 hai chữ số); hai tay đặt chữ số đầu mỗi khi độ dài bằng nhau), và *Đọc bảng số liệu không nhầm hàng, không nhầm cột* (dtable — bảng điểm 4 bạn × 3 môn + cột trung bình: muốn đọc giá trị một ô thì **phải dóng NGANG theo tên hàng** (dải vàng) **và DỌC theo tên cột** (dải xám); hai dải **cắt nhau ở ĐÚNG một ô** (cam) → "Bình · Toán = 5". Chặn đúng lỗi repo "**đọc lướt sang bạn ngồi bên cạnh**" bằng cách bắt người đọc dóng cả hai trục; chọn cột **TB** thì bước PHÉP TÍNH hiện luôn `(8 + 6 + 7) : 3 = 7` để nối sang **trung bình cộng = tổng : số phần tử**), và *Cộng trừ có nhớ – có mượn nhìn bằng bó que* (borrow — 32 − 15: hàng đơn vị có **2 que mà phải bớt 5 que → KHÔNG đủ**; app **mượn 1 bó chục** (hàng chục còn 2 bó) rồi **cởi bó đó thành ĐÚNG 10 que rời** (dải "+10" xanh), nên đơn vị thành 12 − 5 = 7, chục 2 − 1 = 1 → **hiệu 17**; mỗi hàng đều **ghi lại chỗ mượn** chứ không tính nhẩm rồi quên, đúng ý repo "mượn một bó của hàng bên trái = tách thành đúng 10 que"), và **bốn bài ôn tập / tổng hợp dùng chung `chooser`**: *Ôn tập cuối lớp 4* (chọn đúng **vật thật** cho mạch — bài diện tích phải chọn **lưới ô vuông**, không phải bó que hay đồng hồ), *Tổng hợp chương* (*boss-cong-thu* — việc đầu tiên là **nhận ra công thức**: lót đáy hồ = diện tích 8×5, KHÔNG phải chu vi (8+5)×2), *Hình học ôn tập* (chọn đúng công thức **chu vi / diện tích / thể tích** — thể tích hình lập phương là 3×3×3 **cm³**, đừng nhầm sang 3×3 cm² của một mặt), và *Ôn tập cuối lớp 5* (chốt **chiến lược** trước khi tính — "5 bộ hết 14m, 8 bộ hết mấy m" phải **rút về đơn vị** 14 : 5, chứ **sơ đồ đoạn thẳng tổng–tỉ vô dụng vì đề không cho tổng**). `chooser` dựng N **thẻ phương án**, cả lớp **giơ ngón tay chọn**, thẻ đúng viền vàng + verdict, thẻ sai viền đỏ + giải thích vì sao đề KHÔNG hỏi cách đó: chặn đúng bệnh "nhìn đề là nhảy vào một phép tính" mà **chưa chốt mạch/công thức/chiến lược**. Đây là bằng chứng kiến trúc
**model-dispatch** mở rộng rất rẻ: thêm bài mới trùng kiểu minh hoạ = chỉ thêm một dòng
`LESSONS` (kèm `fmt`), không đụng code render; thêm kiểu mới = một `MODELS.<kiểu>`. Mỗi mô
hình dựng 2D + 3D từ **cùng một `state`**, chỉnh bằng **stepper +/−**, và lùi về chuột khi
không có camera/3D. Giờ đã có **bốn model phục vụ nhiều bài**: `array` (2), `grid100` (2), `fracbar` (2), `chooser` (4 bài ôn tập).

**Bài beyond-bank — `money` + `divis` + `piechart` + `line` + `svt` + `circle` + `tri` + `trap` + `sa` (Vòng 69–77):** SGK lớp 4 có mạch
"Tiền Việt Nam" (đọc tờ bạc, cộng thành tổng tiền, mua hàng tìm tiền thối) nhưng **bank
giáo án 39 cụm chưa có cụm này** → app viết thêm MỘT `MODELS.money` + một dòng `LESSONS`
(`tien-viet-nam`) + 2 câu bài tập tự tác, **không đụng** bank và **không đụng** các model cũ.
Đếm theo **từng mệnh giá** rồi cộng (chặn lỗi "gộp nhầm tờ"), so với **giá món hàng** →
kết luận **VỪA ĐỦ / phải THỐI lại (trả − giá) / còn THIẾU**. Vòng 70 thêm mạch thứ hai
ngoài bank: `divis` (dấu hiệu chia hết 2·5·3·9) — hai tay dựng chữ số hàng chục|đơn vị,
4 huy hiệu cập nhật ngay, chặn đúng lỗi "lấy chữ số tận cùng để xét 3/9". Vòng 71 thêm mạch
thứ ba: `piechart` (**biểu đồ hình quạt** — loại biểu đồ trung tâm của lớp 5 mà cả bank lẫn
app trước đây đều chưa có). Vẽ các quạt theo tỉ lệ bằng cung tròn SVG, chú giải "{n} em · {p}%",
quạt đang chọn lồi ra; **cả hình tròn = 100% của TỔNG**, mỗi quạt = số nhóm ÷ tổng × 100 (chặn
lỗi nhìn quạt đoán số tuyệt đối). 3D dùng `CylinderGeometry` cắt theo góc → chiếc bánh quạt thật.
Vòng 72 thêm mạch thứ tư: `line` (**biểu đồ đoạn thẳng** — nhiệt độ trong ngày). Đường gấp khúc
nối 5 điểm theo giờ, **con đọc** gạch đứt chỉ mốc đang xem; **lòng bàn tay ngang** quét trái↔phải
dời con đọc (dùng lại khế ước `usesPalm`), chặn lỗi "nhầm trục ngang (thời gian) với trục dọc (đại
lượng)". Với `bar`/`piechart`/`line`, họ **biểu đồ lớp 4–5 đã đủ cả ba kiểu** (cột = so sánh, quạt =
% của tổng, đoạn thẳng = xu thế theo thời gian). Vòng 73 thêm mạch thứ năm: `svt` — **tam giác đại
lượng** S (chóp) / v·t (đáy). Giơ 1·2·3 ngón để CHE đúng ô cần tìm, hai số còn lại đặt bằng +/−, ô bị
che **tự tính** kèm dòng công thức (`S = v × t`, `v = S ÷ t`, `t = S ÷ v`); có chặn chia cho 0. Đây là
công cụ "che tam giác" kinh điển để học sinh nhớ quan hệ ba đại lượng mà không thuộc máy móc.
Vòng 74 thêm mạch thứ sáu: `circle` — **hình tròn** (bán kính → đường kính d = 2r, chu vi C = 2πr, diện
tích S = πr²). Bán kính đổi bằng **lòng bàn tay ngang** hoặc bấm (khoảng cách tới tâm = r); vẽ thêm
**"chu vi khai triển"** thành một đoạn thẳng để thấy C trải đúng π lần đường kính. Chặn lỗi lẫn r với d,
quên ×2 ở chu vi, và lẫn chu vi với diện tích. Số thập phân hiển thị theo kiểu Việt (dấu phẩy).
Vòng 75 thêm mạch thứ bảy: `tri` — **diện tích hình tam giác**. Vẽ một **hình chữ nhật** đáy × cao rồi cắt
theo **đường chéo**: hai tam giác **giống hệt** (một tô đặc, một tô mờ) **lắp khít** vừa đúng hình chữ nhật,
nên **một tam giác = một nửa** → công thức `S = đáy × cao ÷ 2` có "÷ 2" **không phải điều phải thuộc mà là
điều nhìn thấy được**. Hai tay dựng hình: tay TRÁI kéo ĐÂY (đáy), tay PHẢI dựng CAO (chiều cao); cột bên ghi
dòng chữ nhật = b×h rồi dòng S = b×h÷2. Chặn đúng lỗi kinh điển **"quên chia 2"** (tính 8×5=40 rồi dừng). 3D
dùng `Shape` + `ExtrudeGeometry` → lăng trụ tam giác thật. Đây là **công thức diện tích trung tâm lớp 5** còn
thiếu, nay đã có cùng `rhomb` (hình thoi) và `shear` (hình bình hành).
Vòng 76 thêm mạch thứ tám: `trap` — **diện tích hình thang**. Vẽ hình thang đáy lớn a, đáy nhỏ b, cao h rồi
**quay một hình thang GIỐNG HẸT** áp vào cạnh nghiêng: hai hình **lắp thành một hình bình hành có đáy đúng
bằng (a + b)**, cao h → **một hình thang = một nửa** → `S = (a + b) × h ÷ 2`. Ở đây "÷ 2" và việc **CỘNG hai
đáy** đều **nhìn thấy được**, không phải điều phải thuộc. Hai tay dựng hai đáy (trái = đáy nhỏ, phải = đáy lớn),
cao chỉnh bằng +/−; dấu ngoặc dưới chân ghi rõ "đáy hình bình hành = a + b". Chặn hai lỗi kinh điển **"quên cộng
đáy nhỏ"** và **"quên chia 2"**. 3D dùng `Shape` + `ExtrudeGeometry` → lăng trụ thang. Cùng với `tri`, **bốn công
thức diện tích trung tâm lớp 5** (chữ nhật/ô vuông · bình hành · tam giác · thang · thoi) nay đã có mô hình tay điều khiển.
Vòng 77 thêm mạch thứ chín: `sa` — **diện tích xung quanh & toàn phần hình hộp chữ nhật**. Mở hộp ra thành **LƯỚI 6 mặt**:
dải 4 **mặt bên** (xanh) đặt kề nhau = đúng **diện tích XUNG QUANH = (dài + rộng) × 2 × cao**, còn **2 mặt đáy** (vàng) là phần
**thêm vào** để có **TOÀN PHẦN**. Học sinh **nhìn thấy** vì sao Stp > Sxq và **cái nào là 4 mặt, cái nào là 6 mặt**, chặn đứng
lỗi kinh điển **"nhầm diện tích xung quanh với toàn phần"** (tính đủ 6 mặt rồi gọi là xung quanh). Hai tay dựng chiều dài & chiều
rộng, chiều cao bằng +/−; build3d dùng `BoxGeometry` → chiếc hộp thật để đối chiếu với lưới. Cùng `cube` (đếm 1 cm³ = thể tích), bộ
**hình hộp lớp 5** nay có đủ cả **thể tích** lẫn **hai loại diện tích**.

**Vòng 70 còn sửa một LỖI CHỨC NĂNG thật của điều khiển hai tay:** nhánh `twoHands` trong
`loopDetect` vốn so `state.balL + '/' + state.balR` để quyết định vẽ lại — hai biến CHỈ model
`balance` ghi. Mọi model hai tay khác (`fracbar`, `fracops`, `recipe`, `units`, `dtable`,
`borrow`, `numcmp`, và `divis` mới) đổi trường riêng nên bộ so sánh không bao giờ đổi ⟹
**màn chiếu đứng yên, không cập nhật khi cô đưa tay**. Nay suy lại từ **chữ ký ngón tay trái/phải
đọc được** (`state.twoApplied`): hễ số ngón thay đổi là vẽ lại + cập nhật dòng trạng thái,
đúng cho MỌI model hai tay. Đây là bản vá "đo lỗ hổng thật rồi sửa" — tính năng lõi
"dùng tay điều khiển" chạy được cho cả họ model hai tay.

Đây là bằng chứng kiến trúc
mở rộng ra **ngoài bank**: môn Toán lớp 4–5 còn nhiều mạch chưa có trong 39 giáo án (đo
thời gian dạng lịch, tiền Việt nâng cao, đại lượng F–S–P…), mỗi mạch chỉ cần thêm một
dòng `LESSONS` (tái dùng model) hoặc một `MODELS.<kiểu>` mới.

**Điểm mở rộng cho các vòng sau:** **cả 39 giáo án trong bank giờ đều đã có mô hình trên app** (35 model · 41 bài — phủ kín 39 cụm bank + 2 bài beyond-bank *Tiền Việt Nam* + *Dấu hiệu chia hết*, không còn cụm nào trắng), và **cả 41 bài đã có bài tập LUYỆN TẬP** (verbatim từ `examples.mjs` với 39 bài bank, tự tác với 2 bài beyond-bank; Vòng 67–70). Vòng sau tiếp tục **mở rộng ngoài bank** (thêm mạch SGK lớp 4–5 chưa có: lịch/thời gian nâng cao, đại lượng F–S–P, tiền Việt nâng cao…) và **đi sâu từng bài**: thêm nhiều biến thể số để cô bấm "đề khác", nối `chooser` sang màn **chọn trạm** cho tiết ôn tập nhiều mạch; mỗi khi cần
một kiểu minh hoạ mới (biểu đồ tranh/đường, tỉ lệ bản đồ, đại lượng F–S–P,
tiền Việt/mua hàng, chuyển động…) thì viết thêm một `MODELS.<kiểu>` — các
bài dùng lại kiểu đã có chỉ cần thêm dòng dữ liệu.

## Năm bước dạy

`KHỞI ĐỘNG → VẬT THẬT → SƠ ĐỒ → PHÉP TÍNH → LUYỆN TẬP`, bấm "Bước tiếp".

## Bài tập LUYỆN TẬP thật — theo từng bài (Vòng 67)

Bước **LUYỆN TẬP** (bước 5) của mọi bài giờ hiện một **widget bài tập** ngay dưới
màn chiếu, lấy **verbatim** từ ngân hàng `tools/data/examples.mjs` của bank giáo án
(mỗi cụm 2 câu, đúng khuôn `{ prompt, choices, answer, explanation, errorTag }`).

- `EX` = bản đồ `key ngân hàng → mảng câu`; `EXKEY` map 6 id bài trong app sang
  đúng `key` của bank (vd. `doc-bang-so-lieu → bang-so-lieu`). `exOf()` tra bài
  hiện tại → trả mảng câu, nên **cả 39/39 bài đều có bài tập**, không đụng 33 model.
- Có `choices` → cô/ lớp **bấm đáp án**: đúng tô xanh, sai tô đỏ, rồi mở phần
  giải thích; không có `choices` (tự luận) → nút "Xem đáp án" + giải thích.
- **Giơ tay để trả lời (Vòng 68):** ở bước LUYỆN TẬP, khi câu hỏi có phương án,
  bật camera thì **giơ k ngón = chọn phương án số k** (các đáp án đã đánh số 1, 2, 3…).
  Đây là đúng ý "dùng tay điều khiển" áp vào **từng bài tập**: cả lớp giơ tay bầu
  đáp án, app đọc ngón tay của tay đầu tiên, tô đáp án và mở lời giải. Không có
  camera/vẫn có chuột — cô bấm hoặc ghi nhận +1/+5. Tắt `handDrive` thì ngón tay
  không chọn hộ được.
- `‹ Câu trước / Câu sau ›` đi qua từng câu; đổi bài (`applyLesson`) reset về câu 1.
- `errorTag` hiển thị thành dòng "Lỗi hay mắc" để cô chữa đúng lỗi SGK hay gặp.
- Widget **ẩn** khi chưa tới bước LUYỆN TẬP hoặc đã "lau bảng" (`boardWiped`).

Đây là bước đầu của **đi sâu từng bài**: từ phủ 39 giáo án (33 model) sang **luyện
đúng từng bài tập** — mỗi bài giờ có câu hỏi SGK thật kèm lời giải và lỗi thường mắc.

## Tuân thủ các quy định đã xây ở repo prompt

- **Sĩ số là hàm của mọi con số về lớp**: nhập M thì trần lượt lên bảng =
  `clamp(round(M/3), 12, 16)`; để trống M thì hiện đúng dòng "nhập sĩ số để các
  con số theo lớp có nghĩa" và ẩn các con số **theo sĩ số**.
- **Vòng 31 (M-free ratio)**: khi M trống, dòng đối chiếu "mới ghi nhận N/M em"
  bị ẩn, NHƯNG tỉ lệ tính trên **số đáp án đã ghi nhận** (vd. ngưỡng "1/3 số đáp
  án đã ghi nhận sai") **vẫn hiện** — vì nó không cần M.
- **classVote**: "camera thấy N em" chỉ là **cận dưới**; mẫu số = **TỔNG SỐ ĐÁP
  ÁN ĐÃ GHI NHẬN** (tay máy + cô cộng +1/+5), sai vượt 1/3 trên số đã ghi nhận
  thì gợi ý giảng lại bước SƠ ĐỒ. Chặn ghi nhận ở 60 em.
- **Quyền riêng tư**: camera mặc định **TẮT**, đèn đỏ báo khi bật, nút "Che
  camera" tắt hẳn stream; không lưu khung hình, không tên, không xếp hạng.
- **Không áp lực**: không điểm, không timer, không hit-stop; bảng không tự lau,
  có nút "In bảng" (nền trắng chữ đen).
- **Mẫu số 2–12** theo quy định vật thật.

## Cấu trúc

```
ar-toan-app/
  index.html   # toàn bộ app: bảng chiếu (2D + khối 3D) + dải điều khiển của cô + camera/MediaPipe
```

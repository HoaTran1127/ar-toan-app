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

Hai mươi lăm mô hình đang có:

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

Bài hiện có (28 bài · 25 model): *Phân số ban đầu* (pie), *Phép nhân* + *Diện tích ô vuông*
(·array), *Làm tròn* (numline), *Giá trị theo hàng* (sticks), *Hình bình hành* (shear),
*Hai vế như hai đĩa cân* (balance), *Đọc giờ phút* (clock), *Đo góc* (goc), *Thể tích*
(cube), **hai bài dùng chung `grid100`**: *Số thập phân* (25/100 = 0,25) + *Phần trăm*
(áo 200k giảm 20% → trả 160k), *Lập biểu đồ cột* (bar — Táo/Cam/Xoài/Na, kẻ **đường dóng
ngang** từ đỉnh cột ra trục để **đọc đúng vạch, cấm ước lượng bằng mắt**), và *Trung bình
cộng* (mean — 7/4/6/3 → san đều ra **mực nước 5**; phần thừa màu cam ở cột cao dịch xuống
chỗ trống ở cột thấp, rồi `tổng : số phần = 20 : 4 = 5`), và *Tìm hai số khi biết tổng & tỉ số*
(tape — **sơ đồ đoạn thẳng**: anh gấp đôi em, tổng 30 bi → 1 + 2 = 3 phần bằng nhau, mỗi phần
`30 : 3 = 10` nên em 10, anh 20), và *Diện tích hình thoi* (rhomb — hai đường chéo vuông góc,
nối chéo chia 4 tam giác, ghép ra nửa hình chữ nhật bao: `d₁ × d₂ : 2 = 6 × 4 : 2 = 12 cm²`), và **hai bài dùng chung `fracbar`**: *Hai phân số bằng nhau* (1/2 = 2/4) + *Quy đồng mẫu để so sánh* (1/3 > 1/4) — hai băng chia phần trên **cùng một trục**, đầu phần tô trùng khít ⟺ bằng nhau, và *Xác suất* (prob — hộp bóng 3 màu: chọn màu, đếm số bóng → `số bóng : tổng`, tự xếp loại **KHÔNG THỂ / CÓ THỂ (ít · ngang nhau · nhiều) / CHẮC CHẮN**, đúng ý repo là **không được bỏ qua khả năng ngang nhau**), và *Hai đường vuông góc – song song* (lines — d nằm ngang, đưa tay xoay d′; **phải bật "Kéo dài hết bảng"** mới được kết luận: cách đều mãi → SONG SONG, gặp nhau + ê-ke khít → VUÔNG GÓC — chặn đúng lỗi repo "kết luận song song khi chưa kéo dài"), và *Chia đều và số dư* (groups — băng chuyền 17 kẹo chia vào 5 khay: phát mỗi khay một cái tới khi không đủ chia → mỗi khay 3 (thương), còn 2 nằm lại trong **ô nét đứt** = số dư, và `số dư 2 < số chia 5`), và *Cộng trừ phân số cùng mẫu* (fracops — hai phân số **cùng mẫu số** đặt trên **cùng một trục**, hai tay lần lượt đặt hai tử số; tô vàng phần **cộng**, gạch chéo cam phần **trừ** → `1/4 + 2/4 = 3/4`; dạy đúng ý repo là **CHỈ cộng/trừ tử số, tuyệt đối không cộng mẫu số**, và khi tổng vượt 1 đơn vị thì đổi ra **hỗn số** `3/4 + 3/4 = 1 1/2`), và *Biểu đồ tranh: một hình bằng mấy đơn vị* (pic — **khung chú giải 1 hình = k cái** đặt lên TRƯỚC để đọc; mỗi hàng là các hình giống nhau, hàng đang chọn giơ 0–8 ngón đặt số hình → `số hình × k`; bật **nửa hình** thì tính `+½k`, đúng ý repo là **đừng đếm hình rồi đoán, phải mở chú giải ra đọc trước**), và *Hai xe ngược chiều* (motion — hai xe xuất phát hai đầu con đường dài S km, đi ngược chiều nhau; **mỗi giờ khoảng cách ngắn đi đúng bằng TỔNG hai vận tốc** v₁+v₂, nên gặp nhau sau `S : (v₁+v₂)` giờ, cách A `v₁ × thời-gian-gặp` km; đưa tay ngang cho hai xe chạy, vùng còn cách nhau thu hẹp dần tới vạch GẶP NHAU), và *Tỉ lệ bản đồ* (scale — bản đồ chỉ là hình **thu nhỏ**: hai vạch **cùng một độ dài vật lý** nhưng một bên nhãn cm, một bên nhãn m; **phải đọc thước tỉ lệ "1 cm = k m" trước**, rồi `độ dài thật = số đo bản đồ × k` → đo 3 cm × 10 = 30 m, đúng ý repo là không có thước tỉ lệ thì chưa đổi ra đời thật được), và *Tìm phân số của một số* (fracof — một **tập rời rạc** N đối tượng, **CHIA đều thành Den nhóm trước** (mỗi nhóm = `N : Den`), rồi **LẤY Tu nhóm** → `N : Den × Tu` → `1/3 của 12 = 4`; chặn lỗi "lấy bừa từng cái" bằng cách bắt chia nhóm bằng nhau trước, giơ ngón tay đặt số nhóm lấy), và *Gấp / giảm khẩu phần* (recipe — công thức gốc cho 2 người thành 6 người: **hệ số = 6 : 2 = 3**, MỖI nguyên liệu đều × 3 (Gạo 1→3, Nước 2→6, Cà chua 3→9) nên **tỉ số 1:2:3 giữa chúng KHÔNG đổi**; đưa tay ngang đổi số người, kể cả giảm (hệ số < 1), đúng ý repo là cùng nhân một hệ số thì tỉ số nguyên liệu giữ nguyên), và *Tấn · tạ · ki-lô-gam và cân hai đĩa* (units — **cùng con số 3** nhưng 3 TẤN ≠ 3 KG: mỗi đĩa một bao "{số} {đơn vị}", app **tự đổi cả hai về kg** (1 tấn = 10 tạ = 100 yến = 1000 kg, mỗi bậc ×/÷ đúng 10) rồi nghiêng cân về phía nặng hơn → đúng ý repo là **phải đổi về cùng đơn vị trước khi so sánh**; hai tay đặt số đo mỗi đĩa, +/− chọn đơn vị kg/yến/tạ/tấn). Đây là bằng chứng kiến trúc
**model-dispatch** mở rộng rất rẻ: thêm bài mới trùng kiểu minh hoạ = chỉ thêm một dòng
`LESSONS` (kèm `fmt`), không đụng code render; thêm kiểu mới = một `MODELS.<kiểu>`. Mỗi mô
hình dựng 2D + 3D từ **cùng một `state`**, chỉnh bằng **stepper +/−**, và lùi về chuột khi
không có camera/3D. Giờ đã có **ba model phục vụ nhiều bài**: `array` (2), `grid100` (2), `fracbar` (2).

**Điểm mở rộng cho các vòng sau:** `LESSONS` còn ~8 cụm chưa lên app; mỗi khi cần
một kiểu minh hoạ mới (biểu đồ tranh/đường, tỉ lệ bản đồ, đại lượng F–S–P,
tiền Việt/mua hàng, chuyển động…) thì viết thêm một `MODELS.<kiểu>` — các
bài dùng lại kiểu đã có chỉ cần thêm dòng dữ liệu.

## Năm bước dạy

`KHỞI ĐỘNG → VẬT THẬT → SƠ ĐỒ → PHÉP TÍNH → LUYỆN TẬP`, bấm "Bước tiếp".

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

# Bảng Toán AR Trực Quan — "Cầm lên & Tương Tác" Với Từng Con Số

**Demo (mở được ngay trên mọi thiết bị, không cần cài đặt):**
https://hoatran1127.github.io/ar-toan-app/

**Mã nguồn công khai:** https://github.com/HoaTran1127/ar-toan-app

## Vấn đề

Toán tiểu học (lớp 4–5) là giai đoạn trẻ chuyển từ *tính toán cụ thể* sang *tư duy
trừu tượng* — phân số, diện tích, tỉ lệ, đại lượng, thống kê. Học sinh chủ yếu chỉ
được nhìn **kết quả tĩnh** trên bảng/giấy, còn **quy trình** sinh ra con số đó thì vô
hình. Hệ quả: thuộc công thức nhưng không hiểu bản chất, và rất hay nhầm (cộng cả mẫu
số của phân số, cho rằng "mẫu to thì phân số to", nhầm chu vi với diện tích…). Giáo
viên muốn minh họa sống động nhưng thiếu công cụ: phần mềm mô phỏng thương mại đắt tiền,
nặng, và không bám đúng từng bài trong sách giáo khoa Việt Nam.

## Giải pháp

Một **ứng dụng web gọn trong một tệp HTML**, biến lớp học (máy chiếu, tablet, điện thoại,
kể cả laptop cũ) thành phòng trực quan tương tác:

- **Giảng bằng tay thật.** Dùng webcam + nhận diện bàn tay (MediaPipe): học sinh *giơ
  ngón tay để đặt tử số, đưa bàn tay ngang để xoay khối 3D, dùng hai bàn tay để cân hai
  vế*. Khái niệm trừu tượng trở thành thứ các em **tự tay tạo ra**.
- **Mỗi khái niệm một mô hình sống.** 78 mô hình trực quan phủ kín 84 bài Toán lớp 4–5
  (phân số, phép chia có dư, tiền Việt Nam, dấu hiệu chia hết, biểu đồ cột/cột đôi/đoạn
  thẳng/hình quạt, diện tích tam giác–hình thang–hình hộp, thể tích, toán chuyển động
  S–v–t, tỉ lệ thuận/nghịch, làm tròn số, ƯCLN·BCNN, dãy số cách đều, trung bình cộng…),
  mỗi bài kèm phần **Luyện tập** đánh đúng các lỗi sai phổ biến.
- **Không bao giờ mất bài.** Ứng dụng **tự lùi về chế độ 2D + chuột** khi máy không có
  camera, CDN bị chặn, hoặc không bật được WebGL. Không cần mạng ổn định, không cần card
  đồ họa — phù hợp cả trường học vùng khó khăn.

## Điểm khác biệt / lợi thế cạnh tranh

- **Đúng giáo trình Việt Nam:** nội dung bám sát sách giáo khoa Toán 4–5, cộng thêm 45 bài
  mở rộng ngoài ngân hàng giáo án.
- **Cực nhẹ, dễ phổ cập:** một tệp HTML, mở là chạy, không phí bản quyền, chạy được trên
  chính thiết bị nhà trường đã có.
- **Công bằng số:** nhận diện tay không đòi hỏi thiết bị đội giá (VR/găng); quyền riêng tư
  được tôn trọng (ảnh camera xử lý ngay tại máy, không truyền đi).
- **Đã kiểm chứng bằng kỹ thuật:** mọi mô hình được chấm tự động (headless) với **quét toàn
  bộ tổ hợp số liệu và bất biến toán học** trước khi phát hành — ví dụ mô hình mới nhất
  (biểu đồ cột đôi) kiểm **20.736 tổ hợp** và đối chiếu công thức bằng hai đường độc lập.
  Chất lượng không phải lời hứa, mà là phép đo.

## Tình trạng triển khai

- Sản phẩm **đã chạy thật, phát hành công khai**, không còn là ý tưởng hay bản demo trên giấy.
- 84 bài học tương tác, 78 mô hình, mỗi bài có bộ câu hỏi luyện tập kèm chẩn đoán lỗi.
- Phát triển theo **vòng lặp cải tiến** (113 vòng tính đến nay) có tự động hóa kiểm định,
  nên tốc độ phủ nội dung cao và ổn định.

## Tầm nhìn & lộ trình

Từ nòng lõi Toán 4–5, mở rộng sang các mạch/môn khác (Khoa học, Tự nhiên & Xã hội, Tiếng
Việt trực quan), xây **ngân hàng mô hình do giáo viên đóng góp**, chế độ học tại nhà cho
phụ huynh, và bản phân tích mức độ hiểu bài theo thời gian thực. Đây là hạ tầng **trực
quan hóa tri thức phổ thông** — càng nhiều môn học tham gia, giá trị càng nhân lên.

## Vì sao đáng đầu tư

Chi phí biên gần bằng 0 cho mỗi bài học mới; phân phối qua web nên mở rộng mà không cần
phần cứng; đánh trúng khoảng trống thật: **công cụ dạy trực quan, giá rẻ, chạy được trong
mọi điều kiện, đúng chương trình Việt Nam**. Tính khả thi kỹ thuật đã được chứng minh;
nguồn vốn sẽ dùng để đóng gói nội dung cho các mạch còn lại, thử nghiệm trong lớp học thực
tế, và ươm mầm cộng đồng giáo viên đồng sáng tạo.

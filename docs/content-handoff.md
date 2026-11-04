# Nội dung cho các trang phụ

Chạy `npm run build`, sau đó `npm run serve` để xem trang web tại cổng 3000.

## Sản phẩm

`src/data/products.json` là dữ liệu chung cho danh mục và các trang chi tiết.
Mỗi bản ghi sinh một URL `/san-pham/<slug>/` từ `src/templates/product.html`.
Thêm sản phẩm bằng cách thêm bản ghi có slug duy nhất, tên, category, categoryLabel,
tone, order, tagline và description rồi build lại. Không cần tạo từng file HTML.
Đây là sinh trang tĩnh khi build, chưa có CMS hay backend động.

## Cần bổ sung trước khi ra mắt

- Ảnh thương hiệu, album nhiều góc cho từng sản phẩm và ảnh bộ sưu tập có quyền sử dụng.
- Thành phần, kích thước, màu, giá, tình trạng đặt hàng và hướng dẫn bảo quản được duyệt.
- Mốc lịch sử, tư liệu Lãnh Mỹ A có nguồn, hồ sơ nhóm và người chế tác.
- Tên và mô tả bộ sưu tập chính thức.
- Email, số Zalo và URL Facebook chính thức, đồng thời cập nhật footer dùng chung.
- Đích nhận form và xử lý dữ liệu nếu muốn gửi yêu cầu trực tiếp.

Hiện gallery sử dụng khung minh họa, không phải ảnh thật hay mô hình 3D.
Form liên hệ chỉ soạn và sao chép nội dung sau khi kiểm tra các trường bắt buộc;
không truyền dữ liệu, không lưu thông tin và không báo gửi thành công.
Tên sản phẩm truyền từ trang chi tiết qua query `san-pham` được điền sẵn cho ba mẫu hiện có.

## Tương tác

Danh mục hỗ trợ tìm kiếm không dấu, lọc loại, sắp xếp tên và trạng thái không có kết quả.
Album bộ sưu tập và chi tiết có nút điều hướng; tilt chỉ áp dụng chuột và tôn trọng
`prefers-reduced-motion`. Trang phụ dùng scroll reveal, không tự căn section như Homepage.

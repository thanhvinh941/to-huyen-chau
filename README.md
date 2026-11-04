# to-huyen-chau

## Nguồn và bản build

- Chỉ sửa nội dung, CSS, JavaScript và asset trong `src/`.
- `npm run build` dùng `build.js` để sinh HTML, gộp CSS và chép asset vào `dist/`.
- `npm run serve` tự chạy build trước khi phục vụ `dist/` tại cổng 3000. Build lỗi thì không khởi động server mới.
- GitHub Pages cũng chạy `npm run build` và triển khai duy nhất `dist/` qua `.github/workflows/pages.yml`.
- `.preview-build/` là output kiểm tra tạm, được Git bỏ qua. Không chỉnh file tại đây, không dùng làm nguồn asset hay triển khai.
- Không chép thủ công output giữa các thư mục. Nếu build lỗi quyền truy cập, sửa lỗi trước khi tiếp tục.

Local và production dùng chung luồng: `src/` → `build.js` → `dist/`.

## TODO: Thông tin và tài nguyên cần cung cấp

Các mục dưới đây đang dùng nội dung mẫu hoặc chưa có thông tin chính thức. Đánh dấu hoàn tất sau khi nhóm cung cấp, duyệt nội dung và cập nhật vào source.

| Trạng thái | Hạng mục | Cần cung cấp | Vị trí sử dụng |
| --- | --- | --- | --- |
| [ ] | Nhận diện thương hiệu | Logo gốc (SVG hoặc PNG trong suốt), tên hiển thị và tagline được duyệt | Header, footer, toàn website |
| [ ] | Hero Homepage | Ảnh/video cho ba nội dung: di sản lụa, nghệ thuật chế tác, sản phẩm hiện đại; xác nhận tiêu đề và CTA | `src/partials/sections/hero.html` |
| [ ] | Về dự án | Đoạn giới thiệu khoảng 70–110 từ: ý tưởng hình thành, mục tiêu và giá trị dự án; ảnh giới thiệu | `src/partials/sections/project-intro.html` |
| [ ] | Cội nguồn / Lãnh Mỹ A | Tư liệu xác thực về xuất xứ, lịch sử, giá trị văn hóa, sự tiếp nối; nguồn trích dẫn và ảnh nghề dệt | `src/partials/sections/heritage.html`, `src/pages/ve-chung-toi.html` |
| [ ] | Quy trình chế tác | Số bước thực tế, tên và mô tả từng bước; ảnh hoặc video tương ứng | `src/partials/sections/craftsmanship.html` |
| [ ] | Giới thiệu nhóm | Lịch sử hình thành, các mốc thời gian, tên và vai trò thành viên/người chế tác, chân dung và nội dung được phép công bố | `src/pages/ve-chung-toi.html` |
| [ ] | Danh mục sản phẩm | Danh sách mẫu chính thức, tên, mã/slug, nhóm sản phẩm, mô tả ngắn và chi tiết; xác nhận ba mẫu hiện có | `src/data/products.json`, danh mục và template chi tiết |
| [ ] | Thông số sản phẩm | Chất liệu cụ thể, kích thước, màu, chi tiết hoàn thiện, giá hoặc cách báo giá, tình trạng nhận đặt hàng | `src/templates/product.html`, dữ liệu sản phẩm |
| [ ] | Ảnh sản phẩm | Ảnh tổng thể, chi tiết, chất liệu và nhiều góc cho từng mẫu; file tách nền nếu dùng cho minh họa nhiều lớp | Homepage, danh mục, gallery chi tiết |
| [ ] | Showcase 3D | Chọn phương án: mô hình GLB/GLTF có texture hoặc bộ ảnh nhiều góc của cùng sản phẩm; cung cấp file tương ứng | `src/partials/sections/product-3d.html` — hiện chỉ là khối mô phỏng |
| [ ] | Bộ sưu tập | Tên chính thức, concept/câu chuyện thiết kế, ảnh lookbook, chú thích, thứ tự album và sản phẩm thuộc bộ sưu tập | `src/partials/sections/collection.html`, `src/pages/bo-suu-tap.html` |
| [ ] | Liên hệ | Email, số điện thoại/Zalo và URL Facebook chính thức; xác nhận kênh nhận tư vấn/đặt hàng ưu tiên | `src/pages/lien-he.html`, footer, CTA liên hệ |
| [ ] | Form yêu cầu | Chọn cách nhận: dẫn sang kênh liên hệ hoặc tích hợp gửi form; nếu gửi form cần đích nhận/backend, trường bắt buộc và nội dung đồng ý xử lý thông tin | `src/pages/lien-he.html`, `src/assets/js/pages.js` |
| [ ] | Đặt hàng, giao nhận và bảo quản | Quy trình xác nhận đơn, cách thanh toán ngoài website nếu có, phạm vi/thời gian giao hàng và hướng dẫn bảo quản theo từng mẫu | Các mục mở rộng trong `src/templates/product.html` |
| [ ] | Quyền sử dụng nội dung | Xác nhận quyền sử dụng ảnh, video, lời kể, chân dung; tác giả/nguồn cần ghi công và bản nội dung được duyệt | Toàn website |

### Lưu ý trước khi ra mắt

- Form hiện **chỉ soạn và sao chép nội dung**, chưa gửi yêu cầu và không lưu dữ liệu trên máy chủ.
- Khung ảnh gradient, minh họa vector và khối 3D hiện là bản mẫu, chưa đại diện cho hình ảnh/sản phẩm thật.
- Chỉ mở link Email/Facebook/Zalo sau khi có địa chỉ chính thức; không dùng link giả.
- Cập nhật cả Homepage và trang phụ liên quan, sau đó gỡ nhãn “mẫu”, “đang cập nhật” khi nội dung đã được duyệt.
- Chạy `npm run build` và `npm run check` trước khi bàn giao/triển khai.

Hướng dẫn cập nhật nội dung và dữ liệu sản phẩm: [docs/content-handoff.md](docs/content-handoff.md).

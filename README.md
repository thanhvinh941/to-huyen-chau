# to-huyen-chau

## Nguồn và bản build

- Chỉ sửa nội dung, CSS, JavaScript và asset trong `src/`.
- `npm run build` dùng `build.js` để sinh HTML, gộp CSS và chép asset vào `dist/`.
- `npm run serve` tự chạy build trước khi phục vụ `dist/` tại cổng 3000. Build lỗi thì không khởi động server mới.
- GitHub Pages cũng chạy `npm run build` và triển khai duy nhất `dist/` qua `.github/workflows/pages.yml`.
- `.preview-build/` là output kiểm tra tạm, được Git bỏ qua. Không chỉnh file tại đây, không dùng làm nguồn asset hay triển khai.
- Không chép thủ công output giữa các thư mục. Nếu build lỗi quyền truy cập, sửa lỗi trước khi tiếp tục.

Local và production dùng chung luồng: `src/` → `build.js` → `dist/`.

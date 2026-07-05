# Project Web 1 - Quản lý KTX UMT

Web admin React cho quản lý ký túc xá sinh viên, chạy mặc định tại `http://127.0.0.1:3000`.

## Chức năng chính

- Đăng nhập/đăng xuất không dùng mật khẩu, chọn vai trò quản trị hoặc sinh viên.
- Tách 2 luồng giao diện: quản trị dùng dashboard admin, sinh viên dùng cổng sinh viên màu xanh.
- Dashboard: 4 sinh viên đăng ký, 3 tòa nhà, 0 hóa đơn chưa thanh toán, 4 đơn chờ duyệt, 16 phòng, 90 giường.
- Quản lý sinh viên, tài khoản sinh viên, tòa/phòng, phòng A104, đăng ký KTX, hợp đồng.
- Quản lý hóa đơn: lọc theo tháng/sinh viên, tạo hàng loạt, thêm hóa đơn, đổi trạng thái thanh toán, ảnh hóa đơn, xuất Excel `.xls`.
- Cài đặt hệ thống: giới thiệu KTX, nội quy, liên hệ, thông tin thanh toán.
- Thông báo, vi phạm, đánh giá phòng.
- Cổng sinh viên: đăng ký KTX, chọn tòa/phòng, xem phòng ở, hóa đơn, thanh toán, thông báo, hợp đồng, phản ánh kèm ảnh, giới thiệu KTX.

## Firebase Firestore

App có dữ liệu mẫu để chạy ngay. Muốn lưu lên Firestore, tạo file `.env` theo `.env.example` và điền cấu hình web app Firebase của project `hzuedoanmonhoc`.

Các collection đã dùng:

`bills`, `buildings`, `contracts`, `invoices`, `notifications`, `rooms`, `settings`, `students`, `users`, `violations`, `applications`, `reviews`.

Sau khi đăng nhập, vào `Cài đặt` và bấm `Đồng bộ Firestore` để đẩy dữ liệu hiện tại lên database.

## Chạy dự án

```bash
npm install
npm run dev
```

Build kiểm tra:

```bash
npm run build
```

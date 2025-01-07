# **PTUDW - Đồ án cuối kỳ - Báo điện tử**

![Paperpy](https://firebasestorage.googleapis.com/v0/b/tiktok-clone-f0b70.appspot.com/o/image%2Fpaperly.jpg?alt=media&token=4f524bb0-bd7f-44e0-b3bc-22e692bbb033)

**Yêu cầu:** Xây dựng ứng dụng web **Báo điện tử** với các phân hệ và chức năng sau:

## 1. Phân hệ độc giả vãng lai (guest)

### Hệ thống Menu

- Hiển thị danh sách chuyên mục.

  - **Lưu ý:** Có 2 cấp chuyên mục, ví dụ:

    - Kinh Doanh ➠ Nông Sản

    - Kinh Doanh ➠ Hải Sản

### Trang chủ

- Hiển thị 3-4 bài viết nổi bật nhất trong tuần qua.

- Hiển thị 10 bài viết được xem nhiều nhất (mọi chuyên mục).

- Hiển thị 10 bài viết mới nhất (mọi chuyên mục).

- Hiển thị top 10 chuyên mục, mỗi chuyên mục 1 bài mới nhất.

  - **Lưu ý:** Bài viết hiển thị trên trang chủ gồm các thông tin:

    - Tiêu đề

    - Chuyên mục

    - Ngày đăng

    - Ảnh đại diện bài viết

  - **Khuyến khích:** Sử dụng hiệu ứng như slideshow hoặc carousel trên trang chủ.

### Xem danh sách bài viết

- Theo chuyên mục (category).

- Theo nhãn (tag).

- Có phân trang.

  - **Lưu ý:** Bài viết hiển thị trên trang danh sách gồm các thông tin:

    - Ảnh đại diện bài viết

    - Tiêu đề

    - Chuyên mục

    - Danh sách nhãn (tag)

    - Ngày đăng

    - Nội dung tóm tắt (abstract)

### Xem chi tiết bài viết

- Nội dung đầy đủ của bài viết.

- Ảnh đại diện (kích thước lớn).

- Tiêu đề.

- Ngày đăng.

- Nội dung.

- Chuyên mục (category).

- Danh sách nhãn (tag).

- Danh sách bình luận của độc giả:

  - Ngày bình luận

  - Tên độc giả

  - Nội dung bình luận

- Đăng bình luận mới.

- 5 bài viết ngẫu nhiên cùng chuyên mục.

  - **Lưu ý:** Độc giả có thể click vào chuyên mục (category) hoặc nhãn (tag) để chuyển nhanh sang phần xem danh sách bài viết.

### Tìm kiếm bài viết

- Sử dụng kỹ thuật Full-text search trên:

  - Tiêu đề

  - Nội dung tóm tắt (abstract)

  - Nội dung đầy đủ

## 2. Phân hệ độc giả (subscriber)

- Độc giả có đăng ký tài khoản (thực tế là mua) sẽ được phép xem và tải xuống ấn bản (.pdf) của một số bài viết premium.

- Tài khoản độc giả có thời hạn **7 ngày** (có thể cài đặt **N phút**), tính từ ngày được cấp.

- Khi hết hạn, tài khoản độc giả cần được gia hạn để tiếp tục truy cập các bài viết premium.

- Các bài viết premium được ưu tiên hiển thị trước trong kết quả khi độc giả thực hiện chức năng xem danh sách hoặc tìm kiếm bài viết.

## 3. Phân hệ phóng viên (writer)

### Đăng bài viết

- Hỗ trợ WYSIWYG với các công cụ như:

  - [tinymce](http://tiny.cloud)

  - [ckeditor](https://ckeditor.com)

  - [quilljs](https://quilljs.com)

  - [summernote](https://summernote.org)

- Hỗ trợ upload hình ảnh và liên kết YouTube trong bài viết.

- Khi đăng bài, phóng viên chỉ nhập tiêu đề, tóm tắt, nội dung, chuyên mục và gán nhãn cho bài viết.

### Xem danh sách bài viết (do phóng viên viết)

- Đã được duyệt và chờ xuất bản.

- Đã xuất bản.

- Bị từ chối.

- Chưa được duyệt.

### Hiệu chỉnh bài viết

- Chỉ được phép hiệu chỉnh các bài viết bị từ chối hoặc chưa được duyệt.

## 4. **Phân hệ biên tập viên (Editor)**

Biên tập viên thực hiện quản lý bài viết của phóng viên như sau:

- **Duyệt hoặc từ chối** các bài viết draft được gửi từ phóng viên.
  - Nếu từ chối, biên tập viên phải ghi rõ lý do để phóng viên chỉnh sửa.
  - Nếu duyệt, biên tập viên cần hiệu chỉnh các thông tin sau:
    - **Chuyên mục (category)**.
    - **Nhãn (tag)**.
    - **Thời điểm xuất bản**.

---

## 5. **Phân hệ quản trị viên (Administrator)**

Quản trị viên có toàn quyền trên hệ thống, với các chức năng chính như sau:

- **Quản lý chuyên mục (category)**.
- **Quản lý nhãn (tag)**.
- **Quản lý bài viết**.
  - Cho phép cập nhật trạng thái từ **draft** sang **xuất bản**.
- **Quản lý danh sách người dùng** (phóng viên, biên tập viên, độc giả).
  - Phân công chuyên mục cho biên tập viên.
  - Gia hạn tài khoản độc giả.

---

## 6. **Các tính năng chung cho các phân hệ người dùng**

### **Đăng nhập**

- **Tự cài đặt** hoặc sử dụng thư viện **passportjs**.
  - Khuyến khích tích hợp đăng nhập qua Google, Facebook, Twitter, GitHub,...

### **Cập nhật thông tin cá nhân**

Người dùng có thể cập nhật:

- Họ tên.
- Bút danh (dành cho phóng viên).
- Email liên lạc.
- Ngày tháng năm sinh.

### **Đổi mật khẩu**

- Mật khẩu được mã hóa bằng thuật toán **bcrypt**.

### **Quên mật khẩu**

- Hỗ trợ xác nhận qua email OTP với định dạng chuẩn xác.

---

## 7. **Yêu cầu khác**

### **Yêu cầu kỹ thuật**

- **Web App MVC**.
- Sử dụng các công nghệ sau:
  - **Framework**: ExpressJS.
  - **View engine**: Handlebars/EJS.
  - **Database**: MySQL/Postgres/MongoDB.

### **Yêu cầu dữ liệu**

- Dữ liệu mẫu cần ít nhất **20 bài viết** với đầy đủ nội dung, hình ảnh, và phân loại.
- Hoàn thiện đầy đủ chức năng theo yêu cầu đề bài.

### **Quản lý mã nguồn**

- Mã nguồn được quản lý và upload qua **GitHub**.
- Thực hiện commit/push thường xuyên.

**Chú ý:** Sử dụng các hiệu ứng để nâng cao trải nghiệm người dùng.

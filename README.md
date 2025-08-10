The Bad Hats - Ứng dụng Bán Nón Thời Trang
Mô tả
Ứng dụng web The Bad Hats là một trang thương mại điện tử bán các loại nón thời trang. Người dùng có thể xem danh sách sản phẩm, xem chi tiết sản phẩm, thêm vào giỏ hàng, và thực hiện thanh toán (giả lập). Quản trị viên có quyền thêm, sửa, và xóa sản phẩm, cũng như xem danh sách các đơn hàng.

Yêu cầu hệ thống
Node.js (phiên bản khuyến nghị: >= 16.0.0)

npm hoặc yarn

Hướng dẫn cài đặt và sử dụng
Clone repository:

git clone [Địa chỉ repository của bạn]
cd the-bad-hats-react

Cài đặt các gói phụ thuộc:

npm install

Chạy backend giả lập (json-server):
 npm install -g json-server
json-server --watch db.json --port 3001
Lưu ý: Backend giả lập sẽ chạy ở địa chỉ http://localhost:3001.

Chạy ứng dụng frontend:

npm start

hoặc
yarn start

Ứng dụng frontend sẽ chạy ở địa chỉ http://localhost:3000.

Tài khoản người dùng mẫu
Để trải nghiệm ứng dụng, bạn có thể sử dụng các tài khoản sau:

Admin:

Email: admin@example.com

Mật khẩu: admin123

Người dùng:

Email: user@example.com

Mật khẩu: user123

Lưu ý: Đây là các tài khoản được tạo sẵn trong file db.json cho mục đích thử nghiệm.

Các chức năng chính
Xem danh sách sản phẩm trên trang chủ và trang sản phẩm.

Xem thông tin chi tiết của từng sản phẩm.

Thêm sản phẩm vào giỏ hàng và điều chỉnh số lượng.

Thực hiện thanh toán (giả lập - Thanh toán khi nhận hàng).

Đăng ký và đăng nhập tài khoản người dùng.

Quản lý tài khoản (xem thông tin, đăng xuất).

Chức năng Admin:

Thêm, sửa, xóa sản phẩm.

Xem danh sách đơn hàng.

Công nghệ sử dụng
React

TypeScript

Redux Toolkit

React Router DOM

Bootstrap 5

Axios

json-server

react-toastify

Các bước phát triển chính đã thực hiện
Xây dựng giao diện người dùng với 3 layout chính (trang chủ, danh sách sản phẩm, chi tiết sản phẩm) sử dụng React và Bootstrap 5.

Kết nối và xử lý dữ liệu từ backend giả lập json-server thông qua Web API (Axios).

Triển khai chức năng phân quyền người dùng (admin/user).

Thực hiện đầy đủ các chức năng CRUD (Tạo, Xem, Sửa, Xóa) cho sản phẩm (chỉ dành cho admin).

Triển khai chức năng xác thực người dùng (đăng ký, đăng nhập, đăng xuất).

Tích hợp chức năng tìm kiếm sản phẩm.

Xây dựng chức năng giỏ hàng và thanh toán (giả lập).

Tạo trang quản lý đơn hàng dành cho admin (hiển thị danh sách đơn hàng).

Sử dụng Redux Toolkit để quản lý trạng thái ứng dụng.

Sử dụng React Router cho điều hướng trang.

Xử lý trạng thái tải và lỗi khi gọi API.

Sử dụng react-toastify cho các thông báo trạng thái.
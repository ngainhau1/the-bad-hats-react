const ShippingPage = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-3">Thông tin giao hàng</h1>
      <ul>
        <li>Thời gian: 2–5 ngày làm việc tùy khu vực.</li>
        <li>Miễn phí: Đơn hàng từ 500.000đ trở lên.</li>
        <li>Phí tiêu chuẩn: Từ 25.000đ đối với nội thành, 35.000đ ngoại tỉnh.</li>
        <li>Đơn đặt sau 16:00 sẽ xử lý vào ngày làm việc kế tiếp.</li>
      </ul>
      <p className="text-muted mt-3">Chúng tôi sẽ cung cấp mã theo dõi khi đơn được gửi đi.</p>
    </div>
  );
};

export default ShippingPage;


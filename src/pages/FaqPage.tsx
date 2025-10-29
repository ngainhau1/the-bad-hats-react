const FaqPage = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Câu hỏi thường gặp (FAQ)</h1>

      <div className="mb-4">
        <h5 className="mb-2">1. Thời gian giao hàng bao lâu?</h5>
        <p>Thông thường từ 2–5 ngày làm việc tùy khu vực.</p>
      </div>

      <div className="mb-4">
        <h5 className="mb-2">2. Tôi có thể đổi trả sản phẩm không?</h5>
        <p>Được đổi trong vòng 7 ngày kể từ khi nhận hàng nếu còn nguyên tem mác.</p>
      </div>

      <div className="mb-4">
        <h5 className="mb-2">3. Phí vận chuyển được tính như thế nào?</h5>
        <p>Miễn phí cho đơn từ 500.000đ; đơn dưới mức này áp dụng phí theo khu vực.</p>
      </div>

      <div className="mb-4">
        <h5 className="mb-2">4. Tôi có thể hủy đơn không?</h5>
        <p>Có thể hủy khi đơn chưa được bàn giao cho đơn vị vận chuyển.</p>
      </div>
    </div>
  );
};

export default FaqPage;


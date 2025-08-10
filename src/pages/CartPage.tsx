import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

/**
 * Component trang hiển thị chi tiết các sản phẩm trong giỏ hàng.
 * Cho phép người dùng thay đổi số lượng, xóa sản phẩm và tiến hành thanh toán.
 */
const CartPage = () => {
  // Lấy các state và hàm xử lý từ CartContext qua hook `useCart`
  const { cart, changeQuantity, removeItem, cartTotal } = useCart();

  // Trường hợp giỏ hàng trống, hiển thị thông báo và nút mua sắm
  if (cart.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h1 className="mb-4">Giỏ Hàng Của Bạn</h1>
        <p className="text-muted">Giỏ hàng của bạn đang trống.</p>
        <Link to="/products" className="btn btn-primary mt-3">Quay lại mua sắm</Link>
      </div>
    );
  }

  // Giao diện chính khi giỏ hàng có sản phẩm
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Giỏ Hàng Của Bạn</h1>
      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Ảnh</th>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* Lặp qua mảng `cart` để render từng sản phẩm */}
            {cart.map(item => (
              <tr key={item.id}>
                <td><img src={item.image} width="60" alt={item.name} /></td>
                <td>{item.name}</td>
                <td>{item.price.toLocaleString()}₫</td>
                <td>
                  {/* Nút giảm số lượng */}
                  <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => changeQuantity(item.id, -1)}>-</button>
                  {item.quantity}
                  {/* Nút tăng số lượng */}
                  <button className="btn btn-sm btn-outline-secondary ms-1" onClick={() => changeQuantity(item.id, 1)}>+</button>
                </td>
                <td>{(item.price * item.quantity).toLocaleString()}₫</td>
                <td>
                  {/* Nút xóa sản phẩm khỏi giỏ hàng */}
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-end mt-4">
        {/* Hiển thị tổng giá trị đơn hàng */}
        <h4>Tổng cộng: <span className="text-danger fw-bold">{cartTotal.toLocaleString()}₫</span></h4>
        {/* Nút điều hướng đến trang thanh toán */}
        <Link to="/checkout" className="btn btn-success mt-2">
          <i className="bi bi-credit-card-fill me-1"></i>Thanh toán
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
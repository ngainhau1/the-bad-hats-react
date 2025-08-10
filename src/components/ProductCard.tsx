import { Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { deleteProduct } from '../app/slices/ProductSlice';
import CustomToast from '../components/CustomToast';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Định nghĩa các props mà component này sẽ nhận
interface Props {
  product: Product;     // Dữ liệu chi tiết của sản phẩm để hiển thị
  isAdmin: boolean;     // Cờ để xác định người dùng có phải là admin không
  onEdit?: () => void;  // Hàm callback (tùy chọn) sẽ được gọi khi admin nhấn nút "Sửa"
}

/**
 * Component hiển thị thông tin tóm tắt của một sản phẩm dưới dạng thẻ (card).
 * Có khả năng hiển thị các nút chức năng khác nhau tùy thuộc vào vai trò người dùng (isAdmin).
 */
const ProductCard = ({ product, isAdmin, onEdit }: Props) => {
  // Lấy hàm addToCart từ CartContext
  const { addToCart } = useCart();
  // Lấy hàm dispatch từ Redux để gửi actions
  const dispatch = useDispatch<AppDispatch>();

  // Xử lý sự kiện khi người dùng thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    addToCart(product);
    // Hiển thị thông báo toast thành công
    toast.success(
      <CustomToast 
        iconClassName="bi bi-cart-check-fill" 
        title="Thành công" 
        message={`Đã thêm "${product.name}" vào giỏ!`}
      />
    );
  };

  // Xử lý sự kiện khi admin xóa sản phẩm
  const handleDelete = () => {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}" không?`)) {
      // Gửi action deleteProduct với ID của sản phẩm
      dispatch(deleteProduct(product.id));
    }
  };

  return (
    <div className="col-lg-3 col-md-4 col-6">
      <div className="card h-100 product-card shadow-sm">
        {/* Bọc ảnh và tên sản phẩm trong thẻ Link để điều hướng đến trang chi tiết */}
        <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
          <img src={product.image} className="card-img-top" alt={product.name} />
          <div className="card-body text-center">
            <h5 className="card-title">{product.name}</h5>
          </div>
        </Link>
        <div className="card-footer bg-transparent border-top-0 text-center pb-3">
            <p className="card-text text-danger fw-bold">{product.price.toLocaleString()}₫</p>
            
            {/* Render có điều kiện: tùy thuộc vào vai trò admin */}
            {isAdmin ? (
              // Nếu là admin, hiển thị nút Sửa và Xóa
              <div className="d-grid gap-2">
                <button className="btn btn-outline-warning btn-sm" onClick={onEdit}>Sửa</button>
                <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>Xóa</button>
              </div>
            ) : (
              // Nếu là người dùng thường, hiển thị nút Thêm vào giỏ
              <button className="btn btn-outline-primary btn-sm" onClick={handleAddToCart}>
                <i className="bi bi-cart-plus me-1"></i>Thêm vào giỏ
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
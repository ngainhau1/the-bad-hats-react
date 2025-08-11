import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';

/**
 * Component trang hiển thị thông tin chi tiết của một sản phẩm duy nhất.
 */
const ProductDetailPage = () => {
  // Hook `useParams` để lấy `id` của sản phẩm từ URL (ví dụ: /products/sp01)
  const { id } = useParams<{ id: string }>();
  // State cục bộ để lưu thông tin sản phẩm, trạng thái tải và lỗi
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Lấy hàm `addToCart` từ CartContext
  const { addToCart } = useCart();

  // useEffect sẽ chạy mỗi khi `id` từ URL thay đổi
  useEffect(() => {
    /**
     * Hàm bất đồng bộ để gọi API lấy chi tiết sản phẩm.
     * Sử dụng axiosClient trực tiếp vì đây là thao tác lấy dữ liệu đơn lẻ, không cần quản lý qua Redux store phức tạp.
     */
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Không thể tải thông tin sản phẩm.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Chỉ gọi hàm fetch nếu có `id`
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Render giao diện dựa trên trạng thái tải dữ liệu
  if (loading) {
    return <p className="text-center my-5">Đang tải...</p>;
  }

  if (error) {
    return <p className="text-center text-danger my-5">{error}</p>;
  }

  if (!product) {
    return <p className="text-center my-5">Không tìm thấy sản phẩm.</p>;
  }

  /**
   * Xử lý sự kiện khi người dùng nhấn nút "Thêm vào giỏ hàng".
   */
  const handleAddToCart = () => {
    // Gọi hàm `addToCart` từ Context và truyền vào sản phẩm hiện tại
    addToCart(product);
    // Hiển thị thông báo toast thành công
    toast.success(` Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="container my-5">
      <div className="row">
        {/* Cột trái hiển thị ảnh sản phẩm */}
        <div className="col-md-6">
          <img src={product.image} alt={product.name} className="img-fluid rounded shadow-sm" />
        </div>
        {/* Cột phải hiển thị thông tin chi tiết */}
        <div className="col-md-6">
          <h2 className="fs-3 fs-md-2">{product.name}</h2> 
          <p className="fs-3 text-danger fw-bold">{product.price.toLocaleString()}₫</p>
          <hr />
          <p>{product.description}</p>
          <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
            <i className="bi bi-cart-plus me-2"></i>Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
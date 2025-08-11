import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchProducts, addProduct, updateProduct, searchProducts } from '../app/slices/ProductSlice';
import { Product } from '../data/products';

/**
 * Component trang hiển thị danh sách tất cả sản phẩm.
 * - Cho phép tìm kiếm sản phẩm bằng API.
 * - Cung cấp các chức năng quản lý (Thêm/Sửa/Xóa) cho Admin.
 */
const ProductPage = () => {
  // Hooks để tương tác với Redux store
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, error } = useSelector((state: RootState) => state.products);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  
  // State cục bộ để quản lý các yếu tố giao diện của riêng trang này
  const [searchTerm, setSearchTerm] = useState(''); // Lưu trữ nội dung trong ô tìm kiếm
  const [showModal, setShowModal] = useState(false); // Điều khiển việc hiện/ẩn modal Thêm/Sửa
  const [productToEdit, setProductToEdit] = useState<Product | null>(null); // Lưu sản phẩm đang được chỉnh sửa

  // useEffect để fetch tất cả sản phẩm khi trang được tải lần đầu
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]); // Dependency array `[dispatch]` đảm bảo nó chỉ chạy một lần

  // useEffect để xử lý logic tìm kiếm khi người dùng gõ
  useEffect(() => {
    // Kỹ thuật Debouncing: tạo một bộ đếm thời gian để trì hoãn việc gọi API
    const delayDebounceFn = setTimeout(() => {
      // Chỉ gửi yêu cầu API sau khi người dùng ngừng gõ 300ms
      if (searchTerm) {
        dispatch(searchProducts(searchTerm));
      } else {
        // Nếu ô tìm kiếm trống, fetch lại toàn bộ danh sách sản phẩm
        // (Điều này có thể được tối ưu hơn, nhưng hoạt động tốt cho trường hợp này)
        dispatch(fetchProducts());
      }
    }, 300); // Thời gian chờ là 300ms

    // Cleanup function: Hủy bộ đếm thời gian cũ mỗi khi `searchTerm` thay đổi
    // Điều này ngăn chặn việc gửi API cho mỗi lần gõ phím
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]); // Effect này sẽ chạy lại mỗi khi `searchTerm` thay đổi

  /** Mở modal ở chế độ "Thêm mới" */
  const handleShowAddModal = () => {
    setProductToEdit(null); // Reset productToEdit để modal biết đây là form thêm mới
    setShowModal(true);
  };
  
  /** Mở modal ở chế độ "Chỉnh sửa" với dữ liệu của sản phẩm được chọn */
  const handleShowEditModal = (product: Product) => {
    setProductToEdit(product); // Cung cấp dữ liệu sản phẩm cho modal
    setShowModal(true);
  };

  /** Xử lý sự kiện lưu từ modal, cho cả Thêm và Sửa */
  const handleSave = (productData: Omit<Product, 'id'> | Product) => {
    // Dựa vào việc `productData` có thuộc tính 'id' hay không để quyết định dispatch action nào
    if ('id' in productData) {
      dispatch(updateProduct(productData as Product));
    } else {
      dispatch(addProduct(productData));
    }
    setShowModal(false); // Tự động đóng modal sau khi lưu
  };

  /**
   * Hàm render nội dung chính của trang, dựa trên trạng thái gọi API
   */
  const renderContent = () => {
    if (status === 'loading') return <p className="text-center">Đang tải...</p>;
    if (status === 'failed') return <p className="text-center text-danger">{error}</p>;
    
    if (products.length > 0) {
      // Lặp qua mảng `products` (kết quả từ API) và render ProductCard
      return products.map(p => (
        <ProductCard 
          key={p.id} 
          product={p} 
          isAdmin={currentUser?.role === 'admin'} 
          onEdit={() => handleShowEditModal(p)}
        />
      ));
    }
    return <p className="text-center text-muted">Không tìm thấy sản phẩm phù hợp.</p>;
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Tất Cả Sản Phẩm</h1>

      {/* Nút "Thêm sản phẩm mới" chỉ hiển thị khi admin đăng nhập */}
      {currentUser?.role === 'admin' && (
        <div className="text-end mb-4">
          <button className="btn btn-success" onClick={handleShowAddModal}>
            <i className="bi bi-plus-circle me-1"></i> Thêm sản phẩm mới
          </button>
        </div>
      )}

      {/* Thanh tìm kiếm */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm sản phẩm bằng API..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="input-group-text"><i className="bi bi-search"></i></span>
      </div>

      {/* Lưới hiển thị danh sách sản phẩm */}
      <div className="row gy-4">
        {renderContent()}
      </div>

      {/* Component Modal được điều khiển bởi state của trang này */}
      <ProductModal 
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default ProductPage;
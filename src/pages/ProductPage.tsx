import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchProducts, addProduct, updateProduct } from '../app/slices/ProductSlice';
import { Product } from '../data/products';

/**
 * Component trang hiển thị danh sách tất cả sản phẩm.
 * - Cho phép tìm kiếm sản phẩm.
 * - Cung cấp các chức năng quản lý (Thêm/Sửa/Xóa) cho Admin.
 */
const ProductPage = () => {
  // Hooks để tương tác với Redux
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, error } = useSelector((state: RootState) => state.products);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  
  // State cục bộ cho các chức năng của trang
  const [searchTerm, setSearchTerm] = useState(''); // Lưu trữ nội dung tìm kiếm
  const [showModal, setShowModal] = useState(false); // Điều khiển việc hiện/ẩn modal
  const [productToEdit, setProductToEdit] = useState<Product | null>(null); // Lưu sản phẩm đang được sửa

  // Lấy danh sách sản phẩm từ API khi component được render lần đầu
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  /** Mở modal ở chế độ "Thêm mới" */
  const handleShowAddModal = () => {
    setProductToEdit(null); // Đảm bảo không có sản phẩm nào được chọn để sửa
    setShowModal(true);
  };
  
  /** Mở modal ở chế độ "Chỉnh sửa" */
  const handleShowEditModal = (product: Product) => {
    setProductToEdit(product); // Lưu thông tin sản phẩm cần sửa vào state
    setShowModal(true);
  };

  /** Xử lý sự kiện lưu từ modal, cho cả Thêm và Sửa */
  const handleSave = (productData: Omit<Product, 'id'> | Product) => {
    // Nếu `productData` có thuộc tính 'id', đó là chế độ Sửa
    if ('id' in productData) {
      dispatch(updateProduct(productData as Product));
    } else {
      // Nếu không, đó là chế độ Thêm mới
      dispatch(addProduct(productData));
    }
    setShowModal(false); // Đóng modal sau khi lưu
  };

  // Lọc danh sách sản phẩm dựa trên nội dung tìm kiếm (client-side filtering)
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  /**
   * Hàm render nội dung chính của trang, xử lý các trạng thái tải, lỗi, và thành công.
   */
  const renderContent = () => {
    if (status === 'loading') return <p className="text-center">Đang tải dữ liệu...</p>;
    if (status === 'failed') return <p className="text-center text-danger">{error}</p>;
    if (filteredProducts.length > 0) {
      return filteredProducts.map(p => (
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

      {/* Nút "Thêm sản phẩm mới" chỉ hiển thị cho Admin */}
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
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="input-group-text"><i className="bi bi-search"></i></span>
      </div>

      {/* Lưới hiển thị sản phẩm */}
      <div className="row gy-4">
        {renderContent()}
      </div>

      {/* Modal Thêm/Sửa sản phẩm */}
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
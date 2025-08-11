import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchProducts, addProduct, updateProduct } from '../app/slices/ProductSlice';
import { Product } from '../data/products';

const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, error } = useSelector((state: RootState) => state.products);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleShowAddModal = () => {
    setProductToEdit(null);
    setShowModal(true);
  };
  
  const handleShowEditModal = (product: Product) => {
    setProductToEdit(product);
    setShowModal(true);
  };

  const handleSave = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData) {
      dispatch(updateProduct(productData));
    } else {
      dispatch(addProduct(productData));
    }
    setShowModal(false);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

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

      {currentUser?.role === 'admin' && (
        <div className="text-end mb-4">
          <button className="btn btn-success" onClick={handleShowAddModal}>
            <i className="bi bi-plus-circle me-1"></i> Thêm sản phẩm mới
          </button>
        </div>
      )}

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
      <div className="row gy-4">
        {renderContent()}
      </div>

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
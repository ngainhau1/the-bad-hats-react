import { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchProducts, addProduct, updateProduct, searchProducts } from '../app/slices/ProductSlice';
import { Product } from '../data/products';

// Danh mục cơ bản theo loại nón
const CATEGORIES: { key: string; label: string; match: string[] }[] = [
  { key: 'all', label: 'Tất cả', match: [] },
  { key: 'bucket', label: 'Nón Bucket', match: ['bucket'] },
  { key: 'luoichai', label: 'Nón Lưỡi Trai', match: ['luoichai'] },
  { key: 'jacket', label: 'Nón Jacket', match: ['jacket'] },
  { key: 'snapback', label: 'Nón Snapback', match: ['snapback'] },
  { key: 'beret', label: 'Nón Beret', match: ['beret'] },
  { key: 'dantay', label: 'Nón Đan Tay', match: ['dantay'] },
  { key: 'vanh', label: 'Nón Vành', match: ['vanh'] },
  { key: 'phot', label: 'Nón Phớt', match: ['phot'] },
  { key: 'caoboi', label: 'Nón Cao Bồi', match: ['caoboi'] },
];

const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, error } = useSelector((state: RootState) => state.products);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Debounce tìm kiếm khi gõ
  useEffect(() => {
    const term = searchTerm.trim();
    const delay = setTimeout(() => {
      if (term) dispatch(searchProducts(term));
      else dispatch(fetchProducts());
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, dispatch]);

  // Suy luận danh mục từ name hoặc image
  const detectCategory = (p: Product): string => {
    const text = `${p.name ?? ''} ${p.image ?? ''}`.toLowerCase();
    for (const c of CATEGORIES) {
      if (c.key === 'all') continue;
      if (c.match.some((m) => text.includes(m))) return c.key;
    }
    return 'other';
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of CATEGORIES) counts[c.key] = 0;
    for (const p of products) {
      const k = detectCategory(p);
      if (counts[k] !== undefined) counts[k]++;
    }
    counts['all'] = products.length;
    return counts;
  }, [products]);

  const handleShowAddModal = () => {
    setProductToEdit(null);
    setShowModal(true);
  };

  const handleShowEditModal = (product: Product) => {
    setProductToEdit(product);
    setShowModal(true);
  };

  const handleSave = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData) dispatch(updateProduct(productData as Product));
    else dispatch(addProduct(productData));
    setShowModal(false);
  };

  const renderContent = () => {
    if (status === 'loading') return <p className="text-center">Đang tải...</p>;
    if (status === 'failed') return <p className="text-center text-danger">{error}</p>;

    // Lọc theo từ khóa phía client để đảm bảo hoạt động ngay cả khi API không lọc
    const term = searchTerm.trim().toLowerCase();
    const bySearch = term
      ? products.filter((p: any) =>
          (p.name ?? '').toLowerCase().includes(term) ||
          (p.description ?? '').toLowerCase().includes(term) ||
          (p.image ?? '').toLowerCase().includes(term)
        )
      : products;

    // Áp dụng tiếp lọc theo danh mục
    const filtered =
      activeCategory === 'all'
        ? bySearch
        : bySearch.filter((p) => detectCategory(p) === activeCategory);
    if (filtered.length === 0) return <p className="text-center text-muted">Không tìm thấy sản phẩm phù hợp.</p>;

    return filtered.map((p) => (
      <ProductCard
        key={p.id}
        product={p}
        isAdmin={currentUser?.role === 'admin'}
        onEdit={() => handleShowEditModal(p)}
      />
    ));
  };

  return (
    <div className="container my-5">
      {/* Danh mục lọc nhanh */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`btn btn-sm ${activeCategory === c.key ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => setActiveCategory(c.key)}
            >
              {c.label}
              <span className="ms-1 text-muted">({categoryCounts[c.key] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      <h1 className="text-center mb-4">Tất Cả Sản Phẩm</h1>

      {/* Nút thêm (Admin) */}
      {currentUser?.role === 'admin' && (
        <div className="text-end mb-3">
          <button className="btn btn-success" onClick={handleShowAddModal}>
            <i className="bi bi-plus-circle me-1"></i> Thêm sản phẩm mới
          </button>
        </div>
      )}

      {/* Thanh tìm kiếm (Enter hoặc click nút) */}
      <form
        className="mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          const term = searchTerm.trim();
          if (term) dispatch(searchProducts(term));
          else dispatch(fetchProducts());
        }}
      >
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-secondary" aria-label="Tìm kiếm">
            <i className="bi bi-search"></i>
          </button>
        </div>
      </form>

      <div className="row gy-4">{renderContent()}</div>

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

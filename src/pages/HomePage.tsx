import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { fetchProducts } from '../app/slices/ProductSlice';

/**
 * Component trang chủ - trang đầu tiên người dùng nhìn thấy.
 * - Hiển thị banner, phần giới thiệu và các sản phẩm nổi bật.
 */
const HomePage = () => {
    // Hook để gửi action tới Redux store
    const dispatch = useDispatch<AppDispatch>();
    // Lấy thông tin người dùng hiện tại từ authSlice
    const { currentUser } = useSelector((state: RootState) => state.auth);
    // Lấy danh sách tất cả sản phẩm và trạng thái tải dữ liệu từ productSlice
    const { items: allProducts, status } = useSelector((state: RootState) => state.products);

    // useEffect sẽ chạy khi component được render hoặc khi `status` thay đổi
    useEffect(() => {
        // Chỉ gọi API để lấy danh sách sản phẩm nếu chúng chưa được tải (trạng thái 'idle')
        // Điều này giúp tránh việc gọi lại API một cách không cần thiết.
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);
    
    // Lấy 4 sản phẩm đầu tiên từ danh sách để hiển thị làm sản phẩm nổi bật
    const featuredProducts = allProducts.slice(0, 4);

    return (
        <>
            {/* Phần Banner Carousel */}
            <div className="container-fluid p-0 mb-5">
                <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="/imgs/banner1.webp" className="d-block w-100" alt="Banner 1" />
                        </div>
                        <div className="carousel-item">
                            <img src="/imgs/banner2.webp" className="d-block w-100" alt="Banner 2" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần Giới thiệu về thương hiệu */}
            <section className="py-5 text-center intro-section">
                <div className="container">
                    <h2 className="display-5 fw-bold">THE BAD HATS</h2>
                    <p className="lead text-muted mb-5">
                        Nâng tầm phong cách của bạn với những chiếc nón được thiết kế độc đáo và chất lượng hàng đầu.
                    </p>
                    <div className="row">
                        {/* Các cột giới thiệu tính năng nổi bật */}
                        <div className="col-lg-4">
                            <div className="feature-icon-container bg-primary text-white mb-3">
                                <i className="bi bi-gem"></i>
                            </div>
                            <h4>Chất Lượng Hàng Đầu</h4>
                            <p>Sản phẩm được làm từ những vật liệu tốt nhất, đảm bảo độ bền và sự thoải mái.</p>
                        </div>
                        <div className="col-lg-4">
                            <div className="feature-icon-container bg-primary text-white mb-3">
                                <i className="bi bi-palette-fill"></i>
                            </div>
                            <h4>Thiết Kế Đa Dạng</h4>
                            <p>Luôn cập nhật những xu hướng mới nhất với nhiều mẫu mã phù hợp mọi cá tính.</p>
                        </div>
                        <div className="col-lg-4">
                            <div className="feature-icon-container bg-primary text-white mb-3">
                                <i className="bi bi-truck"></i>
                            </div>
                            <h4>Giao Hàng Nhanh Chóng</h4>
                            <p>Hỗ trợ giao hàng tận nơi trên toàn quốc, nhanh chóng và tiện lợi.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Phần hiển thị các Sản phẩm nổi bật */}
            <div className="container py-5">
                <section className="text-center">
                    <h2 className="mb-4">Sản phẩm nổi bật</h2>
                    <div className="row">
                        {/* Lặp qua mảng `featuredProducts` và render component ProductCard cho mỗi sản phẩm */}
                        {featuredProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                isAdmin={currentUser?.role === 'admin'} 
                            />
                        ))}
                    </div>
                    {/* Nút điều hướng đến trang sản phẩm đầy đủ */}
                    <Link to="/products" className="btn btn-outline-dark mt-4">
                        <i className="bi bi-box-arrow-up-right me-1"></i> Xem tất cả sản phẩm
                    </Link>
                </section>
            </div>
        </>
    );
};

export default HomePage;
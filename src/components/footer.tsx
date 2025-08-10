import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-light text-dark pt-5 pb-4">
      <div className="container text-center text-md-start">
        <div className="row">

          {/* Cột 1: Thông tin shop - Chiếm 2 cột trên mobile */}
          <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
            <h5 className="text-uppercase mb-4 fw-bold text-primary">The Bad Hats</h5>
            <p>
              Chuyên cung cấp các loại nón thời trang, chất lượng cao, giúp bạn thể hiện phong cách và cá tính riêng.
            </p>
          </div>

          {/* Cột 2: Về chúng tôi - Chiếm 1 cột trên mobile */}
          <div className="col-lg-2 col-md-3 col-6 mb-4">
            <h5 className="text-uppercase mb-4 fw-bold">Về chúng tôi</h5>
            <p><Link to="/about" className="footer-link">Về The Bad Hats</Link></p>
            <p><Link to="/stores" className="footer-link">Hệ thống cửa hàng</Link></p>
            <p><Link to="/blog" className="footer-link">Tin tức</Link></p>
          </div>

          {/* Cột 3: Hỗ trợ - Chiếm 1 cột trên mobile */}
          <div className="col-lg-2 col-md-3 col-6 mb-4">
            <h5 className="text-uppercase mb-4 fw-bold">Hỗ trợ</h5>
            <p><Link to="/faq" className="footer-link">Câu hỏi thường gặp (FAQ)</Link></p>
            <p><Link to="/policy" className="footer-link">Chính sách đổi trả</Link></p>
            <p><Link to="/shipping" className="footer-link">Thông tin giao hàng</Link></p>
          </div>

          {/* Cột 4: Liên hệ - Chiếm 2 cột trên mobile */}
          <div className="col-lg-3 col-md-12 col-sm-12 mb-4">
            <h5 className="text-uppercase mb-4 fw-bold">Liên hệ</h5>
            <p><i className="bi bi-geo-alt-fill me-2"></i>123 Nguyễn Văn Linh, Q.7, TP.HCM</p>
            <p><i className="bi bi-envelope-fill me-2"></i>support@thebadhats.com</p>
            <p><i className="bi bi-telephone-fill me-2"></i>0987 654 321</p>
            <div className="mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon"><i className="bi bi-facebook"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon"><i className="bi bi-instagram"></i></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon"><i className="bi bi-youtube"></i></a>
            </div>
          </div>
        </div>

        <hr className="my-3" />

        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="mb-md-0 mb-2">&copy; 2025 The Bad Hats. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
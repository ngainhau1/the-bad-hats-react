import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const Header = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand fw-bold d-flex align-items-center" to="/">
            <img src="imgs/logo.png" alt="Logo" className="me-2" style={{ height: '85px' }} />
            The Bad Hats
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/"><i className="bi bi-house-door-fill me-1"></i>Trang chủ</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products"><i className="bi bi-grid-fill me-1"></i>Sản phẩm</NavLink>
              </li>
              {currentUser?.role === 'admin' && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/orders">
                    <i className="bi bi-archive-fill me-1"></i>Quản lý Đơn hàng
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink className="nav-link" to="/cart"><i className="bi bi-cart-fill me-1"></i>Giỏ hàng</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/account"><i className="bi bi-person-circle me-1"></i>Tài khoản</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
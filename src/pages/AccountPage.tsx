import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { logout, loginUser } from '../app/slices/authSlice';

/**
 * Component con, hiển thị thông tin cho người dùng đã đăng nhập.
 * @param currentUser - Thông tin người dùng hiện tại.
 * @param onLogout - Hàm callback để xử lý sự kiện đăng xuất.
 */
const UserProfile = ({ currentUser, onLogout }: any) => (
  <div className="container my-5 text-center">
    <h2 className="mb-3">Thông tin tài khoản</h2>
    <div className="card mx-auto" style={{ maxWidth: '400px' }}>
      <div className="card-body">
        <p><strong>Họ và tên:</strong> {currentUser?.fullName}</p>
        <p><strong>Email:</strong> {currentUser?.email}</p>
        <p><strong>Vai trò:</strong> {currentUser?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
        <button className="btn btn-danger mt-3" onClick={onLogout}>
          Đăng xuất <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
);

/**
 * Component con, hiển thị form đăng nhập cho khách.
 * @param props - Chứa các state và hàm xử lý được truyền từ component cha.
 */
const LoginForm = ({ onLogin, error, email, setEmail, password, setPassword }: any) => (
  <div className="container my-5">
    <div className="mx-auto" style={{ maxWidth: '400px' }}>
      <form onSubmit={onLogin}>
        <h4 className="mb-4 text-center fw-bold">Đăng nhập / Tạo tài khoản</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="form-control" 
            placeholder="Email" 
            required 
          />
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="form-control" 
            placeholder="Mật khẩu" 
            required 
          />
        </div>
        <div className="d-grid mb-2">
          <button type="submit" className="btn btn-primary fw-bold">Đăng nhập</button>
        </div>
        <div className="d-grid">
          <Link to="/register" className="btn btn-success fw-bold">Tạo tài khoản mới</Link>
        </div>
      </form>
    </div>
  </div>
);

/**
 * Component trang chính, quản lý việc hiển thị giao diện đăng nhập hoặc thông tin tài khoản
 * tùy thuộc vào trạng thái đăng nhập của người dùng.
 */
const AccountPage = () => {
  // Hooks để tương tác với Redux và Router
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoggedIn, currentUser } = useSelector((state: RootState) => state.auth);

  // State cục bộ để quản lý dữ liệu form đăng nhập
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Xử lý sự kiện đăng xuất
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Xử lý sự kiện submit form đăng nhập
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Dispatch action `loginUser` và chờ kết quả
      // .unwrap() sẽ trả về payload nếu thành công, hoặc ném ra lỗi nếu thất bại
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/'); // Chuyển về trang chủ nếu thành công
    } catch (err: any) {
      setError(err); // Hiển thị lỗi nếu thất bại
    }
  };

  // Render có điều kiện: nếu đã đăng nhập thì hiển thị UserProfile, nếu không thì hiển thị LoginForm
  return isLoggedIn 
    ? <UserProfile currentUser={currentUser} onLogout={handleLogout} /> 
    : <LoginForm 
        onLogin={handleLogin} 
        error={error}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />;
};

export default AccountPage;
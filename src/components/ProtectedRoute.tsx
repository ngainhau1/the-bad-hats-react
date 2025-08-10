import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../app/store';

/**
 * Component "gác cổng" dùng để bảo vệ các route chỉ dành cho Admin.
 * Nó sẽ kiểm tra trạng thái đăng nhập và vai trò của người dùng.
 */
const ProtectedRoute = () => {
  // Lấy trạng thái đăng nhập và thông tin người dùng từ Redux store
  const { isLoggedIn, currentUser } = useSelector((state: RootState) => state.auth);

  // 1. Nếu người dùng chưa đăng nhập, điều hướng họ về trang tài khoản/đăng nhập.
  if (!isLoggedIn) {
    // `replace` được dùng để thay thế lịch sử duyệt, người dùng không thể nhấn "Back" để quay lại trang admin.
    return <Navigate to="/account" replace />;
  }

  // 2. Nếu người dùng đã đăng nhập, kiểm tra vai trò của họ.
  // Nếu là 'admin', cho phép truy cập bằng cách render <Outlet />.
  // <Outlet /> sẽ render component con tương ứng với route được định nghĩa trong App.tsx (ví dụ: AdminOrdersPage).
  // Nếu không phải 'admin', điều hướng về trang chủ.
  return currentUser?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
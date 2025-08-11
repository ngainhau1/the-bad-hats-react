import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { registerUser } from '../app/slices/authSlice';
import { toast } from 'react-toastify';
import CustomToast from '../components/CustomToast';

/**
 * Component trang Đăng ký, cho phép người dùng mới tạo tài khoản.
 */
const RegisterPage = () => {
    // State cục bộ để quản lý dữ liệu của các ô input trong form
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // State để lưu trữ lỗi (hiện tại không dùng nhiều vì đã có toast)
    const [error, setError] = useState('');

    // Hooks để tương tác với Redux và Router
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    /**
     * Xử lý sự kiện khi người dùng submit form đăng ký.
     * @param e - Sự kiện của form
     */
    const handleRegister = async (e: FormEvent) => {
        e.preventDefault(); // Ngăn trình duyệt tải lại trang

        // --- Kiểm tra phía Client ---
        // 1. So sánh mật khẩu và mật khẩu xác nhận
        if (password !== confirmPassword) {
            toast.error(
              <CustomToast 
                iconClassName="bi bi-x-circle-fill" 
                title="Lỗi" 
                message="Mật khẩu xác nhận không khớp."
              />
            );
            return; // Dừng hàm nếu mật khẩu không khớp
        }
        setError(''); // Xóa lỗi cũ (nếu có)
        
        // --- Gửi yêu cầu lên Server ---
        try {
            // 2. Dispatch action `registerUser` và chờ kết quả
            // .unwrap() sẽ trả về payload nếu thành công, hoặc ném ra lỗi nếu thất bại (ví dụ: email đã tồn tại)
            await dispatch(registerUser({ fullName, email, password })).unwrap();
            
            // 3. Xử lý khi đăng ký thành công
            toast.success(
              <CustomToast 
                iconClassName="bi bi-check-circle-fill" 
                title="Tuyệt vời!" 
                message="Đăng ký thành công."
              />
            );
            navigate('/'); // Chuyển hướng về trang chủ
        } catch (err: any) {
            // 4. Xử lý khi có lỗi từ server
            toast.error(
              <CustomToast 
                iconClassName="bi bi-exclamation-triangle-fill" 
                title="Đăng ký thất bại" 
                message={err} // `err` là nội dung lỗi trả về từ `rejectWithValue` trong authSlice
              />
            );
        }
    };

    return (
        <div className="container my-5">
            <div className="mx-auto" style={{ maxWidth: '400px' }}>
                <form onSubmit={handleRegister}>
                    <h4 className="mb-4 text-center fw-bold">Tạo Tài Khoản Mới</h4>
                    
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="mb-3">
                        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="form-control" placeholder="Họ và tên" required />
                    </div>
                    <div className="mb-3">
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" placeholder="Email" required />
                    </div>
                    <div className="mb-3">
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" placeholder="Mật khẩu" required />
                    </div>
                    <div className="mb-3">
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="form-control" placeholder="Xác nhận mật khẩu" required />
                    </div>

                    <div className="d-grid mb-2">
                        <button type="submit" className="btn btn-success fw-bold">Đăng ký</button>
                    </div>
                    <div className="text-center">
                        <Link to="/account">Đã có tài khoản? Đăng nhập ngay</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
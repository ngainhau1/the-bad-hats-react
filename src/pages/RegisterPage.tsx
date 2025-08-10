import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { registerUser } from '../app/slices/authSlice';
import { toast } from 'react-toastify';
import CustomToast from '../components/CustomToast';
const RegisterPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        toast.error(
          <CustomToast 
            iconClassName="bi bi-x-circle-fill" 
            title="Lỗi" 
            message="Mật khẩu xác nhận không khớp."
          />
        );
        return;
    }
    setError('');
    
    try {
        await dispatch(registerUser({ fullName, email, password })).unwrap();
        toast.success(
          <CustomToast 
            iconClassName="bi bi-check-circle-fill" 
            title="Tuyệt vời!" 
            message="Đăng ký thành công."
          />
        );
        navigate('/');
    } catch (err: any) {
        toast.error(
          <CustomToast 
            iconClassName="bi bi-exclamation-triangle-fill" 
            title="Đăng ký thất bại" 
            message={err}
          />
        );
    }
};

    return (
        <div className="container my-5">
            <div className="mx-auto" style={{ maxWidth: '400px' }}>
                <form onSubmit={handleRegister}>
                    <h4 className="mb-4 text-center fw-bold">Tạo Tài Khoản Mới</h4>
                    
                    {/* Giữ lại phần error này nếu bạn vẫn muốn hiển thị lỗi ngay form */}
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
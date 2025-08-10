import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

/**
 * Component trang Thanh toán, nơi người dùng điền thông tin và xác nhận đơn hàng.
 */
const CheckoutPage = () => {
    // Lấy thông tin giỏ hàng từ CartContext
    const { cart, cartTotal, clearCart } = useCart();
    // Lấy thông tin người dùng hiện tại từ Redux store
    const { currentUser } = useSelector((state: RootState) => state.auth);
    // Hook để điều hướng trang
    const navigate = useNavigate();

    // State cục bộ để quản lý dữ liệu từ form
    const [customerName, setCustomerName] = useState(currentUser?.fullName || '');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    /**
     * Xử lý sự kiện khi người dùng nhấn nút "Xác nhận Đặt Hàng".
     * @param e - Sự kiện của form
     */
    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn form submit và tải lại trang

        // Kiểm tra xem giỏ hàng có trống không
        if (cart.length === 0) {
            toast.error("Giỏ hàng của bạn đang trống!");
            return;
        }

        // Tạo đối tượng dữ liệu đơn hàng để gửi lên API
        const orderData = {
            customerInfo: {
                userId: currentUser?.id,
                name: customerName,
                address,
                phone
            },
            items: cart,
            totalAmount: cartTotal,
            status: "Pending",
            createdAt: new Date().toISOString()
        };

        try {
            // Gửi yêu cầu POST đến API để tạo đơn hàng mới
            const response = await axiosClient.post('/orders', orderData);
            toast.success("Đặt hàng thành công!");
            clearCart(); // Xóa sạch giỏ hàng
            // Điều hướng đến trang thành công, truyền theo ID của đơn hàng vừa tạo
            navigate('/order-success', { state: { orderId: response.data.id } });
        } catch (error) {
            toast.error("Đã có lỗi xảy ra, không thể đặt hàng.");
        }
    };

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Thanh Toán Đơn Hàng</h1>
            <div className="row">
                {/* Cột bên trái chứa form thông tin giao hàng */}
                <div className="col-md-7">
                    <h4>Thông tin giao hàng</h4>
                    <form onSubmit={handleSubmitOrder}>
                        <div className="mb-3">
                            <label className="form-label">Họ và tên</label>
                            <input type="text" className="form-control" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Địa chỉ</label>
                            <input type="text" className="form-control" value={address} onChange={e => setAddress(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số điện thoại</label>
                            <input type="tel" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required />
                        </div>
                        <h4 className="mt-4">Phương thức thanh toán</h4>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="cod" defaultChecked />
                            <label className="form-check-label" htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg mt-4">Xác nhận Đặt Hàng</button>
                    </form>
                </div>
                {/* Cột bên phải chứa tóm tắt đơn hàng */}
                <div className="col-md-5">
                    <h4>Tóm tắt đơn hàng</h4>
                    <ul className="list-group mb-3">
                        {cart.map(item => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <h6 className="my-0">{item.name}</h6>
                                    <small className="text-muted">Số lượng: {item.quantity}</small>
                                </div>
                                <span className="text-muted">{(item.price * item.quantity).toLocaleString()}₫</span>
                            </li>
                        ))}
                        <li className="list-group-item d-flex justify-content-between">
                            <strong>Tổng cộng (VND)</strong>
                            <strong>{cartTotal.toLocaleString()}₫</strong>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
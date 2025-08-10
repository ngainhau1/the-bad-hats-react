import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchOrders } from '../app/slices/orderSlice';

/**
 * Component trang dành cho Admin để xem danh sách tất cả các đơn hàng đã được đặt.
 */
const AdminOrdersPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    // Lấy danh sách đơn hàng và trạng thái fetch từ Redux store
    const { items: orders, status } = useSelector((state: RootState) => state.orders);

    // Sử dụng useEffect để gọi API lấy danh sách đơn hàng một lần khi component được render
    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    // Hiển thị thông báo đang tải nếu trạng thái là 'loading'
    if (status === 'loading') {
        return <p className="text-center my-5">Đang tải danh sách đơn hàng...</p>;
    }

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Quản Lý Đơn Hàng</h1>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Mã Đơn</th>
                            <th>Khách Hàng</th>
                            <th>Địa Chỉ</th>
                            <th>Số Điện Thoại</th>
                            <th>Tổng Tiền</th>
                            <th>Ngày Đặt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Dùng hàm map để lặp qua mảng `orders` và render từng hàng trong bảng */}
                        {orders.map((order: any) => (
                            <tr key={order.id}>
                                <td><strong>#{order.id}</strong></td>
                                <td>{order.customerInfo.name}</td>
                                <td>{order.customerInfo.address}</td>
                                <td>{order.customerInfo.phone}</td>
                                <td className="text-danger fw-bold">{order.totalAmount.toLocaleString()}₫</td>
                                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
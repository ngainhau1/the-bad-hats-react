import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchOrders, updateOrderStatus } from '../app/slices/orderSlice';

const AdminOrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: orders, status } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

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
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Tổng tiền</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id}>
                <td><strong>#{order.id}</strong></td>
                <td>{order.customerInfo?.name}</td>
                <td>{order.customerInfo?.address}</td>
                <td>{order.customerInfo?.phone}</td>
                <td className="text-danger fw-bold">{Number(order.totalAmount).toLocaleString()}₫</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : ''}</td>
                <td>
                  {order.status === 'Pending' ? (
                    <span className="badge bg-warning text-dark">Pending</span>
                  ) : (
                    <span className="badge bg-success">Order</span>
                  )}
                </td>
                <td>
                  {order.status === 'Pending' ? (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => dispatch(updateOrderStatus({ id: order.id, status: 'Order' }))}
                    >
                      Cập nhật sang Order
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-outline-secondary" disabled>
                      Đã cập nhật
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;


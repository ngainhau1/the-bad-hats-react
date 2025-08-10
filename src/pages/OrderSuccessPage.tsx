import { Link, useLocation } from 'react-router-dom';

const OrderSuccessPage = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="container my-5 text-center">
            <div className="py-5">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '72px' }}></i>
                <h2 className="mt-3">Đặt Hàng Thành Công!</h2>
                <p className="lead">Cảm ơn bạn đã mua sắm tại The Bad Hats.</p>
                {orderId && <p>Mã đơn hàng của bạn là: <strong>#{orderId}</strong></p>}
                <Link to="/" className="btn btn-primary mt-3">Tiếp tục mua sắm</Link>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
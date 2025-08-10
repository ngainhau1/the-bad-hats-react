// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import { CartProvider } from './contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminOrdersPage from './pages/AdminOrdersPage';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success" element={<OrderSuccessPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="register" element={<RegisterPage />} />
            
            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="admin/orders" element={<AdminOrdersPage />} />
            </Route>
          </Route> {/* <--- Thẻ đóng còn thiếu nằm ở đây */}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
// src/pages/ProductDetailPage.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Không thể tải thông tin sản phẩm.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center my-5">Đang tải...</p>;
  }

  if (error) {
    return <p className="text-center text-danger my-5">{error}</p>;
  }

  if (!product) {
    return <p className="text-center my-5">Không tìm thấy sản phẩm.</p>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(` Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.name} className="img-fluid rounded shadow-sm" />
        </div>
        <div className="col-md-6">
          <h2 className="fs-3 fs-md-2">{product.name}</h2> 
          <p className="fs-3 text-danger fw-bold">{product.price.toLocaleString()}₫</p>
          <hr />
            <p>{product.description}</p>
          <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
            <i className="bi bi-cart-plus me-2"></i>Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
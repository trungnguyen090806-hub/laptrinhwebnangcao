import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    setAdding(true);
    const result = await addToCart(product, 1);
    setAdding(false);

    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="product-card h-100 position-relative">

      <div className="position-absolute top-0 start-0 m-2 z-1">
        <span className="badge bg-primary bg-opacity-90 rounded-pill px-2 py-1 small">
          {product.category?.name || 'Công nghệ'}
        </span>
      </div>

      <Link to={`/products/${product.id}`} className="product-img-wrapper text-decoration-none">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
          }}
        />
      </Link>

      <div className="card-body p-3 d-flex flex-direction-column flex-grow-1 justify-content-between">
        <div>
          <h6 className="card-title mb-2">
            <Link
              to={`/products/${product.id}`}
              className="text-decoration-none text-dark fw-semibold text-truncate-2"
              title={product.name}
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.5rem'
              }}
            >
              {product.name}
            </Link>
          </h6>

          <div className="d-flex align-items-center mb-2">
            <span className="price-tag me-2">{formatPrice(product.price)}</span>
          </div>

          <div className="small mb-3">
            {product.stock > 0 ? (
              <span className="badge badge-stock-in rounded-pill">
                <i className="bi bi-check2-circle me-1"></i> Còn {product.stock} sản phẩm
              </span>
            ) : (
              <span className="badge badge-stock-out rounded-pill">
                <i className="bi bi-x-circle me-1"></i> Tạm hết hàng
              </span>
            )}
          </div>
        </div>

        <div className="d-flex gap-2 pt-2 border-top">
          <Link
            to={`/products/${product.id}`}
            className="btn btn-outline-primary btn-sm flex-grow-1 rounded-pill fw-medium d-flex align-items-center justify-content-center"
          >
            <i className="bi bi-eye me-1"></i> Chi tiết
          </Link>

          <button
            className={`btn btn-sm rounded-pill px-3 d-flex align-items-center justify-content-center ${
              added ? 'btn-success' : 'btn-accent'
            }`}
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
            title="Thêm vào giỏ hàng"
          >
            {adding ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : added ? (
              <><i className="bi bi-check2"></i> Đã thêm</>
            ) : (
              <><i className="bi bi-cart-plus me-1"></i> Thêm</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

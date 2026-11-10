import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const handleCheckout = () => {
    if (!currentUser) {

      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto" style={{ maxWidth: '600px' }}>
          <i className="bi bi-cart-x display-1 text-muted opacity-50 mb-3 d-block"></i>
          <h3 className="fw-bold mb-2">Giỏ hàng của bạn đang trống!</h3>
          <p className="text-muted mb-4">
            Hãy khám phá ngay các sản phẩm công nghệ tuyệt vời và thêm vào giỏ hàng nhé.
          </p>
          <Link to="/products" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
            <i className="bi bi-bag-plus me-2"></i> Khám phá sản phẩm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">
        <i className="bi bi-cart3 text-primary me-2"></i> Giỏ Hàng Của Bạn
        <span className="fs-6 fw-normal text-muted ms-2">({cart.totalQuantity} sản phẩm)</span>
      </h3>

      <div className="row g-4">

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Sản phẩm</th>
                    <th scope="col" className="text-center">Đơn giá</th>
                    <th scope="col" className="text-center">Số lượng</th>
                    <th scope="col" className="text-center">Thành tiền</th>
                    <th scope="col" className="text-center pe-4">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="rounded border me-3"
                            style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div>
                            <Link
                              to={`/products/${item.product.id}`}
                              className="text-decoration-none text-dark fw-semibold d-block text-truncate"
                              style={{ maxWidth: '220px' }}
                              title={item.product.name}
                            >
                              {item.product.name}
                            </Link>
                            <span className="badge bg-light text-muted border small">
                              {item.product.category?.name || 'Công nghệ'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="text-center fw-medium">
                        {formatPrice(item.product.price)}
                      </td>

                      <td className="text-center">
                        <div className="input-group input-group-sm mx-auto" style={{ width: '100px' }}>
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <input
                            type="text"
                            className="form-control text-center fw-bold px-1"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </td>

                      <td className="text-center fw-bold text-danger">
                        {formatPrice(item.subtotal || item.product.price * item.quantity)}
                      </td>

                      <td className="text-center pe-4">
                        <button
                          className="btn btn-sm btn-outline-danger border-0 rounded-circle"
                          onClick={() => removeItem(item.id)}
                          title="Xóa món này"
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-light border-top d-flex justify-content-between align-items-center">
              <Link to="/products" className="btn btn-outline-secondary btn-sm rounded-pill">
                <i className="bi bi-arrow-left me-1"></i> Tiếp tục chọn hàng
              </Link>
              <button className="btn btn-sm text-danger" onClick={clearCart}>
                <i className="bi bi-trash me-1"></i> Xóa toàn bộ giỏ hàng
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold mb-3 pb-2 border-bottom">Tóm Tắt Đơn Hàng</h5>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Tổng số lượng:</span>
              <span className="fw-semibold">{cart.totalQuantity} món</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Tạm tính:</span>
              <span className="fw-semibold">{formatPrice(cart.totalAmount)}</span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Phí vận chuyển:</span>
              <span className="text-success fw-bold">MIỄN PHÍ</span>
            </div>

            <hr className="my-3" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold fs-5">Tổng thanh toán:</span>
              <span className="fs-4 fw-bold text-danger">{formatPrice(cart.totalAmount)}</span>
            </div>

            <button
              className="btn btn-accent btn-lg w-100 rounded-pill fw-semibold shadow-sm mb-3"
              onClick={handleCheckout}
              disabled={loading}
            >
              <i className="bi bi-credit-card me-2"></i> Tiến Hành Đặt Hàng
            </button>

            <div className="text-muted small text-center">
              <i className="bi bi-shield-lock me-1 text-success"></i> Thông tin mua sắm được bảo mật an toàn
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

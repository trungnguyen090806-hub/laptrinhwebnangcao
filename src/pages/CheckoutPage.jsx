import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';

export default function CheckoutPage() {
  const { currentUser } = useAuth();
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipientName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    note: '',
    paymentMethod: 'COD',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.recipientName.trim()) {
      setError('Vui lòng nhập họ tên người nhận hàng');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Vui lòng nhập số điện thoại nhận hàng');
      return;
    }
    if (!formData.address.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng cụ thể');
      return;
    }

    if (!currentUser) {
      setError('Vui lòng đăng nhập trước khi hoàn tất đặt hàng');
      return;
    }

    try {
      setLoading(true);
      const orderPayload = {
        userId: currentUser.id,
        recipientName: formData.recipientName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        paymentMethod: formData.paymentMethod,
        note: formData.note.trim(),
      };

      const res = await orderService.createOrder(orderPayload);
      if (res.success && res.data) {

        await refreshCart();
        navigate(`/order-success/${res.data.id}`);
      } else {
        setError(res.message || 'Đặt hàng thất bại');
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi gửi yêu cầu đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4>Giỏ hàng của bạn đang trống!</h4>
        <Link to="/products" className="btn btn-primary rounded-pill mt-3">Chọn mua sản phẩm</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang chủ</Link></li>
          <li className="breadcrumb-item"><Link to="/cart" className="text-decoration-none">Giỏ hàng</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Thanh toán & Đặt hàng</li>
        </ol>
      </nav>

      <h3 className="fw-bold mb-4">
        <i className="bi bi-shield-check text-primary me-2"></i> Xác Nhận Đơn Hàng & Thanh Toán
      </h3>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 className="fw-bold mb-3 pb-2 border-bottom">
                <i className="bi bi-geo-alt-fill text-danger me-2"></i> 1. Thông Tin Nhận Hàng
              </h5>

              <div className="mb-3">
                <label className="form-label fw-semibold">Họ và tên người nhận <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Số điện thoại liên hệ <span className="text-danger">*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ví dụ: 0987654321"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Tài khoản đặt hàng</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={currentUser?.username || 'Khách'}
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Địa chỉ nhận hàng chi tiết <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Số nhà, tên ngõ/đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  required
                ></textarea>
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold">Ghi chú giao hàng (Tùy chọn)</label>
                <input
                  type="text"
                  className="form-control"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Ví dụ: Giao vào giờ hành chính, gọi trước khi đến..."
                />
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-3 pb-2 border-bottom">
                <i className="bi bi-wallet2 text-success me-2"></i> 2. Phương Thức Thanh Toán
              </h5>

              <div className="form-check p-3 rounded border mb-3 d-flex align-items-center">
                <input
                  className="form-check-input me-3 ms-0"
                  type="radio"
                  name="paymentMethod"
                  id="payCOD"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                />
                <label className="form-check-label w-100" htmlFor="payCOD">
                  <div className="fw-bold"><i className="bi bi-cash-stack text-success me-1"></i> Thanh toán tiền mặt khi nhận hàng (COD)</div>
                  <div className="text-muted small">Bạn chỉ thanh toán sau khi đã nhận và kiểm tra kiện hàng.</div>
                </label>
              </div>

              <div className="form-check p-3 rounded border d-flex align-items-center">
                <input
                  className="form-check-input me-3 ms-0"
                  type="radio"
                  name="paymentMethod"
                  id="payBank"
                  value="BANK_TRANSFER"
                  checked={formData.paymentMethod === 'BANK_TRANSFER'}
                  onChange={handleChange}
                />
                <label className="form-check-label w-100" htmlFor="payBank">
                  <div className="fw-bold"><i className="bi bi-bank text-primary me-1"></i> Chuyển khoản ngân hàng (Mô phỏng QR Code)</div>
                  <div className="text-muted small">Quét mã QR qua ứng dụng ngân hàng khi nhận đơn.</div>
                </label>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold mb-3 pb-2 border-bottom">
                <i className="bi bi-bag-check-fill text-primary me-2"></i> Đơn Hàng ({cart.totalQuantity} món)
              </h5>

              <div className="mb-3" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {cart.items.map((item) => (
                  <div key={item.id} className="d-flex align-items-center py-2 border-bottom">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="rounded border me-3"
                      style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1 text-truncate me-2">
                      <div className="fw-semibold text-truncate small">{item.product.name}</div>
                      <div className="text-muted small">x {item.quantity}</div>
                    </div>
                    <div className="fw-bold text-danger small">
                      {formatPrice(item.subtotal || item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Tạm tính:</span>
                <span className="fw-semibold">{formatPrice(cart.totalAmount)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3 small">
                <span className="text-muted">Phí giao hàng:</span>
                <span className="text-success fw-bold">MIỄN PHÍ</span>
              </div>

              <hr className="my-2" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold fs-5">Tổng tiền:</span>
                <span className="fs-4 fw-bold text-danger">{formatPrice(cart.totalAmount)}</span>
              </div>

              <button
                type="submit"
                className="btn btn-accent btn-lg w-100 rounded-pill fw-semibold shadow-sm mb-3"
                disabled={loading}
              >
                {loading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang tạo đơn hàng...
                  </span>
                ) : (
                  <span>
                    <i className="bi bi-check2-circle me-1"></i> Xác Nhận Đặt Hàng Ngay
                  </span>
                )}
              </button>

              <div className="small text-muted text-center">
                Bằng cách bấm đặt hàng, bạn đồng ý với các điều khoản bảo mật và chính sách bán hàng của TechStore.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

export default function OrderHistoryPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge bg-warning text-dark"><i className="bi bi-clock me-1"></i> Chờ xử lý</span>;
      case 'CONFIRMED':
        return <span className="badge bg-info text-dark"><i className="bi bi-check2-circle me-1"></i> Đã xác nhận</span>;
      case 'SHIPPING':
        return <span className="badge bg-primary"><i className="bi bi-truck me-1"></i> Đang giao hàng</span>;
      case 'DELIVERED':
        return <span className="badge bg-success"><i className="bi bi-check-all me-1"></i> Đã giao thành công</span>;
      case 'CANCELLED':
        return <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i> Đã hủy</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      orderService.getOrdersByUser(currentUser.id)
        .then(res => {
          if (res.success && res.data) setOrders(res.data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  return (
    <div className="container py-4">

      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang chủ</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Lịch sử đơn hàng</li>
        </ol>
      </nav>

      <h3 className="fw-bold mb-4">
        <i className="bi bi-bag-check-fill text-primary me-2"></i> Đơn Hàng Của Tôi
      </h3>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <div className="mt-2 text-muted">Đang tải lịch sử đơn hàng...</div>
        </div>
      ) : orders.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
          <i className="bi bi-receipt-cutoff display-1 text-muted opacity-50 mb-3 d-block"></i>
          <h4 className="fw-bold mb-2">Bạn chưa có đơn hàng nào!</h4>
          <p className="text-muted mb-4">Hãy tiếp tục khám phá các thiết bị công nghệ hấp dẫn và đặt hàng nhé.</p>
          <div>
            <Link to="/products" className="btn btn-primary rounded-pill px-4">
              <i className="bi bi-cart-plus me-1"></i> Mua sắm ngay
            </Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order.id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-light py-3 px-4 d-flex flex-wrap justify-content-between align-items-center">
                <div>
                  <span className="fw-bold me-3">Mã đơn hàng: <span className="text-primary">#{order.id}</span></span>
                  <span className="text-muted small">Ngày đặt: {formatDate(order.orderDate)}</span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              <div className="card-body p-4">
                <div className="row g-4">

                  <div className="col-lg-8 border-end-lg">
                    <h6 className="fw-semibold text-secondary small text-uppercase mb-3">Mặt hàng ({order.orderItems?.length || 0})</h6>
                    <div className="d-flex flex-column gap-3">
                      {order.orderItems?.map((item) => (
                        <div key={item.id} className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <img
                              src={item.product?.imageUrl}
                              alt={item.product?.name}
                              className="rounded border me-3"
                              style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                            />
                            <div>
                              <Link to={`/products/${item.product?.id}`} className="text-decoration-none text-dark fw-semibold small d-block">
                                {item.product?.name}
                              </Link>
                              <span className="text-muted small">Đơn giá: {formatPrice(item.price)} x {item.quantity}</span>
                            </div>
                          </div>
                          <div className="fw-bold text-danger">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <h6 className="fw-semibold text-secondary small text-uppercase mb-3">Thông tin giao nhận</h6>
                    <div className="small mb-1">
                      <span className="text-muted">Người nhận:</span> <strong>{order.recipientName}</strong>
                    </div>
                    <div className="small mb-1">
                      <span className="text-muted">SĐT:</span> <strong>{order.phone}</strong>
                    </div>
                    <div className="small mb-2">
                      <span className="text-muted">Địa chỉ:</span> <span>{order.address}</span>
                    </div>
                    <div className="small mb-3">
                      <span className="text-muted">Thanh toán:</span> <span className="badge bg-light text-dark border">{order.paymentMethod}</span>
                    </div>

                    <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Tổng thanh toán:</span>
                      <span className="fs-5 fw-bold text-danger">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

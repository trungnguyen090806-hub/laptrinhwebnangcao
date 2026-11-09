import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  useEffect(() => {
    if (id) {
      orderService.getOrderById(id)
        .then(res => {
          if (res.success && res.data) setOrder(res.data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto" style={{ maxWidth: '750px' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle mb-3" style={{ width: '84px', height: '84px' }}>
            <i className="bi bi-check-lg display-4"></i>
          </div>
          <h2 className="fw-bold text-success mb-2">Đặt Hàng Thành Công!</h2>
          <p className="text-muted mb-1">
            Cảm ơn bạn đã tin tưởng mua sắm tại <strong>TechStore</strong>.
          </p>
          <p className="text-muted small">
            Mã đơn hàng của bạn: <strong className="text-primary fs-6">#{id}</strong>
          </p>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : order ? (
          <div className="border rounded-3 p-3 bg-light mb-4">
            <h6 className="fw-bold border-bottom pb-2 mb-3">Thông Tin Giao Nhận & Đơn Hàng</h6>
            <div className="row g-2 small">
              <div className="col-sm-6">
                <span className="text-muted">Người nhận:</span> <strong>{order.recipientName}</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Số điện thoại:</span> <strong>{order.phone}</strong>
              </div>
              <div className="col-12">
                <span className="text-muted">Địa chỉ nhận hàng:</span> <strong>{order.address}</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Phương thức thanh toán:</span> <strong>{order.paymentMethod} (Thanh toán khi nhận hàng)</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Trạng thái:</span> <span className="badge bg-warning text-dark">{order.status}</span>
              </div>
            </div>

            <hr className="my-3" />

            <h6 className="fw-bold mb-2 small">Sản phẩm trong đơn ({order.orderItems?.length || 0}):</h6>
            <div className="list-group list-group-flush mb-3">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="list-group-item bg-transparent px-0 py-2 d-flex justify-content-between align-items-center small">
                  <div>
                    <span className="fw-semibold">{item.product?.name}</span>
                    <span className="text-muted ms-2">x {item.quantity}</span>
                  </div>
                  <span className="fw-bold text-danger">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between align-items-center pt-2 border-top">
              <span className="fw-bold">Tổng thanh toán:</span>
              <span className="fs-5 fw-bold text-danger">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        ) : null}

        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <Link to="/orders" className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold">
            <i className="bi bi-clock-history me-1"></i> Xem lịch sử đơn hàng
          </Link>
          <Link to="/" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
            <i className="bi bi-house-door me-1"></i> Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

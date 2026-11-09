import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ type: '', message: '' });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('vi-VN');
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

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await orderService.updateStatus(orderId, newStatus);
      if (res.success) {
        setAlertInfo({ type: 'success', message: `Đã cập nhật trạng thái đơn #${orderId} sang ${newStatus}` });
        loadOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(res.data);
        }
      }
    } catch (err) {
      setAlertInfo({ type: 'danger', message: err.message || 'Lỗi cập nhật trạng thái đơn' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter(o => o.status === statusFilter)
    : orders;

  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-cart-check text-primary me-2"></i> Quản Lý Đơn Hàng
          </h3>
          <p className="text-muted small mb-0">Theo dõi, duyệt đơn và cập nhật tiến độ giao hàng</p>
        </div>
      </div>

      {alertInfo.message && (
        <div className={`alert alert-${alertInfo.type} alert-dismissible fade show shadow-sm mb-4`} role="alert">
          <i className="bi bi-info-circle-fill me-2"></i> {alertInfo.message}
          <button type="button" className="btn-close" onClick={() => setAlertInfo({ type: '', message: '' })}></button>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-4 p-2 mb-4 bg-white">
        <ul className="nav nav-pills nav-fill">
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill ${!statusFilter ? 'active' : ''}`}
              onClick={() => setStatusFilter('')}
            >
              Tất Cả ({orders.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill ${statusFilter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setStatusFilter('PENDING')}
            >
              Chờ xử lý ({orders.filter(o => o.status === 'PENDING').length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill ${statusFilter === 'CONFIRMED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('CONFIRMED')}
            >
              Đã xác nhận ({orders.filter(o => o.status === 'CONFIRMED').length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill ${statusFilter === 'SHIPPING' ? 'active' : ''}`}
              onClick={() => setStatusFilter('SHIPPING')}
            >
              Đang giao ({orders.filter(o => o.status === 'SHIPPING').length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill ${statusFilter === 'DELIVERED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('DELIVERED')}
            >
              Đã giao ({orders.filter(o => o.status === 'DELIVERED').length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill ${statusFilter === 'CANCELLED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('CANCELLED')}
            >
              Đã hủy ({orders.filter(o => o.status === 'CANCELLED').length})
            </button>
          </li>
        </ul>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" className="ps-4">Mã đơn</th>
                <th scope="col">Người nhận & SĐT</th>
                <th scope="col">Ngày đặt</th>
                <th scope="col" className="text-end">Tổng tiền</th>
                <th scope="col" className="text-center">Trạng thái</th>
                <th scope="col">Cập nhật nhanh</th>
                <th scope="col" className="text-center pe-4">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Không có đơn hàng nào trong mục này.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="ps-4 fw-bold text-primary">#{order.id}</td>
                    <td>
                      <div className="fw-semibold text-dark">{order.recipientName}</div>
                      <div className="small text-muted">{order.phone}</div>
                    </td>
                    <td className="text-muted small">{formatDate(order.orderDate)}</td>
                    <td className="text-end fw-bold text-danger">{formatPrice(order.totalAmount)}</td>
                    <td className="text-center">{getStatusBadge(order.status)}</td>
                    <td>
                      <select
                        className="form-select form-select-sm rounded-pill"
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{ minWidth: '140px' }}
                      >
                        <option value="PENDING">Chờ xử lý</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="SHIPPING">Đang giao</option>
                        <option value="DELIVERED">Đã giao hàng</option>
                        <option value="CANCELLED">Hủy đơn</option>
                      </select>
                    </td>
                    <td className="text-center pe-4">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <i className="bi bi-eye me-1"></i> Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  📦 Chi Tiết Đơn Hàng #{selectedOrder.id}
                </h5>
                <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3 mb-4">
                  <div className="col-sm-6">
                    <div className="text-muted small">Người nhận:</div>
                    <div className="fw-bold">{selectedOrder.recipientName}</div>
                  </div>
                  <div className="col-sm-6">
                    <div className="text-muted small">Số điện thoại:</div>
                    <div className="fw-bold">{selectedOrder.phone}</div>
                  </div>
                  <div className="col-12">
                    <div className="text-muted small">Địa chỉ nhận hàng:</div>
                    <div>{selectedOrder.address}</div>
                  </div>
                  <div className="col-sm-6">
                    <div className="text-muted small">Phương thức thanh toán:</div>
                    <div><span className="badge bg-light text-dark border">{selectedOrder.paymentMethod}</span></div>
                  </div>
                  <div className="col-sm-6">
                    <div className="text-muted small">Trạng thái hiện tại:</div>
                    <div>{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  {selectedOrder.note && (
                    <div className="col-12">
                      <div className="text-muted small">Ghi chú của khách:</div>
                      <div className="fst-italic text-secondary">"{selectedOrder.note}"</div>
                    </div>
                  )}
                </div>

                <h6 className="fw-bold border-bottom pb-2 mb-3">Danh sách sản phẩm trong đơn</h6>
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Sản phẩm</th>
                        <th className="text-center">Đơn giá</th>
                        <th className="text-center">Số lượng</th>
                        <th className="text-end">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderItems?.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={item.product?.imageUrl}
                                alt={item.product?.name}
                                className="rounded border me-2"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              />
                              <span className="fw-semibold small">{item.product?.name}</span>
                            </div>
                          </td>
                          <td className="text-center small">{formatPrice(item.price)}</td>
                          <td className="text-center small">{item.quantity}</td>
                          <td className="text-end fw-bold text-danger small">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end fw-bold pt-3">Tổng thanh toán:</td>
                        <td className="text-end fw-bold text-danger fs-5 pt-3">
                          {formatPrice(selectedOrder.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="modal-footer border-top p-3">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => setSelectedOrder(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

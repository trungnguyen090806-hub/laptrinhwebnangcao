import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        return <span className="badge bg-warning text-dark">Chờ xử lý</span>;
      case 'CONFIRMED':
        return <span className="badge bg-info text-dark">Đã xác nhận</span>;
      case 'SHIPPING':
        return <span className="badge bg-primary">Đang giao</span>;
      case 'DELIVERED':
        return <span className="badge bg-success">Đã giao</span>;
      case 'CANCELLED':
        return <span className="badge bg-danger">Đã hủy</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          adminService.getStats(),
          orderService.getAllOrders(),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (ordersRes.success && ordersRes.data) {
          setRecentOrders(ordersRes.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-speedometer2 text-primary me-2"></i> Dashboard Thống Kê
          </h3>
          <p className="text-muted small mb-0">Tổng quan tình hình kinh doanh của cửa hàng</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/products" className="btn btn-primary btn-sm rounded-pill px-3">
            <i className="bi bi-plus-lg me-1"></i> Thêm Sản Phẩm
          </Link>
          <Link to="/admin/orders" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
            <i className="bi bi-cart me-1"></i> Xử Lý Đơn Hàng
          </Link>
        </div>
      </div>

      <div className="row g-3 mb-4">

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold text-uppercase">Tổng Doanh Thu</span>
              <div className="p-2 rounded-circle bg-success bg-opacity-10 text-success">
                <i className="bi bi-currency-dollar fs-4"></i>
              </div>
            </div>
            <h4 className="fw-bold text-success mb-1">{formatPrice(stats.totalRevenue)}</h4>
            <div className="small text-muted">Từ các đơn hàng thành công</div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold text-uppercase">Tổng Đơn Hàng</span>
              <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
                <i className="bi bi-bag-check fs-4"></i>
              </div>
            </div>
            <h4 className="fw-bold text-dark mb-1">{stats.totalOrders} đơn</h4>
            <div className="small text-warning fw-semibold">
              <i className="bi bi-clock-history me-1"></i> Có {stats.pendingOrders} đơn chờ xử lý
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold text-uppercase">Sản Phẩm Đang Bán</span>
              <div className="p-2 rounded-circle bg-info bg-opacity-10 text-info">
                <i className="bi bi-box-seam fs-4"></i>
              </div>
            </div>
            <h4 className="fw-bold text-dark mb-1">{stats.totalProducts} mặt hàng</h4>
            <div className="small text-muted">Phân theo 5 danh mục chính</div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold text-uppercase">Khách Hàng Đăng Ký</span>
              <div className="p-2 rounded-circle bg-warning bg-opacity-10 text-warning">
                <i className="bi bi-people fs-4"></i>
              </div>
            </div>
            <h4 className="fw-bold text-dark mb-1">{stats.totalUsers} tài khoản</h4>
            <div className="small text-muted">Hoạt động trong hệ thống</div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-receipt me-2 text-primary"></i> Đơn Hàng Mới Nhất Cần Xử Lý
          </h5>
          <Link to="/admin/orders" className="btn btn-outline-primary btn-sm rounded-pill">
            Xem tất cả đơn hàng <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" className="ps-4">Mã đơn</th>
                <th scope="col">Người nhận</th>
                <th scope="col">Số điện thoại</th>
                <th scope="col">Ngày đặt</th>
                <th scope="col" className="text-end">Tổng tiền</th>
                <th scope="col" className="text-center">Trạng thái</th>
                <th scope="col" className="text-center pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                    Đang tải dữ liệu đơn hàng...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Chưa có đơn hàng nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="ps-4 fw-bold text-primary">#{order.id}</td>
                    <td>{order.recipientName}</td>
                    <td>{order.phone}</td>
                    <td className="text-muted small">{formatDate(order.orderDate)}</td>
                    <td className="text-end fw-bold text-danger">{formatPrice(order.totalAmount)}</td>
                    <td className="text-center">{getStatusBadge(order.status)}</td>
                    <td className="text-center pe-4">
                      <Link to="/admin/orders" className="btn btn-sm btn-outline-secondary rounded-pill">
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

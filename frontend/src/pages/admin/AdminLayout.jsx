import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">

      <nav className="navbar navbar-dark bg-dark px-3 py-2 shadow-sm sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center fw-bold" to="/admin">
            <i className="bi bi-shield-lock-fill text-warning me-2 fs-4"></i>
            <span>TechStore <span className="badge bg-danger ms-1 fs-6">Admin Panel</span></span>
          </Link>

          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="btn btn-outline-light btn-sm rounded-pill px-3">
              <i className="bi bi-box-arrow-up-right me-1"></i> Xem Cửa Hàng
            </Link>

            <div className="d-none d-md-flex align-items-center text-light small">
              <i className="bi bi-person-circle fs-5 me-2 text-warning"></i>
              <span>{currentUser?.fullName || currentUser?.username} (Admin)</span>
            </div>

            <button className="btn btn-danger btn-sm rounded-pill px-3" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i> Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid flex-grow-1">
        <div className="row min-vh-100">

          <nav className="col-md-3 col-lg-2 d-md-block admin-sidebar p-3 shadow-sm">
            <div className="text-secondary small fw-bold text-uppercase px-3 mb-2">Quản trị hệ thống</div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard Thống Kê
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/products"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-laptop me-2"></i> Quản Lý Sản Phẩm
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/categories"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-tags me-2"></i> Quản Lý Danh Mục
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/orders"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-cart-check me-2"></i> Quản Lý Đơn Hàng
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-people me-2"></i> Quản Lý Người Dùng
                </NavLink>
              </li>
            </ul>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

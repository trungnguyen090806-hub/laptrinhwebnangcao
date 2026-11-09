import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { categoryService } from '../services/categoryService';

export default function Header() {
  const { currentUser, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    categoryService.getAll()
      .then(res => {
        if (res.success && res.data) {
          setCategories(res.data);
        }
      })
      .catch(err => console.error('Lỗi lấy danh mục:', err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className="sticky-top shadow-sm">

      <div className="top-bar d-none d-md-block">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <span className="me-3"><i className="bi bi-telephone-fill me-1 text-primary"></i> Hotline: 1800 6868 (Miễn phí)</span>
            <span><i className="bi bi-geo-alt-fill me-1 text-primary"></i> Hệ thống 45 cửa hàng toàn quốc</span>
          </div>
          <div>
            <span className="me-3"><i className="bi bi-shield-check me-1 text-success"></i> 100% Hàng chính hãng</span>
            <span><i className="bi bi-truck me-1 text-warning"></i> Giao hàng siêu tốc 2H</span>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg main-navbar py-2">
        <div className="container">

          <Link className="navbar-brand d-flex align-items-center fw-bold fs-3 text-dark me-4" to="/">
            <i className="bi bi-cpu-fill text-primary me-2 fs-2"></i>
            <span>Tech<span className="text-primary">Store</span></span>
          </Link>

          <form className="d-flex flex-grow-1 mx-lg-4 my-2 my-lg-0" onSubmit={handleSearch} style={{ maxWidth: '580px' }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control border-end-0 rounded-start-pill ps-3"
                placeholder="Bạn muốn tìm laptop, điện thoại hay phụ kiện gì..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button className="btn btn-primary rounded-end-pill px-4" type="submit">
                <i className="bi bi-search me-1"></i> Tìm kiếm
              </button>
            </div>
          </form>

          <div className="d-flex align-items-center gap-3 ms-auto">

            <Link to="/cart" className="btn btn-outline-secondary position-relative rounded-pill px-3 py-2 d-flex align-items-center">
              <i className="bi bi-cart3 fs-5 me-1 text-primary"></i>
              <span className="d-none d-sm-inline fw-semibold">Giỏ hàng</span>
              {cart.totalQuantity > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cart.totalQuantity}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle rounded-pill px-3 py-2 d-flex align-items-center border"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5 me-2 text-primary"></i>
                  <span className="fw-semibold text-truncate" style={{ maxWidth: '120px' }}>
                    {currentUser.fullName || currentUser.username}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                  <li className="px-3 py-2 text-muted small border-bottom">
                    <div>Xin chào, <strong>{currentUser.fullName}</strong></div>
                    <span className={`badge ${currentUser.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                      {currentUser.role === 'ADMIN' ? 'Quản Trị Viên' : 'Khách Hàng'}
                    </span>
                  </li>
                  {isAdmin() && (
                    <li>
                      <Link className="dropdown-item py-2 text-danger fw-semibold" to="/admin">
                        <i className="bi bi-speedometer2 me-2"></i> Trang Quản Trị Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item py-2" to="/orders">
                      <i className="bi bi-bag-check me-2"></i> Đơn hàng của tôi
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-primary rounded-pill px-3 py-2 fw-semibold d-none d-sm-inline-block">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <nav className="category-nav d-none d-lg-block">
        <div className="container">
          <ul className="nav nav-pills py-1">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/products' && !location.search ? 'active' : ''}`}
                to="/products"
              >
                <i className="bi bi-grid-fill me-1"></i> Tất Cả Sản Phẩm
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id} className="nav-item">
                <Link
                  className={`nav-link ${location.search.includes(`categoryId=${cat.id}`) ? 'active' : ''}`}
                  to={`/products?categoryId=${cat.id}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu');
      return;
    }

    const res = await login(username.trim(), password);
    if (res.success) {
      if (res.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (redirect === 'checkout') {
        navigate('/checkout');
      } else {
        navigate('/');
      }
    } else {
      setError(res.message);
    }
  };

  const fillCredentials = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none d-inline-flex align-items-center mb-2">
                <i className="bi bi-cpu-fill text-primary fs-1 me-2"></i>
                <span className="fs-3 fw-bold text-dark">Tech<span className="text-primary">Store</span></span>
              </Link>
              <h4 className="fw-bold mb-1">Đăng Nhập Tài Khoản</h4>
              <p className="text-muted small">Chào mừng bạn trở lại với TechStore</p>
            </div>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show small py-2" role="alert">
                <i className="bi bi-exclamation-circle me-1"></i> {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Tên đăng nhập</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Mật khẩu</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 rounded-pill fw-semibold shadow-sm mb-3"
                disabled={loading}
              >
                {loading ? (
                  <span><span className="spinner-border spinner-border-sm me-2"></span>Đang đăng nhập...</span>
                ) : (
                  <span>Đăng Nhập Ngay</span>
                )}
              </button>
            </form>

            <div className="p-3 bg-light rounded-3 mb-3 small">
              <div className="fw-bold text-secondary mb-2 text-uppercase" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-lightning-charge text-warning me-1"></i> Điền nhanh tài khoản dùng thử demo:
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary flex-grow-1 rounded-pill"
                  onClick={() => fillCredentials('customer', '123456')}
                >
                  Khách Hàng (customer)
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger flex-grow-1 rounded-pill"
                  onClick={() => fillCredentials('admin', 'admin123')}
                >
                  Quản Trị (admin)
                </button>
              </div>
            </div>

            <div className="text-center small text-muted">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

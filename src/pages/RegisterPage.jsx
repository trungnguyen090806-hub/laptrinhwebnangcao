import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Vui lòng điền các trường thông tin bắt buộc (*)');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải từ 6 ký tự trở lên');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      address: formData.address.trim(),
    };

    const res = await register(payload);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none d-inline-flex align-items-center mb-2">
                <i className="bi bi-cpu-fill text-primary fs-1 me-2"></i>
                <span className="fs-3 fw-bold text-dark">Tech<span className="text-primary">Store</span></span>
              </Link>
              <h4 className="fw-bold mb-1">Đăng Ký Tài Khoản Mới</h4>
              <p className="text-muted small">Tạo tài khoản để trải nghiệm mua sắm nhanh chóng</p>
            </div>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show small py-2" role="alert">
                <i className="bi bi-exclamation-circle me-1"></i> {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Họ và tên <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    placeholder="Ví dụ: Trần Văn Nam"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Tên đăng nhập <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Chọn username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Mật khẩu <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    placeholder="0912345678"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    placeholder="Số nhà, đường, quận/huyện..."
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 rounded-pill fw-semibold shadow-sm mb-3"
                disabled={loading}
              >
                {loading ? (
                  <span><span className="spinner-border spinner-border-sm me-2"></span>Đang tạo tài khoản...</span>
                ) : (
                  <span>Đăng Ký Tài Khoản</span>
                )}
              </button>
            </form>

            <div className="text-center small text-muted">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function Banner() {
  return (
    <div className="hero-banner shadow-sm my-4">
      <div className="row align-items-center">
        <div className="col-lg-7 text-center text-lg-start mb-4 mb-lg-0">
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3">
            🔥 SIÊU HỘI CÔNG NGHỆ 2026 - GIẢM ĐẾN 40%
          </span>
          <h1 className="display-5 fw-bold mb-3 lh-sm">
            Nâng Tầm Trải Nghiệm Với Thiết Bị Công Nghệ Đỉnh Cao
          </h1>
          <p className="lead mb-4 text-light text-opacity-75 fs-6">
            Khám phá bộ sưu tập Laptop cao cấp, Smartphone thế hệ mới, Bàn phím cơ & Âm thanh đỉnh cao với chính sách bảo hành chính hãng 12 tháng.
          </p>
          <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
            <Link to="/products" className="btn btn-accent btn-lg px-4 rounded-pill shadow-sm">
              <i className="bi bi-bag-check-fill me-2"></i> Mua sắm ngay
            </Link>
            <Link to="/products?categoryId=1" className="btn btn-outline-light btn-lg px-4 rounded-pill">
              Xem Laptop Mới
            </Link>
          </div>
        </div>

        <div className="col-lg-5 text-center">
          <img
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80"
            alt="Hero banner tech"
            className="img-fluid rounded-4 shadow-lg"
            style={{ maxHeight: '320px', objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4 mb-4">

          <div className="col-lg-4 col-md-6">
            <h5 className="d-flex align-items-center mb-3">
              <i className="bi bi-cpu-fill text-primary me-2"></i>
              Tech<span className="text-primary">Store</span>
            </h5>
            <p className="small text-muted mb-3">
              Hệ thống bán lẻ các sản phẩm công nghệ cao cấp chính hãng: Laptop, Smartphone, Âm thanh và Phụ kiện hàng đầu Việt Nam. Cam kết chất lượng và dịch vụ bảo hành chu đáo nhất.
            </p>
            <div className="small mb-2">
              <i className="bi bi-geo-alt me-2 text-primary"></i> 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội
            </div>
            <div className="small mb-2">
              <i className="bi bi-telephone me-2 text-primary"></i> Hotline: 1800 6868 (8:00 - 21:30)
            </div>
            <div className="small">
              <i className="bi bi-envelope me-2 text-primary"></i> Email: support@techstore.vn
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="mb-3 text-uppercase fs-6">Sản phẩm</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/products?categoryId=1">Laptop chính hãng</Link></li>
              <li><Link to="/products?categoryId=2">Điện thoại di động</Link></li>
              <li><Link to="/products?categoryId=3">Tai nghe & Loa</Link></li>
              <li><Link to="/products?categoryId=4">Bàn phím cơ & Chuột</Link></li>
              <li><Link to="/products?categoryId=5">Phụ kiện công nghệ</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="mb-3 text-uppercase fs-6">Chính sách & Hỗ trợ</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="#!">Chính sách bảo hành 12 tháng</a></li>
              <li><a href="#!">Chính sách đổi trả 7 ngày miễn phí</a></li>
              <li><a href="#!">Chính sách giao hàng siêu tốc</a></li>
              <li><a href="#!">Hướng dẫn mua hàng & thanh toán COD</a></li>
              <li><a href="#!">Quy định bảo mật thông tin</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="mb-3 text-uppercase fs-6">Phương thức thanh toán</h6>
            <div className="d-flex gap-2">
              <span className="badge bg-light text-dark p-2 border">💵 COD Nhận hàng</span>
              <span className="badge bg-light text-dark p-2 border">💳 Thẻ ATM / Visa</span>
              <span className="badge bg-light text-dark p-2 border">📲 Ví điện tử</span>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center small text-muted">
          © {new Date().getFullYear()} TechStore. Tất cả các quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}

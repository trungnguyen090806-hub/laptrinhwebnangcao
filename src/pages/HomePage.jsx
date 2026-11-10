import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, prodRes, catRes] = await Promise.all([
          productService.getFeatured(),
          productService.getAll(),
          categoryService.getAll(),
        ]);

        if (featRes.success && featRes.data) setFeaturedProducts(featRes.data);
        if (prodRes.success && prodRes.data) setAllProducts(prodRes.data);
        if (catRes.success && catRes.data) setCategories(catRes.data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container py-3">

      <Banner />

      <div className="row g-3 mb-5">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="feature-box">
            <div className="feature-icon">
              <i className="bi bi-truck"></i>
            </div>
            <div>
              <h6 className="mb-1 fw-bold">Giao Hàng Siêu Tốc</h6>
              <div className="text-muted small">Nhanh chóng trong 2 Giờ</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="feature-box">
            <div className="feature-icon">
              <i className="bi bi-shield-check"></i>
            </div>
            <div>
              <h6 className="mb-1 fw-bold">100% Chính Hãng</h6>
              <div className="text-muted small">Bảo hành 12 tháng chuẩn</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="feature-box">
            <div className="feature-icon">
              <i className="bi bi-arrow-repeat"></i>
            </div>
            <div>
              <h6 className="mb-1 fw-bold">Đổi Trả 7 Ngày</h6>
              <div className="text-muted small">1 đổi 1 nếu phát sinh lỗi</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="feature-box">
            <div className="feature-icon">
              <i className="bi bi-headset"></i>
            </div>
            <div>
              <h6 className="mb-1 fw-bold">Hỗ Trợ Tận Tâm</h6>
              <div className="text-muted small">Hotline 1800 6868 miễn phí</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">
            <i className="bi bi-grid-3x3-gap-fill text-primary me-2"></i>
            Danh Mục Nổi Bật
          </h4>
          <Link to="/products" className="text-primary text-decoration-none fw-medium small">
            Xem tất cả <i className="bi bi-chevron-right"></i>
          </Link>
        </div>

        <div className="row g-3">
          {categories.map((cat) => (
            <div key={cat.id} className="col-6 col-md-4 col-lg">
              <Link
                to={`/products?categoryId=${cat.id}`}
                className="card text-decoration-none border shadow-sm rounded-3 overflow-hidden text-center p-3 h-100 hover-shadow bg-white d-flex flex-column align-items-center justify-content-center"
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="rounded-circle mb-2"
                  style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                />
                <h6 className="fw-semibold text-dark mb-0 small">{cat.name}</h6>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold mb-1">
              <i className="bi bi-fire text-danger me-2"></i>
              Sản Phẩm Bán Chạy Nhất
            </h4>
            <div className="text-muted small">Những sản phẩm công nghệ được săn đón nhiều nhất</div>
          </div>
          <Link to="/products" className="btn btn-outline-primary btn-sm rounded-pill px-3">
            Xem thêm <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <div className="mt-2 text-muted">Đang tải sản phẩm...</div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 p-md-5 mb-5 rounded-4 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #1e3a8a 0%, #0d6efd 100%)',
        }}
      >
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-2">ƯU ĐÃI ĐẶC BIỆT</span>
            <h3 className="fw-bold mb-2">Phụ Kiện Công Nghệ & Gaming Gear Giảm Sốc</h3>
            <p className="mb-3 text-light text-opacity-90">Bàn phím cơ, Chuột không dây, Củ sạc nhanh GaN 65W chính hãng giá tốt nhất thị trường.</p>
            <Link to="/products?categoryId=4" className="btn btn-light rounded-pill px-4 fw-semibold text-primary">
              Khám phá ngay <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
          <div className="col-md-4 d-none d-md-block text-center">
            <i className="bi bi-controller display-1 text-white opacity-50"></i>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold mb-1">
              <i className="bi bi-stars text-warning me-2"></i>
              Sản Phẩm Mới Về
            </h4>
            <div className="text-muted small">Cập nhật xu hướng công nghệ mới nhất hôm nay</div>
          </div>
          <Link to="/products" className="btn btn-outline-primary btn-sm rounded-pill px-3">
            Tất cả sản phẩm <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {allProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

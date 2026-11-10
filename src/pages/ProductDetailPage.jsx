import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const res = await productService.getById(id);
        if (res.success && res.data) {
          setProduct(res.data);

          if (res.data.category && res.data.category.id) {
            const relatedRes = await productService.getAll({ categoryId: res.data.category.id });
            if (relatedRes.success && relatedRes.data) {
              setRelatedProducts(relatedRes.data.filter(p => p.id !== res.data.id).slice(0, 4));
            }
          }
        }
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && product && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    setAdding(true);
    const result = await addToCart(product, quantity);
    setAdding(false);

    if (result.success) {
      setToastMessage('Đã thêm sản phẩm vào giỏ hàng thành công!');
      setTimeout(() => setToastMessage(''), 3000);
    } else {
      alert(result.message);
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.stock <= 0) return;
    setAdding(true);
    const result = await addToCart(product, quantity);
    setAdding(false);

    if (result.success) {
      navigate('/checkout');
    } else {
      alert(result.message);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <div className="mt-2 text-muted">Đang tải thông tin sản phẩm...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h4>Không tìm thấy sản phẩm!</h4>
        <Link to="/products" className="btn btn-primary rounded-pill mt-3">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">

      {toastMessage && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {toastMessage}
          <Link to="/cart" className="fw-bold text-success ms-2 text-decoration-underline">Xem giỏ hàng ngay</Link>
          <button type="button" className="btn-close" onClick={() => setToastMessage('')}></button>
        </div>
      )}

      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang chủ</Link></li>
          <li className="breadcrumb-item">
            <Link to={`/products?categoryId=${product.category?.id}`} className="text-decoration-none">
              {product.category?.name || 'Sản phẩm'}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="card border-0 shadow-sm rounded-4 p-4 mb-5">
        <div className="row g-5">

          <div className="col-lg-5 text-center">
            <div className="rounded-3 border overflow-hidden p-2 bg-light">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="img-fluid rounded"
                style={{ maxHeight: '420px', width: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
          </div>

          <div className="col-lg-7">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
              {product.category?.name}
            </span>

            <h2 className="fw-bold mb-3">{product.name}</h2>

            <div className="d-flex align-items-center mb-3">
              <span className="display-6 fw-bold text-danger me-3">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 ? (
                <span className="badge badge-stock-in px-3 py-2 rounded-pill">
                  <i className="bi bi-check-circle-fill me-1"></i> Còn {product.stock} sản phẩm
                </span>
              ) : (
                <span className="badge badge-stock-out px-3 py-2 rounded-pill">
                  <i className="bi bi-x-circle-fill me-1"></i> Tạm hết hàng
                </span>
              )}
            </div>

            <p className="text-muted mb-4 lead fs-6" style={{ whiteSpace: 'pre-line' }}>
              {product.description || 'Sản phẩm chính hãng với tiêu chuẩn chất lượng cao, độ bền vượt trội và bảo hành uy tín.'}
            </p>

            {product.stock > 0 && (
              <div className="d-flex align-items-center mb-4">
                <span className="fw-semibold me-3">Số lượng:</span>
                <div className="input-group" style={{ width: '130px' }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control text-center fw-bold"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>
            )}

            <div className="d-flex flex-wrap gap-3 mb-4">
              <button
                className="btn btn-outline-primary btn-lg rounded-pill px-4 fw-semibold d-flex align-items-center"
                onClick={handleAddToCart}
                disabled={adding || product.stock <= 0}
              >
                <i className="bi bi-cart-plus me-2 fs-5"></i>
                Thêm vào giỏ hàng
              </button>

              <button
                className="btn btn-accent btn-lg rounded-pill px-4 fw-semibold shadow-sm"
                onClick={handleBuyNow}
                disabled={adding || product.stock <= 0}
              >
                <i className="bi bi-lightning-charge-fill me-1"></i>
                Mua ngay
              </button>
            </div>

            <div className="border rounded-3 p-3 bg-light">
              <div className="row g-2 text-muted small">
                <div className="col-sm-6 d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                  <span>Cam kết chính hãng 100%</span>
                </div>
                <div className="col-sm-6 d-flex align-items-center">
                  <i className="bi bi-truck text-primary me-2 fs-5"></i>
                  <span>Giao hàng COD toàn quốc</span>
                </div>
                <div className="col-sm-6 d-flex align-items-center">
                  <i className="bi bi-arrow-repeat text-warning me-2 fs-5"></i>
                  <span>1 đổi 1 trong vòng 7 ngày</span>
                </div>
                <div className="col-sm-6 d-flex align-items-center">
                  <i className="bi bi-shield-lock text-info me-2 fs-5"></i>
                  <span>Bảo hành chính hãng 12 tháng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mb-4">
          <h4 className="fw-bold mb-3">
            <i className="bi bi-collection text-primary me-2"></i>
            Sản Phẩm Tương Tự
          </h4>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
            {relatedProducts.map((relProd) => (
              <div key={relProd.id} className="col">
                <ProductCard product={relProd} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

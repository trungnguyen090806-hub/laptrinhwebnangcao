import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentKeyword = searchParams.get('keyword') || '';
  const currentCategoryId = searchParams.get('categoryId') || '';
  const currentSort = searchParams.get('sort') || '';

  useEffect(() => {
    categoryService.getAll()
      .then(res => {
        if (res.success && res.data) setCategories(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productService.getAll({
          keyword: currentKeyword,
          categoryId: currentCategoryId ? Number(currentCategoryId) : undefined,
          sort: currentSort,
        });
        if (res.success && res.data) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentKeyword, currentCategoryId, currentSort]);

  const handleCategorySelect = (id) => {
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set('categoryId', id);
    } else {
      params.delete('categoryId');
    }
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const sortVal = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (sortVal) {
      params.set('sort', sortVal);
    } else {
      params.delete('sort');
    }
    setSearchParams(params);
  };

  const handleResetFilter = () => {
    setSearchParams({});
  };

  return (
    <div className="container py-4">

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Trang chủ</a></li>
          <li className="breadcrumb-item active" aria-current="page">Danh sách sản phẩm</li>
        </ol>
      </nav>

      <div className="row g-4">

        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 sticky-top" style={{ top: '90px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-funnel-fill text-primary me-2"></i>Bộ Lọc
              </h5>
              {(currentCategoryId || currentKeyword || currentSort) && (
                <button className="btn btn-sm text-danger p-0 fw-medium" onClick={handleResetFilter}>
                  <i className="bi bi-x-circle me-1"></i>Xóa lọc
                </button>
              )}
            </div>

            <div className="mb-4">
              <h6 className="fw-semibold text-secondary small text-uppercase mb-2">Danh mục</h6>
              <div className="list-group list-group-flush">
                <button
                  type="button"
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 px-2 py-2 rounded ${
                    !currentCategoryId ? 'bg-primary text-white fw-bold' : ''
                  }`}
                  onClick={() => handleCategorySelect('')}
                >
                  <span>Tất cả sản phẩm</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 px-2 py-2 rounded ${
                      currentCategoryId === String(cat.id) ? 'bg-primary text-white fw-bold' : ''
                    }`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h6 className="fw-semibold text-secondary small text-uppercase mb-2">Sắp xếp theo giá</h6>
              <select
                className="form-select"
                value={currentSort}
                onChange={handleSortChange}
              >
                <option value="">Mặc định (Mới nhất)</option>
                <option value="asc">Giá: Thấp đến Cao ⬆</option>
                <option value="desc">Giá: Cao đến Thấp ⬇</option>
              </select>
            </div>
          </div>
        </div>

        <div className="col-lg-9">

          <div className="card border-0 shadow-sm rounded-3 p-3 mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <h4 className="fw-bold mb-1">
                  {currentCategoryId
                    ? categories.find(c => String(c.id) === currentCategoryId)?.name || 'Danh mục sản phẩm'
                    : 'Tất Cả Sản Phẩm'}
                </h4>
                <div className="text-muted small">
                  Tìm thấy <strong>{products.length}</strong> sản phẩm công nghệ
                  {currentKeyword && (
                    <span> cho từ khóa "<strong>{currentKeyword}</strong>"</span>
                  )}
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {currentKeyword && (
                  <span className="badge bg-light text-dark border p-2">
                    Từ khóa: "{currentKeyword}"
                  </span>
                )}
                {currentSort === 'asc' && (
                  <span className="badge bg-light text-dark border p-2">
                    Giá: Thấp đến Cao
                  </span>
                )}
                {currentSort === 'desc' && (
                  <span className="badge bg-light text-dark border p-2">
                    Giá: Cao đến Thấp
                  </span>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <div className="mt-2 text-muted">Đang tìm sản phẩm phù hợp...</div>
            </div>
          ) : products.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
              {products.map((product) => (
                <div key={product.id} className="col">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 text-center py-5">
              <div className="card-body">
                <i className="bi bi-search display-3 text-muted opacity-50 mb-3 d-block"></i>
                <h5 className="fw-bold text-dark mb-2">Không tìm thấy sản phẩm nào!</h5>
                <p className="text-muted mb-4">
                  Rất tiếc, không có sản phẩm nào khớp với bộ lọc hiện tại của bạn.
                </p>
                <button className="btn btn-primary rounded-pill px-4" onClick={handleResetFilter}>
                  <i className="bi bi-arrow-clockwise me-1"></i> Xem tất cả sản phẩm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

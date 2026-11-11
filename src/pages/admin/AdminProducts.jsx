import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: '',
    categoryId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: '', message: '' });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);

      if (prodRes.success && prodRes.data) setProducts(prodRes.data);
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: catRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      price: '',
      stock: 10,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      categoryId: categories.length > 0 ? categories[0].id : '',
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      imageUrl: product.imageUrl,
      categoryId: product.category?.id || (categories.length > 0 ? categories[0].id : ''),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlertInfo({ type: '', message: '' });

    try {
      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        categoryId: Number(formData.categoryId),
      };

      if (isEditing) {
        const res = await productService.update(currentId, payload);
        if (res.success) {
          setAlertInfo({ type: 'success', message: 'Cập nhật sản phẩm thành công!' });
          closeModal();
          loadData();
        }
      } else {
        const res = await productService.create(payload);
        if (res.success) {
          setAlertInfo({ type: 'success', message: 'Thêm mới sản phẩm thành công!' });
          closeModal();
          loadData();
        }
      }
    } catch (err) {
      setAlertInfo({ type: 'danger', message: err.message || 'Lỗi khi lưu sản phẩm' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`)) {
      try {
        const res = await productService.delete(id);
        if (res.success) {
          setAlertInfo({ type: 'success', message: 'Đã xóa sản phẩm thành công!' });
          loadData();
        }
      } catch (err) {
        setAlertInfo({ type: 'danger', message: err.message || 'Không thể xóa sản phẩm' });
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchKeyword = !filterKeyword || p.name.toLowerCase().includes(filterKeyword.toLowerCase());
    const matchCat = !filterCategory || String(p.category?.id) === filterCategory;
    return matchKeyword && matchCat;
  });

  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-laptop text-primary me-2"></i> Quản Lý Sản Phẩm
          </h3>
          <p className="text-muted small mb-0">Thêm mới, cập nhật và quản lý danh sách sản phẩm bày bán</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-2"></i> Thêm Sản Phẩm Mới
        </button>
      </div>

      {alertInfo.message && (
        <div className={`alert alert-${alertInfo.type} alert-dismissible fade show shadow-sm mb-4`} role="alert">
          <i className="bi bi-info-circle-fill me-2"></i> {alertInfo.message}
          <button type="button" className="btn-close" onClick={() => setAlertInfo({ type: '', message: '' })}></button>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo tên sản phẩm..."
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">-- Tất cả danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2 text-end">
            <span className="badge bg-light text-dark border p-2 w-100">
              Tổng: {filteredProducts.length} sản phẩm
            </span>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" className="ps-4">ID</th>
                <th scope="col">Hình ảnh</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Danh mục</th>
                <th scope="col" className="text-end">Giá bán</th>
                <th scope="col" className="text-center">Tồn kho</th>
                <th scope="col" className="text-center pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                    Đang tải danh sách...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Không tìm thấy sản phẩm nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="ps-4 fw-bold text-muted">#{p.id}</td>
                    <td>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="rounded border"
                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{p.name}</div>
                      <div className="small text-muted text-truncate" style={{ maxWidth: '280px' }}>
                        {p.description}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {p.category?.name || 'Chưa phân loại'}
                      </span>
                    </td>
                    <td className="text-end fw-bold text-danger">
                      {formatPrice(p.price)}
                    </td>
                    <td className="text-center">
                      {p.stock > 0 ? (
                        <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1">
                          {p.stock}
                        </span>
                      ) : (
                        <span className="badge bg-danger bg-opacity-10 text-danger fw-bold px-2 py-1">
                          Hết hàng
                        </span>
                      )}
                    </td>
                    <td className="text-center pe-4">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary rounded-circle"
                          onClick={() => openEditModal(p)}
                          title="Sửa thông tin"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-circle"
                          onClick={() => handleDelete(p.id, p.name)}
                          title="Xóa sản phẩm"
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  {isEditing ? '✏️ Chỉnh Sửa Sản Phẩm' : '➕ Thêm Sản Phẩm Mới'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label fw-semibold">Tên sản phẩm <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: Laptop Dell XPS 13"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Danh mục <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Giá bán (VNĐ) <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="1000"
                        placeholder="Ví dụ: 25000000"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Số lượng tồn kho <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="Ví dụ: 20"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Đường dẫn hình ảnh (URL) <span className="text-danger">*</span></label>
                      <input
                        type="url"
                        className="form-control"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        required
                      />
                      {formData.imageUrl && (
                        <div className="mt-2 text-center">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ height: '90px', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Mô tả cấu hình & chi tiết</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Mô tả chip xử lý, RAM, SSD, màn hình hoặc tính năng nổi bật..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top p-3">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={closeModal}>
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                    disabled={submitting}
                  >
                    {submitting ? 'Đang lưu...' : (isEditing ? 'Lưu Thay Đổi' : 'Thêm Sản Phẩm')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

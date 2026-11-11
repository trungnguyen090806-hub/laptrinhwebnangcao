import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: '', message: '' });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAll();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80',
    });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setCurrentId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
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
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
      };

      if (isEditing) {
        const res = await categoryService.update(currentId, payload);
        if (res.success) {
          setAlertInfo({ type: 'success', message: 'Cập nhật danh mục thành công!' });
          closeModal();
          loadCategories();
        }
      } else {
        const res = await categoryService.create(payload);
        if (res.success) {
          setAlertInfo({ type: 'success', message: 'Thêm danh mục mới thành công!' });
          closeModal();
          loadCategories();
        }
      }
    } catch (err) {
      setAlertInfo({ type: 'danger', message: err.message || 'Lỗi khi lưu danh mục' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"? Các sản phẩm thuộc danh mục này cũng có thể bị ảnh hưởng.`)) {
      try {
        const res = await categoryService.delete(id);
        if (res.success) {
          setAlertInfo({ type: 'success', message: 'Đã xóa danh mục thành công!' });
          loadCategories();
        }
      } catch (err) {
        setAlertInfo({ type: 'danger', message: err.message || 'Không thể xóa danh mục' });
      }
    }
  };

  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-tags text-primary me-2"></i> Quản Lý Danh Mục
          </h3>
          <p className="text-muted small mb-0">Thiết lập các nhóm ngành hàng sản phẩm công nghệ</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-2"></i> Thêm Danh Mục Mới
        </button>
      </div>

      {alertInfo.message && (
        <div className={`alert alert-${alertInfo.type} alert-dismissible fade show shadow-sm mb-4`} role="alert">
          <i className="bi bi-info-circle-fill me-2"></i> {alertInfo.message}
          <button type="button" className="btn-close" onClick={() => setAlertInfo({ type: '', message: '' })}></button>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" className="ps-4">ID</th>
                <th scope="col">Hình ảnh</th>
                <th scope="col">Tên danh mục</th>
                <th scope="col">Mô tả</th>
                <th scope="col" className="text-center pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                    Đang tải danh mục...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="ps-4 fw-bold text-muted">#{cat.id}</td>
                    <td>
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="rounded-circle border"
                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80';
                        }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{cat.name}</div>
                    </td>
                    <td>
                      <span className="text-muted small">{cat.description || 'Không có mô tả'}</span>
                    </td>
                    <td className="text-center pe-4">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary rounded-circle"
                          onClick={() => openEditModal(cat)}
                          title="Sửa danh mục"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-circle"
                          onClick={() => handleDelete(cat.id, cat.name)}
                          title="Xóa danh mục"
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  {isEditing ? '✏️ Chỉnh Sửa Danh Mục' : '➕ Thêm Danh Mục Mới'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Tên danh mục <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Laptop & Máy tính xách tay"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Đường dẫn hình ảnh (URL)</label>
                    <input
                      type="url"
                      className="form-control"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label fw-semibold">Mô tả tóm tắt</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Mô tả các mặt hàng trong danh mục này..."
                    ></textarea>
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
                    {submitting ? 'Đang lưu...' : (isEditing ? 'Lưu Thay Đổi' : 'Thêm Danh Mục')}
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

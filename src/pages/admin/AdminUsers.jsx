import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  useEffect(() => {
    adminService.getUsers()
      .then(res => {
        if (res.success && res.data) setUsers(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.username?.toLowerCase().includes(term) ||
      u.fullName?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-people text-primary me-2"></i> Quản Lý Người Dùng
          </h3>
          <p className="text-muted small mb-0">Danh sách tài khoản khách hàng và quản trị viên đã đăng ký</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm theo username, họ tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            <span className="badge bg-light text-dark border p-2">
              Tổng số: {filteredUsers.length} tài khoản
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
                <th scope="col">Tên đăng nhập</th>
                <th scope="col">Họ và tên</th>
                <th scope="col">Email</th>
                <th scope="col">Số điện thoại</th>
                <th scope="col">Địa chỉ</th>
                <th scope="col" className="text-center">Vai trò</th>
                <th scope="col" className="text-center pe-4">Ngày đăng ký</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    Không tìm thấy tài khoản người dùng nào.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="ps-4 fw-bold text-muted">#{user.id}</td>
                    <td>
                      <span className="fw-bold text-primary">{user.username}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{user.fullName}</div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || <span className="text-muted fst-italic">Chưa cập nhật</span>}</td>
                    <td>
                      <span className="text-truncate d-inline-block small" style={{ maxWidth: '200px' }} title={user.address}>
                        {user.address || <span className="text-muted fst-italic">Chưa có</span>}
                      </span>
                    </td>
                    <td className="text-center">
                      {user.role === 'ADMIN' ? (
                        <span className="badge bg-danger rounded-pill px-3 py-1">Quản Trị Viên</span>
                      ) : (
                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1">Khách Hàng</span>
                      )}
                    </td>
                    <td className="text-center text-muted small pe-4">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

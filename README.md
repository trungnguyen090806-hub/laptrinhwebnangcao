## 1. CÔNG NGHỆ SỬ DỤNG

### Frontend:
- **ReactJS 18** (kiến trúc Component, Hooks, Context API).
- **Vite** (công cụ build và dev server tốc độ cao).
- **React Router DOM v6** (định tuyến Single Page Application).
- **Axios** (gọi RESTful API).
- **Bootstrap 5.3 & Bootstrap Icons** (giao diện hiện đại, responsive máy tính, tablet, điện thoại).
- **Custom CSS** (màu chủ đạo xanh dương `#0d6efd`, điểm nhấn cam `#ff6b00`, nền xám nhạt `#f8fafc`).

### Backend:
- **Java Spring Boot 3.2.5** (chuẩn mô hình 3 lớp: Controller, Service, Repository).
- **Spring Web** (xây dựng các RESTful API).
- **Spring Data JPA & Hibernate** (ORM ánh xạ thực thể xuống bảng MySQL).
- **MySQL Connector Java** (kết nối cơ sở dữ liệu MySQL).
- **Bean Validation** (kiểm tra tính hợp lệ của dữ liệu đầu vào).
- **Apache Maven** (quản lý thư viện và vòng đời dự án).

### Cơ sở dữ liệu:
- **MySQL 8.0** gồm đúng **7 bảng chuẩn**: `users`, `categories`, `products`, `carts`, `cart_items`, `orders`, `order_items`.

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```
Webb/
├── backend/                       
│   ├── src/main/java/com/ecommerce/
│   │   ├── config/               
│   │   ├── controller/           
│   │   ├── dto/                  
│   │   ├── entity/               
│   │   ├── repository/            
│   │   ├── service/             
│   │   └── EcommerceApplication.java 
│   ├── src/main/resources/
│   │   └── application.properties 
│   └── pom.xml                   
│
├── frontend/                      
│   ├── public/                    
│   ├── src/
│   │   ├── components/           
│   │   ├── context/              
│   │   ├── pages/                
│   │   │   └── admin/             
│   │   ├── services/              
│   │   ├── App.jsx               
│   │   ├── App.css               
│   │   └── main.jsx               
│   ├── package.json
│   └── vite.config.js
│
├── database/                    
│   ├── schema.sql                
│   └── data.sql                
│
├── run-backend.bat              
├── run-frontend.bat              
└── README.md                      
```

---

## 3. TÀI KHOẢN MẪU ĐỂ DEMO

Hệ thống đã có sẵn 2 tài khoản mẫu (trên trang Đăng nhập có cả nút **"Điền nhanh"** 1-click):

| Vai trò | Tên đăng nhập (Username) | Mật khẩu (Password) | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản Trị Viên (Admin)** | `admin` | `admin123` | Toàn quyền xem Dashboard, Quản lý Sản phẩm, Danh mục, Đơn hàng, Người dùng |
| **Khách Hàng (Customer)** | `customer` | `123456` | Mua hàng, Giỏ hàng, Đặt hàng COD, Lịch sử đơn hàng |

---

## 4. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN

### Bước 1: Khởi động MySQL
1. Khởi động MySQL Server (qua XAMPP, MySQL Workbench hoặc Services trong Windows).
2. Tạo cơ sở dữ liệu và nạp dữ liệu bằng **1 trong 2 cách**:
   - **Cách 1 (Nên dùng):** Mở MySQL Workbench hoặc Command Line, chạy file:
     - `database/schema.sql` (tạo database và 7 bảng).
     - `database/data.sql` (nạp 15 sản phẩm công nghệ và tài khoản).
   - **Cách 2 (Tự động):** Không cần chạy file SQL! Khi bạn khởi động Backend Spring Boot, lớp `DataInitializer.java` sẽ **tự động kiểm tra và nạp toàn bộ 15 sản phẩm, danh mục và tài khoản mẫu vào MySQL** nếu bảng đang trống.

### Bước 2: Cấu hình kết nối MySQL trong Backend
Mở file `backend/src/main/resources/application.properties`, kiểm tra thông số kết nối:
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=123456   <-- Đổi thành mật khẩu MySQL trên máy của bạn (hoặc để trống nếu không có mật khẩu)
```

### Bước 3: Khởi chạy Backend (Spring Boot)
- **Cách nhanh:** Nhấp đúp chuột vào file `run-backend.bat`.
- **Hoặc chạy bằng dòng lệnh terminal:**
  ```powershell
  cd backend
  mvn spring-boot:run
  ```
- Backend sẽ chạy tại: **http://localhost:8080**

### Bước 4: Khởi chạy Frontend (ReactJS)
- **Cách nhanh:** Nhấp đúp chuột vào file `run-frontend.bat`.
- **Hoặc chạy bằng dòng lệnh terminal:**
  ```powershell
  cd frontend
  npm install   # (chỉ cần chạy lần đầu)
  npm run dev
  ```
- Frontend sẽ chạy tại: **http://localhost:5173**

---

## 5. DANH SÁCH RESTFUL API HỆ THỐNG

### Xác thực & Tài khoản (`/api/auth`)
| Method | Endpoint | Chức năng |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Đăng ký tài khoản mới (tự tạo giỏ hàng rỗng) |
| `POST` | `/api/auth/login` | Đăng nhập tài khoản |
| `GET` | `/api/auth/profile/{userId}` | Lấy thông tin cá nhân |
| `GET` | `/api/auth/users` | Lấy danh sách tất cả tài khoản |

### Danh mục sản phẩm (`/api/categories`)
| Method | Endpoint | Chức năng |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Lấy danh sách tất cả danh mục |
| `GET` | `/api/categories/{id}` | Lấy chi tiết danh mục |
| `POST` | `/api/categories` | Thêm danh mục mới (Admin) |
| `PUT` | `/api/categories/{id}` | Cập nhật danh mục (Admin) |
| `DELETE` | `/api/categories/{id}` | Xóa danh mục (Admin) |

### Sản phẩm (`/api/products`)
| Method | Endpoint | Chức năng |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Lấy danh sách sản phẩm (hỗ trợ `?keyword=...&categoryId=...&sort=asc\|desc`) |
| `GET` | `/api/products/featured` | Lấy các sản phẩm nổi bật cho trang chủ |
| `GET` | `/api/products/{id}` | Lấy thông tin chi tiết sản phẩm |
| `POST` | `/api/products` | Thêm sản phẩm mới (Admin) |
| `PUT` | `/api/products/{id}` | Sửa thông tin sản phẩm (Admin) |
| `DELETE` | `/api/products/{id}` | Xóa sản phẩm (Admin) |

### Giỏ hàng (`/api/cart`)
| Method | Endpoint | Chức năng |
| :--- | :--- | :--- |
| `GET` | `/api/cart/{userId}` | Xem giỏ hàng của người dùng kèm tổng tiền |
| `POST` | `/api/cart/add` | Thêm sản phẩm vào giỏ hàng |
| `PUT` | `/api/cart/items/{itemId}` | Cập nhật số lượng món hàng trong giỏ |
| `DELETE` | `/api/cart/items/{itemId}` | Xóa một món hàng khỏi giỏ |
| `DELETE` | `/api/cart/clear/{userId}` | Làm sạch toàn bộ giỏ hàng |

### Đơn đặt hàng (`/api/orders`)
| Method | Endpoint | Chức năng |
| :--- | :--- | :--- |
| `POST` | `/api/orders` | Đặt hàng từ giỏ (tự động trừ số lượng tồn kho) |
| `GET` | `/api/orders/user/{userId}` | Xem lịch sử đơn hàng của người dùng |
| `GET` | `/api/orders/{id}` | Xem chi tiết 1 đơn hàng |
| `GET` | `/api/orders` | Lấy danh sách toàn bộ đơn hàng (Admin) |
| `PUT` | `/api/orders/{id}/status` | Cập nhật trạng thái đơn: PENDING $\to$ CONFIRMED $\to$ SHIPPING $\to$ DELIVERED |

### Quản trị & Thống kê (`/api/admin`)
| Method | Endpoint | Chức năng |
| :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Thống kê Dashboard: Doanh thu, Tổng đơn, Tổng sản phẩm, Tổng khách hàng |
| `GET` | `/api/admin/users` | Xem danh sách người dùng cho Admin |

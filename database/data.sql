
USE ecommerce_db;

INSERT INTO users (id, username, password, full_name, email, phone, address, role) VALUES
(1, 'admin', 'admin123', 'Quản Trị Viên', 'admin@ecommerce.com', '0901234567', 'Hà Nội, Việt Nam', 'ADMIN'),
(2, 'customer', '123456', 'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0987654321', 'Số 123 Cầu Giấy, Hà Nội', 'CUSTOMER');

INSERT INTO categories (id, name, description, image_url) VALUES
(1, 'Laptop', 'Laptop văn phòng, đồ họa, gaming từ các thương hiệu hàng đầu', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80'),
(2, 'Điện Thoại', 'Smartphone chính hãng, công nghệ đỉnh cao từ Apple, Samsung, Google', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80'),
(3, 'Tai Nghe & Âm Thanh', 'Tai nghe chống ồn, true wireless, loa bluetooth cao cấp', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80'),
(4, 'Bàn Phím & Chuột', 'Bàn phím cơ, chuột gaming công thái học không dây', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80'),
(5, 'Phụ Kiện Công Nghệ', 'Củ sạc nhanh GaN, cáp sạc cao cấp, cổng chuyển đổi đa năng', 'https://images.unsplash.com/photo-1622445268047-92e76f920fbe?auto=format&fit=crop&w=500&q=80');

INSERT INTO products (id, name, price, stock, description, image_url, category_id) VALUES

(1, 'Apple MacBook Air M2 13.6 inch', 24990000, 25, 'Chip Apple M2 mạnh mẽ với CPU 8 nhân và GPU 8 nhân. RAM 8GB, SSD 256GB. Màn hình Liquid Retina sắc nét, thời lượng pin lên đến 18 giờ.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80', 1),
(2, 'Laptop ASUS ROG Zephyrus G14', 35990000, 15, 'Laptop Gaming siêu mỏng nhẹ. Vi xử lý AMD Ryzen 9 7940HS, Card đồ họa NVIDIA GeForce RTX 4060, 16GB RAM DDR5, 1TB SSD NVMe, màn hình 165Hz.', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80', 1),
(3, 'Dell XPS 13 Plus 9320', 32500000, 18, 'Thiết kế tương lai với bàn di chuột tàng hình. Intel Core i7 1360P, RAM 16GB LPDDR5, SSD 512GB, màn hình 13.4 inch FHD+ InfinityEdge.', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80', 1),

(4, 'iPhone 15 Pro Max 256GB', 29490000, 30, 'Khung viền titan chuẩn hàng không vũ trụ. Chip A17 Pro đỉnh cao, nút Tác Vụ đa năng, camera chính 48MP zoom quang học 5x sắc nét.', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80', 2),
(5, 'Samsung Galaxy S24 Ultra 5G 256GB', 27990000, 20, 'Quyền năng Galaxy AI tiên tiến. Vi xử lý Snapdragon 8 Gen 3 for Galaxy, bút S-Pen tích hợp, camera 200MP đột phá nhiếp ảnh đêm.', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80', 2),
(6, 'Google Pixel 8 Pro 128GB', 19890000, 12, 'Trải nghiệm Android thuần khiết với chip Google Tensor G3. Xử lý ảnh bằng AI cực đỉnh, màn hình Super Actua 120Hz mượt mà.', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80', 2),

(7, 'Tai nghe chống ồn Sony WH-1000XM5', 6890000, 40, 'Công nghệ chống ồn chủ động hàng đầu ngành với bộ xử lý V1 và QN1. Thiết kế nhẹ êm ái, đàm thoại cực rõ, pin bền 30 giờ.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', 3),
(8, 'Tai nghe không dây Apple AirPods Pro 2 USB-C', 5690000, 50, 'Chống ồn chủ động gấp 2 lần thế hệ trước. Chip H2 thông minh, âm thanh không gian cá nhân hóa, cổng sạc Type-C hiện đại.', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80', 3),
(9, 'Loa Bluetooth Marshall Emberton II', 3790000, 22, 'Âm thanh đa hướng 360 độ True Stereophonic đặc trưng của Marshall. Kháng nước bụi IP67, thời lượng pin liên tục hơn 30 giờ.', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80', 3),

(10, 'Chuột không dây Logitech MX Master 3S', 2190000, 35, 'Chuột công thái học cao cấp dành cho lập trình viên và sáng tạo nội dung. Cảm biến 8000 DPI trên mọi bề mặt kính, con lăn điện từ MagSpeed cực êm.', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', 4),
(11, 'Bàn phím cơ Keychron K2 Pro Wireless', 2450000, 28, 'Bàn phím cơ không dây layout 75%, hỗ trợ QMK/VIA tùy biến phím. Hotswap 5 pin, keycap PBT double-shot bền bỉ, kết nối Bluetooth & Type-C.', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', 4),
(12, 'Chuột Gaming Razer DeathAdder V3 Pro', 3190000, 16, 'Trọng lượng siêu nhẹ chỉ 63g. Cảm biến quang học Focus Pro 30K DPI, switch quang học thế hệ 3 siêu nhạy không lo double-click.', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80', 4),

(13, 'Củ sạc nhanh Anker 735 GaNPrime 65W', 990000, 60, 'Công nghệ sạc GaNPrime thế hệ mới nhỏ gọn. 3 cổng sạc tiện lợi (2 USB-C + 1 USB-A), công suất 65W sạc nhanh cho cả laptop và smartphone.', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80', 5),
(14, 'Cổng chuyển Hub Baseus Metal Gleam 8-in-1', 750000, 45, 'Vỏ hợp kim nhôm tản nhiệt tốt. Đầy đủ cổng HDMI 4K@60Hz, 3 cổng USB 3.0, khe đọc thẻ SD/TF, cổng mạng RJ45 Gigabit và sạc Type-C PD 100W.', 'https://images.unsplash.com/photo-1622445268047-92e76f920fbe?auto=format&fit=crop&w=600&q=80', 5),
(15, 'Balo chống nước thời trang Tomtoc Tech Backpack 22L', 1590000, 30, 'Chất liệu vải Cordura quân đội chống thấm nước tuyệt đối. Ngăn bảo vệ laptop 16 inch với công nghệ CornerArmor chống sốc vượt trội.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 5);

INSERT INTO carts (id, user_id) VALUES (1, 2);

INSERT INTO orders (id, user_id, total_amount, status, recipient_name, phone, address, payment_method, note, order_date) VALUES
(1, 2, 27180000, 'DELIVERED', 'Nguyễn Văn An', '0987654321', 'Số 123 Cầu Giấy, Hà Nội', 'COD', 'Giao giờ hành chính', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 2, 6890000, 'CONFIRMED', 'Nguyễn Văn An', '0987654321', 'Số 123 Cầu Giấy, Hà Nội', 'COD', 'Gọi trước khi giao', NOW());

INSERT INTO order_items (id, order_id, product_id, price, quantity) VALUES
(1, 1, 1, 24990000, 1),
(2, 1, 10, 2190000, 1),
(3, 2, 7, 6890000, 1);

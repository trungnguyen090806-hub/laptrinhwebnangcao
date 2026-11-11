package com.ecommerce.config;

import com.ecommerce.entity.*;
import com.ecommerce.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           CartRepository cartRepository,
                           OrderRepository orderRepository,
                           OrderItemRepository orderItemRepository) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {

        if (userRepository.count() == 0) {
            initUsers();
        }
        if (categoryRepository.count() == 0) {
            initCategoriesAndProducts();
        }
    }

    private void initUsers() {
        User admin = new User("admin", "admin123", "Quản Trị Viên", "admin@ecommerce.com", "0901234567", "Hà Nội, Việt Nam", "ADMIN");
        User customer = new User("customer", "123456", "Nguyễn Văn An", "nguyenvanan@gmail.com", "0987654321", "Số 123 Cầu Giấy, Hà Nội", "CUSTOMER");

        userRepository.saveAll(Arrays.asList(admin, customer));

        Cart cart = new Cart(customer);
        cartRepository.save(cart);
    }

    private void initCategoriesAndProducts() {
        Category catLaptop = new Category("Laptop", "Laptop văn phòng, đồ họa, gaming từ các thương hiệu hàng đầu", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80");
        Category catPhone = new Category("Điện Thoại", "Smartphone chính hãng, công nghệ đỉnh cao từ Apple, Samsung, Google", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80");
        Category catAudio = new Category("Tai Nghe & Âm Thanh", "Tai nghe chống ồn, true wireless, loa bluetooth cao cấp", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80");
        Category catPeripherals = new Category("Bàn Phím & Chuột", "Bàn phím cơ, chuột gaming công thái học không dây", "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80");
        Category catAccessories = new Category("Phụ Kiện Công Nghệ", "Củ sạc nhanh GaN, cáp sạc cao cấp, cổng chuyển đổi đa năng", "https://images.unsplash.com/photo-1622445268047-92e76f920fbe?auto=format&fit=crop&w=500&q=80");

        List<Category> savedCats = categoryRepository.saveAll(Arrays.asList(catLaptop, catPhone, catAudio, catPeripherals, catAccessories));

        Category laptop = savedCats.get(0);
        Category phone = savedCats.get(1);
        Category audio = savedCats.get(2);
        Category peripherals = savedCats.get(3);
        Category accessories = savedCats.get(4);

        List<Product> products = Arrays.asList(

                new Product("Apple MacBook Air M2 13.6 inch", new BigDecimal("24990000"), 25, "Chip Apple M2 mạnh mẽ với CPU 8 nhân và GPU 8 nhân. RAM 8GB, SSD 256GB. Màn hình Liquid Retina sắc nét, pin 18 giờ.", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", laptop),
                new Product("Laptop ASUS ROG Zephyrus G14", new BigDecimal("35990000"), 15, "Laptop Gaming mỏng nhẹ. Ryzen 9 7940HS, RTX 4060, 16GB RAM DDR5, 1TB SSD NVMe, màn hình 165Hz.", "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80", laptop),
                new Product("Dell XPS 13 Plus 9320", new BigDecimal("32500000"), 18, "Thiết kế tương lai với touchpad tàng hình. Core i7 1360P, RAM 16GB, SSD 512GB, màn hình 13.4 inch FHD+ InfinityEdge.", "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80", laptop),

                new Product("iPhone 15 Pro Max 256GB", new BigDecimal("29490000"), 30, "Khung viền titan chuẩn hàng không vũ trụ. Chip A17 Pro đỉnh cao, nút Tác Vụ đa năng, camera chính 48MP zoom quang 5x.", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80", phone),
                new Product("Samsung Galaxy S24 Ultra 5G 256GB", new BigDecimal("27990000"), 20, "Quyền năng Galaxy AI tiên tiến. Snapdragon 8 Gen 3 for Galaxy, bút S-Pen tích hợp, camera 200MP đột phá.", "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80", phone),
                new Product("Google Pixel 8 Pro 128GB", new BigDecimal("19890000"), 12, "Trải nghiệm Android thuần khiết với chip Google Tensor G3. Xử lý ảnh AI cực đỉnh, màn hình 120Hz mượt mà.", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80", phone),

                new Product("Tai nghe chống ồn Sony WH-1000XM5", new BigDecimal("6890000"), 40, "Chống ồn chủ động hàng đầu với bộ xử lý V1 và QN1. Thiết kế nhẹ êm ái, đàm thoại cực rõ, pin 30 giờ.", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80", audio),
                new Product("Tai nghe Apple AirPods Pro 2 USB-C", new BigDecimal("5690000"), 50, "Chống ồn chủ động gấp 2 lần. Chip H2 thông minh, âm thanh không gian cá nhân hóa, cổng sạc Type-C.", "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80", audio),
                new Product("Loa Bluetooth Marshall Emberton II", new BigDecimal("3790000"), 22, "Âm thanh đa hướng 360 độ True Stereophonic đặc trưng Marshall. Kháng nước bụi IP67, pin liên tục 30 giờ.", "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80", audio),

                new Product("Chuột không dây Logitech MX Master 3S", new BigDecimal("2190000"), 35, "Chuột công thái học cao cấp cho lập trình viên. Cảm biến 8000 DPI trên mặt kính, cuộn MagSpeed cực êm.", "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80", peripherals),
                new Product("Bàn phím cơ Keychron K2 Pro Wireless", new BigDecimal("2450000"), 28, "Bàn phím cơ layout 75%, hỗ trợ QMK/VIA tùy biến phím. Hotswap 5 pin, keycap PBT double-shot bền bỉ.", "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80", peripherals),
                new Product("Chuột Gaming Razer DeathAdder V3 Pro", new BigDecimal("3190000"), 16, "Trọng lượng siêu nhẹ chỉ 63g. Cảm biến quang học 30K DPI, switch quang học Gen-3 phản hồi 0.2ms.", "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80", peripherals),

                new Product("Củ sạc nhanh Anker 735 GaNPrime 65W", new BigDecimal("990000"), 60, "Công nghệ GaNPrime thế hệ mới siêu nhỏ gọn. 3 cổng sạc tiện lợi, công suất 65W sạc cả laptop và điện thoại.", "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80", accessories),
                new Product("Cổng chuyển Hub Baseus Metal Gleam 8-in-1", new BigDecimal("750000"), 45, "Vỏ nhôm tản nhiệt cao cấp. Đầy đủ HDMI 4K@60Hz, 3 USB 3.0, khe SD/TF, LAN Gigabit và sạc Type-C PD 100W.", "https://images.unsplash.com/photo-1622445268047-92e76f920fbe?auto=format&fit=crop&w=600&q=80", accessories),
                new Product("Balo chống nước Tomtoc Tech Backpack 22L", new BigDecimal("1590000"), 30, "Chất liệu vải Cordura chống nước tuyệt đối. Ngăn laptop 16 inch với công nghệ CornerArmor chống sốc vượt trội.", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", accessories)
        );

        List<Product> savedProducts = productRepository.saveAll(products);

        userRepository.findByUsername("customer").ifPresent(cust -> {
            Order sampleOrder = new Order(
                    cust,
                    new BigDecimal("27180000"),
                    "DELIVERED",
                    "Nguyễn Văn An",
                    "0987654321",
                    "Số 123 Cầu Giấy, Hà Nội",
                    "COD",
                    "Giao trong giờ hành chính"
            );
            sampleOrder.setOrderDate(LocalDateTime.now().minusDays(2));
            Order savedOrder = orderRepository.save(sampleOrder);

            OrderItem item1 = new OrderItem(savedOrder, savedProducts.get(0), savedProducts.get(0).getPrice(), 1);
            OrderItem item2 = new OrderItem(savedOrder, savedProducts.get(9), savedProducts.get(9).getPrice(), 1);
            orderItemRepository.saveAll(Arrays.asList(item1, item2));
        });
    }
}

package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
        System.out.println("==================================================");
        System.out.println("   ECOMMERCE BACKEND ĐÃ KHỞI CHẠY THÀNH CÔNG!     ");
        System.out.println("   Port: http://localhost:8080                    ");
        System.out.println("   Swagger/API Docs: http://localhost:8080/api/   ");
        System.out.println("==================================================");
    }
}

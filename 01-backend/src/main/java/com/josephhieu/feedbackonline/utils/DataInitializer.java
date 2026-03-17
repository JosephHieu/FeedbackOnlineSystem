package com.josephhieu.feedbackonline.utils;

import com.josephhieu.feedbackonline.entity.Admin;
import com.josephhieu.feedbackonline.entity.HocVien;
import com.josephhieu.feedbackonline.repository.AdminRepository;
import com.josephhieu.feedbackonline.repository.HocVienRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final AdminRepository adminRepository;
    private final HocVienRepository hocVienRepository; // Thêm Repository của Học Viên
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Transactional // Đảm bảo dữ liệu được commit xuống Postgres
    public ApplicationRunner initializer() {
        return args -> {
            // 1. Khởi tạo Admin (Bảng ADMIN)
            createAdminIfNotExist("admin", "admin123");

            // 2. Khởi tạo Học viên mẫu (Bảng HOCVIEN)
            // Cấu trúc: username, tên hiển thị, mật khẩu
            createHocVienIfNotExist("hieu123", "Nguyễn Văn Hiếu", "123456");
        };
    }

    private void createAdminIfNotExist(String username, String rawPassword) {
        if (!adminRepository.existsByUsername(username)) {
            Admin admin = Admin.builder()
                    .username(username)
                    .password(passwordEncoder.encode(rawPassword))
                    .build();
            adminRepository.save(admin);
            log.info(">>> [ADMIN] Created: {}", username);
        }
    }

    private void createHocVienIfNotExist(String username, String displayName, String rawPassword) {
        // Kiểm tra tồn tại dựa trên cột Username mới thêm vào pgAdmin
        if (!hocVienRepository.existsByUsername(username)) {
            HocVien hocVien = HocVien.builder()
                    .username(username)
                    .tenHocVien(displayName)
                    .password(passwordEncoder.encode(rawPassword))
                    .status(true)
                    .build();
            hocVienRepository.save(hocVien);
            log.info(">>> [HOCVIEN] Created: {}/{}", username, rawPassword);
        } else {
            log.info(">>> [HOCVIEN] User {} already exists", username);
        }
    }
}
package com.josephhieu.feedbackonline.utils;

import com.josephhieu.feedbackonline.entity.Admin;
import com.josephhieu.feedbackonline.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component; // Dùng Component nếu để ở utils
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public ApplicationRunner initializer() {
        return args -> {
            String username = "admin";
            if (!adminRepository.existsByUsername(username)) {
                Admin admin = Admin.builder()
                        .username(username)
                        .password(passwordEncoder.encode("admin123"))
                        .build();
                adminRepository.save(admin);
                log.info(">>> [UTILS] Created default admin: admin/admin123");
            }
        };
    }
}
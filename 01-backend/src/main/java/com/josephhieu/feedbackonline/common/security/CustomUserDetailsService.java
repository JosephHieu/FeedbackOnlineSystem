package com.josephhieu.feedbackonline.common.security;

import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.entity.Admin;
import com.josephhieu.feedbackonline.entity.HocVien;
import com.josephhieu.feedbackonline.repository.AdminRepository;
import com.josephhieu.feedbackonline.repository.HocVienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final HocVienRepository hocVienRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 1. Check Admin
        Optional<Admin> admin = adminRepository.findByUsername(username);
        if (admin.isPresent()) {
            return CustomUserDetails.builder()
                    .username(admin.get().getUsername())
                    .password(admin.get().getPassword())
                    .role("ROLE_ADMIN")
                    .build();
        }

        // 2. Check Học Viên
        Optional<HocVien> hocVien = hocVienRepository.findByUsername(username);
        if (hocVien.isPresent()) {
            return CustomUserDetails.builder()
                    .username(hocVien.get().getUsername())
                    .password(hocVien.get().getPassword())
                    .role("ROLE_USER")
                    .build();
        }

        throw new AppException(ErrorCode.USER_NOT_EXISTED);
    }
}

package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.common.security.CustomUserDetails;
import com.josephhieu.feedbackonline.common.security.JwtTokenProvider;
import com.josephhieu.feedbackonline.dto.request.LoginRequest;
import com.josephhieu.feedbackonline.dto.request.PasswordChangeRequest;
import com.josephhieu.feedbackonline.dto.response.AuthResponse;
import com.josephhieu.feedbackonline.entity.Admin;
import com.josephhieu.feedbackonline.entity.HocVien;
import com.josephhieu.feedbackonline.repository.AdminRepository;
import com.josephhieu.feedbackonline.repository.HocVienRepository;
import com.josephhieu.feedbackonline.service.AuthService;
import com.josephhieu.feedbackonline.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AdminRepository adminRepository;
    private final HocVienRepository hocVienRepository;
    private final PasswordEncoder passwordEncoder;

    private final RefreshTokenService refreshTokenService;

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 2. Tạo Access Token
            String accessToken = tokenProvider.generateToken(authentication);

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String role = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("ROLE_USER");

            // 3. Tạo và lưu Refresh Token vào Database
            var refreshToken = refreshTokenService.createRefreshToken(userDetails.getUsername(), role);

            log.info("Login successful for user: {}", userDetails.getUsername());

            return AuthResponse.builder()
                    .token(accessToken)
                    .refreshToken(refreshToken.getToken())
                    .username(userDetails.getUsername())
                    .role(role)
                    .build();
        } catch (AuthenticationException e) {
            log.error("Login failed for user: {} - Error: {}", request.getUsername(), e.getMessage());
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    // 4. Implement phương thức refreshToken
    @Override
    @Transactional
    public AuthResponse refreshToken(String requestToken) {
        return refreshTokenService.findByToken(requestToken)
                .map(refreshTokenService::verifyExpiration)
                .map(refreshToken -> {
                    // Cấp Access Token mới dựa trên thông tin trong Refresh Token
                    String newAccessToken = tokenProvider.generateTokenFromUsername(
                            refreshToken.getUsername(),
                            refreshToken.getRole()
                    );

                    log.info("Access Token refreshed for user: {}", refreshToken.getUsername());

                    return AuthResponse.builder()
                            .token(newAccessToken)
                            .refreshToken(refreshToken.getToken())
                            .username(refreshToken.getUsername())
                            .role(refreshToken.getRole())
                            .build();
                })
                .orElseThrow(() -> new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));
    }

    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        // 1. Lấy thông tin từ SecurityContext
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Lấy Role (ADMIN hoặc USER)
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        String currentHashedPassword;
        Object targetEntity;

        // 2. Xác định đối tượng cần đổi mật khẩu
        if (role.equals("ROLE_ADMIN")) {
            Admin admin = adminRepository.findById(username)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            currentHashedPassword = admin.getPassword();
            targetEntity = admin;
        } else {
            HocVien hocVien = hocVienRepository.findByUsername(username)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            currentHashedPassword = hocVien.getPassword();
            targetEntity = hocVien;
        }

        // 3. Logic kiểm tra mật khẩu
        if (!passwordEncoder.matches(request.getOldPassword(), currentHashedPassword)) {
            throw new AppException(ErrorCode.OLD_PASSWORD_NOT_MATCH);
        }

        if (passwordEncoder.matches(request.getNewPassword(), currentHashedPassword)) {
            throw new AppException(ErrorCode.PASSWORD_NOT_CHANGED);
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.CONFIRM_PASSWORD_NOT_MATCH);
        }

        // 4. Cập nhật mật khẩu mới
        String newHashedPassword = passwordEncoder.encode(request.getNewPassword());
        if (targetEntity instanceof Admin admin) {
            admin.setPassword(newHashedPassword);
            adminRepository.save(admin);
        } else if (targetEntity instanceof HocVien hocVien) {
            hocVien.setPassword(newHashedPassword);
            hocVienRepository.save(hocVien);
        }
    }
}

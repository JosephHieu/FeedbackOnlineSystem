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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtTokenProvider tokenProvider;
    @Mock private AdminRepository adminRepository;
    @Mock private HocVienRepository hocVienRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthServiceImpl authService;

    @Nested
    @DisplayName("Tests cho chức năng Login")
    class LoginTests {

        @Test
        @DisplayName("Login thành công - Trả về token và thông tin user")
        void login_Success() {
            LoginRequest request = new LoginRequest("admin", "password123");

            // Khởi tạo userDetails thật với role ROLE_ADMIN
            CustomUserDetails userDetails = new CustomUserDetails("admin", "hashed_pass", "ROLE_ADMIN");

            Authentication authentication = mock(Authentication.class);
            when(authentication.getPrincipal()).thenReturn(userDetails);
            when(authenticationManager.authenticate(any())).thenReturn(authentication);
            when(tokenProvider.generateToken(any())).thenReturn("mocked_jwt_token");

            // 2. WHEN
            AuthResponse response = authService.login(request);

            // 3. THEN
            assertNotNull(response);
            assertEquals("mocked_jwt_token", response.getToken());
            assertEquals("ROLE_ADMIN", response.getRole());
            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        }

        @Test
        @DisplayName("Login thất bại - Sai thông tin đăng nhập ném lỗi UNAUTHENTICATED")
        void login_Failure_WrongCredentials() {
            // GIVEN
            LoginRequest request = new LoginRequest("wrong_user", "wrong_pass");
            when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Invalid credentials"));

            // WHEN & THEN
            AppException ex = assertThrows(AppException.class, () -> authService.login(request));
            assertEquals(ErrorCode.UNAUTHENTICATED, ex.getErrorCode());
        }
    }

    @Nested
    @DisplayName("Tests cho chức năng Đổi mật khẩu")
    class ChangePasswordTests {

        @Test
        @DisplayName("Admin đổi mật khẩu thành công")
        void changePassword_Admin_Success() {
            // GIVEN
            PasswordChangeRequest request = createPwdRequest("old123", "new123", "new123");
            Admin admin = Admin.builder().username("admin_hieu").password("hashed_old").build();

            try (MockedStatic<SecurityContextHolder> mockedSecurity = mockStatic(SecurityContextHolder.class)) {
                setupSecurityContext(mockedSecurity, "admin_hieu", "ROLE_ADMIN");

                when(adminRepository.findById("admin_hieu")).thenReturn(Optional.of(admin));
                when(passwordEncoder.matches("old123", "hashed_old")).thenReturn(true);
                when(passwordEncoder.matches("new123", "hashed_old")).thenReturn(false);
                when(passwordEncoder.encode("new123")).thenReturn("hashed_new");

                // WHEN
                authService.changePassword(request);

                // THEN
                assertEquals("hashed_new", admin.getPassword());
                verify(adminRepository).save(admin);
            }
        }

        @Test
        @DisplayName("Học viên đổi mật khẩu thành công")
        void changePassword_HocVien_Success() {
            // GIVEN
            PasswordChangeRequest request = createPwdRequest("old123", "new123", "new123");
            HocVien hocVien = HocVien.builder().username("student_hieu").password("hashed_old").build();

            try (MockedStatic<SecurityContextHolder> mockedSecurity = mockStatic(SecurityContextHolder.class)) {
                setupSecurityContext(mockedSecurity, "student_hieu", "ROLE_USER");

                when(hocVienRepository.findByUsername("student_hieu")).thenReturn(Optional.of(hocVien));
                when(passwordEncoder.matches("old123", "hashed_old")).thenReturn(true);
                when(passwordEncoder.matches("new123", "hashed_old")).thenReturn(false);
                when(passwordEncoder.encode("new123")).thenReturn("hashed_new");

                // WHEN
                authService.changePassword(request);

                // THEN
                assertEquals("hashed_new", hocVien.getPassword());
                verify(hocVienRepository).save(hocVien);
            }
        }

        @Test
        @DisplayName("Đổi mật khẩu thất bại - Mật khẩu cũ không chính xác")
        void changePassword_Failure_OldPasswordNotMatch() {
            // GIVEN
            PasswordChangeRequest request = createPwdRequest("wrong_old", "new123", "new123");
            Admin admin = Admin.builder().username("admin").password("hashed_old").build();

            try (MockedStatic<SecurityContextHolder> mockedSecurity = mockStatic(SecurityContextHolder.class)) {
                setupSecurityContext(mockedSecurity, "admin", "ROLE_ADMIN");
                when(adminRepository.findById("admin")).thenReturn(Optional.of(admin));
                when(passwordEncoder.matches("wrong_old", "hashed_old")).thenReturn(false);

                // WHEN & THEN
                AppException ex = assertThrows(AppException.class, () -> authService.changePassword(request));
                assertEquals(ErrorCode.OLD_PASSWORD_NOT_MATCH, ex.getErrorCode());
            }
        }
    }

    // --- HELPER METHODS ---

    private PasswordChangeRequest createPwdRequest(String oldP, String newP, String confirmP) {
        PasswordChangeRequest request = new PasswordChangeRequest();
        request.setOldPassword(oldP);
        request.setNewPassword(newP);
        request.setConfirmPassword(confirmP);
        return request;
    }

    private void setupSecurityContext(MockedStatic<SecurityContextHolder> mockedSecurity, String username, String role) {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);

        mockedSecurity.when(SecurityContextHolder::getContext).thenReturn(context);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn(username);

        // Mock getAuthorities().iterator().next().getAuthority()
        var authority = new SimpleGrantedAuthority(role);
        when(auth.getAuthorities()).thenAnswer(inv -> List.of(authority));
    }
}
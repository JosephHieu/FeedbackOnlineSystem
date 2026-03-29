package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.SystemResetRequest;
import com.josephhieu.feedbackonline.dto.response.ChartDataDTO;
import com.josephhieu.feedbackonline.dto.response.DashboardStatsResponse;
import com.josephhieu.feedbackonline.dto.response.SystemResetResponse;
import com.josephhieu.feedbackonline.entity.Admin;
import com.josephhieu.feedbackonline.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceImplTest {

    @Mock private AdminRepository adminRepository;
    @Mock private FeedbackRepository feedbackRepository;
    @Mock private ChiTietFeedbackRepository chiTietFeedbackRepository;
    @Mock private GanTopicRepository ganTopicRepository;
    @Mock private LopRepository lopRepository;
    @Mock private TrainerRepository trainerRepository;
    @Mock private HocVienRepository hocVienRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminServiceImpl adminService;

    private Admin mockAdmin;
    private final String ADMIN_USER = "joseph_admin";

    @BeforeEach
    void setUp() {
        mockAdmin = Admin.builder()
                .username(ADMIN_USER)
                .password("encoded_password")
                .build();
    }

    // --- TEST RESET SYSTEM ---

    @Test
    @DisplayName("Reset hệ thống thành công khi mật khẩu admin chính xác")
    void resetSystem_Success() {
        // GIVEN
        SystemResetRequest request = new SystemResetRequest("correct_password");

        try (MockedStatic<SecurityContextHolder> mockedSecurity = mockStatic(SecurityContextHolder.class)) {
            mockSecurityContext(mockedSecurity);

            when(adminRepository.findByUsername(ADMIN_USER)).thenReturn(Optional.of(mockAdmin));
            when(passwordEncoder.matches(request.getPassword(), mockAdmin.getPassword())).thenReturn(true);

            // Giả lập số lượng bản ghi
            when(chiTietFeedbackRepository.count()).thenReturn(100L);
            when(feedbackRepository.count()).thenReturn(50L);
            when(ganTopicRepository.count()).thenReturn(10L);

            // WHEN
            SystemResetResponse response = adminService.resetSystem(request);

            // THEN
            assertNotNull(response);
            assertEquals(50L, response.getFeedbackCount());
            assertEquals("Reset hệ thống thành công. Dữ liệu khảo sát đã được xóa sạch!", response.getMessage());

            // Xác nhận các hàm xóa được gọi đúng 1 lần
            verify(chiTietFeedbackRepository, times(1)).deleteAllInBatch();
            verify(feedbackRepository, times(1)).deleteAllInBatch();
            verify(ganTopicRepository, times(1)).deleteAllInBatch();
        }
    }

    @Test
    @DisplayName("Reset hệ thống thất bại và ném lỗi khi nhập sai mật khẩu")
    void resetSystem_WrongPassword_ThrowsException() {
        // GIVEN
        SystemResetRequest request = new SystemResetRequest("wrong_password");

        try (MockedStatic<SecurityContextHolder> mockedSecurity = mockStatic(SecurityContextHolder.class)) {
            mockSecurityContext(mockedSecurity);

            when(adminRepository.findByUsername(ADMIN_USER)).thenReturn(Optional.of(mockAdmin));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

            // WHEN & THEN
            AppException exception = assertThrows(AppException.class, () -> adminService.resetSystem(request));
            assertEquals(ErrorCode.RESET_PASSWORD_INVALID, exception.getErrorCode());

            // Xác nhận KHÔNG có bảng nào bị xóa
            verify(feedbackRepository, never()).deleteAllInBatch();
        }
    }

    // --- TEST DASHBOARD STATS ---

    @Test
    @DisplayName("Lấy thống kê Dashboard thành công")
    void getDashboardStats_Success() {
        // GIVEN
        when(lopRepository.count()).thenReturn(5L);
        when(hocVienRepository.count()).thenReturn(100L);
        when(trainerRepository.count()).thenReturn(10L);
        when(feedbackRepository.count()).thenReturn(200L);

        List<ChartDataDTO> mockChart = List.of(
                new ChartDataDTO(LocalDate.now(), 10L),
                new ChartDataDTO(LocalDate.now().minusDays(1), 5L)
        );
        when(feedbackRepository.getFeedbackCountByDate(any())).thenReturn(mockChart);

        // WHEN
        DashboardStatsResponse response = adminService.getDashboardStats();

        // THEN
        assertNotNull(response);
        assertEquals(5L, response.getTotalClasses());
        assertEquals(200L, response.getTotalFeedbacks());
        assertEquals(2, response.getChartData().size());

        verify(feedbackRepository, times(1)).getFeedbackCountByDate(any());
    }

    // Helper method để mock SecurityContextHolder
    private void mockSecurityContext(MockedStatic<SecurityContextHolder> mockedSecurity) {
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);

        mockedSecurity.when(SecurityContextHolder::getContext).thenReturn(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(ADMIN_USER);
    }
}
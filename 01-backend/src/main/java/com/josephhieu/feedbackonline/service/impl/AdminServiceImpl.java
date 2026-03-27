package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.SystemResetRequest;
import com.josephhieu.feedbackonline.dto.response.ChartDataDTO;
import com.josephhieu.feedbackonline.dto.response.DashboardStatsResponse;
import com.josephhieu.feedbackonline.dto.response.SystemResetResponse;
import com.josephhieu.feedbackonline.entity.Admin;
import com.josephhieu.feedbackonline.repository.*;
import com.josephhieu.feedbackonline.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final FeedbackRepository feedbackRepository;
    private final ChiTietFeedbackRepository chiTietFeedbackRepository;
    private final GanTopicRepository ganTopicRepository;
    private final LopRepository lopRepository;
    private final TrainerRepository trainerRepository;
    private final HocVienRepository hocVienRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public SystemResetResponse resetSystem(SystemResetRequest request) {

        // 1. Lấy Username Admin từ Token
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Tìm trong bảng ADMIN
        Admin admin = adminRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // 3. Kiểm tra mật khẩu Admin
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            log.warn("!!! THẤT BẠI: Admin {} nhập sai mật khẩu reset hệ thống", currentUsername);
            throw new AppException(ErrorCode.RESET_PASSWORD_INVALID);
        }

        log.info("ADMIN [{}] bắt đầu thực hiện RESET TOÀN BỘ HỆ THỐNG", currentUsername);

        // logic xóa dữ liệu
        long countDetails = chiTietFeedbackRepository.count();
        long countFeedbacks = feedbackRepository.count();
        long countAssignments = ganTopicRepository.count();

        chiTietFeedbackRepository.deleteAllInBatch();
        feedbackRepository.deleteAllInBatch();
        ganTopicRepository.deleteAllInBatch();

        log.info("Hệ thống đã reset bởi [{}]. Đã xóa {} bản ghi feedback.", currentUsername, countFeedbacks);

        return SystemResetResponse.builder()
                .feedbackCount(countFeedbacks)
                .detailCount(countDetails)
                .assignmentCount(countAssignments)
                .message("Reset hệ thống thành công. Dữ liệu khảo sát đã được xóa sạch!")
                .build();

    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        // 1. Tính toán ngày bắt đầu: 7 ngày trước
        LocalDateTime sevenDaysAgo = java.time.LocalDate.now()
                .minusDays(6)
                .atStartOfDay();

        // 2. Lấy dữ liệu biểu đồ từ Repository
        List<ChartDataDTO> chartData = feedbackRepository.getFeedbackCountByDate(sevenDaysAgo);

        // 3. Trả về toàn bộ thông tin
        return DashboardStatsResponse.builder()
                .totalClasses(lopRepository.count())
                .totalStudents(hocVienRepository.count())
                .totalTrainers(trainerRepository.count())
                .totalFeedbacks(feedbackRepository.count())
                .chartData(chartData)
                .build();
    }
}

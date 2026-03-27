package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.SystemResetRequest;
import com.josephhieu.feedbackonline.dto.response.SystemResetResponse;
import com.josephhieu.feedbackonline.entity.Admin;
import com.josephhieu.feedbackonline.entity.HocVien;
import com.josephhieu.feedbackonline.repository.*;
import com.josephhieu.feedbackonline.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final HocVienRepository hocVienRepository;
    private final FeedbackRepository feedbackRepository;
    private final ChiTietFeedbackRepository chiTietFeedbackRepository;
    private final GanTopicRepository ganTopicRepository;
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
}

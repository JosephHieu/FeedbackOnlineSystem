package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.dto.request.FeedbackRequest;
import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.dto.response.PendingFeedbackResponse;
import com.josephhieu.feedbackonline.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/feedbacks")
@RequiredArgsConstructor
@Slf4j
public class FeedbackController {

    private final FeedbackService feedbackService;

    /**
     * 1. API NỘP BÀI KHẢO SÁT
     * Quyền hạn: Chỉ HỌC VIÊN (ROLE_USER) mới được phép nộp bài.
     */
    @PostMapping("/submit")
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<String> submitFeedback(@RequestBody @Valid FeedbackRequest request) {
        log.info("Processing feedback submission for Student ID: {}", request.getMaHocVien());

        feedbackService.submitFeedback(request);

        return ApiResponse.<String>builder()
                .result("Cảm ơn cưng đã hoàn thành khảo sát! Ý kiến của cưng rất quý báu.")
                .build();
    }

    /**
     * 2. API LẤY DANH SÁCH HỌC VIÊN CHƯA FEEDBACK (Trang cưng gửi hình)
     * Quyền hạn: Chỉ ADMIN (ROLE_ADMIN) mới được xem danh sách này.
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<PendingFeedbackResponse>> getPendingList(
            @RequestParam UUID maLop,
            @RequestParam UUID maTopic) {

        log.info("Admin fetching pending feedback list for Class: {} and Topic: {}", maLop, maTopic);

        List<PendingFeedbackResponse> result = feedbackService.getPendingFeedbackList(maLop, maTopic);

        return ApiResponse.<List<PendingFeedbackResponse>>builder()
                .result(result)
                .build();
    }
}
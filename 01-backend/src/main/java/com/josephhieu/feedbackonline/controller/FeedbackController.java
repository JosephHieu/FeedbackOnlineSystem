package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.dto.request.FeedbackRequest;
import com.josephhieu.feedbackonline.dto.response.PendingFeedbackResponse;
import com.josephhieu.feedbackonline.service.FeedbackService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    /**
     * 1. API NỘP BÀI KHẢO SÁT
     * Quyền hạn: Chỉ HỌC VIÊN (ROLE_USER) mới được phép nộp bài.
     */
    @PostMapping("/submit")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Void>> submitFeedback(
            @RequestBody @Valid FeedbackRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> [POST] Học viên nộp đánh giá cho Topic ID: {} tại Lớp ID: {}",
                request.getMaTopic(), request.getMaLop());

        feedbackService.submitFeedback(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        null,
                        "Cảm ơn bạn đã hoàn thành khảo sát! Ý kiến của bạn đã được ghi nhận.",
                        servletRequest.getRequestURI()));
    }

    /**
     * 2. API LẤY DANH SÁCH HỌC VIÊN CHƯA FEEDBACK
     * Quyền hạn: Chỉ ADMIN (ROLE_ADMIN) mới được xem danh sách này.
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PendingFeedbackResponse>>> getPendingList(
            @RequestParam UUID maLop,
            @RequestParam UUID maTopic,
            HttpServletRequest servletRequest) {

        log.info(">>> [GET] Admin truy vấn danh sách học viên nợ feedback - Lớp: {}, Topic: {}", maLop, maTopic);

        List<PendingFeedbackResponse> result = feedbackService.getPendingFeedbackList(maLop, maTopic);

        return ResponseEntity.ok(ApiResponse.success(
                result,
                "Lấy danh sách học viên chưa đánh giá thành công",
                servletRequest.getRequestURI()));
    }
}
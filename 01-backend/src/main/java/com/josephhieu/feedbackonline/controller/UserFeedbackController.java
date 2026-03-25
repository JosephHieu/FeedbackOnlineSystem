package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.dto.request.FeedbackRequest;
import com.josephhieu.feedbackonline.dto.response.FeedbackResponse;
import com.josephhieu.feedbackonline.dto.response.UserTopicResponse;
import com.josephhieu.feedbackonline.service.FeedbackService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/user/feedbacks")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserFeedbackController {

    private final FeedbackService feedbackService;

    /**
     * 1. Lấy danh sách Topic dành cho học viên đang đăng nhập
     */
    @GetMapping("/my-topics")
    public ResponseEntity<ApiResponse<List<UserTopicResponse>>> getMyTopics(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest servletRequest) {

        String username = userDetails.getUsername();
        log.info(">>> Học viên [{}] đang truy cập danh sách topic cần feedback", username);

        List<UserTopicResponse> result = feedbackService.getTopicsForStudent(username);

        return ResponseEntity.ok(ApiResponse.success(
                result,
                "Lấy danh sách chủ đề thành công",
                servletRequest.getRequestURI()));
    }

    /**
     * 2. Học viên thực hiện gửi bài đánh giá
     */
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<Void>> submitFeedback(
            @RequestBody @Valid FeedbackRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> Học viên ID: {} đang nộp feedback cho Topic ID: {}",
                request.getMaHocVien(), request.getMaTopic());

        feedbackService.submitFeedback(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        null,
                        "Cảm ơn bạn đã gửi đánh giá!",
                        servletRequest.getRequestURI()));
    }

    @GetMapping("/detail")
    public ResponseEntity<FeedbackResponse> getFeedbackDetail(
            @RequestParam UUID maLop,
            @RequestParam UUID maTopic) {

        return ResponseEntity.ok(feedbackService.getSubmittedFeedback(maLop, maTopic));
    }

}
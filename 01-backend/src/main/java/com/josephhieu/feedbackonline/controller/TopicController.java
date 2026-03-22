package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.dto.request.TopicRequest;
import com.josephhieu.feedbackonline.dto.response.TopicResponse;
import com.josephhieu.feedbackonline.service.TopicService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/topics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    public ResponseEntity<ApiResponse<TopicResponse>> createTopic(
            @RequestBody @Valid TopicRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> [POST] Tạo mới Topic: Name='{}'", request.getTenTopic());
        TopicResponse result = topicService.createTopic(request);
        log.info("<<< [POST] Tạo Topic thành công: ID={}", result.getMaTopic());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        result,
                        "Thêm chủ đề khảo sát thành công",
                        servletRequest.getRequestURI()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TopicResponse>>> getAllTopics(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "search", required = false) String search,
            HttpServletRequest servletRequest) {

        log.info(">>> [GET] Truy vấn danh sách Topic - Page: {}, Size: {}, Search: '{}'", page, size, search);
        PageResponse<TopicResponse> results = topicService.getAllTopicsPaging(page, size, search);

        return ResponseEntity.ok(ApiResponse.success(
                results,
                "Lấy danh sách chủ đề thành công",
                servletRequest.getRequestURI()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TopicResponse>> getTopicById(
            @PathVariable UUID id,
            HttpServletRequest servletRequest) {

        log.info(">>> [GET] Truy vấn chi tiết Topic ID: {}", id);
        TopicResponse result = topicService.getTopicById(id);

        return ResponseEntity.ok(ApiResponse.success(
                result,
                "Lấy thông tin chủ đề thành công",
                servletRequest.getRequestURI()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TopicResponse>> updateTopic(
            @PathVariable UUID id,
            @RequestBody @Valid TopicRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> [PUT] Cập nhật Topic ID: {}", id);
        TopicResponse result = topicService.updateTopic(id, request);
        log.info("<<< [PUT] Cập nhật thành công cho Topic: {}", result.getTenTopic());

        return ResponseEntity.ok(ApiResponse.success(
                result,
                "Cập nhật chủ đề thành công",
                servletRequest.getRequestURI()));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<String>> toggleTopicStatus(
            @PathVariable UUID id,
            HttpServletRequest servletRequest) {

        log.info(">>> [PATCH] Thay đổi trạng thái (Xóa mềm) Topic ID: {}", id);
        topicService.toggleStatus(id);

        return ResponseEntity.ok(ApiResponse.success(
                "Thay đổi trạng thái chủ đề thành công",
                null,
                servletRequest.getRequestURI()));
    }
}
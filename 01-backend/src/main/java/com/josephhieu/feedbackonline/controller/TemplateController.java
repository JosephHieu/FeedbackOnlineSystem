package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.dto.request.TemplateRequest;
import com.josephhieu.feedbackonline.dto.response.TemplateResponse;
import com.josephhieu.feedbackonline.service.TemplateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/templates")
@RequiredArgsConstructor
@Slf4j
public class TemplateController {

    private final TemplateService templateService;
    private static final String TRACE_ID_KEY = "traceId";

    @PostMapping
    public ResponseEntity<ApiResponse<TemplateResponse>> createTemplate(
            @RequestBody @Valid TemplateRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> [POST] Tạo mới Template: name='{}', count_questions={}",
                request.getTenTemplate(),
                request.getDanhSachCauHoi() != null ? request.getDanhSachCauHoi().size() : 0);
        TemplateResponse result = templateService.createTemplate(request);
        log.info("<<< [POST] Tạo Template thành công: ID={}", result.getMaTemplate());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<TemplateResponse>builder()
                        .result(result)
                        .path(servletRequest.getRequestURI())
                        .traceId(MDC.get(TRACE_ID_KEY))
                        .message("Tạo mẫu feedback thành công")
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TemplateResponse>>> getAllTemplates(
            HttpServletRequest servletRequest) {

        log.info(">>> [GET] Truy vấn danh sách Template");
        List<TemplateResponse> results = templateService.getAllActiveTemplates();

        return ResponseEntity.ok(
                ApiResponse.<List<TemplateResponse>>builder()
                        .result(results)
                        .path(servletRequest.getRequestURI())
                        .traceId(MDC.get(TRACE_ID_KEY))
                        .message("Lấy danh sách thành công")
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTemplate(
            @PathVariable UUID id,
            HttpServletRequest servletRequest) {
        log.warn(">>> [DELETE] Yêu cầu xóa (Soft Delete) Template ID: {}", id);

        templateService.deleteTemplate(id);

        log.info("<<< [DELETE] Xóa Template thành công: ID={}", id);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .result("Xóa mẫu feedback thành công")
                        .path(servletRequest.getRequestURI())
                        .traceId(MDC.get(TRACE_ID_KEY))
                        .build());
    }

}

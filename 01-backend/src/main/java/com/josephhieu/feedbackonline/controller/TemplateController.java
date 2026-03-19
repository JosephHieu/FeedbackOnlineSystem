package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.dto.request.TemplateRequest;
import com.josephhieu.feedbackonline.dto.response.TemplateResponse;
import com.josephhieu.feedbackonline.service.TemplateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @PostMapping
    public ResponseEntity<ApiResponse<TemplateResponse>> createTemplate(
            @RequestBody @Valid TemplateRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> [POST] Tạo mới Template: name='{}'", request.getTenTemplate());
        TemplateResponse result = templateService.createTemplate(request);
        log.info("<<< [POST] Tạo Template thành công: ID={}", result.getMaTemplate());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        result,
                        "Tạo mẫu feedback thành công",
                        servletRequest.getRequestURI()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TemplateResponse>>> getAllTemplates(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            HttpServletRequest servletRequest) {

        log.info(">>> [GET] Truy vấn danh sách Template");

        PageResponse<TemplateResponse> results = templateService.getAllTemplatesPaging(page, size);

        return ResponseEntity.ok(ApiResponse.success(
                results,
                "Lấy danh sách thành công",
                servletRequest.getRequestURI()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TemplateResponse>> getTemplateById(
            @PathVariable UUID id,
            HttpServletRequest servletRequest) {

        log.info(">>> [GET] Truy vấn chi tiết Template ID: {}", id);
        TemplateResponse result = templateService.getTemplateById(id);

        return ResponseEntity.ok(ApiResponse.success(
                result,
                "Lấy thông tin mẫu feedback thành công",
                servletRequest.getRequestURI()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTemplate(
            @PathVariable UUID id,
            HttpServletRequest servletRequest) {

        log.info(">>> [DELETE/PATCH] Thay đổi trạng thái Template ID: {}", id);
        templateService.deleteTemplate(id);

        return ResponseEntity.ok(ApiResponse.success(
                "Thay đổi trạng thái mẫu feedback thành công",
                null,
                servletRequest.getRequestURI()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TemplateResponse>> updateTemplate(
            @PathVariable UUID id,
            @RequestBody @Valid TemplateRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> [PUT] Cập nhật Template ID: {}", id);
        TemplateResponse result = templateService.updateTemplate(id, request);

        return ResponseEntity.ok(ApiResponse.success(
                result,
                "Cập nhật mẫu feedback thành công",
                servletRequest.getRequestURI()));
    }
}
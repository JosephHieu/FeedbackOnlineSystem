package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
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
                .body(ApiResponse.success(result, "Tạo mẫu feedback thành công", servletRequest.getRequestURI()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TemplateResponse>>> getAllTemplates(
            HttpServletRequest servletRequest) {

        log.info(">>> [GET] Truy vấn danh sách Template");
        List<TemplateResponse> results = templateService.getAllActiveTemplates();

        return ResponseEntity.ok(ApiResponse.success(results, "Lấy danh sách thành công", servletRequest.getRequestURI()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTemplate(
            @PathVariable UUID id,
            HttpServletRequest servletRequest) {

        log.warn(">>> [DELETE] Yêu cầu xóa Template ID: {}", id);
        templateService.deleteTemplate(id);
        log.info("<<< [DELETE] Xóa Template thành công: ID={}", id);

        return ResponseEntity.ok(ApiResponse.success("Xóa mẫu feedback thành công", null, servletRequest.getRequestURI()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TemplateResponse>> updateTemplate(
            @PathVariable UUID id,
            @RequestBody @Valid TemplateRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> [PUT] Cập nhật Template ID: {}", id);
        TemplateResponse result = templateService.updateTemplate(id, request);

        return ResponseEntity.ok(ApiResponse.success(result, "Cập nhật mẫu feedback thành công", servletRequest.getRequestURI()));
    }
}
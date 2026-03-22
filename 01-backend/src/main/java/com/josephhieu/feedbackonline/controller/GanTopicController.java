package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.dto.request.GanTopicRequest;
import com.josephhieu.feedbackonline.dto.response.GanTopicResponse;
import com.josephhieu.feedbackonline.service.GanTopicService;
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
@RequestMapping("/api/v1/assign-topics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class GanTopicController {

    private final GanTopicService ganTopicService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> assignTopics(
            @RequestBody @Valid GanTopicRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> [POST] Thực hiện gán {} topic cho lớp ID: {}",
                request.getDanhSachMaTopic().size(), request.getMaLop());

        ganTopicService.assignTopics(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        null,
                        "Gán chủ đề cho lớp thành công!",
                        servletRequest.getRequestURI()));
    }

    @GetMapping("/class/{maLop}")
    public ResponseEntity<ApiResponse<List<GanTopicResponse>>> getAssignmentsByClass(
            @PathVariable UUID maLop,
            HttpServletRequest servletRequest) {

        log.info(">>> [GET] Truy vấn danh sách gán topic của lớp ID: {}", maLop);
        List<GanTopicResponse> results = ganTopicService.getAssignmentsByClass(maLop);

        return ResponseEntity.ok(ApiResponse.success(
                results,
                "Lấy danh sách gán topic thành công",
                servletRequest.getRequestURI()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(
            @PathVariable UUID id,
            HttpServletRequest servletRequest) {

        log.info(">>> [DELETE] Xóa bản ghi gán topic ID: {}", id);
        ganTopicService.deleteAssignment(id);

        return ResponseEntity.ok(ApiResponse.success(
                null,
                "Đã xóa gán chủ đề thành công",
                servletRequest.getRequestURI()));
    }

    @DeleteMapping("/class/{maLop}/clear-all")
    public ResponseEntity<ApiResponse<Void>> clearAllByClass(
            @PathVariable UUID maLop,
            HttpServletRequest servletRequest) {

        log.info(">>> [DELETE] Xóa TOÀN BỘ gán topic của lớp ID: {}", maLop);
        ganTopicService.clearAssignmentsByClass(maLop);

        return ResponseEntity.ok(ApiResponse.success(
                null,
                "Đã xóa sạch cấu hình gán topic của lớp",
                servletRequest.getRequestURI()));
    }
}
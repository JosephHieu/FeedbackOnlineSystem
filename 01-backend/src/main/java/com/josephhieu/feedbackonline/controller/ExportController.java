package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.dto.response.FeedbackExportResponse;
import com.josephhieu.feedbackonline.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/export")
@RequiredArgsConstructor
@Slf4j
public class ExportController {

    private final FeedbackService feedbackService;

    /**
     * 1. API XEM TRƯỚC DỮ LIỆU ĐÁNH GIÁ
     * Quyền hạn: Chỉ ADMIN mới được xem trước kết quả chi tiết.
     */
    @GetMapping("/preview")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<FeedbackExportResponse>> getPreview(
            @RequestParam UUID maLop,
            @RequestParam UUID maTopic) {

        log.info("Admin is previewing feedback results for Class ID: {} and Topic ID: {}", maLop, maTopic);

        List<FeedbackExportResponse> result = feedbackService.getPreviewFeedback(maLop, maTopic);

        return ApiResponse.<List<FeedbackExportResponse>>builder()
                .result(result)
                .build();
    }

    /**
     * 2. API XUẤT FILE EXCEL KẾT QUẢ ĐÁNH GIÁ
     * Quyền hạn: Chỉ ADMIN mới được xuất file.
     */
    @GetMapping("/excel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> exportExcel(
            @RequestParam UUID maLop,
            @RequestParam UUID maTopic) {

        log.info("Admin is exporting feedback Excel for Class ID: {} and Topic ID: {}", maLop, maTopic);

        ByteArrayInputStream in = feedbackService.exportFeedbackToExcel(maLop, maTopic);

        String fileName = "Ket_Qua_Feedback_" + maLop.toString().substring(0, 8) + ".xlsx";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + fileName);

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}

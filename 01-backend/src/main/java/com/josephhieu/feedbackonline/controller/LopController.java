package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.dto.request.LopRequest;
import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.dto.response.LopResponse;
import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.service.LopService;
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
@RequestMapping("/api/v1/lops")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class LopController {

    private final LopService lopService;

    /**
     * Lấy danh sách lớp học có phân trang và tìm kiếm
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<LopResponse>>> getAllLops(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "search", required = false) String search,
            HttpServletRequest request) {

        log.info("REST request to get all Lops - Page: {}, Size: {}, Search: '{}'", page, size, search);
        PageResponse<LopResponse> results = lopService.getAllLopsPaging(page, size, search);

        return ResponseEntity.ok(
                ApiResponse.success(results, "Lấy danh sách lớp thành công", request.getRequestURI())
        );
    }

    /**
     * Lấy chi tiết một lớp học theo ID
     */
    @GetMapping("/{maLop}")
    public ResponseEntity<ApiResponse<LopResponse>> getLopById(
            @PathVariable UUID maLop,
            HttpServletRequest request) {

        log.info("REST request to get Lop : {}", maLop);
        LopResponse result = lopService.getLopById(maLop);

        return ResponseEntity.ok(
                ApiResponse.success(result, "Lấy thông tin lớp thành công", request.getRequestURI())
        );
    }

    /**
     * Tạo mới một lớp học
     */
    @PostMapping
    public ResponseEntity<ApiResponse<LopResponse>> createLop(
            @Valid @RequestBody LopRequest lopRequest,
            HttpServletRequest request) {

        log.info("REST request to save Lop : {}", lopRequest.getTenLop());
        LopResponse result = lopService.createLop(lopRequest);

        // Trả về mã 201 Created (Đúng chuẩn RESTful khi tạo mới tài nguyên)
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(result, "Thêm lớp học thành công", request.getRequestURI()));
    }

    /**
     * Cập nhật thông tin lớp học
     */
    @PutMapping("/{maLop}")
    public ResponseEntity<ApiResponse<LopResponse>> updateLop(
            @PathVariable UUID maLop,
            @Valid @RequestBody LopRequest lopRequest,
            HttpServletRequest request) {

        log.info("REST request to update Lop : {}, ID: {}", lopRequest.getTenLop(), maLop);
        LopResponse result = lopService.updateLop(maLop, lopRequest);

        return ResponseEntity.ok(
                ApiResponse.success(result, "Cập nhật lớp học thành công", request.getRequestURI())
        );
    }

    /**
     * Xóa mềm / Thay đổi trạng thái hoạt động của lớp
     */
    @DeleteMapping("/{maLop}")
    public ResponseEntity<ApiResponse<Void>> toggleLopStatus(
            @PathVariable UUID maLop,
            HttpServletRequest request) {

        log.warn("REST request to toggle status for Lop ID: {}", maLop);
        lopService.deleteLop(maLop);

        return ResponseEntity.ok(
                ApiResponse.success(null, "Cập nhật trạng thái lớp thành công", request.getRequestURI())
        );
    }
}
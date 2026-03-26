package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.dto.request.HocVienRequest;
import com.josephhieu.feedbackonline.dto.response.HocVienResponse;
import com.josephhieu.feedbackonline.service.HocVienService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/hoc-viens")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class HocVienController {

    private final HocVienService hocVienService;

    /**
     * 1. Lấy danh sách học viên theo lớp (Phân trang & Tìm kiếm)
     */
    @GetMapping("/lop/{maLop}")
    public ResponseEntity<ApiResponse<PageResponse<HocVienResponse>>> getAllByLop(
            @PathVariable UUID maLop,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "search", required = false) String search,
            HttpServletRequest servletRequest) {

        log.info(">>> [GET] Admin lấy danh sách học viên lớp: {}, Trang: {}", maLop, page);
        var result = hocVienService.getAllHocViensPaging(maLop, page, size, search);

        return ResponseEntity.ok(ApiResponse.success(
                result,
                "Lấy danh sách học viên thành công",
                servletRequest.getRequestURI()));
    }

    /**
     * 2. Lấy chi tiết một học viên (Dùng cho trang Edit)
     */
    @GetMapping("/{maHocVien}")
    public ResponseEntity<ApiResponse<HocVienResponse>> getHocVienById(
            @PathVariable UUID maHocVien,
            HttpServletRequest servletRequest) {

        log.info(">>> [GET] Admin lấy chi tiết học viên ID: {}", maHocVien);
        var result = hocVienService.getHocVienById(maHocVien);

        return ResponseEntity.ok(ApiResponse.success(
                result,
                "Lấy thông tin học viên thành công",
                servletRequest.getRequestURI()));
    }

    /**
     * 3. Tạo mới một học viên (Thủ công)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<HocVienResponse>> create(
            @Valid @RequestBody HocVienRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> [POST] Admin tạo mới học viên: {}", request.getUsername());
        var result = hocVienService.createHocVien(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        result,
                        "Thêm học viên thành công",
                        servletRequest.getRequestURI()));
    }

    /**
     * 4. Cập nhật thông tin học viên
     */
    @PutMapping("/{maHocVien}")
    public ResponseEntity<ApiResponse<HocVienResponse>> update(
            @PathVariable UUID maHocVien,
            @Valid @RequestBody HocVienRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> [PUT] Admin cập nhật học viên ID: {}", maHocVien);
        var result = hocVienService.updateHocVien(maHocVien, request);

        return ResponseEntity.ok(ApiResponse.success(
                result,
                "Cập nhật thông tin học viên thành công",
                servletRequest.getRequestURI()));
    }

    /**
     * 5. Đổi trạng thái (Vô hiệu hóa/Kích hoạt) học viên
     */
    @DeleteMapping("/{maHocVien}")
    public ResponseEntity<ApiResponse<Void>> deleteHocVien(
            @PathVariable UUID maHocVien,
            HttpServletRequest servletRequest) {

        log.warn(">>> [DELETE] Admin cập nhật trạng thái học viên ID: {}", maHocVien);
        hocVienService.deleteHocVien(maHocVien);

        return ResponseEntity.ok(ApiResponse.success(
                null,
                "Cập nhật trạng thái thành công",
                servletRequest.getRequestURI()));
    }

    /**
     * 6. Import danh sách học viên hàng loạt từ file Excel
     */
    @PostMapping("/import/{maLop}")
    public ResponseEntity<ApiResponse<Void>> importExcel(
            @PathVariable UUID maLop,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest servletRequest) {

        log.info(">>> [POST] Admin import Excel lớp ID: {}, File: {}", maLop, file.getOriginalFilename());
        hocVienService.importFromExcel(file, maLop);

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(ApiResponse.success(
                        null,
                        "Import danh sách học viên thành công",
                        servletRequest.getRequestURI()));
    }
}
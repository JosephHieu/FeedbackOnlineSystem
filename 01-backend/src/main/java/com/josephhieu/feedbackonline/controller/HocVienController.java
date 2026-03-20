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
     * Lấy danh sách học viên theo lớp (Phân trang & Tìm kiếm)
     */
    @GetMapping("/lop/{maLop}")
    public ApiResponse<PageResponse<HocVienResponse>> getAllByLop(
            @PathVariable UUID maLop,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "search", required = false) String search,
            HttpServletRequest servletRequest) {

        log.info("Admin đang lấy danh sách học viên lớp: {}, Trang: {}, Tìm kiếm: '{}'", maLop, page, search);
        var result = hocVienService.getAllHocViensPaging(maLop, page, size, search);
        return ApiResponse.success(result, "Lấy danh sách học viên thành công", servletRequest.getRequestURI());
    }

    /**
     * Lấy chi tiết một học viên theo ID (Dùng cho trang Edit)
     */
    @GetMapping("/{maHocVien}")
    public ApiResponse<HocVienResponse> getHocVienById(
            @PathVariable UUID maHocVien,
            HttpServletRequest servletRequest) {

        log.info("Admin đang lấy chi tiết học viên ID: {}", maHocVien);
        var result = hocVienService.getHocVienById(maHocVien);
        return ApiResponse.success(result, "Lấy thông tin học viên thành công", servletRequest.getRequestURI());
    }

    /**
     * Tạo mới một học viên (Thủ công)
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<HocVienResponse> create(
            @Valid @RequestBody HocVienRequest request,
            HttpServletRequest servletRequest) {

        log.info("Admin đang tạo mới học viên: {}", request.getUsername());
        var result = hocVienService.createHocVien(request);
        return ApiResponse.success(result, "Thêm học viên thành công", servletRequest.getRequestURI());
    }

    /**
     * Cập nhật thông tin học viên
     */
    @PutMapping("/{maHocVien}")
    public ApiResponse<HocVienResponse> update(
            @PathVariable UUID maHocVien,
            @Valid @RequestBody HocVienRequest request,
            HttpServletRequest servletRequest) {

        log.info("Admin đang cập nhật học viên ID: {}", maHocVien);
        var result = hocVienService.updateHocVien(maHocVien, request);
        return ApiResponse.success(result, "Cập nhật thông tin học viên thành công", servletRequest.getRequestURI());
    }

    /**
     * Đổi trạng thái (Vô hiệu hóa/Kích hoạt) học viên
     */
    @DeleteMapping("/{maHocVien}")
    public ApiResponse<Void> deleteHocVien(
            @PathVariable UUID maHocVien,
            HttpServletRequest servletRequest) {

        log.warn("Admin đang thay đổi trạng thái học viên ID: {}", maHocVien);
        hocVienService.deleteHocVien(maHocVien);
        return ApiResponse.success(null, "Cập nhật trạng thái thành công", servletRequest.getRequestURI());
    }

    /**
     * Import danh sách học viên hàng loạt từ file Excel
     */
    @PostMapping("/import/{maLop}")
    @ResponseStatus(HttpStatus.ACCEPTED) // Dùng Accepted vì quá trình xử lý file có thể mất thời gian
    public ApiResponse<Void> importExcel(
            @PathVariable UUID maLop,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest servletRequest) {

        log.info("Admin đang thực hiện import file Excel cho lớp ID: {}, Tên file: {}", maLop, file.getOriginalFilename());
        hocVienService.importFromExcel(file, maLop);
        return ApiResponse.success(null, "Import danh sách học viên thành công", servletRequest.getRequestURI());
    }
}
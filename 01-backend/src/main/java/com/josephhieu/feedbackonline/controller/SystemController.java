package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.dto.request.SystemResetRequest;
import com.josephhieu.feedbackonline.dto.response.DashboardStatsResponse;
import com.josephhieu.feedbackonline.dto.response.SystemResetResponse;
import com.josephhieu.feedbackonline.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/system")
@RequiredArgsConstructor
public class SystemController {

    private final AdminService adminService;

    @PostMapping("/reset")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SystemResetResponse>> reset(
            @RequestBody @Valid SystemResetRequest request,
            HttpServletRequest servletRequest) {

        var result = adminService.resetSystem(request);
        return ResponseEntity.ok(ApiResponse.success(result, result.getMessage(), servletRequest.getRequestURI()));
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats(HttpServletRequest servletRequest) {

        var result = adminService.getDashboardStats();
        return ResponseEntity.ok(
                ApiResponse.success(result, "Lấy thống kê thành công", servletRequest.getRequestURI()));
    }

}

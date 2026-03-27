package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.dto.request.SystemResetRequest;
import com.josephhieu.feedbackonline.dto.response.SystemResetResponse;
import com.josephhieu.feedbackonline.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/system")
@RequiredArgsConstructor
public class SystemController {

    private final AdminService adminService;

    public ResponseEntity<ApiResponse<SystemResetResponse>> reset(
            @RequestBody @Valid SystemResetRequest request,
            HttpServletRequest servletRequest) {

        var result = adminService.resetSystem(request);
        return ResponseEntity.ok(ApiResponse.success(result, result.getMessage(), servletRequest.getRequestURI()));
    }
}

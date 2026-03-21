package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.dto.request.LoginRequest;
import com.josephhieu.feedbackonline.dto.request.PasswordChangeRequest;
import com.josephhieu.feedbackonline.dto.response.AuthResponse;
import com.josephhieu.feedbackonline.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody @Valid LoginRequest request) {

        AuthResponse result = authService.login(request);

        return ApiResponse.<AuthResponse>builder()
                .result(result)
                .message("Đăng nhập thành công")
                .build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestBody @Valid PasswordChangeRequest request,
            HttpServletRequest servletRequest) {

        authService.changePassword(request);

        return ResponseEntity.ok(ApiResponse.success(
                null,
                "Đổi mật khẩu thành công rồi nhé!",
                servletRequest.getRequestURI()));
    }
}

package com.josephhieu.feedbackonline.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.Data;

@Data
public class PasswordChangeRequest {
    @NotBlank(message = "Mật khẩu cũ không được để trống")
    private String oldPassword;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @Size(min = 6, message = "Mật khẩu phải từ 6 ký tự trở lên")
    private String newPassword;

    @NotBlank(message = "Xác nhận mật khẩu không được để trống")
    private String confirmPassword;
}

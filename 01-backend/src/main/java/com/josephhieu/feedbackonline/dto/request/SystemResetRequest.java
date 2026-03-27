package com.josephhieu.feedbackonline.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemResetRequest {

    @NotBlank(message = "Vui lòng nhập mật khẩu để xác nhận xóa hệ thống")
    private String password;
}

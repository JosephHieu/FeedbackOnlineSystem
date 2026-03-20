package com.josephhieu.feedbackonline.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HocVienRequest {

    @NotBlank(message = "Username không được để trống")
    private String username;

    @NotBlank(message = "Tên học viên không được để trống")
    private String tenHocVien;

    @NotNull(message = "Vui lòng chọn lớp học")
    private UUID maLop;

    private Boolean status;
}

package com.josephhieu.feedbackonline.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerRequest {

    @NotBlank(message = "Account trainer không được để trống")
    private String account;

    @NotBlank(message = "Tên giảng viên không được để trống")
    @Pattern(regexp = "^[^0-9]*$", message = "Vui lòng không nhập ký tự số!")
    private String tenTrainer;
}

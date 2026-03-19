package com.josephhieu.feedbackonline.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LopRequest {

    @NotBlank(message = "Tên lớp không được để trống cưng ơi")
    @Size(min = 2, max = 100, message = "Tên lớp phải từ 2 đến 100 ký tự nhé")
    private String tenLop;

    @NotNull(message = "Phải chọn một mẫu khảo sát cho lớp này nhé")
    private UUID maTemplate;

    @Builder.Default
    private Boolean status = true;
}
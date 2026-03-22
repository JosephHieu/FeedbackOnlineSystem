package com.josephhieu.feedbackonline.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicRequest {

    @NotBlank(message = "Tên chủ đề không được để trống")
    private String tenTopic;
}

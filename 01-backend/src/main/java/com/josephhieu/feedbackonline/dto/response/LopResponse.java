package com.josephhieu.feedbackonline.dto.response;

import lombok.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LopResponse {
    private UUID maLop;
    private String tenLop;

    private UUID maTemplate;

    private String tenTemplate;

    private Boolean status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
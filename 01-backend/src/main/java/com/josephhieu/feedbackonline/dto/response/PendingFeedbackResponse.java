package com.josephhieu.feedbackonline.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class PendingFeedbackResponse {
    private UUID maHocVien;
    private String tenHocVien;
    private String tenLop;
    private String tenTopic;
}
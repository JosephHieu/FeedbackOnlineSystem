package com.josephhieu.feedbackonline.dto.response;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {
    private UUID maFeedback;
    private UUID maLop;
    private UUID maTopic;
    private List<ChiTietResponse> chiTietFeedback;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChiTietResponse {
        private UUID maCauHoi;
        private Integer diem;
        private String ghiChu;
    }
}
package com.josephhieu.feedbackonline.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackRequest {

    private UUID maLop;
    private UUID maTemplate;
    private UUID maTopic;
    private UUID maTrainer;
    private UUID maHocVien;

    private List<ChiTietFeedbackRequest> chiTietFeedback;

    @Data
    public static class ChiTietFeedbackRequest {
        private UUID maCauHoi;
        private Integer diem;
        private String ghiChu;
    }
}

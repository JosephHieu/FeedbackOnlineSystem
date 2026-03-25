package com.josephhieu.feedbackonline.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackExportResponse {

    private String tenHocVien;
    private String tenLop;
    private String tenTopic;
    private String tenTrainer;
    private List<ChiTietExport> chiTietFeedback;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChiTietExport {
        private String tenCauHoi;
        private Integer diem;
        private String ghiChu;
    }
}

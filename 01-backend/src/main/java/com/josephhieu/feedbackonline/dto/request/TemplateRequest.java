package com.josephhieu.feedbackonline.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateRequest {

    private String tenTemplate;
    private List<CauHoiRequest> danhSachCauHoi;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CauHoiRequest {
        private String tenCauHoi;
        private Integer STT;
        private Integer diemToiThieu;
        private Integer diemToiDa;
        private Integer diemToiThieuKhongGhiChu;
    }
}

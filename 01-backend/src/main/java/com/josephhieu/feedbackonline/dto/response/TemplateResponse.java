package com.josephhieu.feedbackonline.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateResponse {

    private UUID maTemplate;
    private String temTemplate;
    private Boolean status;
    private LocalDateTime createAt;
    private List<CauHoiResponse> danhSachCauHoi;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CauHoiResponse {
        private UUID maCauHoi;
        private String tenCauHoi;
        private Integer STT;
        private Integer diemToiThieu;
        private Integer diemToiDa;
        private Integer diemToiThieuKhongGhiChu;
    }
}

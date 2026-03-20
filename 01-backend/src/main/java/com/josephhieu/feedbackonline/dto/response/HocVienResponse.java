package com.josephhieu.feedbackonline.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class HocVienResponse {

    private UUID maHocVien;
    private String username;
    private String tenHocVien;
    private String tenLop;
    private UUID maLop;
    private Boolean status;
}

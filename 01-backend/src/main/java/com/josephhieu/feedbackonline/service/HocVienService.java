package com.josephhieu.feedbackonline.service;

import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.dto.request.HocVienRequest;
import com.josephhieu.feedbackonline.dto.response.HocVienResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface HocVienService {
    HocVienResponse createHocVien(HocVienRequest request);

    HocVienResponse updateHocVien(UUID maHocVien, HocVienRequest request);

    PageResponse<HocVienResponse> getAllHocViensPaging(UUID maLop, int page, int size, String search);

    HocVienResponse getHocVienById(UUID maHocVien);

    void deleteHocVien(UUID maHocVien);

    void importFromExcel(MultipartFile file, UUID maLop);
}
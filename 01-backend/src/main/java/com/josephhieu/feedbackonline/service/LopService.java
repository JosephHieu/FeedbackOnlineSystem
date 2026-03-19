package com.josephhieu.feedbackonline.service;

import com.josephhieu.feedbackonline.dto.request.LopRequest;
import com.josephhieu.feedbackonline.dto.response.LopResponse;
import com.josephhieu.feedbackonline.common.dto.response.PageResponse;

import java.util.UUID;

public interface LopService {
    LopResponse createLop(LopRequest request);
    LopResponse updateLop(UUID maLop, LopRequest request);
    void deleteLop(UUID maLop);
    LopResponse getLopById(UUID maLop);
    PageResponse<LopResponse> getAllLopsPaging(int page, int size, String search);
}
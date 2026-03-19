package com.josephhieu.feedbackonline.service;

import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.dto.request.TemplateRequest;
import com.josephhieu.feedbackonline.dto.response.TemplateResponse;

import java.util.List;
import java.util.UUID;

public interface TemplateService {

    TemplateResponse createTemplate(TemplateRequest request);

    List<TemplateResponse> getAllActiveTemplates();

    void deleteTemplate(UUID id);

    TemplateResponse updateTemplate(UUID id, TemplateRequest request);

    TemplateResponse getTemplateById(UUID id);

    PageResponse<TemplateResponse> getAllTemplatesPaging(int page, int size);
}

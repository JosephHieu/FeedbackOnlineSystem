package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.TemplateRequest;
import com.josephhieu.feedbackonline.dto.response.TemplateResponse;
import com.josephhieu.feedbackonline.entity.Template;
import com.josephhieu.feedbackonline.mapper.TemplateMapper;
import com.josephhieu.feedbackonline.repository.TemplateRepository;
import com.josephhieu.feedbackonline.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TemplateServiceImpl implements TemplateService {

    private final TemplateRepository templateRepository;
    private final TemplateMapper templateMapper;

    @Override
    @Transactional
    public TemplateResponse createTemplate(TemplateRequest request) {

        if (templateRepository.existsByTenTemplate(request.getTenTemplate())) {
            throw new AppException(ErrorCode.TEMPLATE_EXISTED);
        }

        Template template = templateMapper.toEntity(request);

        if (template.getDanhSachCauHoi() != null) {
            template.getDanhSachCauHoi().forEach(ch -> ch.setTemplate(template));
        }

        Template savedTemplate = templateRepository.save(template);
        return templateMapper.toResponse(savedTemplate);
    }

    @Override
    public List<TemplateResponse> getAllActiveTemplates() {
        return templateRepository.findAllByStatusTrue()
                .stream()
                .map(templateMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteTemplate(UUID id) {

        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TEMPLATE_NOT_EXISTED));

        template.setStatus(false);
        templateRepository.save(template);
    }
}

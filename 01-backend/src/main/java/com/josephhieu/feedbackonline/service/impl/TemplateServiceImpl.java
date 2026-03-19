package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.TemplateRequest;
import com.josephhieu.feedbackonline.dto.response.TemplateResponse;
import com.josephhieu.feedbackonline.entity.CauHoi;
import com.josephhieu.feedbackonline.entity.Template;
import com.josephhieu.feedbackonline.mapper.TemplateMapper;
import com.josephhieu.feedbackonline.repository.TemplateRepository;
import com.josephhieu.feedbackonline.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

        validateScores(request.getDanhSachCauHoi());

        if (templateRepository.existsByTenTemplate(request.getTenTemplate())) {
            throw new AppException(ErrorCode.TEMPLATE_EXISTED);
        }

        Template template = templateMapper.toEntity(request);

        template.setStatus(true);

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
    @Transactional
    public void deleteTemplate(UUID id) {

        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TEMPLATE_NOT_EXISTED));

        template.setStatus(!template.getStatus());
        templateRepository.save(template);
    }

    @Override
    @Transactional
    public TemplateResponse updateTemplate(UUID id, TemplateRequest request) {

        Template existingTemplate = templateRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TEMPLATE_NOT_EXISTED));

        if (!existingTemplate.getTenTemplate().equalsIgnoreCase(request.getTenTemplate()) &&
                templateRepository.existsByTenTemplate(request.getTenTemplate())) {
            throw new AppException(ErrorCode.TEMPLATE_EXISTED);
        }

        validateScores(request.getDanhSachCauHoi());

        existingTemplate.setTenTemplate(request.getTenTemplate());

        existingTemplate.getDanhSachCauHoi().clear();

        // 2. Kiểm tra null-safe trước khi thêm câu hỏi mới
        if (request.getDanhSachCauHoi() != null) {
            List<CauHoi> newCauHois = request.getDanhSachCauHoi().stream()
                    .map(req -> {
                        CauHoi ch = templateMapper.toCauHoiEntity(req);
                        ch.setTemplate(existingTemplate);
                        return ch;
                    }).toList();
            existingTemplate.getDanhSachCauHoi().addAll(newCauHois);
        }
        return templateMapper.toResponse(templateRepository.save(existingTemplate));
    }

    @Override
    public TemplateResponse getTemplateById(UUID id) {
        return templateRepository.findById(id)
                .map(templateMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.TEMPLATE_NOT_EXISTED));
    }

    @Override
    public PageResponse<TemplateResponse> getAllTemplatesPaging(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        Page<Template> templatePage;

        if (keyword != null && !keyword.trim().isEmpty()) {
            templatePage = templateRepository.findByTenTemplateContainingIgnoreCase(keyword, pageable);
        } else {
            templatePage = templateRepository.findAll(pageable);
        }

        List<TemplateResponse> dtoList = templatePage.getContent().stream()
                .map(templateMapper::toResponse)
                .toList();

        return PageResponse.<TemplateResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(templatePage.getTotalPages())
                .totalElements(templatePage.getTotalElements())
                .data(dtoList)
                .build();
    }

    private void validateScores(List<TemplateRequest.CauHoiRequest> danhSachCauHoi) {
        if (danhSachCauHoi != null) {
            for (var req : danhSachCauHoi) {
                // 1. Kiểm tra số âm trước (Ưu tiên cao nhất)
                if (req.getDiemToiThieu() < 0 || req.getDiemToiDa() < 0) {
                    throw new AppException(ErrorCode.INVALID_SCORE_NEGATIVE);
                }

                // 2. Kiểm tra logic Min >= Max
                if (req.getDiemToiThieu() >= req.getDiemToiDa()) {
                    throw new AppException(ErrorCode.INVALID_SCORE_RANGE);
                }
            }
        }
    }
}

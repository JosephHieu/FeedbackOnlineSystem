package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.LopRequest;
import com.josephhieu.feedbackonline.dto.response.LopResponse;
import com.josephhieu.feedbackonline.entity.Lop;
import com.josephhieu.feedbackonline.entity.Template;
import com.josephhieu.feedbackonline.mapper.LopMapper;
import com.josephhieu.feedbackonline.repository.LopRepository;
import com.josephhieu.feedbackonline.repository.TemplateRepository;
import com.josephhieu.feedbackonline.service.LopService;
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
public class LopServiceImpl implements LopService {

    private final LopRepository lopRepository;
    private final TemplateRepository templateRepository;
    private final LopMapper lopMapper;

    @Override
    @Transactional
    public LopResponse createLop(LopRequest request) {
        // 1. Kiểm tra Template có tồn tại không
        Template template = templateRepository.findById(request.getMaTemplate())
                .orElseThrow(() -> new AppException(ErrorCode.TEMPLATE_NOT_EXISTED));

        Lop lop = lopMapper.toEntity(request);
        lop.setTemplate(template);
        lop.setStatus(true);

        return lopMapper.toResponse(lopRepository.save(lop));
    }

    @Override
    @Transactional
    public LopResponse updateLop(UUID maLop, LopRequest request) {
        Lop lop = lopRepository.findById(maLop)
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));

        Template template = templateRepository.findById(request.getMaTemplate())
                .orElseThrow(() -> new AppException(ErrorCode.TEMPLATE_NOT_EXISTED));

        // Cập nhật thông tin
        lop.setTenLop(request.getTenLop());
        lop.setTemplate(template);
        if (request.getStatus() != null) {
            lop.setStatus(request.getStatus());
        }

        return lopMapper.toResponse(lopRepository.save(lop));
    }

    @Override
    public PageResponse<LopResponse> getAllLopsPaging(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        Page<Lop> lopPage = (search != null && !search.trim().isEmpty())
                ? lopRepository.findByTenLopContainingIgnoreCase(search, pageable)
                : lopRepository.findAll(pageable);

        return PageResponse.<LopResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(lopPage.getTotalPages())
                .totalElements(lopPage.getTotalElements())
                .data(lopPage.getContent().stream().map(lopMapper::toResponse).toList())
                .build();
    }

    @Override
    public LopResponse getLopById(UUID maLop) {
        return lopRepository.findById(maLop)
                .map(lopMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));
    }

    @Override
    @Transactional
    public void deleteLop(UUID maLop) {
        Lop lop = lopRepository.findById(maLop)
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));

        lop.setStatus(!lop.getStatus());

        lopRepository.save(lop);
    }
}

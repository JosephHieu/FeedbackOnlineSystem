package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.TemplateRequest;
import com.josephhieu.feedbackonline.dto.response.TemplateResponse;
import com.josephhieu.feedbackonline.entity.CauHoi;
import com.josephhieu.feedbackonline.entity.Template;
import com.josephhieu.feedbackonline.mapper.TemplateMapper;
import com.josephhieu.feedbackonline.repository.TemplateRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TemplateServiceImplTest {

    @Mock private TemplateRepository templateRepository;
    @Mock private TemplateMapper templateMapper;

    @InjectMocks
    private TemplateServiceImpl templateService;

    @Nested
    @DisplayName("Tests cho chức năng Validate Score")
    class ValidationTests {

        @Test
        @DisplayName("Ném lỗi khi điểm số là số âm")
        void validateScores_NegativeScore_ThrowsException() {
            // GIVEN
            TemplateRequest request = TemplateRequest.builder()
                    .tenTemplate("Mẫu lỗi")
                    .danhSachCauHoi(List.of(
                            TemplateRequest.CauHoiRequest.builder().diemToiThieu(-1).diemToiDa(5).build()
                    )).build();

            // WHEN & THEN
            AppException ex = assertThrows(AppException.class, () -> templateService.createTemplate(request));
            assertEquals(ErrorCode.INVALID_SCORE_NEGATIVE, ex.getErrorCode());
        }

        @Test
        @DisplayName("Ném lỗi khi điểm tối thiểu >= điểm tối đa")
        void validateScores_InvalidRange_ThrowsException() {
            // GIVEN
            TemplateRequest request = TemplateRequest.builder()
                    .tenTemplate("Mẫu lỗi")
                    .danhSachCauHoi(List.of(
                            TemplateRequest.CauHoiRequest.builder().diemToiThieu(5).diemToiDa(5).build()
                    )).build();

            // WHEN & THEN
            AppException ex = assertThrows(AppException.class, () -> templateService.createTemplate(request));
            assertEquals(ErrorCode.INVALID_SCORE_RANGE, ex.getErrorCode());
        }
    }

    @Nested
    @DisplayName("Tests cho chức năng Update Template")
    class UpdateTests {

        @Test
        @DisplayName("Cập nhật template thành công - Thay thế toàn bộ câu hỏi cũ")
        void updateTemplate_Success() {
            // GIVEN
            UUID id = UUID.randomUUID();
            TemplateRequest request = TemplateRequest.builder()
                    .tenTemplate("Mẫu mới")
                    .danhSachCauHoi(List.of(
                            TemplateRequest.CauHoiRequest.builder().tenCauHoi("Câu hỏi mới").diemToiThieu(1).diemToiDa(5).build()
                    )).build();

            // Template cũ có sẵn một list câu hỏi (ArrayList để cho phép clear/add)
            Template existingTemplate = Template.builder()
                    .maTemplate(id)
                    .tenTemplate("Mẫu cũ")
                    .danhSachCauHoi(new ArrayList<>(List.of(new CauHoi())))
                    .build();

            when(templateRepository.findById(id)).thenReturn(Optional.of(existingTemplate));
            when(templateRepository.existsByTenTemplate(anyString())).thenReturn(false);
            when(templateMapper.toCauHoiEntity(any())).thenReturn(new CauHoi());
            when(templateRepository.save(any())).thenReturn(existingTemplate);
            when(templateMapper.toResponse(any())).thenReturn(new TemplateResponse());

            // WHEN
            templateService.updateTemplate(id, request);

            // THEN
            assertEquals("Mẫu mới", existingTemplate.getTenTemplate());
            assertEquals(1, existingTemplate.getDanhSachCauHoi().size());
            verify(templateRepository).save(existingTemplate);
        }
    }
}
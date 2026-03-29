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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LopServiceImplTest {

    @Mock private LopRepository lopRepository;
    @Mock private TemplateRepository templateRepository;
    @Mock private LopMapper lopMapper;

    @InjectMocks
    private LopServiceImpl lopService;

    private UUID lopId, templateId;
    private Lop mockLop;
    private Template mockTemplate;

    @BeforeEach
    void setUp() {
        lopId = UUID.randomUUID();
        templateId = UUID.randomUUID();
        mockTemplate = Template.builder().maTemplate(templateId).tenTemplate("Mẫu chuẩn").build();
        mockLop = Lop.builder().maLop(lopId).tenLop("Java 01").status(true).build();
    }

    @Test
    @DisplayName("Tạo lớp thành công khi Template tồn tại")
    void createLop_Success() {
        // GIVEN
        LopRequest request = LopRequest.builder().tenLop("Java 01").maTemplate(templateId).build();

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(mockTemplate));
        when(lopMapper.toEntity(any())).thenReturn(mockLop);
        when(lopRepository.save(any())).thenReturn(mockLop);
        when(lopMapper.toResponse(any())).thenReturn(LopResponse.builder().tenLop("Java 01").build());

        // WHEN
        LopResponse response = lopService.createLop(request);

        // THEN
        assertNotNull(response);
        assertEquals("Java 01", response.getTenLop());
        verify(lopRepository).save(any());
    }

    @Test
    @DisplayName("Tạo lớp thất bại khi Template không tồn tại")
    void createLop_TemplateNotFound_ThrowsException() {
        // GIVEN
        LopRequest request = LopRequest.builder().maTemplate(templateId).build();
        when(templateRepository.findById(templateId)).thenReturn(Optional.empty());

        // WHEN & THEN
        AppException ex = assertThrows(AppException.class, () -> lopService.createLop(request));
        assertEquals(ErrorCode.TEMPLATE_NOT_EXISTED, ex.getErrorCode());
        verify(lopRepository, never()).save(any());
    }

    @Test
    @DisplayName("Lấy danh sách phân trang thành công")
    void getAllLopsPaging_Success() {
        // GIVEN
        Page<Lop> page = new PageImpl<>(List.of(mockLop));
        when(lopRepository.findAll(any(Pageable.class))).thenReturn(page);
        when(lopMapper.toResponse(any())).thenReturn(new LopResponse());

        // WHEN
        PageResponse<LopResponse> response = lopService.getAllLopsPaging(1, 10, null);

        // THEN
        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        verify(lopRepository).findAll(any(Pageable.class));
    }

    @Test
    @DisplayName("Xóa mềm (Đảo trạng thái) lớp học")
    void deleteLop_ToggleStatus() {
        // GIVEN
        when(lopRepository.findById(lopId)).thenReturn(Optional.of(mockLop));

        // WHEN
        lopService.deleteLop(lopId);

        // THEN
        assertFalse(mockLop.getStatus()); // Đang true thành false
        verify(lopRepository).save(mockLop);
    }
}
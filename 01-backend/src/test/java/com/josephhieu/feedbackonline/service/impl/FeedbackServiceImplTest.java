package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.FeedbackRequest;
import com.josephhieu.feedbackonline.entity.*;
import com.josephhieu.feedbackonline.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedbackServiceImplTest {

    @Mock private FeedbackRepository feedbackRepository;
    @Mock private ChiTietFeedbackRepository chiTietFeedbackRepository;
    @Mock private HocVienRepository hocVienRepository;
    @Mock private LopRepository lopRepository;
    @Mock private TopicRepository topicRepository;
    @Mock private TrainerRepository trainerRepository;
    @Mock private TemplateRepository templateRepository;
    @Mock private CauHoiRepository cauHoiRepository;

    @InjectMocks
    private FeedbackServiceImpl feedbackService;

    private final String CURRENT_USER = "student_test";
    private HocVien mockHocVien;
    private UUID lopId, topicId, trainerId, templateId;

    @BeforeEach
    void setUp() {
        lopId = UUID.randomUUID();
        topicId = UUID.randomUUID();
        trainerId = UUID.randomUUID();
        templateId = UUID.randomUUID();

        mockHocVien = HocVien.builder()
                .maHocVien(UUID.randomUUID())
                .username(CURRENT_USER)
                .build();
    }

    @Nested
    @DisplayName("Tests cho chức năng Submit Feedback")
    class SubmitFeedbackTests {

        @Test
        @DisplayName("Nộp feedback lần đầu - Thành công")
        void submitFeedback_FirstTime_Success() {
            // GIVEN
            FeedbackRequest request = createMockRequest();

            try (MockedStatic<SecurityContextHolder> mockedSecurity = mockStatic(SecurityContextHolder.class)) {
                setupSecurityContext(mockedSecurity);

                when(hocVienRepository.findByUsername(CURRENT_USER)).thenReturn(Optional.of(mockHocVien));
                when(feedbackRepository.findByHocVien_MaHocVienAndTopic_MaTopicAndLop_MaLop(any(), any(), any()))
                        .thenReturn(Optional.empty()); // Chưa có feedback cũ

                mockRepositoriesFound();
                when(feedbackRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
                when(cauHoiRepository.findById(any())).thenReturn(Optional.of(new CauHoi()));

                // WHEN
                feedbackService.submitFeedback(request);

                // THEN
                verify(feedbackRepository, times(1)).save(any(Feedback.class));
                verify(chiTietFeedbackRepository, times(1)).saveAll(anyList());
                verify(feedbackRepository, never()).delete(any());
            }
        }

        @Test
        @DisplayName("Nộp feedback ghi đè - Phải xóa dữ liệu cũ trước khi lưu mới")
        void submitFeedback_Override_Success() {
            // GIVEN
            FeedbackRequest request = createMockRequest();
            Feedback existingFeedback = Feedback.builder().maFeedback(UUID.randomUUID()).build();

            try (MockedStatic<SecurityContextHolder> mockedSecurity = mockStatic(SecurityContextHolder.class)) {
                setupSecurityContext(mockedSecurity);

                when(hocVienRepository.findByUsername(CURRENT_USER)).thenReturn(Optional.of(mockHocVien));
                when(feedbackRepository.findByHocVien_MaHocVienAndTopic_MaTopicAndLop_MaLop(any(), any(), any()))
                        .thenReturn(Optional.of(existingFeedback)); // Đã tồn tại feedback

                mockRepositoriesFound();
                when(feedbackRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
                when(cauHoiRepository.findById(any())).thenReturn(Optional.of(new CauHoi()));

                // WHEN
                feedbackService.submitFeedback(request);

                // THEN
                // Kiểm tra logic quan trọng nhất: Phải xóa cũ trước khi lưu mới
                verify(chiTietFeedbackRepository).deleteAllByFeedback_MaFeedback(existingFeedback.getMaFeedback());
                verify(feedbackRepository).delete(existingFeedback);
                verify(feedbackRepository).save(any(Feedback.class));
            }
        }
    }

    // --- HELPER METHODS ---

    private FeedbackRequest createMockRequest() {
        return FeedbackRequest.builder()
                .maLop(lopId)
                .maTopic(topicId)
                .maTrainer(trainerId)
                .maTemplate(templateId)
                .chiTietFeedback(List.of(
                        new FeedbackRequest.ChiTietFeedbackRequest() {{
                            setMaCauHoi(UUID.randomUUID());
                            setDiem(5);
                            setGhiChu("Good!");
                        }}
                ))
                .build();
    }

    private void setupSecurityContext(MockedStatic<SecurityContextHolder> mockedSecurity) {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        mockedSecurity.when(SecurityContextHolder::getContext).thenReturn(context);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn(CURRENT_USER);
    }

    private void mockRepositoriesFound() {
        when(lopRepository.findById(lopId)).thenReturn(Optional.of(new Lop()));
        when(topicRepository.findById(topicId)).thenReturn(Optional.of(new Topic()));
        when(trainerRepository.findById(trainerId)).thenReturn(Optional.of(new Trainer()));
        when(templateRepository.findById(templateId)).thenReturn(Optional.of(new Template()));
    }
}
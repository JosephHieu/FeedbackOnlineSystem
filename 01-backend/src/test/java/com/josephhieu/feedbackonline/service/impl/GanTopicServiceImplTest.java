package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.GanTopicRequest;
import com.josephhieu.feedbackonline.entity.*;
import com.josephhieu.feedbackonline.mapper.GanTopicMapper;
import com.josephhieu.feedbackonline.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GanTopicServiceImplTest {

    @Mock private GanTopicRepository ganTopicRepository;
    @Mock private LopRepository lopRepository;
    @Mock private TrainerRepository trainerRepository;
    @Mock private TopicRepository topicRepository;
    @Mock private GanTopicMapper ganTopicMapper;

    @InjectMocks
    private GanTopicServiceImpl ganTopicService;

    private UUID lopId, trainerId, topicId1, topicId2;
    private Lop mockLop;
    private Trainer mockTrainer;

    @BeforeEach
    void setUp() {
        lopId = UUID.randomUUID();
        trainerId = UUID.randomUUID();
        topicId1 = UUID.randomUUID();
        topicId2 = UUID.randomUUID();

        mockLop = Lop.builder().maLop(lopId).tenLop("Java Web 01").build();
        mockTrainer = Trainer.builder().maTrainer(trainerId).tenTrainer("Joseph Hieu").build();
    }

    @Test
    @DisplayName("Gán Topic thành công - Bỏ qua topic đã tồn tại")
    void assignTopics_Success_SkipDuplicate() {
        // GIVEN: Gán 2 topic, nhưng topic 1 đã tồn tại trong lớp
        GanTopicRequest request = GanTopicRequest.builder()
                .maLop(lopId)
                .maTrainer(trainerId)
                .danhSachMaTopic(List.of(topicId1, topicId2))
                .build();

        when(lopRepository.findById(lopId)).thenReturn(Optional.of(mockLop));
        when(trainerRepository.findById(trainerId)).thenReturn(Optional.of(mockTrainer));

        // Giả lập: topic 1 đã tồn tại, topic 2 chưa có
        when(ganTopicRepository.existsByLop_MaLopAndTopic_MaTopic(lopId, topicId1)).thenReturn(true);
        when(ganTopicRepository.existsByLop_MaLopAndTopic_MaTopic(lopId, topicId2)).thenReturn(false);

        when(topicRepository.findById(topicId2)).thenReturn(Optional.of(new Topic()));

        // WHEN
        ganTopicService.assignTopics(request);

        // THEN
        // Kiểm tra saveAll chỉ được gọi với danh sách có 1 phần tử (topicId2)
        verify(ganTopicRepository, times(1)).saveAll(argThat(iterable -> {
            List<GanTopic> list = (List<GanTopic>) iterable;
            return list.size() == 1;
        }));        verify(topicRepository, never()).findById(topicId1); // Không cần tìm topicId1 vì đã bị skip
        verify(topicRepository, times(1)).findById(topicId2);
    }

    @Test
    @DisplayName("Gán Topic thất bại - Danh sách topic gửi lên trống")
    void assignTopics_Failure_EmptyList() {
        // GIVEN
        GanTopicRequest request = GanTopicRequest.builder()
                .maLop(lopId)
                .danhSachMaTopic(List.of()) // Danh sách trống
                .build();

        // WHEN & THEN
        AppException ex = assertThrows(AppException.class, () -> ganTopicService.assignTopics(request));
        assertEquals(ErrorCode.ASSIGN_EMPTY_TOPIC_LIST, ex.getErrorCode());
        verifyNoInteractions(lopRepository, trainerRepository, ganTopicRepository);
    }

    @Test
    @DisplayName("Xóa toàn bộ gán topic của lớp thành công")
    void clearAssignmentsByClass_Success() {
        // WHEN
        ganTopicService.clearAssignmentsByClass(lopId);

        // THEN
        verify(ganTopicRepository, times(1)).deleteAllByLop_MaLop(lopId);
    }

    @Test
    @DisplayName("Xóa một bản ghi gán topic thất bại - Không tồn tại ID")
    void deleteAssignment_Failure_NotExisted() {
        // GIVEN
        UUID invalidId = UUID.randomUUID();
        when(ganTopicRepository.existsById(invalidId)).thenReturn(false);

        // WHEN & THEN
        AppException ex = assertThrows(AppException.class, () -> ganTopicService.deleteAssignment(invalidId));
        assertEquals(ErrorCode.ASSIGN_NOT_EXISTED, ex.getErrorCode());
        verify(ganTopicRepository, never()).deleteById(any());
    }
}
package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.TopicRequest;
import com.josephhieu.feedbackonline.dto.response.TopicResponse;
import com.josephhieu.feedbackonline.entity.Topic;
import com.josephhieu.feedbackonline.mapper.TopicMapper;
import com.josephhieu.feedbackonline.repository.TopicRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
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
class TopicServiceImplTest {

    @Mock private TopicRepository topicRepository;
    @Mock private TopicMapper topicMapper;

    @InjectMocks
    private TopicServiceImpl topicService;

    private UUID topicId;
    private Topic mockTopic;

    @BeforeEach
    void setUp() {
        topicId = UUID.randomUUID();
        mockTopic = Topic.builder()
                .maTopic(topicId)
                .tenTopic("Thái độ giảng viên")
                .status(true)
                .build();
    }

    @Nested
    @DisplayName("Tests cho chức năng Tạo & Cập nhật Topic")
    class CreateUpdateTests {

        @Test
        @DisplayName("Tạo Topic thất bại - Tên đã tồn tại (không phân biệt hoa thường)")
        void createTopic_NameExisted_ThrowsException() {
            // GIVEN
            TopicRequest request = new TopicRequest("THÁI ĐỘ GIẢNG VIÊN");
            when(topicRepository.existsByTenTopicIgnoreCase(anyString())).thenReturn(true);

            // WHEN & THEN
            AppException ex = assertThrows(AppException.class, () -> topicService.createTopic(request));
            assertEquals(ErrorCode.TOPIC_EXISTED, ex.getErrorCode());
        }

        @Test
        @DisplayName("Cập nhật Topic thành công - Giữ nguyên tên cũ")
        void updateTopic_KeepSameName_Success() {
            // GIVEN
            TopicRequest request = new TopicRequest("Thái độ giảng viên");
            when(topicRepository.findById(topicId)).thenReturn(Optional.of(mockTopic));
            // Không gọi existsByTenTopicIgnoreCase vì tên không đổi (logic equalsIgnoreCase)

            when(topicRepository.save(any())).thenReturn(mockTopic);
            when(topicMapper.toResponse(any())).thenReturn(new TopicResponse());

            // WHEN
            assertDoesNotThrow(() -> topicService.updateTopic(topicId, request));

            // THEN
            verify(topicRepository).save(mockTopic);
        }
    }

    @Nested
    @DisplayName("Tests cho chức năng Phân trang & Trạng thái")
    class PagingAndStatusTests {

        @Test
        @DisplayName("Lấy danh sách phân trang - Gọi đúng Custom Query")
        void getAllTopicsPaging_Success() {
            // GIVEN
            Page<Topic> page = new PageImpl<>(List.of(mockTopic));
            when(topicRepository.findAllWithSearch(eq("Thái độ"), any(Pageable.class))).thenReturn(page);
            when(topicMapper.toResponse(any())).thenReturn(new TopicResponse());

            // WHEN
            PageResponse<TopicResponse> response = topicService.getAllTopicsPaging(1, 10, "Thái độ");

            // THEN
            assertNotNull(response);
            assertEquals(1, response.getTotalElements());
            verify(topicRepository).findAllWithSearch(eq("Thái độ"), any(Pageable.class));
        }

        @Test
        @DisplayName("Đảo trạng thái - Xử lý trường hợp status bị null")
        void toggleStatus_HandleNullStatus_Success() {
            // GIVEN
            Topic nullStatusTopic = Topic.builder().maTopic(topicId).status(null).build();
            when(topicRepository.findById(topicId)).thenReturn(Optional.of(nullStatusTopic));

            // WHEN
            topicService.toggleStatus(topicId);

            // THEN
            assertTrue(nullStatusTopic.getStatus()); // null -> true
            verify(topicRepository).save(nullStatusTopic);
        }
    }
}
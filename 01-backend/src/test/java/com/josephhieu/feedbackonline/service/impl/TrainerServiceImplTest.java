package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.TrainerRequest;
import com.josephhieu.feedbackonline.dto.response.TrainerResponse;
import com.josephhieu.feedbackonline.entity.Trainer;
import com.josephhieu.feedbackonline.mapper.TrainerMapper;
import com.josephhieu.feedbackonline.repository.TrainerRepository;
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
class TrainerServiceImplTest {

    @Mock private TrainerRepository trainerRepository;
    @Mock private TrainerMapper trainerMapper;

    @InjectMocks
    private TrainerServiceImpl trainerService;

    private UUID trainerId;
    private Trainer mockTrainer;

    @BeforeEach
    void setUp() {
        trainerId = UUID.randomUUID();
        mockTrainer = Trainer.builder()
                .maTrainer(trainerId)
                .account("hieu.trainer")
                .tenTrainer("Joseph Hieu")
                .status(true)
                .build();
    }

    @Nested
    @DisplayName("Tests cho chức năng Tạo & Cập nhật Trainer")
    class CreateUpdateTests {

        @Test
        @DisplayName("Tạo Trainer thất bại - Account đã tồn tại")
        void createTrainer_AccountExisted_ThrowsException() {
            // GIVEN
            TrainerRequest request = new TrainerRequest("hieu.trainer", "Joseph Hieu");
            when(trainerRepository.existsByAccount("hieu.trainer")).thenReturn(true);

            // WHEN & THEN
            AppException ex = assertThrows(AppException.class, () -> trainerService.createTrainer(request));
            assertEquals(ErrorCode.TRAINER_ACCOUNT_EXISTED, ex.getErrorCode());
            verify(trainerRepository, never()).save(any());
        }

        @Test
        @DisplayName("Cập nhật Trainer thành công - Kiểm tra logic an toàn của Mapper")
        void updateTrainer_Success() {
            // GIVEN
            TrainerRequest request = new TrainerRequest("new.account", "Hieu Updated");
            when(trainerRepository.findById(trainerId)).thenReturn(Optional.of(mockTrainer));

            // Giả lập hành vi của Mapper: chỉ cập nhật tên, ignore account
            doAnswer(invocation -> {
                Trainer t = invocation.getArgument(0);
                TrainerRequest r = invocation.getArgument(1);
                t.setTenTrainer(r.getTenTrainer());
                return null;
            }).when(trainerMapper).updateEntity(any(), any());

            when(trainerRepository.save(any())).thenReturn(mockTrainer);
            when(trainerMapper.toResponse(any())).thenReturn(new TrainerResponse());

            // WHEN
            trainerService.updateTrainer(trainerId, request);

            // THEN
            assertEquals("Hieu Updated", mockTrainer.getTenTrainer());
            assertEquals("hieu.trainer", mockTrainer.getAccount()); // Account không đổi
            verify(trainerRepository).save(mockTrainer);
        }
    }

    @Nested
    @DisplayName("Tests cho chức năng Phân trang & Trạng thái")
    class PagingAndStatusTests {

        @Test
        @DisplayName("Lấy danh sách phân trang thành công")
        void getAllTrainersPaging_Success() {
            // GIVEN
            Page<Trainer> page = new PageImpl<>(List.of(mockTrainer));
            when(trainerRepository.findAllWithSearch(eq("Joseph"), any(Pageable.class))).thenReturn(page);
            when(trainerMapper.toResponse(any())).thenReturn(new TrainerResponse());

            // WHEN
            PageResponse<TrainerResponse> response = trainerService.getAllTrainersPaging(1, 10, "Joseph");

            // THEN
            assertNotNull(response);
            assertEquals(1, response.getTotalElements());
            verify(trainerRepository).findAllWithSearch(eq("Joseph"), any(Pageable.class));
        }

        @Test
        @DisplayName("Đảo ngược trạng thái Trainer (Xóa mềm/Khôi phục)")
        void toggleStatus_Success() {
            // GIVEN
            when(trainerRepository.findById(trainerId)).thenReturn(Optional.of(mockTrainer));

            // WHEN
            trainerService.toggleStatus(trainerId);

            // THEN
            assertFalse(mockTrainer.getStatus()); // true -> false
            verify(trainerRepository).save(mockTrainer);
        }
    }
}
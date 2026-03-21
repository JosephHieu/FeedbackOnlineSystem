package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.TrainerRequest;
import com.josephhieu.feedbackonline.dto.response.TrainerResponse;
import com.josephhieu.feedbackonline.entity.Trainer;
import com.josephhieu.feedbackonline.mapper.TrainerMapper;
import com.josephhieu.feedbackonline.repository.TrainerRepository;
import com.josephhieu.feedbackonline.service.TrainerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrainerServiceImpl implements TrainerService {

    private final TrainerRepository trainerRepository;
    private final TrainerMapper trainerMapper;

    @Override
    @Transactional
    public TrainerResponse createTrainer(TrainerRequest request) {
        // 1. Kiểm tra Account trùng
        if (trainerRepository.existsByAccount(request.getAccount())) {
            throw new AppException(ErrorCode.TRAINER_ACCOUNT_EXISTED);
        }

        // 2. Map sang Entity và lưu
        Trainer trainer = trainerMapper.toEntity(request);
        trainer.setStatus(true);

        return trainerMapper.toResponse(trainerRepository.save(trainer));
    }

    @Override
    @Transactional
    public TrainerResponse updateTrainer(UUID maTrainer, TrainerRequest request) {
        Trainer trainer = trainerRepository.findById(maTrainer)
                .orElseThrow(() -> new AppException(ErrorCode.TRAINER_NOT_EXISTED));

        // Cập nhật thông tin (Mapper đã ignore trường account nên rất an toàn)
        trainerMapper.updateEntity(trainer, request);

        return trainerMapper.toResponse(trainerRepository.save(trainer));
    }

    @Override
    public PageResponse<TrainerResponse> getAllTrainersPaging(int page, int size, String search) {
        // Spring tính trang từ 0 nên phải trừ 1
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        Page<Trainer> trainerPage = trainerRepository.findAllWithSearch(search, pageable);

        return PageResponse.<TrainerResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(trainerPage.getTotalPages())
                .totalElements(trainerPage.getTotalElements())
                .data(trainerPage.getContent().stream().map(trainerMapper::toResponse).toList())
                .build();
    }

    @Override
    public TrainerResponse getTrainerById(UUID maTrainer) {
        return trainerRepository.findById(maTrainer)
                .map(trainerMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.TRAINER_NOT_EXISTED));
    }

    @Override
    @Transactional
    public void toggleStatus(UUID maTrainer) {
        Trainer trainer = trainerRepository.findById(maTrainer)
                .orElseThrow(() -> new AppException(ErrorCode.TRAINER_NOT_EXISTED));

        // LOGIC XÓA MỀM:
        // Nếu đang true (hoạt động) -> thành false (đã xóa/vô hiệu)
        // Nếu đang false -> thành true (khôi phục)
        boolean newStatus = (trainer.getStatus() == null) || !trainer.getStatus();
        trainer.setStatus(newStatus);

        trainerRepository.save(trainer);
        log.info("Trainer {} đã được xóa mềm/khôi phục. Trạng thái mới: {}", maTrainer, newStatus);
    }
}
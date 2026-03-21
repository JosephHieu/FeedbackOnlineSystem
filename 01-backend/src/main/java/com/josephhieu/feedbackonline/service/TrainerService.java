package com.josephhieu.feedbackonline.service;

import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.dto.request.TrainerRequest;
import com.josephhieu.feedbackonline.dto.response.TrainerResponse;
import java.util.UUID;

public interface TrainerService {
    TrainerResponse createTrainer(TrainerRequest request);
    TrainerResponse updateTrainer(UUID maTrainer, TrainerRequest request);
    PageResponse<TrainerResponse> getAllTrainersPaging(int page, int size, String search);
    TrainerResponse getTrainerById(UUID maTrainer);
    void toggleStatus(UUID maTrainer);
}
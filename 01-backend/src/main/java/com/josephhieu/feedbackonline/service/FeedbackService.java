package com.josephhieu.feedbackonline.service;

import com.josephhieu.feedbackonline.dto.request.FeedbackRequest;
import com.josephhieu.feedbackonline.dto.response.FeedbackResponse;
import com.josephhieu.feedbackonline.dto.response.PendingFeedbackResponse;
import com.josephhieu.feedbackonline.dto.response.UserTopicResponse;
import com.josephhieu.feedbackonline.entity.HocVien;

import java.util.List;
import java.util.UUID;

public interface FeedbackService {
    // Lưu bài khảo sát
    void submitFeedback(FeedbackRequest request);

    // Lấy danh sách học viên chưa làm feedback (Theo Lớp và Topic)
    List<PendingFeedbackResponse> getPendingFeedbackList(UUID maLop, UUID maTopic);

    List<UserTopicResponse> getTopicsForStudent(String username);
}
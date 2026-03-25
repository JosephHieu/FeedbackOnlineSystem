package com.josephhieu.feedbackonline.service;

import com.josephhieu.feedbackonline.dto.request.FeedbackRequest;
import com.josephhieu.feedbackonline.dto.response.FeedbackExportResponse;
import com.josephhieu.feedbackonline.dto.response.FeedbackResponse;
import com.josephhieu.feedbackonline.dto.response.PendingFeedbackResponse;
import com.josephhieu.feedbackonline.dto.response.UserTopicResponse;
import com.josephhieu.feedbackonline.entity.HocVien;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.UUID;

public interface FeedbackService {
    // Lưu bài khảo sát
    void submitFeedback(FeedbackRequest request);

    // Lấy danh sách học viên chưa làm feedback (Theo Lớp và Topic)
    List<PendingFeedbackResponse> getPendingFeedbackList(UUID maLop, UUID maTopic);

    List<UserTopicResponse> getTopicsForStudent(String username);

    FeedbackResponse getSubmittedFeedback(UUID maLop, UUID maTopic);

    List<FeedbackExportResponse> getPreviewFeedback(UUID maLop, UUID maTopic);

    ByteArrayInputStream exportFeedbackToExcel(UUID maLop, UUID maTopic);
}
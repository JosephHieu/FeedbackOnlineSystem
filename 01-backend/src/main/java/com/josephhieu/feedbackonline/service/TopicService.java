package com.josephhieu.feedbackonline.service;

import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.dto.request.TopicRequest;
import com.josephhieu.feedbackonline.dto.response.TopicResponse;

import java.util.UUID;

public interface TopicService {
    TopicResponse createTopic(TopicRequest request);

    TopicResponse updateTopic(UUID id, TopicRequest request);

    PageResponse<TopicResponse> getAllTopicsPaging(int page, int size, String search);

    TopicResponse getTopicById(UUID id);

    void toggleStatus(UUID id); // Xử lý Xóa mềm/Khôi phục
}
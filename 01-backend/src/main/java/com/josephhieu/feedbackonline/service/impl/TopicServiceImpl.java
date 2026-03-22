package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.TopicRequest;
import com.josephhieu.feedbackonline.dto.response.TopicResponse;
import com.josephhieu.feedbackonline.entity.Topic;
import com.josephhieu.feedbackonline.mapper.TopicMapper;
import com.josephhieu.feedbackonline.repository.TopicRepository;
import com.josephhieu.feedbackonline.service.TopicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final TopicMapper topicMapper;

    @Override
    public TopicResponse createTopic(TopicRequest request) {

        if (topicRepository.existsByTenTopicIgnoreCase(request.getTenTopic())) {
            throw new AppException(ErrorCode.TOPIC_EXISTED);
        }

        Topic topic = topicMapper.toEntity(request);
        topic.setStatus(true);

        return topicMapper.toResponse(topicRepository.save(topic));
    }

    @Override
    @Transactional
    public TopicResponse updateTopic(UUID id, TopicRequest request) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_EXISTED));

        // 2. Nếu đổi tên, phải check xem tên mới có trùng với Topic khác không
        if (!topic.getTenTopic().equalsIgnoreCase(request.getTenTopic()) &&
                topicRepository.existsByTenTopicIgnoreCase(request.getTenTopic())) {
            throw new AppException(ErrorCode.TOPIC_EXISTED);
        }

        topicMapper.updateEntity(topic, request);
        return topicMapper.toResponse(topicRepository.save(topic));
    }

    @Override
    public PageResponse<TopicResponse> getAllTopicsPaging(int page, int size, String search) {
        // Sắp xếp theo ngày tạo mới nhất lên đầu
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        Page<Topic> topicPage = topicRepository.findAllWithSearch(search, pageable);

        return PageResponse.<TopicResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(topicPage.getTotalPages())
                .totalElements(topicPage.getTotalElements())
                .data(topicPage.getContent().stream().map(topicMapper::toResponse).toList())
                .build();
    }

    @Override
    public TopicResponse getTopicById(UUID id) {
        return topicRepository.findById(id)
                .map(topicMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_EXISTED));
    }

    @Override
    @Transactional
    public void toggleStatus(UUID id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_EXISTED));

        // Logic Xóa mềm: Đảo ngược trạng thái
        topic.setStatus(topic.getStatus() == null || !topic.getStatus());

        topicRepository.save(topic);
        log.info(">>> Topic ID {} đã được đổi trạng thái sang: {}", id, topic.getStatus());
    }
}

package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.GanTopicRequest;
import com.josephhieu.feedbackonline.dto.response.GanTopicResponse;
import com.josephhieu.feedbackonline.entity.*;
import com.josephhieu.feedbackonline.mapper.GanTopicMapper;
import com.josephhieu.feedbackonline.repository.*;
import com.josephhieu.feedbackonline.service.GanTopicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GanTopicServiceImpl implements GanTopicService {

    private final GanTopicRepository ganTopicRepository;
    private final LopRepository lopRepository;
    private final TrainerRepository trainerRepository;
    private final TopicRepository topicRepository;
    private final GanTopicMapper ganTopicMapper;

    @Override
    @Transactional
    public void assignTopics(GanTopicRequest request) {
        // 1. Kiểm tra danh sách topic gửi lên có trống không
        if (request.getDanhSachMaTopic() == null || request.getDanhSachMaTopic().isEmpty()) {
            throw new AppException(ErrorCode.ASSIGN_EMPTY_TOPIC_LIST);
        }

        // 2. Tìm thực thể Lớp và Trainer (Chung cho cả đống Topic)
        Lop lop = lopRepository.findById(request.getMaLop())
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));
        Trainer trainer = trainerRepository.findById(request.getMaTrainer())
                .orElseThrow(() -> new AppException(ErrorCode.TRAINER_NOT_EXISTED));

        List<GanTopic> listToSave = new ArrayList<>();

        // 3. Duyệt danh sách MaTopic để tạo bản ghi
        for (UUID maTopic : request.getDanhSachMaTopic()) {
            // Kiểm tra xem Topic này đã gán cho Lớp này chưa
            if (ganTopicRepository.existsByLop_MaLopAndTopic_MaTopic(request.getMaLop(), maTopic)) {
                log.warn("Topic {} đã tồn tại trong lớp {}, bỏ qua...", maTopic, lop.getTenLop());
                continue; // Bỏ qua nếu đã gán rồi, không cần báo lỗi để tránh ngắt quãng quá trình gán hàng loạt
            }

            Topic topic = topicRepository.findById(maTopic)
                    .orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_EXISTED));

            GanTopic ganTopic = GanTopic.builder()
                    .lop(lop)
                    .trainer(trainer)
                    .topic(topic)
                    .build();

            listToSave.add(ganTopic);
        }

        if (!listToSave.isEmpty()) {
            ganTopicRepository.saveAll(listToSave);
            log.info(">>> Đã gán thành công {} topic cho lớp {}", listToSave.size(), lop.getTenLop());
        }
    }

    @Override
    public List<GanTopicResponse> getAssignmentsByClass(UUID maLop) {
        return ganTopicRepository.findAllByLop_MaLop(maLop).stream()
                .map(ganTopicMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deleteAssignment(UUID maGanTopic) {
        if (!ganTopicRepository.existsById(maGanTopic)) {
            throw new AppException(ErrorCode.ASSIGN_NOT_EXISTED);
        }
        ganTopicRepository.deleteById(maGanTopic);
    }

    @Override
    @Transactional
    public void clearAssignmentsByClass(UUID maLop) {
        log.info(">>> Xóa toàn bộ cấu hình gán topic cho lớp ID: {}", maLop);
        ganTopicRepository.deleteAllByLop_MaLop(maLop);
    }
}
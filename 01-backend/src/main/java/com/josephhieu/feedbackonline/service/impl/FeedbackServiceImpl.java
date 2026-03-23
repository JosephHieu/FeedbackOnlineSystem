package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.FeedbackRequest;
import com.josephhieu.feedbackonline.dto.response.PendingFeedbackResponse;
import com.josephhieu.feedbackonline.entity.*;
import com.josephhieu.feedbackonline.entity.id.ChiTietFeedbackId;
import com.josephhieu.feedbackonline.repository.*;
import com.josephhieu.feedbackonline.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ChiTietFeedbackRepository chiTietFeedbackRepository;
    private final HocVienRepository hocVienRepository;
    private final LopRepository lopRepository;
    private final TopicRepository topicRepository;
    private final TrainerRepository trainerRepository;
    private final TemplateRepository templateRepository;
    private final CauHoiRepository cauHoiRepository;

    @Override
    @Transactional
    public void submitFeedback(FeedbackRequest request) {
        if (feedbackRepository.existsByHocVien_MaHocVienAndTopic_MaTopicAndLop_MaLop(
                request.getMaHocVien(), request.getMaTopic(), request.getMaLop())) {
            throw new AppException(ErrorCode.FEEDBACK_ALREADY_SUBMITTED);
        }

        HocVien hv = hocVienRepository.findById(request.getMaHocVien())
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_EXISTED));

        Lop lop = lopRepository.findById(request.getMaLop())
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));

        Topic topic = topicRepository.findById(request.getMaTopic())
                .orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_EXISTED));

        Trainer trainer = trainerRepository.findById(request.getMaTrainer())
                .orElseThrow(() -> new AppException(ErrorCode.TRAINER_NOT_EXISTED));

        Template template = templateRepository.findById(request.getMaTemplate())
                .orElseThrow(() -> new AppException(ErrorCode.TEMPLATE_NOT_EXISTED));

        // 3. Tạo và Lưu bản ghi Feedback (Bảng chính)
        Feedback feedback = Feedback.builder()
                .hocVien(hv)
                .lop(lop)
                .topic(topic)
                .trainer(trainer)
                .template(template)
                .build();

        Feedback savedFeedback = feedbackRepository.save(feedback);

        // 4. Chuyển đổi và Lưu danh sách ChiTietFeedback (Bảng chi tiết điểm)
        List<ChiTietFeedback> chiTietEntities = request.getChiTietFeedback().stream()
                .map(item -> ChiTietFeedback.builder()
                        .id(new ChiTietFeedbackId(savedFeedback.getMaFeedback(), item.getMaCauHoi()))
                        .feedback(savedFeedback)
                        .cauHoi(cauHoiRepository.findById(item.getMaCauHoi())
                                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_EXIST)))
                        .diem(item.getDiem())
                        .ghiChu(item.getGhiChu())
                        .build())
                .toList();

        chiTietFeedbackRepository.saveAll(chiTietEntities);
    }

    @Override
    public List<PendingFeedbackResponse> getPendingFeedbackList(UUID maLop, UUID maTopic) {

        if (maTopic == null || maLop == null) {
            return List.of();
        }

        // 1. Lấy thông tin Topic để gán tên vào Response
        Topic topic = topicRepository.findById(maTopic)
                .orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_EXISTED));

        // 2. Gọi câu Query NOT IN thần thánh trong Repository
        List<HocVien> listChuaLam = feedbackRepository.findHocVienChuaFeedback(maLop, maTopic);

        // 3. Map sang DTO để trả về Frontend
        return listChuaLam.stream()
                .map(hv -> PendingFeedbackResponse.builder()
                        .maHocVien(hv.getMaHocVien())
                        .tenHocVien(hv.getTenHocVien())
                        .tenLop(hv.getLop().getTenLop())
                        .tenTopic(topic.getTenTopic())
                        .build())
                .toList();
    }
}
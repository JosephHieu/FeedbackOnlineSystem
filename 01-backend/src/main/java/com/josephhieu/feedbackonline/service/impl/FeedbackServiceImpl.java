package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.FeedbackRequest;
import com.josephhieu.feedbackonline.dto.response.FeedbackExportResponse;
import com.josephhieu.feedbackonline.dto.response.FeedbackResponse;
import com.josephhieu.feedbackonline.dto.response.PendingFeedbackResponse;
import com.josephhieu.feedbackonline.dto.response.UserTopicResponse;
import com.josephhieu.feedbackonline.entity.*;
import com.josephhieu.feedbackonline.entity.id.ChiTietFeedbackId;
import com.josephhieu.feedbackonline.repository.*;
import com.josephhieu.feedbackonline.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ChiTietFeedbackRepository chiTietFeedbackRepository;
    private final HocVienRepository hocVienRepository;
    private final LopRepository lopRepository;
    private final TopicRepository topicRepository;
    private final TrainerRepository trainerRepository;
    private final TemplateRepository templateRepository;
    private final CauHoiRepository cauHoiRepository;
    private final GanTopicRepository ganTopicRepository;

    @Override
    @Transactional
    public void submitFeedback(FeedbackRequest request) {
        // 1. LẤY USERNAME TỪ SECURITY CONTEXT
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. TÌM HỌC VIÊN
        HocVien hv = hocVienRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_EXISTED));

        // 3. XỬ LÝ GHI ĐÈ
        // Tìm xem đã có feedback cũ
        Optional<Feedback> oldFeedback = feedbackRepository.findByHocVien_MaHocVienAndTopic_MaTopicAndLop_MaLop(
                hv.getMaHocVien(), request.getMaTopic(), request.getMaLop());

        if (oldFeedback.isPresent()) {
            log.info(">>> Học viên {} thực hiện đánh giá lại cho Topic {}", currentUsername, request.getMaTopic());

            // Xóa chi tiết cũ trước
            chiTietFeedbackRepository.deleteAllByFeedback_MaFeedback(oldFeedback.get().getMaFeedback());
            // Xóa feedback cũ
            feedbackRepository.delete(oldFeedback.get());

            feedbackRepository.flush();
        }

        // 4. TÌM CÁC THỰC THỂ KHÁC
        Lop lop = lopRepository.findById(request.getMaLop())
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));

        Topic topic = topicRepository.findById(request.getMaTopic())
                .orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_EXISTED));

        Trainer trainer = trainerRepository.findById(request.getMaTrainer())
                .orElseThrow(() -> new AppException(ErrorCode.TRAINER_NOT_EXISTED));

        Template template = templateRepository.findById(request.getMaTemplate())
                .orElseThrow(() -> new AppException(ErrorCode.TEMPLATE_NOT_EXISTED));

        // 5. LƯU MỚI
        Feedback feedback = Feedback.builder()
                .hocVien(hv)
                .lop(lop)
                .topic(topic)
                .trainer(trainer)
                .template(template)
                .build();

        Feedback savedFeedback = feedbackRepository.save(feedback);

        // 6. LƯU CHI TIẾT
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

    @Override
    public List<UserTopicResponse> getTopicsForStudent(String username) {
        // 1. Tìm học viên
        HocVien hv = hocVienRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_EXISTED));

        Lop lop = hv.getLop();

        if (lop == null) {
            log.warn("Học viên {} chưa được gán vào lớp nào!", username);
            return List.of();
        }

        if (lop.getTemplate() == null) {
            throw new AppException(ErrorCode.CLASS_HAS_NO_TEMPLATE);
        }


        UUID maTemplate = lop.getTemplate().getMaTemplate();

        // 3. Lấy các Topic được gán cho Lớp này
        List<GanTopic> assignments = ganTopicRepository.findAllByLop_MaLop(lop.getMaLop());

        return assignments.stream().map(gt -> {
            // Kiểm tra xem HV đã làm Topic này chưa
            boolean isDone = feedbackRepository.existsFeedback(hv.getMaHocVien(),
                     gt.getTopic().getMaTopic(), lop.getMaLop());

            return UserTopicResponse.builder()
                    .maTopic(gt.getTopic().getMaTopic())
                    .tenTopic(gt.getTopic().getTenTopic())
                    .tenTrainer(gt.getTrainer().getTenTrainer())
                    .maLop(lop.getMaLop())
                    .maTrainer(gt.getTrainer().getMaTrainer())
                    .maTemplate(maTemplate)
                    .isCompleted(isDone)
                    .build();
        }).toList();
    }

    @Override
    public FeedbackResponse getSubmittedFeedback(UUID maLop, UUID maTopic) {
        // 1. Lấy user đang đăng nhập
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        HocVien hv = hocVienRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_EXISTED));

        // 2. Tìm feedback cũ
        Feedback feedback = feedbackRepository.findByHocVien_MaHocVienAndTopic_MaTopicAndLop_MaLop(
                        hv.getMaHocVien(), maTopic, maLop)
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_FOUND));

        // 3. Trả về DTO chứa các câu trả lời cũ
        return FeedbackResponse.builder()
                .maFeedback(feedback.getMaFeedback())
                .chiTietFeedback(feedback.getChiTietFeedbacks().stream()
                        .map(ct -> FeedbackResponse.ChiTietResponse.builder()
                                .maCauHoi(ct.getCauHoi().getMaCauHoi())
                                .diem(ct.getDiem())
                                .ghiChu(ct.getGhiChu())
                                .build())
                        .toList())
                .build();
    }

    @Override
    public List<FeedbackExportResponse> getPreviewFeedback(UUID maLop, UUID maTopic) {

        List<Feedback> feedbacks = feedbackRepository.findAllByLop_MaLopAndTopic_MaTopic(maLop, maTopic);

        return feedbacks.stream().map(fb -> FeedbackExportResponse.builder()
                        .tenHocVien(fb.getHocVien().getTenHocVien())
                        .tenLop(fb.getLop().getTenLop())
                        .tenTopic(fb.getTopic().getTenTopic())
                        .tenTrainer(fb.getTrainer().getTenTrainer())
                        .chiTietFeedback(fb.getChiTietFeedbacks().stream().map(ct ->
                                FeedbackExportResponse.ChiTietExport.builder()
                                        .tenCauHoi(ct.getCauHoi().getTenCauHoi())
                                        .diem(ct.getDiem())
                                        .ghiChu(ct.getGhiChu())
                                        .build())
                                .toList())
                .build())
                .toList();
    }

    @Override
    public ByteArrayInputStream exportFeedbackToExcel(UUID maLop, UUID maTopic) {

        List<FeedbackExportResponse> data = getPreviewFeedback(maLop, maTopic);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Ket_Qua_Feedback");

            // 1. Tạo Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            // 2. Tạo Header Row
            Row headerRow = sheet.createRow(0);
            String[] columns = {"STT", "Học Viên", "Lớp", "Topic", "Trainer", "Câu Hỏi", "Điểm", "Ghi Chú"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // 3. Đổ dữ liệu
            int rowIdx = 1;
            int stt = 1;
            for (FeedbackExportResponse fb : data) {
                for (FeedbackExportResponse.ChiTietExport ct : fb.getChiTietFeedback()) {
                    Row row = sheet.createRow(rowIdx++);
                    row.createCell(0).setCellValue(stt);
                    row.createCell(1).setCellValue(fb.getTenHocVien());
                    row.createCell(2).setCellValue(fb.getTenLop());
                    row.createCell(3).setCellValue(fb.getTenTopic());
                    row.createCell(4).setCellValue(fb.getTenTrainer());
                    row.createCell(5).setCellValue(ct.getTenCauHoi());
                    row.createCell(6).setCellValue(ct.getDiem());
                    row.createCell(7).setCellValue(ct.getGhiChu());
                }
                stt++;
            }

            // Tự động căn chỉnh độ rộng cột
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Lỗi xuất Excel: " + e.getMessage());
        }
    }

}
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
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
            throw new AppException(ErrorCode.EXCEL_EXPORT_ERROR);
        }
    }

    @Override
    public ByteArrayInputStream exportAllFeedbackByLop(UUID maLop) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Báo cáo Tổng hợp");

            // 1. TẠO CÁC STYLE CHUẨN
            // Style cho Tiêu đề chính (Chữ đỏ, to)
            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 18);
            titleFont.setColor(IndexedColors.RED.getIndex());
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            // Style cho dòng thông tin Topic/Trainer (Nền xám, chữ đậm)
            CellStyle topicHeaderStyle = workbook.createCellStyle();
            Font topicFont = workbook.createFont();
            topicFont.setBold(true);
            topicHeaderStyle.setFont(topicFont);
            topicHeaderStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            topicHeaderStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            topicHeaderStyle.setAlignment(HorizontalAlignment.LEFT);
            topicHeaderStyle.setBorderBottom(BorderStyle.THIN);

            // Style cho Header của bảng (Nền xanh, chữ trắng, đậm)
            CellStyle tableHeaderStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            tableHeaderStyle.setFont(headerFont);
            tableHeaderStyle.setFillForegroundColor(IndexedColors.CORNFLOWER_BLUE.getIndex());
            tableHeaderStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            tableHeaderStyle.setAlignment(HorizontalAlignment.CENTER);
            applyBorders(tableHeaderStyle); // Thêm border cho đẹp

            // Style cho nội dung dữ liệu (Chữ thường, có border)
            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setAlignment(HorizontalAlignment.CENTER);
            dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            dataStyle.setWrapText(true); // Cho phép xuống dòng trong ô
            applyBorders(dataStyle);

            // 2. LẤY DỮ LIỆU
            List<Feedback> allFeedbacks = feedbackRepository.findAllByLop_MaLop(maLop);
            if (allFeedbacks.isEmpty()) {
                throw new AppException(ErrorCode.FEEDBACK_NOT_FOUND);
            }

            // Nhóm theo Topic
            Map<Topic, List<Feedback>> groupedData = allFeedbacks.stream()
                    .collect(Collectors.groupingBy(Feedback::getTopic));

            int currentRow = 0;

            // 3. TIÊU ĐỀ CHÍNH
            Row titleRow = sheet.createRow(currentRow++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("FeedbackOnline - BÁO CÁO TỔNG HỢP KẾT QUẢ");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 8));

            currentRow++; // Cách 1 dòng

            for (Map.Entry<Topic, List<Feedback>> entry : groupedData.entrySet()) {
                Topic topic = entry.getKey();
                List<Feedback> feedbacks = entry.getValue();

                if (feedbacks.isEmpty()) continue;

                // 4. DÒNG THÔNG TIN CHUNG (Topic & Trainer)
                Row infoRow = sheet.createRow(currentRow++);
                Cell infoCell = infoRow.createCell(0);
                String infoText = String.format("CHỦ ĐỀ: %s  |  GIẢNG VIÊN: %s",
                        topic.getTenTopic(),
                        feedbacks.get(0).getTrainer().getTenTrainer());
                infoCell.setCellValue(infoText);
                infoCell.setCellStyle(topicHeaderStyle);
                sheet.addMergedRegion(new CellRangeAddress(currentRow - 1, currentRow - 1, 0, 8));

                // 5. HEADER BẢNG DỮ LIỆU
                Row headerRow = sheet.createRow(currentRow++);
                String[] baseHeaders = {"STT", "Mã HV", "Họ tên"};
                for (int i = 0; i < baseHeaders.length; i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(baseHeaders[i]);
                    cell.setCellStyle(tableHeaderStyle);
                }

                // Lấy danh sách câu hỏi từ bản ghi đầu tiên để làm Header tiêu chí
                List<ChiTietFeedback> sampleCts = feedbacks.get(0).getChiTietFeedbacks();
                int colIdx = 3;
                for (int i = 0; i < sampleCts.size(); i++) {
                    Cell cell = headerRow.createCell(colIdx++);
                    cell.setCellValue("Tiêu chí " + (i + 1));
                    cell.setCellStyle(tableHeaderStyle);
                }
                Cell noteHeader = headerRow.createCell(colIdx);
                noteHeader.setCellValue("Ghi chú tổng hợp");
                noteHeader.setCellStyle(tableHeaderStyle);

                // 6. ĐỔ DỮ LIỆU TỪNG HỌC VIÊN (DẠNG PIVOT)
                int stt = 1;
                for (Feedback fb : feedbacks) {
                    Row row = sheet.createRow(currentRow++);

                    // Cột STT, Mã, Tên
                    createStyledCell(row, 0, String.valueOf(stt++), dataStyle);
                    createStyledCell(row, 1, fb.getHocVien().getMaHocVien().toString().substring(0, 8), dataStyle);
                    createStyledCell(row, 2, fb.getHocVien().getTenHocVien(), dataStyle);

                    // Các cột điểm
                    List<ChiTietFeedback> cts = fb.getChiTietFeedbacks();
                    StringBuilder allNotes = new StringBuilder();
                    int scoreCol = 3;
                    for (ChiTietFeedback ct : cts) {
                        Cell scoreCell = row.createCell(scoreCol++);
                        scoreCell.setCellValue(ct.getDiem());
                        scoreCell.setCellStyle(dataStyle);

                        if (ct.getGhiChu() != null && !ct.getGhiChu().isBlank()) {
                            allNotes.append("- ").append(ct.getGhiChu()).append("\n");
                        }
                    }

                    // Cột ghi chú cuối cùng
                    Cell noteCell = row.createCell(scoreCol);
                    noteCell.setCellValue(allNotes.toString().trim());
                    noteCell.setCellStyle(dataStyle);
                    // Cho phép xuống dòng trong ô ghi chú
                    noteCell.getCellStyle().setWrapText(true);
                }

                currentRow += 2; // Khoảng cách giữa các khối Topic
            }

            // 7. AUTO SIZE COLUMNS
            for (int i = 0; i <= 10; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            log.error("Lỗi xuất Excel tổng hợp: ", e);
            throw new AppException(ErrorCode.EXCEL_NOT_CREATE);
        }
    }

    // Hàm bổ trợ viết Cell có Style cho gọn code
    private void createStyledCell(Row row, int column, String value, CellStyle style) {
        Cell cell = row.createCell(column);
        cell.setCellValue(value);
        cell.setCellStyle(style);
    }

    // Hàm bổ trợ tạo Style cho nhanh
    private CellStyle createStyle(Workbook workbook, short bgColor, boolean isBold, int fontSize) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(isBold);
        font.setFontHeightInPoints((short) fontSize);
        style.setFont(font);

        // Căn giữa
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        // Thêm Border cho "Pro"
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);

        return style;
    }

    // Hàm bổ trợ gán Border cho Style
    private void applyBorders(CellStyle style) {
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
    }
}
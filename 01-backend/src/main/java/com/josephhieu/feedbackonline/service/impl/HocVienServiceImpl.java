package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.request.HocVienRequest;
import com.josephhieu.feedbackonline.dto.response.HocVienResponse;
import com.josephhieu.feedbackonline.entity.HocVien;
import com.josephhieu.feedbackonline.entity.Lop;
import com.josephhieu.feedbackonline.mapper.HocVienMapper;
import com.josephhieu.feedbackonline.repository.HocVienRepository;
import com.josephhieu.feedbackonline.repository.LopRepository;
import com.josephhieu.feedbackonline.service.HocVienService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class HocVienServiceImpl implements HocVienService {

    private final HocVienRepository hocVienRepository;
    private final LopRepository lopRepository;
    private final HocVienMapper hocVienMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public HocVienResponse createHocVien(HocVienRequest request) {
        // 1. Kiểm tra username đã tồn tại chưa
        if (hocVienRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // 2. Kiểm tra Lớp có tồn tại không
        Lop lop = lopRepository.findById(request.getMaLop())
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));

        // 3. Map sang Entity và bổ sung thông tin
        HocVien hocVien = hocVienMapper.toEntity(request);
        hocVien.setLop(lop);
        hocVien.setPassword(passwordEncoder.encode("123456")); // Mật khẩu mặc định
        hocVien.setStatus(true);

        return hocVienMapper.toResponse(hocVienRepository.save(hocVien));
    }

    @Override
    @Transactional
    public HocVienResponse updateHocVien(UUID maHocVien, HocVienRequest request) {
        HocVien hocVien = hocVienRepository.findById(maHocVien)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_EXISTED));

        Lop lop = lopRepository.findById(request.getMaLop())
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));

        // Cập nhật thông tin qua Mapper
        hocVienMapper.updateEntity(hocVien, request);
        hocVien.setLop(lop);

        return hocVienMapper.toResponse(hocVienRepository.save(hocVien));
    }

    @Override
    public PageResponse<HocVienResponse> getAllHocViensPaging(UUID maLop, int page, int size, String search) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        Page<HocVien> hocVienPage;

        if (search != null && !search.trim().isEmpty()) {
            hocVienPage = hocVienRepository.findByLop_MaLopAndTenHocVienContainingIgnoreCase(maLop, search, pageable);
        } else {
            hocVienPage = hocVienRepository.findByLop_MaLop(maLop, pageable);
        }

        return PageResponse.<HocVienResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(hocVienPage.getTotalPages())
                .totalElements(hocVienPage.getTotalElements())
                .data(hocVienPage.getContent().stream().map(hocVienMapper::toResponse).toList())
                .build();
    }

    @Override
    public HocVienResponse getHocVienById(UUID maHocVien) {
        return hocVienRepository.findById(maHocVien)
                .map(hocVienMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_EXISTED));
    }

    @Override
    @Transactional
    public void deleteHocVien(UUID maHocVien) {
        HocVien hocVien = hocVienRepository.findById(maHocVien)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_EXISTED));

        // Kiểm tra nếu status bị null thì mặc định là false (hoặc true tùy bạn)
        // Sau đó mới thực hiện đảo ngược
        Boolean currentStatus = hocVien.getStatus();
        if (currentStatus == null) {
            currentStatus = false;
        }

        hocVien.setStatus(!currentStatus);

        hocVienRepository.save(hocVien);
        log.info("Học viên {} đã thay đổi trạng thái thành công", maHocVien);
    }

    @Override
    @Transactional
    public void importFromExcel(MultipartFile file, UUID maLop) {
        // 1. Kiểm tra lớp có tồn tại không
        Lop lop = lopRepository.findById(maLop)
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));

        // 2. Kiểm tra định dạng file
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            throw new AppException(ErrorCode.INVALID_FILE_FORMAT);
        }

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            List<HocVien> studentsToSave = new ArrayList<>();
            String defaultPassword = passwordEncoder.encode("123456");

            for (Row row : sheet) {
                // Bỏ qua dòng tiêu đề (dòng 0)
                if (row.getRowNum() == 0) continue;

                Cell cellUsername = row.getCell(0);
                Cell cellFullName = row.getCell(1);

                if (cellUsername == null || cellFullName == null) continue;

                String username = getCellValueAsString(cellUsername);
                String fullName = getCellValueAsString(cellFullName);

                // Nếu username chưa tồn tại thì mới thêm vào danh sách lưu
                if (!username.isEmpty() && !hocVienRepository.existsByUsername(username)) {
                    studentsToSave.add(HocVien.builder()
                            .username(username)
                            .tenHocVien(fullName)
                            .password(defaultPassword)
                            .lop(lop)
                            .status(true)
                            .build());
                }
            }

            if (!studentsToSave.isEmpty()) {
                hocVienRepository.saveAll(studentsToSave);
            }

        } catch (IOException e) {
            throw new AppException(ErrorCode.IMPORT_ERROR);
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                // Xử lý trường hợp số (ví dụ: 2024 -> "2024")
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }
}
package com.josephhieu.feedbackonline.service.impl;

import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.common.exception.AppException;
import com.josephhieu.feedbackonline.common.exception.ErrorCode;
import com.josephhieu.feedbackonline.dto.response.HocVienResponse;
import com.josephhieu.feedbackonline.entity.HocVien;
import com.josephhieu.feedbackonline.entity.Lop;
import com.josephhieu.feedbackonline.mapper.HocVienMapper;
import com.josephhieu.feedbackonline.repository.HocVienRepository;
import com.josephhieu.feedbackonline.repository.LopRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HocVienServiceImplTest {

    @Mock private HocVienRepository hocVienRepository;
    @Mock private LopRepository lopRepository;
    @Mock private HocVienMapper hocVienMapper;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private HocVienServiceImpl hocVienService;

    @Nested
    @DisplayName("Tests cho chức năng Phân trang & Tìm kiếm")
    class PagingTests {
        @Test
        @DisplayName("Lấy danh sách phân trang - Thành công")
        void getAllHocViensPaging_Success() {
            // GIVEN
            UUID lopId = UUID.randomUUID();
            HocVien hv = HocVien.builder().tenHocVien("Nguyen Van A").build();
            Page<HocVien> mockPage = new PageImpl<>(List.of(hv));

            when(hocVienRepository.findByLop_MaLop(eq(lopId), any(Pageable.class))).thenReturn(mockPage);
            when(hocVienMapper.toResponse(any())).thenReturn(HocVienResponse.builder().tenHocVien("Nguyen Van A").build());

            // WHEN
            PageResponse<HocVienResponse> response = hocVienService.getAllHocViensPaging(lopId, 1, 10, null);

            // THEN
            assertEquals(1, response.getTotalElements());
            assertEquals(1, response.getCurrentPage());
            assertEquals("Nguyen Van A", response.getData().get(0).getTenHocVien());
        }
    }

    @Nested
    @DisplayName("Tests cho chức năng Import Excel")
    class ImportExcelTests {
        @Test
        @DisplayName("Import Excel thành công - Chỉ lưu những username chưa tồn tại")
        void importFromExcel_Success() throws IOException {
            // GIVEN
            UUID lopId = UUID.randomUUID();
            when(lopRepository.findById(lopId)).thenReturn(Optional.of(new Lop()));
            when(passwordEncoder.encode(any())).thenReturn("encoded_123456");

            byte[] excelContent = createMockExcel();
            MockMultipartFile file = new MockMultipartFile("file", "students.xlsx",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelContent);

            when(hocVienRepository.existsByUsername("user1")).thenReturn(true);
            when(hocVienRepository.existsByUsername("user2")).thenReturn(false);

            ArgumentCaptor<List<HocVien>> captor = ArgumentCaptor.forClass(List.class);

            // WHEN
            hocVienService.importFromExcel(file, lopId);

            // THEN
            verify(hocVienRepository).saveAll(captor.capture());
            List<HocVien> capturedList = captor.getValue();
            assertEquals(1, capturedList.size());
            assertEquals("user2", capturedList.get(0).getUsername());
        }

        @Test
        @DisplayName("Import thất bại - Sai định dạng file")
        void importFromExcel_WrongFormat_ThrowsException() {
            // GIVEN
            MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "content".getBytes());
            when(lopRepository.findById(any())).thenReturn(Optional.of(new Lop()));

            // WHEN & THEN
            AppException ex = assertThrows(AppException.class, () -> hocVienService.importFromExcel(file, UUID.randomUUID()));
            assertEquals(ErrorCode.INVALID_FILE_FORMAT, ex.getErrorCode());
        }
    }

    @Test
    @DisplayName("Thay đổi trạng thái (Xóa mềm) - Đảo ngược status thành công")
    void deleteHocVien_ToggleStatus_Success() {
        // GIVEN
        UUID hvId = UUID.randomUUID();
        HocVien hocVien = HocVien.builder().maHocVien(hvId).status(true).build();
        when(hocVienRepository.findById(hvId)).thenReturn(Optional.of(hocVien));

        // WHEN
        hocVienService.deleteHocVien(hvId);

        // THEN
        assertFalse(hocVien.getStatus()); // true -> false
        verify(hocVienRepository).save(hocVien);
    }

    // --- HELPER TO CREATE EXCEL ---
    private byte[] createMockExcel() throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet();
            // Header
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Username");
            header.createCell(1).setCellValue("Fullname");

            // Data 1 (Đã tồn tại)
            Row row1 = sheet.createRow(1);
            row1.createCell(0).setCellValue("user1");
            row1.createCell(1).setCellValue("Hoc Vien Một");

            // Data 2 (Mới)
            Row row2 = sheet.createRow(2);
            row2.createCell(0).setCellValue("user2");
            row2.createCell(1).setCellValue("Hoc Vien Hai");

            workbook.write(bos);
            return bos.toByteArray();
        }
    }
}
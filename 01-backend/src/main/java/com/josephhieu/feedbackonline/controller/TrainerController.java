package com.josephhieu.feedbackonline.controller;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import com.josephhieu.feedbackonline.common.dto.response.PageResponse;
import com.josephhieu.feedbackonline.dto.request.TrainerRequest;
import com.josephhieu.feedbackonline.dto.response.TrainerResponse;
import com.josephhieu.feedbackonline.service.TrainerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/trainers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class TrainerController {

    private final TrainerService trainerService;

    @PostMapping
    public ResponseEntity<ApiResponse<TrainerResponse>> createTrainer(
            @RequestBody @Valid TrainerRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> [POST] Tạo mới Trainer: Account='{}', Name='{}'", request.getAccount(), request.getTenTrainer());
        TrainerResponse result = trainerService.createTrainer(request);
        log.info("<<< [POST] Tạo Trainer thành công: ID={}", result.getMaTrainer());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        result,
                        "Thêm giảng viên thành công",
                        servletRequest.getRequestURI()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TrainerResponse>>> getAllTrainers(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "search", required = false) String search,
            HttpServletRequest servletRequest) {

        log.info(">>> [GET] Truy vấn danh sách Trainer - Page: {}, Size: {}, Search: '{}'", page, size, search);
        PageResponse<TrainerResponse> results = trainerService.getAllTrainersPaging(page, size, search);

        return ResponseEntity.ok(ApiResponse.success(
                results,
                "Lấy danh sách giảng viên thành công",
                servletRequest.getRequestURI()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TrainerResponse>> getTrainerById(
            @PathVariable UUID id,
            HttpServletRequest servletRequest) {

        log.info(">>> [GET] Truy vấn chi tiết Trainer ID: {}", id);
        TrainerResponse result = trainerService.getTrainerById(id);

        return ResponseEntity.ok(ApiResponse.success(
                result,
                "Lấy thông tin giảng viên thành công",
                servletRequest.getRequestURI()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TrainerResponse>> updateTrainer(
            @PathVariable UUID id,
            @RequestBody @Valid TrainerRequest request,
            HttpServletRequest servletRequest) {

        log.info(">>> [PUT] Cập nhật Trainer ID: {}", id);
        TrainerResponse result = trainerService.updateTrainer(id, request);
        log.info("<<< [PUT] Cập nhật thành công cho Trainer: {}", result.getTenTrainer());

        return ResponseEntity.ok(ApiResponse.success(
                result,
                "Cập nhật thông tin giảng viên thành công",
                servletRequest.getRequestURI()));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<String>> toggleTrainerStatus(
            @PathVariable UUID id,
            HttpServletRequest servletRequest) {

        log.info(">>> [PATCH] Thay đổi trạng thái (Xóa mềm) Trainer ID: {}", id);
        trainerService.toggleStatus(id);

        return ResponseEntity.ok(ApiResponse.success(
                "Thay đổi trạng thái giảng viên thành công",
                null,
                servletRequest.getRequestURI()));
    }
}
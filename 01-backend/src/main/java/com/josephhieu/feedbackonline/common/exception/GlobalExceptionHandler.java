package com.josephhieu.feedbackonline.common.exception;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private static final String TRACE_ID = "traceId";

    private ResponseEntity<ApiResponse<?>> buildResponse(ErrorCode errorCode, HttpServletRequest request) {
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .path(request.getRequestURI())
                        .traceId(MDC.get(TRACE_ID))
                        .build());
    }

    @ExceptionHandler(AppException.class)
    ResponseEntity<ApiResponse<?>> handleAppException(AppException exception, HttpServletRequest request) {
        return buildResponse(exception.getErrorCode(), request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<ApiResponse<?>> handleAccessDeniedException(AccessDeniedException exception, HttpServletRequest request) {
        return buildResponse(ErrorCode.UNAUTHORIZED, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<?>> handleValidation(MethodArgumentNotValidException exception, HttpServletRequest request) {
        String enumKey = exception.getBindingResult().getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.INVALID_KEY;

        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException e) {
            log.warn("[TraceId: {}] Validation key '{}' not found in ErrorCode enum", MDC.get(TRACE_ID), enumKey);
        }
        return buildResponse(errorCode, request);
    }

    @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
    ResponseEntity<ApiResponse<?>> handleMethodNotSupported(HttpServletRequest request) {
        // Có thể tạo thêm mã lỗi riêng trong ErrorCode nếu muốn đồng bộ hoàn toàn
        return ResponseEntity.status(405).body(ApiResponse.builder()
                .code(405)
                .message("Phương thức HTTP không được hỗ trợ")
                .path(request.getRequestURI())
                .traceId(MDC.get(TRACE_ID))
                .build());
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    ResponseEntity<ApiResponse<?>> handleHttpMessageNotReadable(HttpServletRequest request) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .code(400)
                .message("Dữ liệu gửi lên không đúng định dạng (JSON invalid hoặc sai kiểu dữ liệu)")
                .path(request.getRequestURI())
                .traceId(MDC.get(TRACE_ID))
                .build());
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiResponse<?>> handleRuntimeException(Exception exception, HttpServletRequest request) {
        String currentTraceId = MDC.get(TRACE_ID);
        log.error("[TraceId: {}] Critical System Error at path {}: ", currentTraceId, request.getRequestURI(), exception);

        return buildResponse(ErrorCode.UNCATEGORIZED_EXCEPTION, request);
    }
}
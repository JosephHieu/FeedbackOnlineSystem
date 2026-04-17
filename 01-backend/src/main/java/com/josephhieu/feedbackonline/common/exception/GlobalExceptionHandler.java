package com.josephhieu.feedbackonline.common.exception;

import com.josephhieu.feedbackonline.common.dto.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private static final String TRACE_ID = "traceId";

    private ResponseEntity<ApiResponse<?>> buildResponse(ErrorCode errorCode, HttpServletRequest request) {
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.error(errorCode.getCode(), errorCode.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(AppException.class)
    ResponseEntity<ApiResponse<?>> handleAppException(AppException exception, HttpServletRequest request) {
        log.warn("[TraceId: {}] Business Exception tại {}: {} - {}",
                MDC.get(TRACE_ID), request.getRequestURI(),
                exception.getErrorCode().getCode(), exception.getErrorCode().getMessage());
        return buildResponse(exception.getErrorCode(), request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<ApiResponse<?>> handleAccessDeniedException(AccessDeniedException exception, HttpServletRequest request) {
        log.warn("[TraceId: {}] Truy cập trái phép tại path: {}", MDC.get(TRACE_ID), request.getRequestURI());
        return buildResponse(ErrorCode.FORBIDDEN, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<?>> handleValidation(MethodArgumentNotValidException exception, HttpServletRequest request) {

        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();

            try {
                ErrorCode errorCode = ErrorCode.valueOf(errorMessage);
                errors.put(fieldName, errorCode.getMessage());
            } catch (IllegalArgumentException e) {
                errors.put(fieldName, errorMessage);
            }
        });

        log.warn("[TraceId: {}] Lỗi Validation tại {}: {}",
                MDC.get(TRACE_ID), request.getRequestURI(), errors);

        ApiResponse<Map<String, String>> apiResponse = ApiResponse.<Map<String, String>>builder()
                .code(ErrorCode.FIELD_REQUIRED.getCode())
                .message("Dữ liệu gửi lên không hợp lệ, vui lòng kiểm tra lại")
                .result(errors)
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    ResponseEntity<ApiResponse<?>> handleMethodNotSupported(HttpServletRequest request) {
        log.warn("[TraceId: {}] Phương thức không được hỗ trợ tại path: {}", MDC.get(TRACE_ID), request.getRequestURI());

        return buildResponse(ErrorCode.METHOD_NOT_SUPPORTED, request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<ApiResponse<?>> handleHttpMessageNotReadable(Exception exception, HttpServletRequest request) {
        log.warn("[TraceId: {}] Body Request không hợp lệ: {}", MDC.get(TRACE_ID), exception.getMessage());
        return buildResponse(ErrorCode.INVALID_JSON, request);
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiResponse<?>> handleRuntimeException(Exception exception, HttpServletRequest request) {
        log.error("[TraceId: {}] LỖI HỆ THỐNG NGHIÊM TRỌNG tại {}: ",
                MDC.get(TRACE_ID), request.getRequestURI(), exception);

        return buildResponse(ErrorCode.UNCATEGORIZED_EXCEPTION, request);
    }
}
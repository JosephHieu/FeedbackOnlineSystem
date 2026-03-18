package com.josephhieu.feedbackonline.common.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.slf4j.MDC;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiResponse<T> {

    private static final String TRACE_ID = "traceId";

    @Builder.Default
    int code = 1000;
    String message;
    T result;

    @Builder.Default
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime timestamp = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

    String path;
    String traceId;

    public static <T> ApiResponse<T> success(T result) {
        return ApiResponse.<T>builder()
                .result(result)
                .traceId(MDC.get(TRACE_ID))
                .build();
    }

    public static <T> ApiResponse<T> success(T result, String message, String path) {
        return ApiResponse.<T>builder()
                .result(result)
                .message(message)
                .path(path)
                .traceId(MDC.get(TRACE_ID))
                .build();
    }

    public static <T> ApiResponse<T> error(int code, String message, String path) {
        return ApiResponse.<T>builder()
                .code(code)
                .message(message)
                .path(path)
                .traceId(MDC.get(TRACE_ID))
                .build();
    }
}

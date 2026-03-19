package com.josephhieu.feedbackonline.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // SYSTEM ERRORS
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi chưa phân loại hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Mã lỗi không hợp lệ", HttpStatus.BAD_REQUEST),

    // AUTHENTICATION & AUTHORIZATION
    UNAUTHENTICATED(1002, "Sai tên đăng nhập hoặc mật khẩu", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1003, "Bạn không có quyền truy cập chức năng này", HttpStatus.FORBIDDEN),
    USER_NOT_EXISTED(1004, "Người dùng không tồn tại", HttpStatus.NOT_FOUND),
    USER_EXISTED(1005, "Tên đăng nhập đã tồn tại trong hệ thống", HttpStatus.BAD_REQUEST),
    TOKEN_INVALID(1006, "Phiên làm việc không hợp lệ", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(1007, "Phiên làm việc đã hết hạn", HttpStatus.UNAUTHORIZED),

    // VALIDATION ERRORS
    INVALID_PASSWORD(1008, "Mật khẩu phải có ít nhất 8 ký tự", HttpStatus.BAD_REQUEST),
    INVALID_USERNAME(1009, "Tên đăng nhập không đúng định dạng", HttpStatus.BAD_REQUEST),
    FORBIDDEN(1010, "Bạn không có quyền truy cập tài nguyên này", HttpStatus.FORBIDDEN),

    // TEMPLATE ERRORS
    TEMPLATE_NOT_EXISTED(2001, "Mẫu feedback không tồn tại", HttpStatus.NOT_FOUND),
    TEMPLATE_EXISTED(2002, "Tên mẫu feedback đã tồn tại", HttpStatus.BAD_REQUEST),
    TEMPLATE_IN_USE(2003, "Mẫu feedback đang được sử dụng bởi một lớp học, không thể xóa", HttpStatus.CONFLICT),
    INVALID_SCORE_RANGE(2004, "Điểm tối thiểu không được lớn hơn điểm tối đa", HttpStatus.BAD_REQUEST),
    INVALID_SCORE_NEGATIVE(2005, "Điểm số không được là số âm nhé!", HttpStatus.BAD_REQUEST),

    // CLASS (LOP) ERRORS
    CLASS_NOT_EXISTED(3001, "Lớp học không tồn tại", HttpStatus.NOT_FOUND),
    CLASS_EXISTED(3002, "Tên lớp học đã tồn tại", HttpStatus.BAD_REQUEST),

    // Nhóm lỗi Request
    METHOD_NOT_SUPPORTED(4005, "Phương thức HTTP không được hỗ trợ", HttpStatus.METHOD_NOT_ALLOWED),
    INVALID_JSON(4006, "Dữ liệu gửi lên không đúng định dạng", HttpStatus.BAD_REQUEST),

    ;
    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatus statusCode;
}
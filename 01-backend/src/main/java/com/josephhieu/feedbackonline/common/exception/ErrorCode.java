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
    OLD_PASSWORD_NOT_MATCH(1011, "Mật khẩu cũ không chính xác cưng ơi", HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_CHANGED(1012, "Mật khẩu mới không được trùng với mật khẩu cũ", HttpStatus.BAD_REQUEST),
    CONFIRM_PASSWORD_NOT_MATCH(1013, "Xác nhận mật khẩu mới không khớp", HttpStatus.BAD_REQUEST),

    // TEMPLATE ERRORS
    TEMPLATE_NOT_EXISTED(2001, "Mẫu feedback không tồn tại", HttpStatus.NOT_FOUND),
    TEMPLATE_EXISTED(2002, "Tên mẫu feedback đã tồn tại", HttpStatus.BAD_REQUEST),
    TEMPLATE_IN_USE(2003, "Mẫu feedback đang được sử dụng bởi một lớp học, không thể xóa", HttpStatus.CONFLICT),
    INVALID_SCORE_RANGE(2004, "Điểm tối thiểu không được lớn hơn điểm tối đa", HttpStatus.BAD_REQUEST),
    INVALID_SCORE_NEGATIVE(2005, "Điểm số không được là số âm nhé!", HttpStatus.BAD_REQUEST),
    TEMPLATE_IS_DISABLED(2006, "Mẫu khảo sát này đang bị khóa, không thể gán cho lớp", HttpStatus.BAD_REQUEST),
    TEMPLATE_HAS_NO_QUESTIONS(2007, "Mẫu này chưa có câu hỏi nào, không gán được đâu nhé", HttpStatus.BAD_REQUEST),

    // CLASS (LOP) ERRORS
    CLASS_NOT_EXISTED(3001, "Lớp học không tồn tại", HttpStatus.NOT_FOUND),
    CLASS_EXISTED(3002, "Tên lớp học đã tồn tại", HttpStatus.BAD_REQUEST),
    CLASS_HAS_STUDENTS(3003, "Lớp học đang có học viên, không thể xóa!", HttpStatus.CONFLICT),
    CLASS_ALREADY_ASSIGNED(3004, "Lớp học này đã được gán mẫu khảo sát này rồi!", HttpStatus.BAD_REQUEST),
    CLASS_HAS_NO_TEMPLATE(3005, "Lớp học không có template nào", HttpStatus.BAD_REQUEST),

    // Nhóm lỗi Request
    METHOD_NOT_SUPPORTED(4005, "Phương thức HTTP không được hỗ trợ!", HttpStatus.METHOD_NOT_ALLOWED),
    INVALID_JSON(4006, "Dữ liệu gửi lên không đúng định dạng", HttpStatus.BAD_REQUEST),
    FIELD_REQUIRED(4007, "Trường dữ liệu này là bắt buộc", HttpStatus.BAD_REQUEST),
    INVALID_UUID_FORMAT(4008, "Định dạng mã định danh (UUID) không hợp lệ", HttpStatus.BAD_REQUEST),

    // STUDENT (HOCVIEN) ERRORS
    STUDENT_NOT_EXISTED(5001, "Học viên không tồn tại", HttpStatus.NOT_FOUND),
    STUDENT_ALREADY_IN_CLASS(5002, "Học viên này đã ở trong lớp rồi", HttpStatus.BAD_REQUEST),
    USERNAME_EXISTED(5003, "Tên tài khoản học viên đã tồn tại", HttpStatus.BAD_REQUEST),

    // IMPORT & FILE ERRORS
    IMPORT_ERROR(6001, "Lỗi trong quá trình xử lý file Excel", HttpStatus.BAD_REQUEST),
    INVALID_FILE_FORMAT(6002, "Định dạng file không hỗ trợ (Chỉ nhận .xlsx)", HttpStatus.BAD_REQUEST),
    FILE_TOO_LARGE(6003, "File quá lớn, vui lòng chia nhỏ dữ liệu", HttpStatus.PAYLOAD_TOO_LARGE),
    EMPTY_FILE(6004, "File không có dữ liệu để xử lý", HttpStatus.BAD_REQUEST),

    // TRAINER ERRORS
    TRAINER_NOT_EXISTED(7001, "Giảng viên không tồn tại", HttpStatus.NOT_FOUND),
    TRAINER_ACCOUNT_EXISTED(7002, "Account giảng viên này đã có người dùng rồi", HttpStatus.BAD_REQUEST),
    TRAINER_NAME_INVALID(7003, "Tên giảng viên không được chứa con số nhé", HttpStatus.BAD_REQUEST),
    TRAINER_HAS_ASSIGNMENTS(7004, "Giảng viên này đang dạy, không xóa được", HttpStatus.CONFLICT),

    // TOPIC ERRORS
    TOPIC_NOT_EXISTED(8001, "Chủ đề feedback không tồn tại ", HttpStatus.NOT_FOUND),
    TOPIC_EXISTED(8002, "Tên chủ đề này đã tồn tại rồi", HttpStatus.BAD_REQUEST),
    TOPIC_IN_USE(8003, "Chủ đề này đã có dữ liệu feedback, không thể xóa cứng", HttpStatus.CONFLICT),

    // ASSIGN ERRORS (GÁN TOPIC)
    ASSIGN_NOT_EXISTED(9001, "Bản ghi gán topic không tồn tại", HttpStatus.NOT_FOUND),
    ASSIGN_ALREADY_EXISTED(9002, "Chủ đề này đã được gán cho lớp rồi", HttpStatus.BAD_REQUEST),
    ASSIGN_EMPTY_TOPIC_LIST(9003, "Vui lòng chọn ít nhất một chủ đề để gán nhé", HttpStatus.BAD_REQUEST),
    ASSIGN_TRAINER_NOT_MATCH(9004, "Giảng viên này không khớp với cấu hình hiện tại của lớp", HttpStatus.BAD_REQUEST),

    // --- FEEDBACK ERRORS ---
    FEEDBACK_ALREADY_SUBMITTED(10001, "Bạn đã thực hiện đánh giá cho chủ đề này rồi!", HttpStatus.BAD_REQUEST),
    INVALID_FEEDBACK_SCORE(10002, "Điểm đánh giá phải nằm trong khoảng từ 1 đến 5 nhé!", HttpStatus.BAD_REQUEST),
    QUESTION_NOT_IN_TEMPLATE(10003, "Câu hỏi này không thuộc về mẫu khảo sát của lớp!", HttpStatus.BAD_REQUEST),
    QUESTION_NOT_EXIST(10004, "Câu hỏi này không tồn tại", HttpStatus.NOT_FOUND),

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
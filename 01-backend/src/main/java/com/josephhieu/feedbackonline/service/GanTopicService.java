package com.josephhieu.feedbackonline.service;

import com.josephhieu.feedbackonline.dto.request.GanTopicRequest;
import com.josephhieu.feedbackonline.dto.response.GanTopicResponse;

import java.util.List;
import java.util.UUID;

public interface GanTopicService {
    // Gán nhiều topic cùng lúc
    void assignTopics(GanTopicRequest request);

    // Lấy danh sách đã gán của 1 lớp để hiện lên bảng
    List<GanTopicResponse> getAssignmentsByClass(UUID maLop);

    // Xóa 1 dòng gán cụ thể
    void deleteAssignment(UUID maGanTopic);

    // Xóa sạch cấu hình của 1 lớp (Nút "Xóa hết" trong ảnh)
    void clearAssignmentsByClass(UUID maLop);
}
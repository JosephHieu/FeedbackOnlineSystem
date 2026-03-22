package com.josephhieu.feedbackonline.repository;

import com.josephhieu.feedbackonline.entity.ChiTietFeedback;
import com.josephhieu.feedbackonline.entity.id.ChiTietFeedbackId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChiTietFeedbackRepository extends JpaRepository<ChiTietFeedback, ChiTietFeedbackId> {

    // Tìm toàn bộ câu trả lời của một bản Feedback cụ thể
    List<ChiTietFeedback> findAllByFeedback_MaFeedback(UUID maFeedback);

    // Xóa toàn bộ chi tiết khi xóa một Feedback
    void deleteAllByFeedback_MaFeedback(UUID maFeedback);
}
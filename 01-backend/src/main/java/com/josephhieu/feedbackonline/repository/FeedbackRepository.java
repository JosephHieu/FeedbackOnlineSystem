package com.josephhieu.feedbackonline.repository;

import com.josephhieu.feedbackonline.entity.Feedback;
import com.josephhieu.feedbackonline.entity.HocVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {

    // Tìm tất cả học viên của lớp 'maLop' mà CHƯA có bản ghi Feedback cho 'maTopic'
    @Query("SELECT hv FROM HocVien hv " +
            "WHERE hv.lop.maLop = :maLop " +
            "AND hv.status = true " +
            "AND hv.maHocVien NOT IN (" +
            "   SELECT f.hocVien.maHocVien FROM Feedback f " +
            "   WHERE f.lop.maLop = :maLop AND f.topic.maTopic = :maTopic" +
            ")")
    List<HocVien> findHocVienChuaFeedback(
            @Param("maLop") UUID maLop,
            @Param("maTopic") UUID maTopic);

    // Kiểm tra xem một học viên cụ thể đã làm feedback cho topic này chưa
    boolean existsByHocVien_MaHocVienAndTopic_MaTopicAndLop_MaLop(UUID maHocVien, UUID maTopic, UUID maLop);
}
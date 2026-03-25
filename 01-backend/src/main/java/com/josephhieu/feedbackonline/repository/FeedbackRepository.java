package com.josephhieu.feedbackonline.repository;

import com.josephhieu.feedbackonline.entity.Feedback;
import com.josephhieu.feedbackonline.entity.HocVien;
import com.josephhieu.feedbackonline.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {

    // Tìm tất cả học viên của lớp 'maLop' mà CHƯA có bản ghi Feedback cho 'maTopic'
    @Query("SELECT hv FROM HocVien hv " +
            "WHERE hv.lop.maLop = :maLop " +
            "AND hv.status = true " +
            "AND EXISTS (SELECT gt FROM GanTopic gt WHERE gt.lop.maLop = :maLop AND gt.topic.maTopic = :maTopic) " +
            "AND hv.maHocVien NOT IN (" +
            "   SELECT f.hocVien.maHocVien FROM Feedback f " +
            "   WHERE f.lop.maLop = :maLop AND f.topic.maTopic = :maTopic" +
            ")")
    List<HocVien> findHocVienChuaFeedback(
            @Param("maLop") UUID maLop,
            @Param("maTopic") UUID maTopic);

    @Query("SELECT COUNT(f) > 0 FROM Feedback f " +
            "WHERE f.hocVien.maHocVien = :maHocVien " +
            "AND f.topic.maTopic = :maTopic " +
            "AND f.lop.maLop = :maLop")
    boolean existsFeedback(@Param("maHocVien") UUID maHocVien,
                           @Param("maTopic") UUID maTopic,
                           @Param("maLop") UUID maLop);

    // Kiểm tra xem một học viên cụ thể đã làm feedback cho topic này chưa
    boolean existsByHocVien_MaHocVienAndTopic_MaTopicAndLop_MaLop(UUID maHocVien, UUID maTopic, UUID maLop);

    Optional<Feedback> findByHocVien_MaHocVienAndTopic_MaTopicAndLop_MaLop(
            UUID maHocVien,
            UUID maTopic,
            UUID maLop
    );

    // Tìm tất cả Feedback dựa trên MaLop và MaTopic
    List<Feedback> findAllByLop_MaLopAndTopic_MaTopic(UUID maLop, UUID maTopic);

    @Query("SELECT gt.topic FROM GanTopic gt WHERE gt.lop.maLop = :maLop")
    List<Topic> findTopicsByLopId(@Param("maLop") UUID maLop);

    List<Feedback> findAllByLop_MaLop(UUID maLop);
}
package com.josephhieu.feedbackonline.repository;

import com.josephhieu.feedbackonline.entity.Trainer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, UUID> {

    // Kiểm tra xem Account đã tồn tại chưa để báo lỗi lúc tạo mới
    boolean existsByAccount(String account);

    @Query("SELECT t FROM Trainer t WHERE " +
            "(:search IS NULL OR LOWER(t.tenTrainer) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(t.account) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Trainer> findAllWithSearch(@Param("search") String search, Pageable pageable);
}
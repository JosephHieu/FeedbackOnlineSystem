package com.josephhieu.feedbackonline.repository;

import com.josephhieu.feedbackonline.entity.HocVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface HocVienRepository extends JpaRepository<HocVien, UUID> {

    boolean existsByUsername(String tenHocVien);
    Optional<HocVien> findByUsername(String username);
}

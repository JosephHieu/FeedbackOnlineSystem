package com.josephhieu.feedbackonline.repository;

import com.josephhieu.feedbackonline.entity.HocVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface HocVienRepository extends JpaRepository<HocVien, UUID> {

    boolean existsByUsername(String username);
    Optional<HocVien> findByUsername(String username);

    Page<HocVien> findByLop_MaLopAndTenHocVienContainingIgnoreCase(UUID maLop, String ten, Pageable pageable);

    Page<HocVien> findByLop_MaLop(UUID maLop, Pageable pageable);

    Page<HocVien> findByLop_MaLopAndStatusTrue(UUID maLop, Pageable pageable);

    Page<HocVien> findByLop_MaLopAndTenHocVienContainingIgnoreCaseAndStatusTrue(UUID maLop, String ten, Pageable pageable);

    long countByLop_MaLop(UUID maLop);
}

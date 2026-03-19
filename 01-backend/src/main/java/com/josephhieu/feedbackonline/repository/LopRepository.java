package com.josephhieu.feedbackonline.repository;

import com.josephhieu.feedbackonline.entity.Lop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LopRepository extends JpaRepository<Lop, UUID> {

    Page<Lop> findByStatusTrue(Pageable pageable);

    Page<Lop> findByTenLopContainingIgnoreCase(String tenLop, Pageable pageable);
}
package com.josephhieu.feedbackonline.repository;

import com.josephhieu.feedbackonline.entity.CauHoi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CauHoiRepository extends JpaRepository<CauHoi, UUID> {

    List<CauHoi> findByTemplateMaTemplateOrderByCreatedAtAsc(UUID maTemplate);

    void deleteByTemplateMaTemplate(UUID maTemplate);
}

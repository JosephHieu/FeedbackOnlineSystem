package com.josephhieu.feedbackonline.repository;

import com.josephhieu.feedbackonline.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TemplateRepository extends JpaRepository<Template, UUID> {

    Optional<Template> findByTenTemplate(String tenTemplate);

    List<Template> findAllByStatusTrue();

    boolean existsByTenTemplate(String tenTemplate);
}

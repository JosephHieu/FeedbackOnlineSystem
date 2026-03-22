package com.josephhieu.feedbackonline.repository;

import com.josephhieu.feedbackonline.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TopicRepository extends JpaRepository<Topic, UUID> {

    boolean existsByTenTopicIgnoreCase(String tenTopic);

    @Query("SELECT t FROM Topic t WHERE (:search IS NULL OR LOWER(t.tenTopic) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Topic>findAllWithSearch(@Param("search") String search, Pageable pageable);
}

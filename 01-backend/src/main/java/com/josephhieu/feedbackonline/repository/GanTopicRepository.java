package com.josephhieu.feedbackonline.repository;

import com.josephhieu.feedbackonline.entity.GanTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GanTopicRepository extends JpaRepository<GanTopic, UUID> {

    List<GanTopic> findAllByLop_MaLop(UUID maLop);

    void deleteAllByLop_MaLop(UUID maLop);

    boolean existsByLop_MaLopAndTopic_MaTopic(UUID maLop, UUID maTopic);
}

package com.josephhieu.feedbackonline.mapper;

import com.josephhieu.feedbackonline.dto.response.GanTopicResponse;
import com.josephhieu.feedbackonline.entity.GanTopic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GanTopicMapper {

    @Mapping(source = "lop.tenLop", target = "tenLop")
    @Mapping(source = "trainer.tenTrainer", target = "tenTrainer")
    @Mapping(source = "topic.tenTopic", target = "tenTopic")
    GanTopicResponse toResponse(GanTopic ganTopic);
}
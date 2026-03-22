package com.josephhieu.feedbackonline.mapper;

import com.josephhieu.feedbackonline.dto.request.TopicRequest;
import com.josephhieu.feedbackonline.dto.response.TopicResponse;
import com.josephhieu.feedbackonline.entity.Topic;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TopicMapper {
    Topic toEntity(TopicRequest request);

    TopicResponse toResponse(Topic topic);

    void updateEntity(@MappingTarget Topic topic, TopicRequest request);
}
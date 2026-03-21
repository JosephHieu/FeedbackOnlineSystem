package com.josephhieu.feedbackonline.mapper;

import com.josephhieu.feedbackonline.dto.request.TrainerRequest;
import com.josephhieu.feedbackonline.dto.response.TrainerResponse;
import com.josephhieu.feedbackonline.entity.Trainer;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TrainerMapper {
    Trainer toEntity(TrainerRequest request);

    TrainerResponse toResponse(Trainer trainer);

    @Mapping(target = "account", ignore = true) // Chặn không cho sửa Account theo nghiệp vụ
    void updateEntity(@MappingTarget Trainer trainer, TrainerRequest request);
}
package com.josephhieu.feedbackonline.mapper;

import com.josephhieu.feedbackonline.dto.request.TemplateRequest;
import com.josephhieu.feedbackonline.dto.response.TemplateResponse;
import com.josephhieu.feedbackonline.entity.CauHoi;
import com.josephhieu.feedbackonline.entity.Template;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TemplateMapper {

    Template toEntity(TemplateRequest request);

    CauHoi toCauHoiEntity(TemplateRequest.CauHoiRequest request);

    @Mapping(target = "createAt", source = "createdAt")
    @Mapping(target = "tenTemplate", source = "tenTemplate")
    TemplateResponse toResponse(Template entity);

    TemplateResponse.CauHoiResponse toCauHoiResponse(CauHoi entity);
}

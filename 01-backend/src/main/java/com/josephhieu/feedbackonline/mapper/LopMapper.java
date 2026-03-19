package com.josephhieu.feedbackonline.mapper;

import com.josephhieu.feedbackonline.dto.request.LopRequest;
import com.josephhieu.feedbackonline.dto.response.LopResponse;
import com.josephhieu.feedbackonline.entity.Lop;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LopMapper {

    // 1. Chuyển từ Request sang Entity (Khi tạo mới)
    @Mapping(target = "maLop", ignore = true)
    @Mapping(target = "template", ignore = true)
    Lop toEntity(LopRequest request);

    // 2. Chuyển từ Entity sang Response (Khi trả về Frontend)
    @Mapping(target = "maTemplate", source = "template.maTemplate")
    @Mapping(target = "tenTemplate", source = "template.tenTemplate")
    LopResponse toResponse(Lop lop);

    // 3. Cập nhật Entity từ Request (Khi chỉnh sửa)
    @Mapping(target = "maLop", ignore = true)
    @Mapping(target = "template", ignore = true)
    void updateLop(@MappingTarget Lop lop, LopRequest request);
}
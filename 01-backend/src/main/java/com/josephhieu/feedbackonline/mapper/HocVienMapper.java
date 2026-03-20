package com.josephhieu.feedbackonline.mapper;

import com.josephhieu.feedbackonline.dto.request.HocVienRequest;
import com.josephhieu.feedbackonline.dto.response.HocVienResponse;
import com.josephhieu.feedbackonline.entity.HocVien;
import com.josephhieu.feedbackonline.entity.Lop;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface HocVienMapper {

    @Mapping(target = "maHocVien", ignore = true)
    @Mapping(target = "lop", ignore = true)
    @Mapping(target = "password", ignore = true)
    HocVien toEntity(HocVienRequest request);

    @Mapping(target = "tenLop", source = "lop.tenLop")
    @Mapping(target = "maLop", source = "lop.maLop")
    HocVienResponse toResponse(HocVien hocVien);

    @Mapping(target = "maHocVien", ignore = true)
    @Mapping(target = "lop", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateEntity(@MappingTarget HocVien hocVien, HocVienRequest request);
}
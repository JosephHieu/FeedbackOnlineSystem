package com.josephhieu.feedbackonline.common.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageResponse<T> {

    int currentPage;
    int totalPages;
    int pageSize;
    long totalElements;

    List<T> data;
}

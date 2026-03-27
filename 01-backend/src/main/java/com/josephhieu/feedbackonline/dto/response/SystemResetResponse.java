package com.josephhieu.feedbackonline.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemResetResponse {

    private long feedbackCount;
    private long detailCount;
    private long assignmentCount;
    private String message;
}

package com.josephhieu.feedbackonline.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopicResponse {

    private UUID maTopic;
    private String tenTopic;
    private Boolean status;
}

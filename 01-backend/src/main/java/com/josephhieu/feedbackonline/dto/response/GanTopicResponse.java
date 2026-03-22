package com.josephhieu.feedbackonline.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class GanTopicResponse {
    private UUID maGanTopic;
    private String tenLop;
    private String tenTrainer;
    private String tenTopic;
}

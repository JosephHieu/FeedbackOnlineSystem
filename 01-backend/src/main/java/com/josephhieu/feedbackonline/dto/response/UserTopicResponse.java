package com.josephhieu.feedbackonline.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTopicResponse {

    private UUID maTopic;
    private String tenTopic;
    private String tenTrainer;
    private UUID maLop;
    private UUID maTrainer;
    private UUID maTemplate;
    private boolean isCompleted;
}

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
public class TrainerResponse {

    private UUID maTrainer;
    private String account;
    private String tenTrainer;
    private Boolean status;
}

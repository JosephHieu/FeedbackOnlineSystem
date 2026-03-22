package com.josephhieu.feedbackonline.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GanTopicRequest {

    private UUID maLop;
    private UUID maTrainer;
    private List<UUID> danhSachMaTopic;
}

package com.josephhieu.feedbackonline.dto.response;

import com.josephhieu.feedbackonline.dto.ChartDataDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    long totalClasses;
    long totalStudents;
    long totalTrainers;
    long totalFeedbacks;
    List<ChartDataDTO> chartData;
}

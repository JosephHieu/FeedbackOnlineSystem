package com.josephhieu.feedbackonline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChartDataDTO {

    private LocalDate date;
    private long count;
}

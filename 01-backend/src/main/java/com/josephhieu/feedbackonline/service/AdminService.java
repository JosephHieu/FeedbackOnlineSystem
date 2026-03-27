package com.josephhieu.feedbackonline.service;

import com.josephhieu.feedbackonline.dto.request.SystemResetRequest;
import com.josephhieu.feedbackonline.dto.response.DashboardStatsResponse;
import com.josephhieu.feedbackonline.dto.response.SystemResetResponse;

public interface AdminService {

    SystemResetResponse resetSystem(SystemResetRequest request);

    DashboardStatsResponse getDashboardStats();
}

package com.josephhieu.feedbackonline.service;

import com.josephhieu.feedbackonline.dto.request.LoginRequest;
import com.josephhieu.feedbackonline.dto.request.PasswordChangeRequest;
import com.josephhieu.feedbackonline.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    void changePassword(PasswordChangeRequest request);
}

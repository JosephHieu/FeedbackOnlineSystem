package com.josephhieu.feedbackonline.service;

import com.josephhieu.feedbackonline.entity.RefreshToken;

import java.util.Optional;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(String username, String role);

    Optional<RefreshToken> findByToken(String token);

    RefreshToken verifyExpiration(RefreshToken token);

    void deleteByUsername(String username);
}

package com.importacionessanjose.dto.auth;

public record AuthResponse(
        String token,
        String tipo,
        long expiraEnMs,
        MeResponse usuario) {
    public static AuthResponse of(String token, long expiraEnMs, MeResponse usuario) {
        return new AuthResponse(token, "Bearer", expiraEnMs, usuario);
    }
}
package com.importacionessanjose.dto.auth;

public record MeResponse(
        Integer id,
        String nombreCompleto,
        String correo,
        String rol) {
}
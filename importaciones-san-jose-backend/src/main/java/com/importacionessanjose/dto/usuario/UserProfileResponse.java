package com.importacionessanjose.dto.usuario;

import java.time.LocalDateTime;

public record UserProfileResponse(
        Integer id,
        String nombreCompleto,
        String correo,
        String telefono,
        String rol,
        Boolean activo,
        LocalDateTime fechaRegistro
) {}

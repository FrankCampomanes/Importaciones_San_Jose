package com.importacionessanjose.dto.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank(message = "El nombre completo es obligatorio")
        @Size(max = 150, message = "El nombre no puede exceder 150 caracteres")
        String nombreCompleto,

        @Size(max = 20, message = "El teléfono no puede exceder 20 dígitos")
        String telefono,

        String password
) {}

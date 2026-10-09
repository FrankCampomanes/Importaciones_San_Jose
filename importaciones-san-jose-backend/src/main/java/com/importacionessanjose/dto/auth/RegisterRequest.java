package com.importacionessanjose.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "El nombre es obligatorio") @Size(max = 150, message = "El nombre no puede exceder 150 caracteres") String nombreCompleto,

        @NotBlank(message = "El correo es obligatorio") @Email(message = "El correo debe tener un formato válido") @Size(max = 120, message = "El correo no puede exceder 120 caracteres") String correo,

        @NotBlank(message = "La contraseña es obligatoria") @Size(min = 6, max = 100, message = "La contraseña debe tener entre 6 y 100 caracteres") String password,

        @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres") String telefono,

        String rol,

        String claveAdmin) {
}
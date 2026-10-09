package com.importacionessanjose.dto.sede;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SedeRequest(

        @NotBlank(message = "El nombre de la sede es obligatorio") @Size(max = 100, message = "El nombre no puede exceder 100 caracteres") String nombreSede,

        @NotBlank(message = "La dirección es obligatoria") @Size(max = 255, message = "La dirección no puede exceder 255 caracteres") String direccion,

        @NotBlank(message = "El distrito es obligatorio") @Size(max = 80, message = "El distrito no puede exceder 80 caracteres") String distrito,

        @NotBlank(message = "La provincia es obligatoria") @Size(max = 80, message = "La provincia no puede exceder 80 caracteres") String provincia,

        @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres") String telefono,

        @Size(max = 100, message = "El horario no puede exceder 100 caracteres") String horarioAtencion,

        Boolean activo) {
}
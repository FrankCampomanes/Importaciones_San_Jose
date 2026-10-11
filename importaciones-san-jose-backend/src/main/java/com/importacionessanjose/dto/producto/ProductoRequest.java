package com.importacionessanjose.dto.producto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductoRequest(

        @NotBlank(message = "El nombre es obligatorio") @Size(max = 150, message = "El nombre no puede exceder 150 caracteres") String nombre,

        String descripcion,

        @NotNull(message = "El precio es obligatorio") @DecimalMin(value = "0.00", inclusive = true, message = "El precio no puede ser negativo") BigDecimal precio,

        @DecimalMin(value = "0.00", inclusive = true, message = "El costo no puede ser negativo") BigDecimal costoAdquisicion,

        @NotBlank(message = "La categoría es obligatoria") @Size(max = 80, message = "La categoría no puede exceder 80 caracteres") String categoria,

        @Size(max = 5000000, message = "La imagen no puede exceder 5MB") String imagenUrl,

        @Size(max = 100, message = "El código QR no puede exceder 100 caracteres") String codigoQr,

        Boolean activo) {
}
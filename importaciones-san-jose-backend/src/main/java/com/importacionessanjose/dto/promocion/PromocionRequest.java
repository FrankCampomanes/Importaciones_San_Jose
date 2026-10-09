package com.importacionessanjose.dto.promocion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PromocionRequest(
        @NotNull(message = "El ID del producto es obligatorio")
        Integer productoId,

        @NotBlank(message = "El tipo de promoción es obligatorio")
        String tipo,

        BigDecimal precioOferta,

        Integer descuentoPorcentaje,

        Integer unidadesMinimas,

        Integer unidadesLleva,

        Integer unidadesGratis,

        @NotBlank(message = "El motivo o descripción de la promoción es obligatorio")
        String motivo,

        LocalDate fechaFin,

        Boolean activo
) {}

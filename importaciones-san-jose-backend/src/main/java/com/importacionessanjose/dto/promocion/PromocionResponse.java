package com.importacionessanjose.dto.promocion;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record PromocionResponse(
        Integer id,
        Integer productoId,
        String productoNombre,
        BigDecimal productoPrecioOriginal,
        String tipo,
        BigDecimal precioOferta,
        Integer descuentoPorcentaje,
        Integer unidadesMinimas,
        Integer unidadesLleva,
        Integer unidadesGratis,
        String motivo,
        LocalDate fechaFin,
        Boolean activo,
        Boolean expirado,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaActualizacion
) {}

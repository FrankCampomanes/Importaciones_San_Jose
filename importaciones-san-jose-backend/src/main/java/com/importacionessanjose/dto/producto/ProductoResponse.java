package com.importacionessanjose.dto.producto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductoResponse(
        Integer id,
        String nombre,
        String descripcion,
        BigDecimal precio,
        BigDecimal costoAdquisicion,
        String categoria,
        String imagenUrl,
        String codigoQr,
        Boolean activo,
        LocalDateTime fechaCreacion) {
}
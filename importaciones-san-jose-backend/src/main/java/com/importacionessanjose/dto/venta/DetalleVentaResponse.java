package com.importacionessanjose.dto.venta;

import java.math.BigDecimal;

public record DetalleVentaResponse(
        Integer productoId,
        String productoNombre,
        String productoCodigoQr,
        Integer cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotalLinea) {
}
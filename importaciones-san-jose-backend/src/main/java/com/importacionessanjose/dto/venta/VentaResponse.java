package com.importacionessanjose.dto.venta;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record VentaResponse(
        Integer id,
        Integer usuarioId,
        String usuarioNombre,
        Integer sedeId,
        String sedeNombre,
        String metodoEntrega,
        String direccionEnvio,
        String distritoEnvio,
        String referenciaEnvio,
        LocalDateTime fechaHora,
        BigDecimal subtotal,
        BigDecimal igv,
        BigDecimal costoEnvio,
        BigDecimal total,
        String comprobante,
        String numeroComprobante,
        String numDocumentoCliente,
        String razonSocialCliente,
        String estado,
        List<DetalleVentaResponse> detalles) {
}
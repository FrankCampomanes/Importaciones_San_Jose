package com.importacionessanjose.dto.venta;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ComprobanteResponse(
        String numeroComprobante,
        String tipoComprobante,
        LocalDateTime fechaEmision,
        String razonSocialEmisor,
        String rucEmisor,
        String direccionEmisor,
        String documentoCliente,
        String razonSocialCliente,
        String sedeNombre,
        String sedeDireccion,
        List<DetalleVentaResponse> items,
        BigDecimal subtotal,
        BigDecimal igv,
        BigDecimal costoEnvio,
        BigDecimal total,
        String metodoEntrega) {
}
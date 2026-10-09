package com.importacionessanjose.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DashboardSummaryResponse(
        LocalDate desde,
        LocalDate hasta,
        Long pedidos,
        BigDecimal subtotal,
        BigDecimal igv,
        BigDecimal costoEnvio,
        BigDecimal total,
        BigDecimal gananciaTotal, // null si no hay costos de adquisición
        Long productosActivos,
        Long sedesActivas) {
}
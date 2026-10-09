package com.importacionessanjose.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record SalesReportResponse(
        LocalDate desde,
        LocalDate hasta,
        BigDecimal total,
        BigDecimal subtotal,
        BigDecimal igv,
        Long pedidos,
        List<DiaVenta> porDia) {
    public record DiaVenta(LocalDate fecha, BigDecimal total, Long pedidos) {
    }
}
package com.importacionessanjose.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;

public record BranchReportItem(
        Integer sedeId,
        String sedeNombre,
        Long pedidos,
        BigDecimal total,
        List<TopProductoResponse> topProductos) {
}
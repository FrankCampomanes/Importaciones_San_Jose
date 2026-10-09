package com.importacionessanjose.dto.dashboard;

import java.time.LocalDate;
import java.util.List;

public record ProductosReportResponse(
        LocalDate desde,
        LocalDate hasta,
        List<TopProductoResponse> topVendidos,
        List<TopProductoResponse> estancados) {
}
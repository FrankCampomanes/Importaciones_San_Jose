package com.importacionessanjose.dto.dashboard;

import java.time.LocalDate;
import java.util.List;

public record BranchReportResponse(
        LocalDate desde,
        LocalDate hasta,
        List<BranchReportItem> sedes) {
}
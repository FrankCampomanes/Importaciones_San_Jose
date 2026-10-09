package com.importacionessanjose.dto.dashboard;

import java.math.BigDecimal;

public record TopProductoResponse(
        Integer productoId,
        String productoNombre,
        String productoCodigoQr,
        Long unidadesVendidas,
        BigDecimal ingresos,
        Long stockActualTotal,
        BigDecimal rotacionAproximada // null si stockTotal = 0
) {
}
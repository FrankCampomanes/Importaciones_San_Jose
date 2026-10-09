package com.importacionessanjose.repository;

import java.math.BigDecimal;

public interface VentaResumenProjection {
    Long getPedidos();

    BigDecimal getSubtotal();

    BigDecimal getIgv();

    BigDecimal getCostoEnvio();

    BigDecimal getTotal();
}
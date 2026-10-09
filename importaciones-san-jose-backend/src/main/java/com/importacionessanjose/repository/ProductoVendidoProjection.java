package com.importacionessanjose.repository;

import java.math.BigDecimal;

public interface ProductoVendidoProjection {
    Integer getProductoId();

    String getProductoNombre();

    String getProductoCodigoQr();

    Long getUnidades();

    BigDecimal getIngresos();
}
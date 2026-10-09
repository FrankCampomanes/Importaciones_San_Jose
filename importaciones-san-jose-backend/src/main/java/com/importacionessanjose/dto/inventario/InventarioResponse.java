package com.importacionessanjose.dto.inventario;

public record InventarioResponse(
        Integer id,
        Integer sedeId,
        String sedeNombre,
        Integer productoId,
        String productoNombre,
        String productoCodigoQr,
        Integer stockActual) {
}
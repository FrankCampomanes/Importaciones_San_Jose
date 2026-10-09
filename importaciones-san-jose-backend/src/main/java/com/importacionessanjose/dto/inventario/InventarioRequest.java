package com.importacionessanjose.dto.inventario;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record InventarioRequest(

        @NotNull(message = "El ID de sede es obligatorio") Integer sedeId,

        @NotNull(message = "El ID de producto es obligatorio") Integer productoId,

        @NotNull(message = "El stock es obligatorio") @Min(value = 0, message = "El stock no puede ser negativo") Integer stockActual) {
}
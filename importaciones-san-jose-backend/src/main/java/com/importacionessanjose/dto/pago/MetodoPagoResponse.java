package com.importacionessanjose.dto.pago;

import java.time.LocalDateTime;

public record MetodoPagoResponse(
        Integer id,
        Integer usuarioId,
        String ultimosDigitos,
        String titular,
        String mesExpiracion,
        String anioExpiracion,
        LocalDateTime fechaCreacion) {
}
package com.importacionessanjose.dto.pago;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MetodoPagoRequest(

        @NotBlank(message = "El token simulado es obligatorio") @Size(max = 100, message = "El token no puede exceder 100 caracteres") String tokenSimulado,

        @NotBlank(message = "Los últimos dígitos son obligatorios") @Pattern(regexp = "\\d{4}", message = "Deben ser exactamente 4 dígitos") String ultimosDigitos,

        @NotBlank(message = "El titular es obligatorio") @Size(max = 150, message = "El titular no puede exceder 150 caracteres") String titular,

        @NotBlank(message = "El mes de expiración es obligatorio") @Pattern(regexp = "(0[1-9]|1[0-2])", message = "El mes debe estar entre 01 y 12") String mesExpiracion,

        @NotBlank(message = "El año de expiración es obligatorio") @Pattern(regexp = "\\d{4}", message = "El año debe tener 4 dígitos") String anioExpiracion) {
}
package com.importacionessanjose.dto.venta;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CheckoutRequest(

        @NotNull(message = "El ID de sede es obligatorio") Integer sedeId,

        @NotNull(message = "El ID de método de pago es obligatorio") Integer metodoPagoId,

        @NotBlank(message = "El método de entrega es obligatorio") String metodoEntrega, // "Recojo en Tienda" |
                                                                                         // "Delivery"

        @Size(max = 255) String direccionEnvio,

        @Size(max = 100) String distritoEnvio,

        @Size(max = 255) String referenciaEnvio,

        @NotBlank(message = "El tipo de comprobante es obligatorio") String comprobante, // "Boleta" | "Factura"

        @NotBlank(message = "El documento del cliente es obligatorio") @Size(max = 20) String numDocumentoCliente,

        @Size(max = 150) String razonSocialCliente,

        // Campos de procesamiento de pago bancario (Culqi / Yape)
        String tipoPago, // "TARJETA" | "YAPE" | "EFECTIVO"
        String numeroTarjeta,
        String mesExpiracion,
        String anioExpiracion,
        String cvv,
        String titularTarjeta,
        String yapeTelefono,
        String yapeOtp,
        String codigoOperacion,

        @NotEmpty(message = "El pedido debe tener al menos un ítem") @Valid List<CheckoutItemRequest> items) {
}
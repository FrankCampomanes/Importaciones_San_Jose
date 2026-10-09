package com.importacionessanjose.venta;

import com.importacionessanjose.BaseIntegrationTest;
import com.importacionessanjose.TestAuthHelper;
import com.importacionessanjose.repository.InventarioSedeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class VentaControllerTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private InventarioSedeRepository inventarioRepository;

    @Test
    void checkoutRecojoOk() throws Exception {
        String token = TestAuthHelper.login(mockMvc, "cliente@test.com", "admin123");
        mockMvc.perform(post("/api/orders")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(checkoutJson("Recojo en Tienda", 1, "Boleta")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.numeroComprobante").value("B001-00000001"))
                .andExpect(jsonPath("$.subtotal").value(100.00))
                .andExpect(jsonPath("$.igv").value(18.00))
                .andExpect(jsonPath("$.costoEnvio").value(0.00))
                .andExpect(jsonPath("$.total").value(118.00));

        var inv = inventarioRepository.findBySedeIdAndProductoId(sede.getId(), producto.getId()).orElseThrow();
        assertThat(inv.getStockActual()).isEqualTo(9);
    }

    @Test
    void checkoutStockInsuficienteRollback() throws Exception {
        String token = TestAuthHelper.login(mockMvc, "cliente@test.com", "admin123");
        mockMvc.perform(post("/api/orders")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(checkoutJson("Recojo en Tienda", 100, "Boleta")))
                .andExpect(status().isConflict());

        var inv = inventarioRepository.findBySedeIdAndProductoId(sede.getId(), producto.getId()).orElseThrow();
        assertThat(inv.getStockActual()).isEqualTo(10);
    }

    @Test
    void checkoutDeliveryDistritoNoPermitido() throws Exception {
        String token = TestAuthHelper.login(mockMvc, "cliente@test.com", "admin123");
        String json = """
                {
                  "sedeId": %d,
                  "metodoPagoId": %d,
                  "metodoEntrega": "Delivery",
                  "direccionEnvio": "Av. Larco 123",
                  "distritoEnvio": "Miraflores",
                  "comprobante": "Boleta",
                  "numDocumentoCliente": "74561230",
                  "items": [{"productoId": %d, "cantidad": 1}]
                }
                """.formatted(sede.getId(), metodoPago.getId(), producto.getId());
        mockMvc.perform(post("/api/orders")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isConflict());
    }

    @Test
    void checkoutFacturaSinRuc() throws Exception {
        String token = TestAuthHelper.login(mockMvc, "cliente@test.com", "admin123");
        String json = """
                {
                  "sedeId": %d,
                  "metodoPagoId": %d,
                  "metodoEntrega": "Recojo en Tienda",
                  "comprobante": "Factura",
                  "numDocumentoCliente": "123",
                  "razonSocialCliente": "X SAC",
                  "items": [{"productoId": %d, "cantidad": 1}]
                }
                """.formatted(sede.getId(), metodoPago.getId(), producto.getId());
        mockMvc.perform(post("/api/orders")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isConflict());
    }

    @Test
    void checkoutMetodoPagoAjeno() throws Exception {
        String tokenAdmin = TestAuthHelper.login(mockMvc, "admin@test.com", "admin123");
        mockMvc.perform(post("/api/orders")
                .header("Authorization", "Bearer " + tokenAdmin)
                .contentType(MediaType.APPLICATION_JSON)
                .content(checkoutJson("Recojo en Tienda", 1, "Boleta")))
                .andExpect(status().isConflict());
    }

    @Test
    void checkoutSinToken() throws Exception {
        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(checkoutJson("Recojo en Tienda", 1, "Boleta")))
                .andExpect(status().isUnauthorized());
    }

    private String checkoutJson(String metodo, int cantidad, String comprobante) {
        return """
                {
                  "sedeId": %d,
                  "metodoPagoId": %d,
                  "metodoEntrega": "%s",
                  "comprobante": "%s",
                  "numDocumentoCliente": "74561230",
                  "items": [{"productoId": %d, "cantidad": %d}]
                }
                """.formatted(sede.getId(), metodoPago.getId(), metodo, comprobante, producto.getId(), cantidad);
    }
}
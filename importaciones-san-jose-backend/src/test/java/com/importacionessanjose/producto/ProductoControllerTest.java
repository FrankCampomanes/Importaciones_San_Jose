package com.importacionessanjose.producto;

import com.importacionessanjose.BaseIntegrationTest;
import com.importacionessanjose.TestAuthHelper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ProductoControllerTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void listarProductosEsPublico() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].codigoQr").value("PROD-TEST-001"));
    }

    @Test
    void buscarPorQr() throws Exception {
        mockMvc.perform(get("/api/products/qr/PROD-TEST-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Producto Test"));
    }

    @Test
    void buscarPorQrInexistente() throws Exception {
        mockMvc.perform(get("/api/products/qr/NO-EXISTE"))
                .andExpect(status().isNotFound());
    }

    @Test
    void crearProductoRequiereToken() throws Exception {
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(productoJson("PROD-NEW-001")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void crearProductoConClienteEsForbidden() throws Exception {
        String token = TestAuthHelper.login(mockMvc, "cliente@test.com", "admin123");
        mockMvc.perform(post("/api/products")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(productoJson("PROD-NEW-002")))
                .andExpect(status().isForbidden());
    }

    @Test
    void crearProductoConAdminOk() throws Exception {
        String token = TestAuthHelper.login(mockMvc, "admin@test.com", "admin123");
        mockMvc.perform(post("/api/products")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(productoJson("PROD-NEW-003")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.codigoQr").value("PROD-NEW-003"));
    }

    @Test
    void crearProductoQrDuplicadoEsConflict() throws Exception {
        String token = TestAuthHelper.login(mockMvc, "admin@test.com", "admin123");
        mockMvc.perform(post("/api/products")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(productoJson("PROD-TEST-001")))
                .andExpect(status().isConflict());
    }

    @Test
    void eliminarProductoEsLogico() throws Exception {
        String token = TestAuthHelper.login(mockMvc, "admin@test.com", "admin123");
        mockMvc.perform(delete("/api/products/" + producto.getId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/products/" + producto.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activo").value(false));
    }

    private String productoJson(String qr) {
        return "{\"nombre\":\"Nuevo\",\"precio\":50.00,\"categoria\":\"Test\",\"codigoQr\":\"" + qr
                + "\",\"activo\":true}";
    }
}
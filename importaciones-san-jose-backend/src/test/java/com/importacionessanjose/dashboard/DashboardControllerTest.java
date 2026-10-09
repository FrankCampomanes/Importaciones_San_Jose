package com.importacionessanjose.dashboard;

import com.importacionessanjose.BaseIntegrationTest;
import com.importacionessanjose.TestAuthHelper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DashboardControllerTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void summaryConAdminOk() throws Exception {
        String token = TestAuthHelper.login(mockMvc, "admin@test.com", "admin123");
        mockMvc.perform(get("/api/dashboard/summary")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pedidos").exists())
                .andExpect(jsonPath("$.productosActivos").value(1))
                .andExpect(jsonPath("$.sedesActivas").value(1));
    }

    @Test
    void summaryConClienteEsForbidden() throws Exception {
        String token = TestAuthHelper.login(mockMvc, "cliente@test.com", "admin123");
        mockMvc.perform(get("/api/dashboard/summary")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void summarySinTokenEsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isUnauthorized());
    }
}
package com.importacionessanjose;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public final class TestAuthHelper {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private TestAuthHelper() {
    }

    public static String login(MockMvc mockMvc, String correo, String password) throws Exception {
        String body = "{\"correo\":\"" + correo + "\",\"password\":\"" + password + "\"}";
        String response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andReturn()
                .getResponse()
                .getContentAsString();
        JsonNode node = MAPPER.readTree(response);
        return node.get("token").asText();
    }
}
package com.importacionessanjose.dto.health;

import java.time.OffsetDateTime;

public record HealthResponse(
        String status,
        String application,
        String version,
        OffsetDateTime timestamp) {
}
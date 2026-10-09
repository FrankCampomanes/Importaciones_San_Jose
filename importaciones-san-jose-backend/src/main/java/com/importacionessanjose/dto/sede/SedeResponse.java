package com.importacionessanjose.dto.sede;

public record SedeResponse(
        Integer id,
        String nombreSede,
        String direccion,
        String distrito,
        String provincia,
        String telefono,
        String horarioAtencion,
        Boolean activo) {
}
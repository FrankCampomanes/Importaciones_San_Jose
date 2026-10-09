package com.importacionessanjose.controller;

import com.importacionessanjose.dto.usuario.UpdateProfileRequest;
import com.importacionessanjose.dto.usuario.UserProfileResponse;
import com.importacionessanjose.security.JwtService;
import com.importacionessanjose.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    public UsuarioController(UsuarioService usuarioService, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }

    private Integer usuarioIdDesdeToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            return jwtService.extraerUsuarioId(token);
        }
        throw new IllegalArgumentException("Token de autorización no provisto");
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> obtenerPerfil(HttpServletRequest request) {
        Integer usuarioId = usuarioIdDesdeToken(request);
        return ResponseEntity.ok(usuarioService.obtenerPerfil(usuarioId));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> actualizarPerfil(
            HttpServletRequest request,
            @Valid @RequestBody UpdateProfileRequest body) {
        Integer usuarioId = usuarioIdDesdeToken(request);
        return ResponseEntity.ok(usuarioService.actualizarPerfil(usuarioId, body));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<Void> desactivarCuenta(HttpServletRequest request) {
        Integer usuarioId = usuarioIdDesdeToken(request);
        usuarioService.desactivarCuenta(usuarioId);
        return ResponseEntity.noContent().build();
    }
}

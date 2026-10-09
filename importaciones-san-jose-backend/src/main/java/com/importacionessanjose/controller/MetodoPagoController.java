package com.importacionessanjose.controller;

import com.importacionessanjose.dto.pago.MetodoPagoRequest;
import com.importacionessanjose.dto.pago.MetodoPagoResponse;
import com.importacionessanjose.security.JwtService;
import com.importacionessanjose.service.MetodoPagoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
public class MetodoPagoController {

    private final MetodoPagoService metodoPagoService;
    private final JwtService jwtService;

    public MetodoPagoController(MetodoPagoService metodoPagoService, JwtService jwtService) {
        this.metodoPagoService = metodoPagoService;
        this.jwtService = jwtService;
    }

    private Integer usuarioIdDesdeToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        String token = header.substring(7);
        return jwtService.extraerUsuarioId(token);
    }

    @GetMapping
    public ResponseEntity<List<MetodoPagoResponse>> listar(HttpServletRequest request) {
        return ResponseEntity.ok(metodoPagoService.listarPorUsuario(usuarioIdDesdeToken(request)));
    }

    @PostMapping
    public ResponseEntity<MetodoPagoResponse> crear(
            HttpServletRequest request,
            @Valid @RequestBody MetodoPagoRequest body) {
        MetodoPagoResponse creado = metodoPagoService.crear(usuarioIdDesdeToken(request), body);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(HttpServletRequest request, @PathVariable Integer id) {
        metodoPagoService.eliminar(usuarioIdDesdeToken(request), id);
        return ResponseEntity.noContent().build();
    }
}
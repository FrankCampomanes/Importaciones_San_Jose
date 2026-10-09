package com.importacionessanjose.controller;

import com.importacionessanjose.dto.venta.CheckoutRequest;
import com.importacionessanjose.dto.venta.ComprobanteResponse;
import com.importacionessanjose.dto.venta.VentaResponse;
import com.importacionessanjose.security.JwtService;
import com.importacionessanjose.service.VentaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class VentaController {

    private final VentaService ventaService;
    private final JwtService jwtService;

    public VentaController(VentaService ventaService, JwtService jwtService) {
        this.ventaService = ventaService;
        this.jwtService = jwtService;
    }

    private Integer usuarioId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtService.extraerUsuarioId(token);
    }

    private boolean esAdmin(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return "Admin".equals(jwtService.extraerRol(token));
    }

    @PostMapping
    public ResponseEntity<VentaResponse> checkout(HttpServletRequest request,
            @Valid @RequestBody CheckoutRequest body) {
        VentaResponse venta = ventaService.checkout(usuarioId(request), body);
        return ResponseEntity.status(HttpStatus.CREATED).body(venta);
    }

    @GetMapping
    public ResponseEntity<List<VentaResponse>> listar(HttpServletRequest request) {
        return ResponseEntity.ok(ventaService.listar(usuarioId(request), esAdmin(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaResponse> obtener(HttpServletRequest request, @PathVariable Integer id) {
        return ResponseEntity.ok(ventaService.obtener(id, usuarioId(request), esAdmin(request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<VentaResponse> actualizarEstado(HttpServletRequest request,
            @PathVariable Integer id,
            @RequestBody java.util.Map<String, String> body) {
        String nuevoEstado = body.getOrDefault("estado", "Preparando");
        return ResponseEntity.ok(ventaService.actualizarEstado(id, nuevoEstado, esAdmin(request)));
    }

    @GetMapping("/{id}/receipt")
    public ResponseEntity<ComprobanteResponse> comprobante(HttpServletRequest request, @PathVariable Integer id) {
        return ResponseEntity.ok(ventaService.comprobante(id, usuarioId(request), esAdmin(request)));
    }
}
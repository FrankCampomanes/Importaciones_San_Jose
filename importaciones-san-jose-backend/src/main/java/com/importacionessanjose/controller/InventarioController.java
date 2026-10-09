package com.importacionessanjose.controller;

import com.importacionessanjose.dto.inventario.ActualizarStockRequest;
import com.importacionessanjose.dto.inventario.InventarioRequest;
import com.importacionessanjose.dto.inventario.InventarioResponse;
import com.importacionessanjose.service.InventarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<InventarioResponse>> listarPorSede(@PathVariable Integer sedeId) {
        return ResponseEntity.ok(inventarioService.listarPorSede(sedeId));
    }

    @GetMapping("/product/{productoId}")
    public ResponseEntity<List<InventarioResponse>> listarPorProducto(@PathVariable Integer productoId) {
        return ResponseEntity.ok(inventarioService.listarPorProducto(productoId));
    }

    @GetMapping("/product/{productoId}/sede/{sedeId}")
    public ResponseEntity<InventarioResponse> obtenerPorSedeYProducto(
            @PathVariable Integer productoId,
            @PathVariable Integer sedeId) {
        return ResponseEntity.ok(inventarioService.obtenerPorSedeYProducto(sedeId, productoId));
    }

    @PostMapping
    public ResponseEntity<InventarioResponse> crear(@Valid @RequestBody InventarioRequest request) {
        InventarioResponse creado = inventarioService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/product/{productoId}/sede/{sedeId}")
    public ResponseEntity<InventarioResponse> actualizarStock(
            @PathVariable Integer productoId,
            @PathVariable Integer sedeId,
            @Valid @RequestBody ActualizarStockRequest request) {
        return ResponseEntity.ok(inventarioService.actualizarStock(sedeId, productoId, request));
    }
}
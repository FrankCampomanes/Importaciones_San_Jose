package com.importacionessanjose.controller;

import com.importacionessanjose.dto.promocion.PromocionRequest;
import com.importacionessanjose.dto.promocion.PromocionResponse;
import com.importacionessanjose.service.PromocionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromocionController {

    private final PromocionService promocionService;

    public PromocionController(PromocionService promocionService) {
        this.promocionService = promocionService;
    }

    /**
     * Catálogo / Carrito: Consulta pública de promociones vigentes y no vencidas
     */
    @GetMapping
    public ResponseEntity<List<PromocionResponse>> listarVigentes() {
        return ResponseEntity.ok(promocionService.listarVigentes());
    }

    /**
     * Panel Admin: Consulta de todas las promociones (activas, inactivas, vencidas)
     */
    @GetMapping("/all")
    public ResponseEntity<List<PromocionResponse>> listarTodas() {
        return ResponseEntity.ok(promocionService.listarTodas());
    }

    /**
     * Consulta promoción de un producto específico
     */
    @GetMapping("/product/{productoId}")
    public ResponseEntity<PromocionResponse> obtenerPorProducto(@PathVariable Integer productoId) {
        PromocionResponse res = promocionService.obtenerPorProducto(productoId);
        if (res == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(res);
    }

    /**
     * Crear o actualizar promoción (Admin)
     */
    @PostMapping
    public ResponseEntity<PromocionResponse> guardar(@Valid @RequestBody PromocionRequest request) {
        PromocionResponse res = promocionService.guardarOActualizar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    /**
     * Alternar estado Activo / Inactivo sin borrar de la BD (Admin)
     */
    @PutMapping("/{id}/toggle")
    public ResponseEntity<PromocionResponse> toggleActivo(@PathVariable Integer id) {
        return ResponseEntity.ok(promocionService.toggleActivo(id));
    }

    /**
     * Desactivar promoción (Admin)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(@PathVariable Integer id) {
        promocionService.desactivar(id);
        return ResponseEntity.noContent().build();
    }
}

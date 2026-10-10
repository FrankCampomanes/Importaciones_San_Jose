package com.importacionessanjose.service;

import com.importacionessanjose.dto.inventario.ActualizarStockRequest;
import com.importacionessanjose.dto.inventario.InventarioRequest;
import com.importacionessanjose.dto.inventario.InventarioResponse;
import com.importacionessanjose.entity.InventarioSede;
import com.importacionessanjose.entity.Producto;
import com.importacionessanjose.entity.Sede;
import com.importacionessanjose.exception.BusinessException;
import com.importacionessanjose.exception.ResourceNotFoundException;
import com.importacionessanjose.repository.InventarioSedeRepository;
import com.importacionessanjose.repository.ProductoRepository;
import com.importacionessanjose.repository.SedeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventarioService {

    private final InventarioSedeRepository inventarioRepository;
    private final SedeRepository sedeRepository;
    private final ProductoRepository productoRepository;

    public InventarioService(InventarioSedeRepository inventarioRepository,
            SedeRepository sedeRepository,
            ProductoRepository productoRepository) {
        this.inventarioRepository = inventarioRepository;
        this.sedeRepository = sedeRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional(readOnly = true)
    public List<InventarioResponse> listarPorSede(Integer sedeId) {
        if (!sedeRepository.existsById(sedeId)) {
            throw ResourceNotFoundException.of("Sede", sedeId);
        }
        return inventarioRepository.findBySedeId(sedeId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InventarioResponse> listarPorProducto(Integer productoId) {
        if (!productoRepository.existsById(productoId)) {
            throw ResourceNotFoundException.of("Producto", productoId);
        }
        return inventarioRepository.findByProductoId(productoId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public InventarioResponse obtenerPorSedeYProducto(Integer sedeId, Integer productoId) {
        InventarioSede inv = inventarioRepository.findBySedeIdAndProductoId(sedeId, productoId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No existe inventario para sede " + sedeId + " y producto " + productoId));
        return toResponse(inv);
    }

    @Transactional
    public InventarioResponse crear(InventarioRequest request) {
        Sede sede = sedeRepository.findById(request.sedeId())
                .orElseThrow(() -> ResourceNotFoundException.of("Sede", request.sedeId()));
        Producto producto = productoRepository.findById(request.productoId())
                .orElseThrow(() -> ResourceNotFoundException.of("Producto", request.productoId()));

        inventarioRepository.findBySedeIdAndProductoId(request.sedeId(), request.productoId())
                .ifPresent(existente -> {
                    throw new BusinessException(
                            "Ya existe inventario para la sede " + request.sedeId()
                                    + " y producto " + request.productoId());
                });

        InventarioSede inv = new InventarioSede();
        inv.setSede(sede);
        inv.setProducto(producto);
        inv.setStockActual(request.stockActual());
        InventarioSede guardado = inventarioRepository.save(inv);
        return toResponse(guardado);
    }

    @Transactional
    public InventarioResponse actualizarStock(Integer sedeId, Integer productoId, ActualizarStockRequest request) {
        InventarioSede inv = inventarioRepository.findBySedeIdAndProductoId(sedeId, productoId)
                .orElseGet(() -> {
                    Sede sede = sedeRepository.findById(sedeId)
                            .orElseThrow(() -> ResourceNotFoundException.of("Sede", sedeId));
                    Producto producto = productoRepository.findById(productoId)
                            .orElseThrow(() -> ResourceNotFoundException.of("Producto", productoId));
                    InventarioSede nuevo = new InventarioSede();
                    nuevo.setSede(sede);
                    nuevo.setProducto(producto);
                    nuevo.setStockActual(0);
                    return nuevo;
                });
        inv.setStockActual(request.stockActual());
        InventarioSede guardado = inventarioRepository.save(inv);
        return toResponse(guardado);
    }

    private InventarioResponse toResponse(InventarioSede inv) {
        return new InventarioResponse(
                inv.getId(),
                inv.getSede().getId(),
                inv.getSede().getNombreSede(),
                inv.getProducto().getId(),
                inv.getProducto().getNombre(),
                inv.getProducto().getCodigoQr(),
                inv.getStockActual());
    }
}
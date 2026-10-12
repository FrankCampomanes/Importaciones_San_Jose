package com.importacionessanjose.service;

import com.importacionessanjose.dto.producto.ProductoRequest;
import com.importacionessanjose.dto.producto.ProductoResponse;
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
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final SedeRepository sedeRepository;
    private final InventarioSedeRepository inventarioSedeRepository;

    public ProductoService(ProductoRepository productoRepository,
                           SedeRepository sedeRepository,
                           InventarioSedeRepository inventarioSedeRepository) {
        this.productoRepository = productoRepository;
        this.sedeRepository = sedeRepository;
        this.inventarioSedeRepository = inventarioSedeRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> listarActivos() {
        return productoRepository.findByActivoTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> listarTodos() {
        return productoRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtenerPorId(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Producto", id));
        return toResponse(producto);
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtenerPorQr(String codigoQr) {
        Producto producto = productoRepository.findByCodigoQr(codigoQr)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con QR: " + codigoQr));
        return toResponse(producto);
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> buscarPorCategoria(String categoria) {
        return productoRepository.findByCategoriaAndActivoTrue(categoria).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        String qr = (request.codigoQr() != null && !request.codigoQr().isBlank())
                ? request.codigoQr().trim()
                : "SJ-PROD-" + System.currentTimeMillis();

        if (productoRepository.findByCodigoQr(qr).isPresent()) {
            qr = qr + "-" + (int) (Math.random() * 1000);
        }

        Producto producto = new Producto();
        aplicar(producto, request, qr);
        producto.setFechaCreacion(java.time.LocalDateTime.now());
        Producto guardado = productoRepository.save(producto);

        // Inicializar automáticamente el inventario para todas las sedes activas
        List<Sede> sedes = sedeRepository.findByActivoTrue();
        for (Sede s : sedes) {
            InventarioSede inv = new InventarioSede();
            inv.setSede(s);
            inv.setProducto(guardado);
            inv.setStockActual(s.getId() <= 2 ? 15 : 10);
            inventarioSedeRepository.save(inv);
        }

        return toResponse(guardado);
    }

    @Transactional
    public ProductoResponse actualizar(Integer id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Producto", id));

        String qr = (request.codigoQr() != null && !request.codigoQr().isBlank())
                ? request.codigoQr().trim()
                : (producto.getCodigoQr() != null ? producto.getCodigoQr() : "SJ-PROD-" + id);

        productoRepository.findByCodigoQr(qr).ifPresent(otro -> {
            if (!otro.getId().equals(id)) {
                throw new BusinessException("Ya existe otro producto con el código QR: " + qr);
            }
        });

        aplicar(producto, request, qr);
        Producto guardado = productoRepository.save(producto);
        return toResponse(guardado);
    }

    @Transactional
    public void eliminar(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Producto", id));
        // Borrado lógico: no eliminamos filas con historial de ventas.
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    private void aplicar(Producto producto, ProductoRequest request, String qr) {
        producto.setNombre(request.nombre());
        producto.setDescripcion(request.descripcion());
        producto.setPrecio(request.precio());
        producto.setCostoAdquisicion(request.costoAdquisicion());
        producto.setCategoria(request.categoria());
        producto.setImagenUrl(request.imagenUrl());
        producto.setCodigoQr(qr);
        producto.setActivo(request.activo() == null ? Boolean.TRUE : request.activo());
    }

    private ProductoResponse toResponse(Producto p) {
        return new ProductoResponse(
                p.getId(),
                p.getNombre(),
                p.getDescripcion(),
                p.getPrecio(),
                p.getCostoAdquisicion(),
                p.getCategoria(),
                p.getImagenUrl(),
                p.getCodigoQr(),
                p.getActivo(),
                p.getFechaCreacion());
    }
}
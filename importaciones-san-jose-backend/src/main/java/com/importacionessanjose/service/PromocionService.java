package com.importacionessanjose.service;

import com.importacionessanjose.dto.promocion.PromocionRequest;
import com.importacionessanjose.dto.promocion.PromocionResponse;
import com.importacionessanjose.entity.Producto;
import com.importacionessanjose.entity.Promocion;
import com.importacionessanjose.exception.BusinessException;
import com.importacionessanjose.exception.ResourceNotFoundException;
import com.importacionessanjose.repository.ProductoRepository;
import com.importacionessanjose.repository.PromocionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PromocionService {

    private final PromocionRepository promocionRepository;
    private final ProductoRepository productoRepository;

    public PromocionService(PromocionRepository promocionRepository, ProductoRepository productoRepository) {
        this.promocionRepository = promocionRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional(readOnly = true)
    public List<PromocionResponse> listarVigentes() {
        return promocionRepository.findVigentes(LocalDate.now()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PromocionResponse> listarTodas() {
        return promocionRepository.findAllByOrderByFechaCreacionDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PromocionResponse obtenerPorProducto(Integer productoId) {
        return promocionRepository.findByProductoId(productoId)
                .map(this::toResponse)
                .orElse(null);
    }

    @Transactional
    public PromocionResponse guardarOActualizar(PromocionRequest request) {
        Producto producto = productoRepository.findById(request.productoId())
                .orElseThrow(() -> ResourceNotFoundException.of("Producto", request.productoId()));

        Optional<Promocion> optExistente = promocionRepository.findByProductoId(request.productoId());

        Promocion promo = optExistente.orElseGet(Promocion::new);
        promo.setProducto(producto);
        promo.setTipo(request.tipo());
        promo.setPrecioOferta(request.precioOferta());
        promo.setDescuentoPorcentaje(request.descuentoPorcentaje());
        promo.setUnidadesMinimas(request.unidadesMinimas());
        promo.setUnidadesLleva(request.unidadesLleva());
        promo.setUnidadesGratis(request.unidadesGratis());
        promo.setMotivo(request.motivo());
        promo.setFechaFin(request.fechaFin());
        promo.setActivo(request.activo() != null ? request.activo() : true);

        if (promo.getId() == null) {
            promo.setFechaCreacion(LocalDateTime.now());
        }
        promo.setFechaActualizacion(LocalDateTime.now());

        Promocion guardada = promocionRepository.save(promo);
        return toResponse(guardada);
    }

    @Transactional
    public PromocionResponse toggleActivo(Integer id) {
        Promocion promo = promocionRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Promoción", id));

        promo.setActivo(!Boolean.TRUE.equals(promo.getActivo()));
        promo.setFechaActualizacion(LocalDateTime.now());
        Promocion actualizada = promocionRepository.save(promo);
        return toResponse(actualizada);
    }

    @Transactional
    public void desactivar(Integer id) {
        Promocion promo = promocionRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Promoción", id));

        promo.setActivo(false);
        promo.setFechaActualizacion(LocalDateTime.now());
        promocionRepository.save(promo);
    }

    @Transactional
    public void eliminar(Integer id) {
        Promocion promo = promocionRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Promoción", id));
        // Desactivación lógica o física según requerimiento
        promo.setActivo(false);
        promocionRepository.save(promo);
    }

    private PromocionResponse toResponse(Promocion p) {
        Producto prod = p.getProducto();
        return new PromocionResponse(
                p.getId(),
                prod != null ? prod.getId() : null,
                prod != null ? prod.getNombre() : null,
                prod != null ? prod.getPrecio() : null,
                p.getTipo(),
                p.getPrecioOferta(),
                p.getDescuentoPorcentaje(),
                p.getUnidadesMinimas(),
                p.getUnidadesLleva(),
                p.getUnidadesGratis(),
                p.getMotivo(),
                p.getFechaFin(),
                p.getActivo(),
                p.estaExpirada(),
                p.getFechaCreacion(),
                p.getFechaActualizacion()
        );
    }
}

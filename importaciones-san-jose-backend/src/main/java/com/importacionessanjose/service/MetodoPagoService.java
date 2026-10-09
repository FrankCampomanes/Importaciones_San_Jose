package com.importacionessanjose.service;

import com.importacionessanjose.dto.pago.MetodoPagoRequest;
import com.importacionessanjose.dto.pago.MetodoPagoResponse;
import com.importacionessanjose.entity.MetodoPago;
import com.importacionessanjose.entity.Usuario;
import com.importacionessanjose.exception.BusinessException;
import com.importacionessanjose.exception.ResourceNotFoundException;
import com.importacionessanjose.repository.MetodoPagoRepository;
import com.importacionessanjose.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MetodoPagoService {

    private final MetodoPagoRepository metodoPagoRepository;
    private final UsuarioRepository usuarioRepository;

    public MetodoPagoService(MetodoPagoRepository metodoPagoRepository,
            UsuarioRepository usuarioRepository) {
        this.metodoPagoRepository = metodoPagoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<MetodoPagoResponse> listarPorUsuario(Integer usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw ResourceNotFoundException.of("Usuario", usuarioId);
        }
        return metodoPagoRepository.findByUsuarioId(usuarioId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MetodoPagoResponse crear(Integer usuarioId, MetodoPagoRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ResourceNotFoundException.of("Usuario", usuarioId));

        // Unicidad del token simulado
        metodoPagoRepository.findAll().stream()
                .filter(m -> m.getTokenSimulado().equals(request.tokenSimulado()))
                .findFirst()
                .ifPresent(m -> {
                    throw new BusinessException("El token simulado ya está registrado");
                });

        MetodoPago metodo = new MetodoPago();
        metodo.setUsuario(usuario);
        metodo.setTokenSimulado(request.tokenSimulado());
        metodo.setUltimosDigitos(request.ultimosDigitos());
        metodo.setTitular(request.titular());
        metodo.setMesExpiracion(request.mesExpiracion());
        metodo.setAnioExpiracion(request.anioExpiracion());
        metodo.setFechaCreacion(LocalDateTime.now());

        MetodoPago guardado = metodoPagoRepository.save(metodo);
        return toResponse(guardado);
    }

    @Transactional
    public void eliminar(Integer usuarioId, Integer metodoId) {
        MetodoPago metodo = metodoPagoRepository.findById(metodoId)
                .orElseThrow(() -> ResourceNotFoundException.of("Método de pago", metodoId));

        if (!metodo.getUsuario().getId().equals(usuarioId)) {
            throw new BusinessException("El método de pago no pertenece al usuario indicado");
        }

        // TODO: validar que no esté asociado a ventas antes de eliminar.
        // Por ahora, si está asociado, MySQL lanzará error de FK (RESTRICT).
        metodoPagoRepository.delete(metodo);
    }

    private MetodoPagoResponse toResponse(MetodoPago m) {
        return new MetodoPagoResponse(
                m.getId(),
                m.getUsuario().getId(),
                m.getUltimosDigitos(),
                m.getTitular(),
                m.getMesExpiracion(),
                m.getAnioExpiracion(),
                m.getFechaCreacion());
    }
}
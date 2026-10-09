package com.importacionessanjose.service;

import com.importacionessanjose.dto.sede.SedeRequest;
import com.importacionessanjose.dto.sede.SedeResponse;
import com.importacionessanjose.entity.Sede;
import com.importacionessanjose.exception.ResourceNotFoundException;
import com.importacionessanjose.repository.SedeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SedeService {

    private final SedeRepository sedeRepository;

    public SedeService(SedeRepository sedeRepository) {
        this.sedeRepository = sedeRepository;
    }

    @Transactional(readOnly = true)
    public List<SedeResponse> listarActivas() {
        return sedeRepository.findByActivoTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SedeResponse> listarTodas() {
        return sedeRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SedeResponse obtenerPorId(Integer id) {
        Sede sede = sedeRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Sede", id));
        return toResponse(sede);
    }

    @Transactional
    public SedeResponse crear(SedeRequest request) {
        Sede sede = new Sede();
        aplicar(sede, request);
        Sede guardada = sedeRepository.save(sede);
        return toResponse(guardada);
    }

    @Transactional
    public SedeResponse actualizar(Integer id, SedeRequest request) {
        Sede sede = sedeRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Sede", id));
        aplicar(sede, request);
        Sede guardada = sedeRepository.save(sede);
        return toResponse(guardada);
    }

    private void aplicar(Sede sede, SedeRequest request) {
        sede.setNombreSede(request.nombreSede());
        sede.setDireccion(request.direccion());
        sede.setDistrito(request.distrito());
        sede.setProvincia(request.provincia());
        sede.setTelefono(request.telefono());
        sede.setHorarioAtencion(request.horarioAtencion());
        sede.setActivo(request.activo() == null ? Boolean.TRUE : request.activo());
    }

    private SedeResponse toResponse(Sede s) {
        return new SedeResponse(
                s.getId(),
                s.getNombreSede(),
                s.getDireccion(),
                s.getDistrito(),
                s.getProvincia(),
                s.getTelefono(),
                s.getHorarioAtencion(),
                s.getActivo());
    }
}
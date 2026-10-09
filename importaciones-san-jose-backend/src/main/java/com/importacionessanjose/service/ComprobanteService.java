package com.importacionessanjose.service;

import com.importacionessanjose.entity.Venta;
import com.importacionessanjose.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ComprobanteService {

    private final VentaRepository ventaRepository;

    public ComprobanteService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    /**
     * Genera el siguiente número de comprobante para el tipo dado.
     * Formato: B001-XXXXXXXX o F001-XXXXXXXX (correlativo de 8 dígitos).
     *
     * TODO: CONFIRMAR REGLA DE NEGOCIO — series por sede en v2.
     * TODO: CONFIRMAR REGLA DE NEGOCIO — reinicio anual o continuo.
     */
    @Transactional
    public String generarNumero(String tipo) {
        String serie = "Boleta".equals(tipo) ? "B001" : "F001";
        Optional<Venta> ultima = ventaRepository.findTopByComprobanteOrderByIdDesc(tipo);

        int siguiente = ultima
                .map(v -> extraerCorrelativo(v.getNumeroComprobante()) + 1)
                .orElse(1);

        return String.format("%s-%08d", serie, siguiente);
    }

    private int extraerCorrelativo(String numero) {
        try {
            return Integer.parseInt(numero.substring(numero.indexOf('-') + 1));
        } catch (Exception e) {
            return 0;
        }
    }
}
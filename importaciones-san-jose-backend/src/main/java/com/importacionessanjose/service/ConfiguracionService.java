package com.importacionessanjose.service;

import com.importacionessanjose.entity.Configuracion;
import com.importacionessanjose.exception.ResourceNotFoundException;
import com.importacionessanjose.repository.ConfiguracionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class ConfiguracionService {

    private final ConfiguracionRepository repository;

    public ConfiguracionService(ConfiguracionRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public String getString(String clave) {
        return repository.findByClave(clave)
                .filter(Configuracion::getActivo)
                .map(Configuracion::getValor)
                .orElseThrow(() -> new ResourceNotFoundException("Configuración no encontrada: " + clave));
    }

    @Transactional(readOnly = true)
    public BigDecimal getDecimal(String clave) {
        return new BigDecimal(getString(clave));
    }

    @Transactional(readOnly = true)
    public Integer getEntero(String clave) {
        return Integer.valueOf(getString(clave));
    }

    @Transactional(readOnly = true)
    public Boolean getBooleano(String clave) {
        return Boolean.valueOf(getString(clave));
    }

    // Claves conocidas — TODO: mover a constantes o enum si crecen
    public BigDecimal getIgvPorcentaje() {
        return getDecimal("IGV_PORCENTAJE");
    }

    public BigDecimal getDeliveryUmbralGratis() {
        return getDecimal("DELIVERY_UMBRAL_GRATIS");
    }

    public BigDecimal getDeliveryCostoFijo() {
        return getDecimal("DELIVERY_COSTO_FIJO");
    }

    public Boolean isDeliveryLimaMetropolitana() {
        return getBooleano("DELIVERY_LIMA_METROPOLITANA");
    }

    public String getAdminRegistrationKey() {
        return repository.findByClave("ADMIN_REGISTRATION_KEY")
                .filter(Configuracion::getActivo)
                .map(Configuracion::getValor)
                .orElse("ROSES080816");
    }

    public String getCulqiPublicKey() {
        return repository.findByClave("CULQI_PUBLIC_KEY")
                .filter(Configuracion::getActivo)
                .map(Configuracion::getValor)
                .orElse("pk_test_sample12345678");
    }

    public String getCulqiSecretKey() {
        return repository.findByClave("CULQI_SECRET_KEY")
                .filter(Configuracion::getActivo)
                .map(Configuracion::getValor)
                .orElse("sk_test_sample12345678");
    }
}
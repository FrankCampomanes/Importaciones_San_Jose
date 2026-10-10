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

    public String getMercadoPagoPublicKey() {
        return repository.findByClave("MERCADOPAGO_PUBLIC_KEY")
                .filter(Configuracion::getActivo)
                .map(Configuracion::getValor)
                .orElse("TEST-cfd28cb2-df82-4c40-8ae6-f6a34949df20");
    }

    public String getMercadoPagoAccessToken() {
        return repository.findByClave("MERCADOPAGO_ACCESS_TOKEN")
                .filter(Configuracion::getActivo)
                .map(Configuracion::getValor)
                .orElse("TEST-7077188188231241-100920-f7cb1accb0dd553f6e12b85653fcc76d-3750642607");
    }
}
package com.importacionessanjose.repository;

import com.importacionessanjose.entity.Configuracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConfiguracionRepository extends JpaRepository<Configuracion, Integer> {

    Optional<Configuracion> findByClave(String clave);

    boolean existsByClave(String clave);

    List<Configuracion> findByActivoTrue();
}
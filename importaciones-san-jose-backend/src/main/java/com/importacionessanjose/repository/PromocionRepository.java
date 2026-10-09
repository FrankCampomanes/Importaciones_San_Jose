package com.importacionessanjose.repository;

import com.importacionessanjose.entity.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Integer> {

    @Query("SELECT p FROM Promocion p WHERE p.activo = true AND (p.fechaFin IS NULL OR p.fechaFin >= :fechaActual)")
    List<Promocion> findVigentes(@Param("fechaActual") LocalDate fechaActual);

    Optional<Promocion> findByProductoId(Integer productoId);

    List<Promocion> findAllByOrderByFechaCreacionDesc();
}

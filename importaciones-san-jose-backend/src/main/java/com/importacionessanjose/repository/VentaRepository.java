package com.importacionessanjose.repository;

import com.importacionessanjose.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Integer> {

    List<Venta> findByUsuarioId(Integer usuarioId);

    List<Venta> findBySedeId(Integer sedeId);

    Optional<Venta> findByNumeroComprobante(String numeroComprobante);

    Optional<Venta> findTopByComprobanteOrderByIdDesc(String comprobante);

        @Query("SELECT v FROM Venta v WHERE v.estado = 'Completada' AND v.fechaHora BETWEEN :desde AND :hasta")
    List<Venta> findCompletadasEnRango(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);

    @Query("SELECT COUNT(v), COALESCE(SUM(v.subtotal),0), COALESCE(SUM(v.igv),0), " +
           "COALESCE(SUM(v.costoEnvio),0), COALESCE(SUM(v.total),0) " +
           "FROM Venta v WHERE v.estado = 'Completada' AND v.fechaHora BETWEEN :desde AND :hasta")
    Object[] sumarizadoEnRango(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);

    @Query("SELECT COUNT(v) AS pedidos, " +
            "COALESCE(SUM(v.subtotal),0) AS subtotal, " +
            "COALESCE(SUM(v.igv),0) AS igv, " +
            "COALESCE(SUM(v.costoEnvio),0) AS costoEnvio, " +
            "COALESCE(SUM(v.total),0) AS total " +
            "FROM Venta v WHERE v.estado = 'Completada' AND v.fechaHora BETWEEN :desde AND :hasta")
    VentaResumenProjection resumenEnRango(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);

    @Query("SELECT function('DATE', v.fechaHora) AS dia, " +
            "SUM(v.total) AS total, COUNT(v) AS pedidos " +
            "FROM Venta v WHERE v.estado = 'Completada' AND v.fechaHora BETWEEN :desde AND :hasta " +
            "GROUP BY function('DATE', v.fechaHora) " +
            "ORDER BY function('DATE', v.fechaHora)")
    List<Object[]> ventasPorDiaEnRango(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);

    @Query("SELECT COUNT(v), COALESCE(SUM(v.total),0) FROM Venta v " +
            "WHERE v.estado = 'Completada' AND v.fechaHora BETWEEN :desde AND :hasta " +
            "AND v.sede.id = :sedeId")
    Object[] sumarizadoPorSede(@Param("sedeId") Integer sedeId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta);
}
package com.importacionessanjose.repository;

import com.importacionessanjose.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Integer> {

    List<DetalleVenta> findByVentaId(Integer ventaId);

    List<DetalleVenta> findByProductoId(Integer productoId);

        @Query("SELECT d.producto.id AS productoId, " +
           "d.producto.nombre AS productoNombre, " +
           "d.producto.codigoQr AS productoCodigoQr, " +
           "SUM(d.cantidad) AS unidades, " +
           "SUM(d.precioUnitario * d.cantidad) AS ingresos " +
           "FROM DetalleVenta d " +
           "WHERE d.venta.estado = 'Completada' AND d.venta.fechaHora BETWEEN :desde AND :hasta " +
           "GROUP BY d.producto.id, d.producto.nombre, d.producto.codigoQr " +
           "ORDER BY SUM(d.cantidad) DESC")
    List<ProductoVendidoProjection> topProductosEnRango(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);

    @Query("SELECT d.producto.id AS productoId, " +
           "d.producto.nombre AS productoNombre, " +
           "d.producto.codigoQr AS productoCodigoQr, " +
           "SUM(d.cantidad) AS unidades, " +
           "SUM(d.precioUnitario * d.cantidad) AS ingresos " +
           "FROM DetalleVenta d " +
           "WHERE d.venta.estado = 'Completada' AND d.venta.fechaHora BETWEEN :desde AND :hasta " +
           "AND d.venta.sede.id = :sedeId " +
           "GROUP BY d.producto.id, d.producto.nombre, d.producto.codigoQr " +
           "ORDER BY SUM(d.cantidad) DESC")
    List<ProductoVendidoProjection> topProductosPorSedeEnRango(@Param("sedeId") Integer sedeId,
                                                                @Param("desde") LocalDateTime desde,
                                                                @Param("hasta") LocalDateTime hasta);

    @Query("SELECT d.producto.id FROM DetalleVenta d " +
           "WHERE d.venta.estado = 'Completada' AND d.venta.fechaHora BETWEEN :desde AND :hasta")
    List<Integer> productosVendidosIdsEnRango(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);
}
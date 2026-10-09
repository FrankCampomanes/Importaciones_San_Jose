package com.importacionessanjose.repository;

import com.importacionessanjose.entity.InventarioSede;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventarioSedeRepository extends JpaRepository<InventarioSede, Integer> {

    Optional<InventarioSede> findBySedeIdAndProductoId(Integer sedeId, Integer productoId);

    List<InventarioSede> findBySedeId(Integer sedeId);

    List<InventarioSede> findByProductoId(Integer productoId);

    /**
     * Bloqueo pesimista (SELECT ... FOR UPDATE) sobre una fila de inventario.
     * Se usa durante el checkout para evitar sobreventa concurrente.
     */
    @Query(value = "SELECT * FROM inventario_sedes WHERE id_sede = :sedeId AND id_producto = :productoId FOR UPDATE", nativeQuery = true)
    Optional<InventarioSede> findBySedeIdAndProductoIdForUpdate(
            @Param("sedeId") Integer sedeId,
            @Param("productoId") Integer productoId);

            @Query("SELECT COALESCE(SUM(i.stockActual),0) FROM InventarioSede i WHERE i.producto.id = :productoId")
    Long stockTotalProducto(@Param("productoId") Integer productoId);
}
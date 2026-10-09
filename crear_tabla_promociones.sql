-- Crear tabla de promociones comerciales para Importaciones San José
USE importaciones_san_jose;

CREATE TABLE IF NOT EXISTS promociones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'descuento_directo', 'bonificacion', 'descuento_volumen'
    precio_oferta DECIMAL(10,2) NULL,
    descuento_porcentaje INT NULL,
    unidades_minimas INT NULL,
    unidades_lleva INT NULL,
    unidades_gratis INT NULL,
    motivo VARCHAR(255) NOT NULL,
    fecha_fin DATE NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_promociones_producto (producto_id),
    INDEX idx_promociones_activo (activo),
    INDEX idx_promociones_fechafin (fecha_fin),
    CONSTRAINT fk_promociones_producto FOREIGN KEY (producto_id) REFERENCES productos (ID_Producto) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar ofertas iniciales activas vinculadas a productos reales
DELETE FROM promociones WHERE producto_id IN (1, 2, 11);

INSERT INTO promociones (producto_id, tipo, precio_oferta, descuento_porcentaje, unidades_minimas, unidades_lleva, unidades_gratis, motivo, fecha_fin, activo)
VALUES 
(1, 'descuento_directo', 2.80, NULL, NULL, NULL, NULL, 'Super Oferta de Temporada', '2026-12-31', 1),
(2, 'bonificacion', NULL, NULL, NULL, 3, 1, 'Lleva 3 y recibe 1 gratis', '2026-12-31', 1),
(11, 'descuento_volumen', NULL, 20, 2, NULL, NULL, '20% de descuento a partir de 2 unidades', '2026-12-31', 1);

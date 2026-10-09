-- =====================================================================
-- GRUPO IMPORTACIONES SAN JOSÉ S.R.L.
-- BASE DE DATOS OFICIAL Y DEFINITIVA (MySQL / XAMPP v2 Final)
-- Compatible al 100% con Spring Boot JPA y Frontend React
-- Codificación: UTF-8 (utf8mb4_unicode_ci)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS importaciones_san_jose 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE importaciones_san_jose;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS Detalle_Ventas;
DROP TABLE IF EXISTS Ventas;
DROP TABLE IF EXISTS Metodos_Pago;
DROP TABLE IF EXISTS Inventario_Sedes;
DROP TABLE IF EXISTS Productos;
DROP TABLE IF EXISTS Sedes;
DROP TABLE IF EXISTS Usuarios;
DROP TABLE IF EXISTS Configuracion;
SET FOREIGN_KEY_CHECKS=1;

-- ---------------------------------------------------------------------
-- 1. TABLA: Configuracion (Reglas de negocio, IGV y Delivery)
-- ---------------------------------------------------------------------
CREATE TABLE Configuracion (
  ID_Configuracion INT AUTO_INCREMENT PRIMARY KEY,
  Clave VARCHAR(80) NOT NULL UNIQUE,
  Valor VARCHAR(255) NOT NULL,
  Descripcion VARCHAR(255),
  Tipo ENUM('DECIMAL','ENTERO','TEXTO','BOOLEANO') NOT NULL DEFAULT 'TEXTO',
  Activo BOOLEAN NOT NULL DEFAULT TRUE,
  Fecha_Actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. TABLA: Usuarios (Autenticación y Roles)
-- ---------------------------------------------------------------------
CREATE TABLE Usuarios (
  ID_Usuario INT AUTO_INCREMENT PRIMARY KEY,
  Nombre_Completo VARCHAR(150) NOT NULL,
  Correo VARCHAR(120) NOT NULL UNIQUE,
  Password_Hash VARCHAR(255) NOT NULL,
  Rol ENUM('Admin','Cliente') NOT NULL DEFAULT 'Cliente',
  Telefono VARCHAR(20),
  Activo BOOLEAN NOT NULL DEFAULT TRUE,
  Fecha_Registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario_correo (Correo), 
  INDEX idx_usuario_rol (Rol), 
  INDEX idx_usuario_activo (Activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. TABLA: Sedes (5 Sedes oficiales Lima Norte & Callao)
-- ---------------------------------------------------------------------
CREATE TABLE Sedes (
  ID_Sede INT AUTO_INCREMENT PRIMARY KEY,
  Nombre_Sede VARCHAR(100) NOT NULL,
  Direccion VARCHAR(255) NOT NULL,
  Distrito VARCHAR(80) NOT NULL,
  Provincia VARCHAR(80) NOT NULL DEFAULT 'Lima',
  Telefono VARCHAR(20),
  Horario_Atencion VARCHAR(100) DEFAULT 'Lunes a Domingo: 9:00 AM - 10:00 PM',
  Activo BOOLEAN NOT NULL DEFAULT TRUE,
  INDEX idx_sede_distrito (Distrito), 
  INDEX idx_sede_activo (Activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. TABLA: Productos (Bazar, Hogar, Juguetería, Novedades, Belleza)
-- ---------------------------------------------------------------------
CREATE TABLE Productos (
  ID_Producto INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(150) NOT NULL,
  Descripcion TEXT,
  Precio DECIMAL(10,2) NOT NULL CHECK (Precio >= 0),
  Costo_Adquisicion DECIMAL(10,2) NULL CHECK (Costo_Adquisicion IS NULL OR Costo_Adquisicion >= 0),
  Categoria VARCHAR(80) NOT NULL,
  Imagen_URL VARCHAR(500),
  Codigo_QR VARCHAR(100) NOT NULL UNIQUE,
  Activo BOOLEAN NOT NULL DEFAULT TRUE,
  Fecha_Creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_producto_nombre (Nombre), 
  INDEX idx_producto_categoria (Categoria), 
  INDEX idx_producto_qr (Codigo_QR), 
  INDEX idx_producto_activo (Activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. TABLA: Inventario_Sedes (Stock Multisede)
-- ---------------------------------------------------------------------
CREATE TABLE Inventario_Sedes (
  ID_Inventario INT AUTO_INCREMENT PRIMARY KEY,
  ID_Sede INT NOT NULL,
  ID_Producto INT NOT NULL,
  Stock_Actual INT NOT NULL DEFAULT 0 CHECK (Stock_Actual >= 0),
  CONSTRAINT fk_inventario_sede FOREIGN KEY (ID_Sede) REFERENCES Sedes(ID_Sede) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_inventario_producto FOREIGN KEY (ID_Producto) REFERENCES Productos(ID_Producto) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT uq_sede_producto UNIQUE (ID_Sede, ID_Producto),
  INDEX idx_inventario_stock (Stock_Actual), 
  INDEX idx_inventario_producto (ID_Producto), 
  INDEX idx_inventario_sede (ID_Sede)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. TABLA: Metodos_Pago (Tarjetas / Pasarela simulada)
-- ---------------------------------------------------------------------
CREATE TABLE Metodos_Pago (
  ID_Metodo INT AUTO_INCREMENT PRIMARY KEY,
  ID_Usuario INT NOT NULL,
  Token_Simulado VARCHAR(100) NOT NULL UNIQUE,
  Ultimos_Digitos VARCHAR(4) NOT NULL,
  Titular VARCHAR(150) NOT NULL,
  Mes_Expiracion VARCHAR(2) NOT NULL,
  Anio_Expiracion VARCHAR(4) NOT NULL,
  Fecha_Creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_metodopago_usuario FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(ID_Usuario) ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_metodopago_usuario (ID_Usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. TABLA: Ventas (Órdenes de Compra y Comprobantes SUNAT)
-- ---------------------------------------------------------------------
CREATE TABLE Ventas (
  ID_Venta INT AUTO_INCREMENT PRIMARY KEY,
  ID_Usuario INT NOT NULL,
  ID_Sede INT NOT NULL,
  ID_Metodo INT NOT NULL,
  Metodo_Entrega ENUM('Recojo en Tienda','Delivery') NOT NULL,
  Direccion_Envio VARCHAR(255),
  Distrito_Envio VARCHAR(100),
  Referencia_Envio VARCHAR(255),
  Fecha_Hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Subtotal DECIMAL(10,2) NOT NULL CHECK (Subtotal >= 0),
  IGV DECIMAL(10,2) NOT NULL CHECK (IGV >= 0),
  Costo_Envio DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (Costo_Envio >= 0),
  Total DECIMAL(10,2) NOT NULL CHECK (Total >= 0),
  Comprobante ENUM('Boleta','Factura') NOT NULL,
  Numero_Comprobante VARCHAR(30) NOT NULL UNIQUE,
  Num_Documento_Cliente VARCHAR(20) NOT NULL,
  Razon_Social_Cliente VARCHAR(150),
  Estado ENUM('Completada','Cancelada') NOT NULL DEFAULT 'Completada',
  CONSTRAINT fk_ventas_usuario FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(ID_Usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_ventas_sede FOREIGN KEY (ID_Sede) REFERENCES Sedes(ID_Sede) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_ventas_metodo FOREIGN KEY (ID_Metodo) REFERENCES Metodos_Pago(ID_Metodo) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_ventas_fecha (Fecha_Hora), 
  INDEX idx_ventas_estado (Estado), 
  INDEX idx_ventas_sede (ID_Sede), 
  INDEX idx_ventas_usuario (ID_Usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. TABLA: Detalle_Ventas (Ítems por Venta)
-- ---------------------------------------------------------------------
CREATE TABLE Detalle_Ventas (
  ID_Detalle INT AUTO_INCREMENT PRIMARY KEY,
  ID_Venta INT NOT NULL,
  ID_Producto INT NOT NULL,
  Cantidad INT NOT NULL CHECK (Cantidad > 0),
  Precio_Unitario DECIMAL(10,2) NOT NULL CHECK (Precio_Unitario >= 0),
  Costo_Unitario DECIMAL(10,2) NULL CHECK (Costo_Unitario IS NULL OR Costo_Unitario >= 0),
  CONSTRAINT fk_detalle_venta FOREIGN KEY (ID_Venta) REFERENCES Ventas(ID_Venta) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_detalle_producto FOREIGN KEY (ID_Producto) REFERENCES Productos(ID_Producto) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_detalle_venta (ID_Venta), 
  INDEX idx_detalle_producto (ID_Producto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- POBLACIÓN DE DATOS INICIALES (SEMILLA DEFINITIVA)
-- =====================================================================

-- Configuración
INSERT INTO Configuracion (Clave, Valor, Descripcion, Tipo) VALUES
('IGV_PORCENTAJE', '18.00', 'Porcentaje de IGV oficial del 18%', 'DECIMAL'),
('DELIVERY_UMBRAL_GRATIS', '60.00', 'Monto mínimo de compra para delivery gratuito en soles', 'DECIMAL'),
('DELIVERY_COSTO_FIJO', '2.00', 'Costo estándar de delivery si no supera el umbral', 'DECIMAL'),
('DELIVERY_LIMA_METROPOLITANA', 'true', 'Habilitación de cobertura para Lima Norte y Callao', 'BOOLEANO'),
('ADMIN_REGISTRATION_KEY', 'ROSES080816', 'Clave requerida para registro de administradores', 'TEXTO'),
('CULQI_PUBLIC_KEY', 'pk_test_sample12345678', 'Llave pública de Culqi Sandbox para tokenización frontend', 'TEXTO'),
('CULQI_SECRET_KEY', 'sk_test_sample12345678', 'Llave secreta de Culqi Sandbox para cargos en backend', 'TEXTO');

-- Sedes Oficiales
INSERT INTO Sedes (ID_Sede, Nombre_Sede, Direccion, Distrito, Provincia, Telefono, Horario_Atencion) VALUES
(1, 'Sede Puente Piedra (Principal)', 'Mza. B Lote 9, Coop. San Lorenzo', 'Puente Piedra', 'Lima', '01-555-1001', 'Lunes a Domingo: 9:00 AM - 10:00 PM'),
(2, 'Sede Los Olivos', 'Av. 2 de Octubre, 3W29+CVF', 'Los Olivos', 'Lima', '01-555-1002', 'Lunes a Domingo: 9:00 AM - 10:00 PM'),
(3, 'Sede Los Olivos - Villasol', 'Av. Huandoy, Mz. J, Lote 16', 'Los Olivos', 'Lima', '01-555-1003', 'Lunes a Domingo: 9:00 AM - 10:00 PM'),
(4, 'Sede Ventanilla - Pachacútec', 'C. Piloto Pachacútec, Ventanilla 07071', 'Ventanilla', 'Callao', '01-555-1004', 'Lunes a Domingo: 9:00 AM - 10:00 PM'),
(5, 'Sede Comas - Collique', 'Av. Revolución 3.ª Zona, Mz. C1, Lote 10C', 'Comas', 'Lima', '01-555-1005', 'Lunes a Domingo: 9:00 AM - 10:00 PM');

-- Usuarios Oficiales (Contraseña: admin123 para Admin, cliente123 para Cliente)
INSERT INTO Usuarios (ID_Usuario, Nombre_Completo, Correo, Password_Hash, Rol, Telefono) VALUES
(1, 'Administrador General', 'admin@sanjose.pe', '$2a$10$vUqrFZGmid5cJ6af/S0hh.9pYVC2qJhYLyYSpA1sGY127v91AfSc.', 'Admin', '987654321'),
(2, 'Juan Pérez Rodríguez', 'cliente@gmail.com', '$2a$10$vUqrFZGmid5cJ6af/S0hh.9pYVC2qJhYLyYSpA1sGY127v91AfSc.', 'Cliente', '912345678');

-- Catálogo Real de Productos (Exactamente los 22 con imágenes locales disponibles)
INSERT INTO Productos (ID_Producto, Nombre, Descripcion, Precio, Costo_Adquisicion, Categoria, Imagen_URL, Codigo_QR) VALUES
(1, 'Guantes para lavar', 'Guantes resistentes de látex multiusos para limpieza de cocina y hogar.', 3.50, 2.20, 'Hogar y Cocina', '/images/products/img001.png', 'SJ-PROD-001'),
(2, 'Jarras de vidrio', 'Jarra de vidrio templado elegante con asa ergonómica, ideal para bebidas frías.', 7.50, 4.80, 'Hogar y Cocina', '/images/products/img002.png', 'SJ-PROD-002'),
(3, 'Coladores', 'Colador multiusos de malla fina de acero inoxidable para cocina.', 3.00, 1.95, 'Hogar y Cocina', '/images/products/img003.png', 'SJ-PROD-003'),
(4, 'Jarra 1.5 Litros', 'Jarra plástica graduada de 1.5L libre de BPA para refrescos y jugos.', 7.50, 4.80, 'Hogar y Cocina', '/images/products/img005.png', 'SJ-PROD-004'),
(5, 'Collar para gato', 'Collar ajustable con cascabel sonoro y broche de seguridad para mascotas.', 1.00, 0.65, 'Novedades y Temporada', '/images/products/img007.png', 'SJ-PROD-005'),
(6, 'Perchero multiusos', 'Perchero colgador de pared con ganchos resistentes para baño o dormitorio.', 10.00, 6.50, 'Hogar y Cocina', '/images/products/img008.png', 'SJ-PROD-006'),
(7, 'Papel higiénico Sel Radiante', 'Rollo de papel higiénico doble hoja suave de máxima absorción.', 1.50, 0.95, 'Útiles y Papelería', '/images/products/img009.png', 'SJ-PROD-007'),
(8, 'Banquito', 'Banquito plástico infantil antideslizante multiusos resistente.', 5.50, 3.55, 'Hogar y Cocina', '/images/products/img010.png', 'SJ-PROD-008'),
(9, 'Lanza confeti bombarda', 'Cañón de confeti multicolor para fiestas y celebraciones de cumpleaños.', 4.00, 2.60, 'Juguetería y Niños', '/images/products/img011.png', 'SJ-PROD-009'),
(10, 'Aromatizantes', 'Aromatizante ambiental en spray con fragancia fresca y duradera.', 4.50, 2.90, 'Hogar y Cocina', '/images/products/img012.png', 'SJ-PROD-010'),
(11, 'Mini joyero de cuero', 'Organizador de joyas compacto en cuero sintético con compartimentos.', 9.00, 5.85, 'Belleza y Cuidado Personal', '/images/products/img013.png', 'SJ-PROD-011'),
(12, 'Cafetera de vidrio', 'Cafetera francesa de émbolo en vidrio resistente al calor con filtro inox.', 7.50, 4.85, 'Hogar y Cocina', '/images/products/img014.png', 'SJ-PROD-012'),
(13, 'Cepillos de pestañas', 'Pack de cepillos aplicadores descartables para pestañas y cejas.', 3.00, 1.95, 'Belleza y Cuidado Personal', '/images/products/img015.png', 'SJ-PROD-013'),
(14, 'Jarra de vidrio 750 ml', 'Jarra clásica de vidrio transparente de 750 ml para agua y jugos.', 6.00, 3.90, 'Hogar y Cocina', '/images/products/img017.png', 'SJ-PROD-014'),
(15, 'Llavero panda', 'Tierno llavero de silicona suave con diseño de oso panda y gancho metálico.', 2.00, 1.30, 'Novedades y Temporada', '/images/products/img021.png', 'SJ-PROD-015'),
(16, 'Porta cubiertos', 'Organizador plástico de cubiertos para cajón con divisiones útiles.', 6.00, 3.90, 'Hogar y Cocina', '/images/products/img022.png', 'SJ-PROD-016'),
(17, 'Cartera multiusos', 'Cartera organizadora portátil con cremallera y acabados modernos.', 18.00, 11.70, 'Novedades y Temporada', '/images/products/img023.png', 'SJ-PROD-017'),
(18, 'Llavero de cachorro', 'Llavero decorativo con diseño 3D de perrito con correa para muñeca.', 7.00, 4.55, 'Novedades y Temporada', '/images/products/img024.png', 'SJ-PROD-018'),
(19, 'Lonchera infantil', 'Lonchera térmica ligera con diseño animado ideal para colegio.', 3.00, 1.95, 'Útiles y Papelería', '/images/products/img025.png', 'SJ-PROD-019'),
(20, 'Almohada de cuello', 'Almohada ergonómica de descanso para viaje con espuma viscoelástica.', 6.00, 3.90, 'Novedades y Temporada', '/images/products/img026.png', 'SJ-PROD-020'),
(21, 'Posavasos', 'Juego de posavasos protectores con textura antideslizante para mesa.', 1.00, 0.65, 'Hogar y Cocina', '/images/products/img028.png', 'SJ-PROD-021'),
(22, 'Exprimidor de limón', 'Exprimidor manual de aluminio reforzado de alta durabilidad.', 2.00, 1.30, 'Hogar y Cocina', '/images/products/img030.png', 'SJ-PROD-022');

-- Inventario Distribuido (22 productos en las 5 sedes = 110 filas)
INSERT INTO Inventario_Sedes (ID_Sede, ID_Producto, Stock_Actual) VALUES
-- Sede 1: Puente Piedra
(1, 1, 25), (1, 2, 18), (1, 3, 30), (1, 4, 15), (1, 5, 40), (1, 6, 12),
(1, 7, 50), (1, 8, 20), (1, 9, 35), (1, 10, 22), (1, 11, 14), (1, 12, 10),
(1, 13, 40), (1, 14, 16), (1, 15, 30), (1, 16, 18), (1, 17, 8), (1, 18, 15),
(1, 19, 25), (1, 20, 14), (1, 21, 60), (1, 22, 28),
-- Sede 2: Los Olivos
(2, 1, 20), (2, 2, 15), (2, 3, 25), (2, 4, 12), (2, 5, 35), (2, 6, 10),
(2, 7, 45), (2, 8, 18), (2, 9, 30), (2, 10, 20), (2, 11, 12), (2, 12, 8),
(2, 13, 35), (2, 14, 14), (2, 15, 25), (2, 16, 15), (2, 17, 7), (2, 18, 12),
(2, 19, 20), (2, 20, 12), (2, 21, 50), (2, 22, 24),
-- Sede 3: Los Olivos - Villasol
(3, 1, 15), (3, 2, 10), (3, 3, 20), (3, 4, 10), (3, 5, 25), (3, 6, 8),
(3, 7, 30), (3, 8, 12), (3, 9, 20), (3, 10, 15), (3, 11, 8), (3, 12, 6),
(3, 13, 25), (3, 14, 10), (3, 15, 20), (3, 16, 10), (3, 17, 5), (3, 18, 10),
(3, 19, 15), (3, 20, 8), (3, 21, 40), (3, 22, 18),
-- Sede 4: Ventanilla - Pachacútec
(4, 1, 18), (4, 2, 12), (4, 3, 22), (4, 4, 10), (4, 5, 30), (4, 6, 9),
(4, 7, 35), (4, 8, 14), (4, 9, 25), (4, 10, 16), (4, 11, 10), (4, 12, 7),
(4, 13, 30), (4, 14, 12), (4, 15, 22), (4, 16, 12), (4, 17, 6), (4, 18, 11),
(4, 19, 18), (4, 20, 10), (4, 21, 45), (4, 22, 20),
-- Sede 5: Comas - Collique
(5, 1, 22), (5, 2, 14), (5, 3, 28), (5, 4, 14), (5, 5, 35), (5, 6, 11),
(5, 7, 40), (5, 8, 16), (5, 9, 28), (5, 10, 18), (5, 11, 12), (5, 12, 9),
(5, 13, 35), (5, 14, 15), (5, 15, 26), (5, 16, 14), (5, 17, 7), (5, 18, 13),
(5, 19, 22), (5, 20, 11), (5, 21, 55), (5, 22, 25);

-- Métodos de Pago Simulado
INSERT INTO Metodos_Pago (ID_Metodo, ID_Usuario, Token_Simulado, Ultimos_Digitos, Titular, Mes_Expiracion, Anio_Expiracion) VALUES
(1, 2, 'tok_sim_9a8b7c6d5e4f3a2b1c', '4242', 'JUAN PEREZ', '12', '2028');

-- Ventas de Demostración (3 pedidos históricos consistentes)
INSERT INTO Ventas (ID_Venta, ID_Usuario, ID_Sede, ID_Metodo, Metodo_Entrega, Direccion_Envio, Distrito_Envio, Referencia_Envio, Fecha_Hora, Subtotal, IGV, Costo_Envio, Total, Comprobante, Numero_Comprobante, Num_Documento_Cliente, Razon_Social_Cliente, Estado) VALUES
(1, 2, 1, 1, 'Recojo en Tienda', NULL, NULL, NULL, '2026-10-06 14:30:00', 84.75, 15.25, 0.00, 100.00, 'Boleta', 'B001-000001', '72849102', 'Juan Pérez Rodríguez', 'Completada'),
(2, 2, 2, 1, 'Delivery', 'Av. 2 de Octubre 450', 'Los Olivos', 'Frente al parque', '2026-10-07 16:15:00', 152.54, 27.46, 10.00, 190.00, 'Factura', 'F001-000001', '20607725731', 'Comercial Lima SAC', 'Completada'),
(3, 2, 1, 1, 'Recojo en Tienda', NULL, NULL, NULL, '2026-10-08 11:20:00', 46.61, 8.39, 0.00, 55.00, 'Boleta', 'B001-000002', '72849102', 'Juan Pérez Rodríguez', 'Completada');

-- Detalles de Ventas (Asociados a los productos 1, 2, 6, 11, 17)
INSERT INTO Detalle_Ventas (ID_Detalle, ID_Venta, ID_Producto, Cantidad, Precio_Unitario, Costo_Unitario) VALUES
-- Venta 1: Guantes (10 un), Jarras (6 un), Perchero (2 un) -> Total 35 + 45 + 20 = 100.00
(1, 1, 1, 10, 3.50, 2.20),
(2, 1, 2, 6, 7.50, 4.80),
(3, 1, 6, 2, 10.00, 6.50),
-- Venta 2: Cartera multiusos (10 un) -> Total 180.00 + 10 envío = 190.00
(4, 2, 17, 10, 18.00, 11.70),
-- Venta 3: Cartera multiusos (2 un), Mini joyero (1 un), Exprimidor (1 un) -> Total 36 + 9 + 2 = 47.00 aprox / ajustado a productos 17, 11
(5, 3, 17, 2, 18.00, 11.70),
(6, 3, 11, 2, 9.00, 5.85),
(7, 3, 2, 1, 1.00, 0.65);

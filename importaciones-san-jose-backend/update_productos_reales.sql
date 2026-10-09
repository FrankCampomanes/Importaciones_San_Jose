-- Script para actualizar Productos y Sedes de Grupo Importaciones San José S.R.L.

-- 1. Limpiar datos existentes
DELETE FROM Inventario_Sedes;
DELETE FROM Detalle_Ventas;
DELETE FROM Ventas;
DELETE FROM Productos;
DELETE FROM Sedes;

-- 2. Actualizar las Sedes con las direcciones exactas y horarios
INSERT INTO Sedes (ID_Sede, Nombre_Sede, Direccion, Distrito, Provincia, Telefono) VALUES
(1, 'Sede Puente Piedra (Principal)', 'Mza. B Lote 9, Coop. San Lorenzo', 'Puente Piedra', 'Lima', '01-555-1001'),
(2, 'Sede Los Olivos', 'Av. 2 de Octubre, 3W29+CVF', 'Los Olivos', 'Lima', '01-555-1002'),
(3, 'Sede Los Olivos - Villasol', 'Av. Huandoy, Mz. J, Lote 16', 'Los Olivos', 'Lima', '01-555-1003'),
(4, 'Sede Ventanilla - Pachacútec', 'C. Piloto Pachacútec, Ventanilla 07071', 'Ventanilla', 'Callao', '01-555-1004'),
(5, 'Sede Comas - Collique', 'Av. Revolución 3.ª Zona, Mz. C1, Lote 10C', 'Comas', 'Lima', '01-555-1005');

-- 3. Insertar Productos Reales del Bazar
INSERT INTO Productos (ID_Producto, Nombre, Descripcion, Precio, Categoria, Imagen_URL, Codigo_QR) VALUES
(1, 'Set de Brochas de Maquillaje Profesional', 'Kit completo de 12 brochas suaves para rostro y ojos, incluye estuche.', 25.50, 'Belleza & Cosméticos', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500', 'PROD-BROCHAS-12'),
(2, 'Organizador Acrílico para Cosméticos', 'Organizador transparente con cajones, ideal para maquillaje y joyería.', 35.00, 'Hogar & Cocina', 'https://images.unsplash.com/photo-1595781575231-c42337a7b8e1?w=500', 'PROD-ORG-ACRILICO'),
(3, 'Set de Tapers Herméticos x5', 'Juego de 5 contenedores de plástico libre de BPA, aptos para microondas.', 18.00, 'Hogar & Cocina', 'https://images.unsplash.com/photo-1620606015523-a8019a32c2ea?w=500', 'PROD-TAPER-X5'),
(4, 'Dispensador Automático de Jabón', 'Dispensador con sensor infrarrojo recargable vía USB.', 45.00, 'Limpieza & Baño', 'https://images.unsplash.com/photo-1584949514122-261559868725?w=500', 'PROD-DISP-JABON'),
(5, 'Juego de Cubiertos 24 Piezas Inoxidable', 'Elegante juego de cubiertos de acero inoxidable para 6 personas.', 55.00, 'Hogar & Cocina', 'https://images.unsplash.com/photo-1579730537021-363debbcb0e3?w=500', 'PROD-CUBIERTOS-24'),
(6, 'Pack de 10 Cuadernos A4 Cuadriculados', 'Cuadernos grapados de 100 hojas, surtido de colores.', 38.00, 'Útiles & Oficina', 'https://images.unsplash.com/photo-1531346878377-a54413ba11f9?w=500', 'PROD-CUAD-10X'),
(7, 'Set Escolar: Colores, Plumones y Crayones', 'Kit de arte escolar con 12 colores, 10 plumones y 24 crayones.', 22.00, 'Útiles & Oficina', 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=500', 'PROD-ART-KIT'),
(8, 'Carro a Control Remoto Todoterreno', 'Juguete a control remoto 4x4 recargable, colores surtidos.', 65.00, 'Juguetes & Niños', 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500', 'PROD-RC-CAR'),
(9, 'Muñeca Articulada con Accesorios', 'Muñeca de moda con vestidos intercambiables y accesorios.', 30.00, 'Juguetes & Niños', 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?w=500', 'PROD-MUN-ACC'),
(10, 'Luces LED Decorativas Navidad 10m', 'Guirnalda de luces LED multicolor con 8 secuencias, ideal para fiestas.', 15.00, 'Novedades & Temporada', 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=500', 'PROD-LED-10M');

-- 4. Actualizar Inventario en las 5 Sedes (Valores realistas)
INSERT INTO Inventario_Sedes (ID_Sede, ID_Producto, Stock_Actual) VALUES
-- Brochas (Producto 1)
(1, 1, 15), (2, 1, 20), (3, 1, 0), (4, 1, 12), (5, 1, 8),
-- Organizador (Producto 2)
(1, 2, 10), (2, 2, 15), (3, 2, 5), (4, 2, 0), (5, 2, 6),
-- Tapers (Producto 3)
(1, 3, 25), (2, 3, 30), (3, 3, 10), (4, 3, 20), (5, 3, 15),
-- Dispensador Jabón (Producto 4)
(1, 4, 8), (2, 4, 12), (3, 4, 0), (4, 4, 4), (5, 4, 5),
-- Cubiertos (Producto 5)
(1, 5, 5), (2, 5, 10), (3, 5, 3), (4, 5, 8), (5, 5, 7),
-- Cuadernos (Producto 6)
(1, 6, 50), (2, 6, 45), (3, 6, 20), (4, 6, 30), (5, 6, 40),
-- Set Escolar (Producto 7)
(1, 7, 30), (2, 7, 35), (3, 7, 15), (4, 7, 25), (5, 7, 20),
-- Carro RC (Producto 8)
(1, 8, 12), (2, 8, 8), (3, 8, 4), (4, 8, 0), (5, 8, 6),
-- Muñeca (Producto 9)
(1, 9, 18), (2, 9, 22), (3, 9, 10), (4, 9, 15), (5, 9, 12),
-- Luces LED (Producto 10)
(1, 10, 40), (2, 10, 60), (3, 10, 25), (4, 10, 35), (5, 10, 50);

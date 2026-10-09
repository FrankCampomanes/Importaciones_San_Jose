USE importaciones_san_jose;

INSERT INTO metodos_pago (ID_Metodo, ID_Usuario, Token_Simulado, Ultimos_Digitos, Titular, Mes_Expiracion, Anio_Expiracion, Fecha_Creacion)
VALUES 
(1, 2, 'tok_visa_4242_demo', '4242', 'JUAN PEREZ', '12', '2028', NOW())
ON DUPLICATE KEY UPDATE Titular=VALUES(Titular);

INSERT INTO ventas (ID_Venta, ID_Usuario, ID_Sede, ID_Metodo, Metodo_Entrega, Subtotal, IGV, Costo_Envio, Total, Comprobante, Numero_Comprobante, Num_Documento_Cliente, Razon_Social_Cliente, Estado, Fecha_Hora) VALUES
(1, 2, 1, 1, 'Recojo en Tienda', 84.75, 15.25, 0.00, 100.00, 'Boleta', 'B001-000001', '72849102', 'Juan Perez', 'Completada', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 2, 2, 1, 'Delivery', 152.54, 27.46, 10.00, 190.00, 'Factura', 'F001-000001', '20607725731', 'Comercial Lima SAC', 'Completada', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 2, 1, 1, 'Recojo en Tienda', 46.61, 8.39, 0.00, 55.00, 'Boleta', 'B001-000002', '72849102', 'Juan Perez', 'Completada', NOW())
ON DUPLICATE KEY UPDATE Total=VALUES(Total);

INSERT INTO detalle_ventas (ID_Detalle, ID_Venta, ID_Producto, Cantidad, Precio_Unitario, Costo_Unitario) VALUES
(1, 1, 1, 10, 3.50, 2.20),
(2, 1, 2, 6, 7.50, 4.80),
(3, 1, 8, 2, 10.00, 6.50),
(4, 2, 68, 2, 55.00, 35.75),
(5, 2, 54, 2, 40.00, 26.00),
(6, 3, 23, 2, 18.00, 11.70),
(7, 3, 18, 2, 9.00, 5.85)
ON DUPLICATE KEY UPDATE Cantidad=VALUES(Cantidad);

USE importaciones_san_jose;

INSERT INTO metodos_pago (ID_Metodo, ID_Usuario, Token_Simulado, Ultimos_Digitos, Titular, Mes_Expiracion, Anio_Expiracion, Fecha_Creacion)
VALUES 
(2, 2, 'tok_yape_plin_123456', '1234', 'YAPE PLIN', '12', '2099', NOW())
ON DUPLICATE KEY UPDATE Titular=VALUES(Titular);

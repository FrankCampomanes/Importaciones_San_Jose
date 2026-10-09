USE importaciones_san_jose;

INSERT INTO usuarios (ID_Usuario, Nombre_Completo, Correo, Password_Hash, Rol, Telefono, Activo, Fecha_Registro)
VALUES
(3, 'María López', 'maria@gmail.com', '$2a$10$vUqrFZGmid5cJ6af/S0hh.9pYVC2qJhYLyYSpA1sGY127v91AfSc.', 'Cliente', '912345679', 1, NOW()),
(4, 'Carlos Mendoza', 'carlos@gmail.com', '$2a$10$vUqrFZGmid5cJ6af/S0hh.9pYVC2qJhYLyYSpA1sGY127v91AfSc.', 'Cliente', '912345680', 1, NOW())
ON DUPLICATE KEY UPDATE Nombre_Completo=VALUES(Nombre_Completo);

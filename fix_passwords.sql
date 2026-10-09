USE importaciones_san_jose;
UPDATE usuarios SET Password_Hash = '$2a$10$vUqrFZGmid5cJ6af/S0hh.9pYVC2qJhYLyYSpA1sGY127v91AfSc.' WHERE ID_Usuario IN (1, 2);
SELECT ID_Usuario, Correo, Password_Hash FROM usuarios;

package com.importacionessanjose.service;

import com.importacionessanjose.dto.usuario.UpdateProfileRequest;
import com.importacionessanjose.dto.usuario.UserProfileResponse;
import com.importacionessanjose.entity.Usuario;
import com.importacionessanjose.exception.ResourceNotFoundException;
import com.importacionessanjose.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse obtenerPerfil(Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ResourceNotFoundException.of("Usuario", usuarioId));
        return toResponse(usuario);
    }

    @Transactional
    public UserProfileResponse actualizarPerfil(Integer usuarioId, UpdateProfileRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ResourceNotFoundException.of("Usuario", usuarioId));

        usuario.setNombreCompleto(request.nombreCompleto().trim());
        if (request.telefono() != null) {
            usuario.setTelefono(request.telefono().trim());
        }
        if (request.password() != null && !request.password().trim().isEmpty()) {
            usuario.setPasswordHash(passwordEncoder.encode(request.password().trim()));
        }

        Usuario guardado = usuarioRepository.save(usuario);
        return toResponse(guardado);
    }

    @Transactional
    public void desactivarCuenta(Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ResourceNotFoundException.of("Usuario", usuarioId));

        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    private UserProfileResponse toResponse(Usuario u) {
        return new UserProfileResponse(
                u.getId(),
                u.getNombreCompleto(),
                u.getCorreo(),
                u.getTelefono(),
                u.getRol(),
                u.getActivo(),
                u.getFechaRegistro()
        );
    }
}

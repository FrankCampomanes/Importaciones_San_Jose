package com.importacionessanjose.service;

import com.importacionessanjose.dto.auth.AuthResponse;
import com.importacionessanjose.dto.auth.LoginRequest;
import com.importacionessanjose.dto.auth.MeResponse;
import com.importacionessanjose.dto.auth.RegisterRequest;
import com.importacionessanjose.entity.Usuario;
import com.importacionessanjose.exception.BusinessException;
import com.importacionessanjose.repository.UsuarioRepository;
import com.importacionessanjose.security.CustomUserDetailsService;
import com.importacionessanjose.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final ConfiguracionService configuracionService;

    public AuthService(UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            CustomUserDetailsService userDetailsService,
            ConfiguracionService configuracionService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.configuracionService = configuracionService;
    }

    @Transactional
    public AuthResponse registrar(RegisterRequest request) {
        if (usuarioRepository.existsByCorreo(request.correo())) {
            throw new BusinessException("Ya existe un usuario con el correo: " + request.correo());
        }

        String rolAsignado = "Cliente";
        if ("Admin".equalsIgnoreCase(request.rol())) {
            String claveValida = configuracionService.getAdminRegistrationKey();
            if (request.claveAdmin() == null || !request.claveAdmin().trim().equals(claveValida)) {
                throw new BusinessException("Clave de autorización incorrecta. No está autorizado para registrarse como Administrador.");
            }
            rolAsignado = "Admin";
        }

        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(request.nombreCompleto());
        usuario.setCorreo(request.correo().toLowerCase());
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        usuario.setRol(rolAsignado);
        usuario.setTelefono(request.telefono());
        usuario.setActivo(true);
        usuario.setFechaRegistro(LocalDateTime.now());

        Usuario guardado = usuarioRepository.save(usuario);

        UserDetails userDetails = userDetailsService.loadUserByUsername(guardado.getCorreo());
        String token = jwtService.generarToken(userDetails, guardado.getId(), guardado.getRol());

        return AuthResponse.of(token, jwtService.getExpirationMs(), toMe(guardado));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.correo().toLowerCase(), request.password()));

        Usuario usuario = usuarioRepository.findByCorreo(request.correo().toLowerCase())
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getCorreo());
        String token = jwtService.generarToken(userDetails, usuario.getId(), usuario.getRol());

        return AuthResponse.of(token, jwtService.getExpirationMs(), toMe(usuario));
    }

    @Transactional(readOnly = true)
    public MeResponse me(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));
        return toMe(usuario);
    }

    private MeResponse toMe(Usuario u) {
        return new MeResponse(u.getId(), u.getNombreCompleto(), u.getCorreo(), u.getRol());
    }
}
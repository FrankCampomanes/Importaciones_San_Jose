package com.importacionessanjose.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration(proxyBeanMethods = false)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;
    private final String allowedOrigins;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserDetailsService userDetailsService,
            @Value("${app.cors.allowed-origins:http://localhost:5173}") String allowedOrigins) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
        this.allowedOrigins = allowedOrigins;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            DaoAuthenticationProvider authenticationProvider,
            CorsConfigurationSource corsConfigurationSource) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // Swagger / OpenAPI
                        .requestMatchers(
                                "/",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html")
                        .permitAll()
                        // Público
                        .requestMatchers("/api/health").permitAll()
                        .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()

                        // Catálogo e inventario: lectura pública
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/sedes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/promotions/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/inventory/**").permitAll()

                        // Promociones: administración
                        .requestMatchers(HttpMethod.POST, "/api/promotions/**").hasRole("Admin")
                        .requestMatchers(HttpMethod.PUT, "/api/promotions/**").hasRole("Admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/promotions/**").hasRole("Admin")

                        // Usuario: perfil y cuenta
                        .requestMatchers("/api/users/**").authenticated()

                        // Productos: escritura solo Admin
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("Admin")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("Admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("Admin")

                        // Sedes: escritura solo Admin
                        .requestMatchers(HttpMethod.POST, "/api/sedes/**").hasRole("Admin")
                        .requestMatchers(HttpMethod.PUT, "/api/sedes/**").hasRole("Admin")

                        // Inventario: escritura solo Admin
                        .requestMatchers(HttpMethod.POST, "/api/inventory/**").hasRole("Admin")
                        .requestMatchers(HttpMethod.PUT, "/api/inventory/**").hasRole("Admin")

                        // Métodos de pago: solo autenticados (y dueño del recurso, validado en service)
                        .requestMatchers("/api/payment-methods/**").authenticated()

                        // Auth /me
                        .requestMatchers("/api/auth/me").authenticated()
                        // Órdenes: solo autenticados
                        .requestMatchers("/api/orders/**").authenticated()
                        // Dashboard: solo Admin
                        .requestMatchers("/api/dashboard/**").hasRole("Admin")
                        // Cualquier otra cosa: autenticada
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(401);
                            res.setContentType("application/json");
                            res.setCharacterEncoding("UTF-8");
                            res.getWriter().write(
                                    "{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Token ausente o inválido\",\"path\":\""
                                            + req.getRequestURI() + "\"}");
                        })
                        .accessDeniedHandler((req, res, e) -> {
                            res.setStatus(403);
                            res.setContentType("application/json");
                            res.setCharacterEncoding("UTF-8");
                            res.getWriter().write(
                                    "{\"status\":403,\"error\":\"Forbidden\",\"message\":\"No tiene permisos para acceder a este recurso\",\"path\":\""
                                            + req.getRequestURI() + "\"}");
                        }))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        
        config.setAllowedOrigins(origins);
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://*.vercel.app",
                "https://*.onrender.com"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization", "Link", "X-Total-Count"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
package com.importacionessanjose;

import com.importacionessanjose.entity.Configuracion;
import com.importacionessanjose.entity.InventarioSede;
import com.importacionessanjose.entity.MetodoPago;
import com.importacionessanjose.entity.Producto;
import com.importacionessanjose.entity.Sede;
import com.importacionessanjose.entity.Usuario;
import com.importacionessanjose.repository.ConfiguracionRepository;
import com.importacionessanjose.repository.DetalleVentaRepository;
import com.importacionessanjose.repository.InventarioSedeRepository;
import com.importacionessanjose.repository.MetodoPagoRepository;
import com.importacionessanjose.repository.ProductoRepository;
import com.importacionessanjose.repository.SedeRepository;
import com.importacionessanjose.repository.UsuarioRepository;
import com.importacionessanjose.repository.VentaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class BaseIntegrationTest {

    @Autowired
    protected UsuarioRepository usuarioRepository;
    @Autowired
    protected SedeRepository sedeRepository;
    @Autowired
    protected ProductoRepository productoRepository;
    @Autowired
    protected InventarioSedeRepository inventarioRepository;
    @Autowired
    protected MetodoPagoRepository metodoPagoRepository;
    @Autowired
    protected ConfiguracionRepository configuracionRepository;
    @Autowired
    protected VentaRepository ventaRepository;
    @Autowired
    protected DetalleVentaRepository detalleVentaRepository;
    @Autowired
    protected PasswordEncoder passwordEncoder;

    protected Usuario admin;
    protected Usuario cliente;
    protected Sede sede;
    protected Producto producto;
    protected MetodoPago metodoPago;

    @BeforeEach
    void setUpBase() {
        // Limpieza en orden inverso a las FKs:
        // 1. Detalle_Ventas (hijo de Ventas y Productos)
        // 2. Ventas (hijo de Usuarios, Sedes, Metodos_Pago)
        // 3. Inventario_Sedes (hijo de Sedes y Productos)
        // 4. Metodos_Pago (hijo de Usuarios)
        // 5. Productos
        // 6. Sedes
        // 7. Usuarios
        // 8. Configuracion
        detalleVentaRepository.deleteAll();
        ventaRepository.deleteAll();
        inventarioRepository.deleteAll();
        metodoPagoRepository.deleteAll();
        productoRepository.deleteAll();
        sedeRepository.deleteAll();
        usuarioRepository.deleteAll();
        configuracionRepository.deleteAll();

        // Configuración base
        configuracionRepository.save(config("IGV_PORCENTAJE", "18.00", "DECIMAL"));
        configuracionRepository.save(config("DELIVERY_UMBRAL_GRATIS", "100.00", "DECIMAL"));
        configuracionRepository.save(config("DELIVERY_COSTO_FIJO", "10.00", "DECIMAL"));
        configuracionRepository.save(config("DELIVERY_LIMA_METROPOLITANA", "true", "BOOLEANO"));

        // Admin
        admin = new Usuario();
        admin.setNombreCompleto("Admin Test");
        admin.setCorreo("admin@test.com");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRol("Admin");
        admin.setActivo(true);
        admin.setFechaRegistro(LocalDateTime.now());
        admin = usuarioRepository.save(admin);

        // Cliente
        cliente = new Usuario();
        cliente.setNombreCompleto("Cliente Test");
        cliente.setCorreo("cliente@test.com");
        cliente.setPasswordHash(passwordEncoder.encode("admin123"));
        cliente.setRol("Cliente");
        cliente.setActivo(true);
        cliente.setFechaRegistro(LocalDateTime.now());
        cliente = usuarioRepository.save(cliente);

        // Sede
        sede = new Sede();
        sede.setNombreSede("Sede Test");
        sede.setDireccion("Av. Test 123");
        sede.setDistrito("Comas");
        sede.setProvincia("Lima");
        sede.setActivo(true);
        sede = sedeRepository.save(sede);

        // Producto
        producto = new Producto();
        producto.setNombre("Producto Test");
        producto.setDescripcion("Descripción test");
        producto.setPrecio(new BigDecimal("100.00"));
        producto.setCategoria("Test");
        producto.setCodigoQr("PROD-TEST-001");
        producto.setActivo(true);
        producto.setFechaCreacion(LocalDateTime.now());
        producto = productoRepository.save(producto);

        // Inventario: 10 unidades
        InventarioSede inv = new InventarioSede();
        inv.setSede(sede);
        inv.setProducto(producto);
        inv.setStockActual(10);
        inventarioRepository.save(inv);

        // Método de pago del cliente
        metodoPago = new MetodoPago();
        metodoPago.setUsuario(cliente);
        metodoPago.setTokenSimulado("tok_test_001");
        metodoPago.setUltimosDigitos("4242");
        metodoPago.setTitular("CLIENTE TEST");
        metodoPago.setMesExpiracion("12");
        metodoPago.setAnioExpiracion("2030");
        metodoPago.setFechaCreacion(LocalDateTime.now());
        metodoPago = metodoPagoRepository.save(metodoPago);
    }

    private Configuracion config(String clave, String valor, String tipo) {
        Configuracion c = new Configuracion();
        c.setClave(clave);
        c.setValor(valor);
        c.setTipo(tipo);
        c.setActivo(true);
        c.setFechaActualizacion(LocalDateTime.now());
        return c;
    }
}
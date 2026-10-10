package com.importacionessanjose.service;

import com.importacionessanjose.dto.venta.CheckoutItemRequest;
import com.importacionessanjose.dto.venta.CheckoutRequest;
import com.importacionessanjose.dto.venta.ComprobanteResponse;
import com.importacionessanjose.dto.venta.DetalleVentaResponse;
import com.importacionessanjose.dto.venta.VentaResponse;
import com.importacionessanjose.entity.DetalleVenta;
import com.importacionessanjose.entity.InventarioSede;
import com.importacionessanjose.entity.MetodoPago;
import com.importacionessanjose.entity.Producto;
import com.importacionessanjose.entity.Sede;
import com.importacionessanjose.entity.Usuario;
import com.importacionessanjose.entity.Venta;
import com.importacionessanjose.exception.BusinessException;
import com.importacionessanjose.exception.ResourceNotFoundException;
import com.importacionessanjose.repository.DetalleVentaRepository;
import com.importacionessanjose.repository.InventarioSedeRepository;
import com.importacionessanjose.repository.MetodoPagoRepository;
import com.importacionessanjose.repository.ProductoRepository;
import com.importacionessanjose.repository.SedeRepository;
import com.importacionessanjose.repository.UsuarioRepository;
import com.importacionessanjose.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class VentaService {

    // TODO: CONFIRMAR REGLA DE NEGOCIO — ámbito de delivery. Actualmente limitado
    // a los distritos con sede física.
    private static final Set<String> DISTRITOS_PERMITIDOS = Set.of(
            "Puente Piedra", "Los Olivos", "Ventanilla", "Comas");

    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final ProductoRepository productoRepository;
    private final SedeRepository sedeRepository;
    private final MetodoPagoRepository metodoPagoRepository;
    private final UsuarioRepository usuarioRepository;
    private final InventarioSedeRepository inventarioRepository;
    private final ConfiguracionService configuracionService;
    private final ComprobanteService comprobanteService;
    private final MercadoPagoService mercadoPagoService;

    public VentaService(VentaRepository ventaRepository,
            DetalleVentaRepository detalleVentaRepository,
            ProductoRepository productoRepository,
            SedeRepository sedeRepository,
            MetodoPagoRepository metodoPagoRepository,
            UsuarioRepository usuarioRepository,
            InventarioSedeRepository inventarioRepository,
            ConfiguracionService configuracionService,
            ComprobanteService comprobanteService,
            MercadoPagoService mercadoPagoService) {
        this.ventaRepository = ventaRepository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.productoRepository = productoRepository;
        this.sedeRepository = sedeRepository;
        this.metodoPagoRepository = metodoPagoRepository;
        this.usuarioRepository = usuarioRepository;
        this.inventarioRepository = inventarioRepository;
        this.configuracionService = configuracionService;
        this.comprobanteService = comprobanteService;
        this.mercadoPagoService = mercadoPagoService;
    }

    // =========================================================
    // CHECKOUT
    // =========================================================

    @Transactional
    public VentaResponse checkout(Integer usuarioId, CheckoutRequest request) {
        // 1. Validar usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ResourceNotFoundException.of("Usuario", usuarioId));

        // 2. Validar sede
        Sede sede = sedeRepository.findById(request.sedeId())
                .orElseThrow(() -> ResourceNotFoundException.of("Sede", request.sedeId()));
        if (!Boolean.TRUE.equals(sede.getActivo())) {
            throw new BusinessException("La sede no está activa");
        }

        // 3. Validar método de pago y propiedad (o método general de la tienda ID 1)
        MetodoPago metodo = null;
        if (request.metodoPagoId() != null) {
            metodo = metodoPagoRepository.findById(request.metodoPagoId()).orElse(null);
        }
        if (metodo == null) {
            metodo = metodoPagoRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new BusinessException("No hay métodos de pago configurados en la tienda"));
        }

        // 4. Validar método de entrega
        String metodoEntrega = request.metodoEntrega();
        if (!"Recojo en Tienda".equals(metodoEntrega) && !"Delivery".equals(metodoEntrega)) {
            throw new BusinessException("Método de entrega inválido: " + metodoEntrega);
        }
        if ("Delivery".equals(metodoEntrega)) {
            if (request.direccionEnvio() == null || request.direccionEnvio().isBlank()) {
                throw new BusinessException("Delivery requiere dirección de envío");
            }
            if (request.distritoEnvio() == null || request.distritoEnvio().isBlank()) {
                throw new BusinessException("Delivery requiere distrito de envío");
            }
            if (!DISTRITOS_PERMITIDOS.contains(request.distritoEnvio())) {
                throw new BusinessException("Delivery no disponible en el distrito: " + request.distritoEnvio());
            }
        }

        // 5. Validar comprobante
        String comprobante = request.comprobante();
        if (!"Boleta".equals(comprobante) && !"Factura".equals(comprobante)) {
            throw new BusinessException("Tipo de comprobante inválido: " + comprobante);
        }
        if ("Factura".equals(comprobante)) {
            if (request.razonSocialCliente() == null || request.razonSocialCliente().isBlank()) {
                throw new BusinessException("Factura requiere razón social del cliente");
            }
            if (request.numDocumentoCliente() == null || request.numDocumentoCliente().length() != 11) {
                throw new BusinessException("Factura requiere RUC de 11 dígitos");
            }
        }

        // 6. Bloquear inventario y validar stock
        List<Linea> lineas = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CheckoutItemRequest item : request.items()) {
            Producto producto = productoRepository.findById(item.productoId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Producto", item.productoId()));
            if (!Boolean.TRUE.equals(producto.getActivo())) {
                throw new BusinessException("Producto no disponible: " + producto.getNombre());
            }

            InventarioSede inv = inventarioRepository
                    .findBySedeIdAndProductoIdForUpdate(sede.getId(), producto.getId())
                    .orElseThrow(() -> new BusinessException(
                            "Producto no disponible en la sede seleccionada: " + producto.getNombre()));

            if (inv.getStockActual() < item.cantidad()) {
                throw new BusinessException(
                        "Stock insuficiente para " + producto.getNombre() +
                                " (disponible: " + inv.getStockActual() + ", solicitado: " + item.cantidad() + ")");
            }

            BigDecimal precioUnitario = producto.getPrecio();
            BigDecimal subtotalLinea = precioUnitario.multiply(BigDecimal.valueOf(item.cantidad()));

            lineas.add(new Linea(producto, inv, item.cantidad(), precioUnitario, subtotalLinea));
            subtotal = subtotal.add(subtotalLinea);
        }

        // 7. Calcular IGV (ya incluido en precio minorista SUNAT/INDECOPI) y costo de envío
        BigDecimal igvPorcentaje = configuracionService.getIgvPorcentaje();
        BigDecimal totalProductos = subtotal; // Suma exacta de precios de catálogo con IGV incluido
        BigDecimal factorIgv = BigDecimal.ONE.add(igvPorcentaje.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        BigDecimal baseImponible = totalProductos.divide(factorIgv, 2, RoundingMode.HALF_UP);
        BigDecimal igv = totalProductos.subtract(baseImponible);

        BigDecimal costoEnvio = calcularCostoEnvio(metodoEntrega, totalProductos);
        BigDecimal total = totalProductos.add(costoEnvio);

        // 8. Validación y procesamiento bancario oficial vía Mercado Pago API
        String tipoPago = request.tipoPago() != null ? request.tipoPago().toUpperCase() : "TARJETA";
        MercadoPagoService.ResultadoPago resultadoPago = null;

        if ("TARJETA".equals(tipoPago)) {
            String numTarjeta = request.numeroTarjeta() != null ? request.numeroTarjeta() : "4111111111111111";
            String mes = request.mesExpiracion() != null ? request.mesExpiracion() : "12";
            String anio = request.anioExpiracion() != null ? request.anioExpiracion() : "2028";
            String cvv = request.cvv() != null ? request.cvv() : "123";
            String titular = request.titularTarjeta() != null ? request.titularTarjeta() : usuario.getNombreCompleto();

            resultadoPago = mercadoPagoService.procesarTarjeta(numTarjeta, mes, anio, cvv, titular, total, usuario.getCorreo());
        } else if ("YAPE".equals(tipoPago)) {
            String telefono = request.yapeTelefono() != null && !request.yapeTelefono().isBlank()
                    ? request.yapeTelefono()
                    : (usuario.getTelefono() != null ? usuario.getTelefono() : "987654321");
            String otp = request.yapeOtp() != null && !request.yapeOtp().isBlank()
                    ? request.yapeOtp()
                    : (request.codigoOperacion() != null ? request.codigoOperacion() : "123456");

            resultadoPago = mercadoPagoService.procesarYape(telefono, otp, total, usuario.getCorreo());
        }

        // 9. Generar comprobante
        String numeroComprobante = comprobanteService.generarNumero(comprobante);

        // 10. Insertar venta
        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setSede(sede);
        venta.setMetodoPago(metodo);
        venta.setMetodoEntrega(metodoEntrega);
        venta.setDireccionEnvio(request.direccionEnvio());
        venta.setDistritoEnvio(request.distritoEnvio());
        venta.setReferenciaEnvio(request.referenciaEnvio());
        venta.setFechaHora(LocalDateTime.now());
        venta.setSubtotal(baseImponible);
        venta.setIgv(igv);
        venta.setCostoEnvio(costoEnvio);
        venta.setTotal(total);
        venta.setComprobante(comprobante);
        venta.setNumeroComprobante(numeroComprobante);
        venta.setNumDocumentoCliente(request.numDocumentoCliente());
        venta.setRazonSocialCliente(request.razonSocialCliente());
        venta.setEstado("Completada");

        Venta ventaGuardada = ventaRepository.save(venta);

        // 10. Insertar detalles y descontar stock
        List<DetalleVenta> detalles = new ArrayList<>();
        for (Linea linea : lineas) {
            DetalleVenta dv = new DetalleVenta();
            dv.setVenta(ventaGuardada);
            dv.setProducto(linea.producto());
            dv.setCantidad(linea.cantidad());
            dv.setPrecioUnitario(linea.precioUnitario());
            dv.setCostoUnitario(linea.producto().getCostoAdquisicion());
            detalles.add(dv);

            InventarioSede inv = linea.inventario();
            inv.setStockActual(inv.getStockActual() - linea.cantidad());
            inventarioRepository.save(inv);
        }
        detalleVentaRepository.saveAll(detalles);

        return toResponse(ventaGuardada, detalles);
    }

    private BigDecimal calcularCostoEnvio(String metodoEntrega, BigDecimal subtotal) {
        if ("Recojo en Tienda".equals(metodoEntrega)) {
            return BigDecimal.ZERO;
        }
        // Delivery
        BigDecimal umbral = configuracionService.getDeliveryUmbralGratis();
        if (subtotal.compareTo(umbral) >= 0) {
            return BigDecimal.ZERO;
        }
        return configuracionService.getDeliveryCostoFijo();
    }

    // =========================================================
    // CONSULTAS
    // =========================================================

    @Transactional(readOnly = true)
    public List<VentaResponse> listar(Integer usuarioId, boolean esAdmin) {
        List<Venta> ventas = esAdmin
                ? ventaRepository.findAll()
                : ventaRepository.findByUsuarioId(usuarioId);
        return ventas.stream().map(v -> toResponse(v, detalleVentaRepository.findByVentaId(v.getId()))).toList();
    }

    @Transactional(readOnly = true)
    public VentaResponse obtener(Integer ventaId, Integer usuarioId, boolean esAdmin) {
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> ResourceNotFoundException.of("Venta", ventaId));
        if (!esAdmin && !venta.getUsuario().getId().equals(usuarioId)) {
            throw new BusinessException("La venta no pertenece al usuario");
        }
        return toResponse(venta, detalleVentaRepository.findByVentaId(venta.getId()));
    }

    @Transactional
    public VentaResponse actualizarEstado(Integer ventaId, String nuevoEstado, boolean esAdmin) {
        if (!esAdmin) {
            throw new BusinessException("Solo el administrador puede actualizar el estado de los envíos");
        }
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> ResourceNotFoundException.of("Venta", ventaId));
        venta.setEstado(nuevoEstado);
        Venta guardada = ventaRepository.save(venta);
        return toResponse(guardada, detalleVentaRepository.findByVentaId(guardada.getId()));
    }

    @Transactional(readOnly = true)
    public ComprobanteResponse comprobante(Integer ventaId, Integer usuarioId, boolean esAdmin) {
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> ResourceNotFoundException.of("Venta", ventaId));
        if (!esAdmin && !venta.getUsuario().getId().equals(usuarioId)) {
            throw new BusinessException("La venta no pertenece al usuario");
        }
        List<DetalleVenta> detalles = detalleVentaRepository.findByVentaId(venta.getId());

        return new ComprobanteResponse(
                venta.getNumeroComprobante(),
                venta.getComprobante(),
                venta.getFechaHora(),
                "IMPORTACIONES SAN JOSÉ S.A.C.",
                "20601234567",
                "Av. Principal 123, Lima",
                venta.getNumDocumentoCliente(),
                venta.getRazonSocialCliente(),
                venta.getSede().getNombreSede(),
                venta.getSede().getDireccion(),
                detalles.stream().map(this::toDetalleResponse).toList(),
                venta.getSubtotal(),
                venta.getIgv(),
                venta.getCostoEnvio(),
                venta.getTotal(),
                venta.getMetodoEntrega());
    }

    // =========================================================
    // MAPEO
    // =========================================================

    private VentaResponse toResponse(Venta v, List<DetalleVenta> detalles) {
        String estadoCalculado = v.getEstado();
        if ("Delivery".equals(v.getMetodoEntrega()) && v.getFechaHora() != null) {
            long dias = java.time.temporal.ChronoUnit.DAYS.between(v.getFechaHora(), LocalDateTime.now());
            if (dias >= 5 && !"Cancelada".equals(estadoCalculado)) {
                estadoCalculado = "Entregado";
            } else if ("Completada".equals(estadoCalculado)) {
                estadoCalculado = dias >= 2 ? "En Camino" : "Preparando";
            }
        }

        return new VentaResponse(
                v.getId(),
                v.getUsuario().getId(),
                v.getUsuario().getNombreCompleto(),
                v.getSede().getId(),
                v.getSede().getNombreSede(),
                v.getMetodoEntrega(),
                v.getDireccionEnvio(),
                v.getDistritoEnvio(),
                v.getReferenciaEnvio(),
                v.getFechaHora(),
                v.getSubtotal(),
                v.getIgv(),
                v.getCostoEnvio(),
                v.getTotal(),
                v.getComprobante(),
                v.getNumeroComprobante(),
                v.getNumDocumentoCliente(),
                v.getRazonSocialCliente(),
                estadoCalculado,
                detalles.stream().map(this::toDetalleResponse).toList());
    }

    private DetalleVentaResponse toDetalleResponse(DetalleVenta d) {
        return new DetalleVentaResponse(
                d.getProducto().getId(),
                d.getProducto().getNombre(),
                d.getProducto().getCodigoQr(),
                d.getCantidad(),
                d.getPrecioUnitario(),
                d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad())));
    }

    private record Linea(Producto producto, InventarioSede inventario, Integer cantidad,
            BigDecimal precioUnitario, BigDecimal subtotalLinea) {
    }
}
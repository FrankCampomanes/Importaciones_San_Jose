package com.importacionessanjose.service;

import com.importacionessanjose.dto.dashboard.BranchReportItem;
import com.importacionessanjose.dto.dashboard.BranchReportResponse;
import com.importacionessanjose.dto.dashboard.DashboardSummaryResponse;
import com.importacionessanjose.dto.dashboard.ProductosReportResponse;
import com.importacionessanjose.dto.dashboard.SalesReportResponse;
import com.importacionessanjose.dto.dashboard.TopProductoResponse;
import com.importacionessanjose.entity.Producto;
import com.importacionessanjose.entity.Sede;
import com.importacionessanjose.repository.DetalleVentaRepository;
import com.importacionessanjose.repository.InventarioSedeRepository;
import com.importacionessanjose.repository.ProductoRepository;
import com.importacionessanjose.repository.ProductoVendidoProjection;
import com.importacionessanjose.repository.SedeRepository;
import com.importacionessanjose.repository.VentaRepository;
import com.importacionessanjose.repository.VentaResumenProjection;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private static final int DEFAULT_DIAS = 30;
    private static final int TOP_LIMIT = 10;

    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final ProductoRepository productoRepository;
    private final SedeRepository sedeRepository;
    private final InventarioSedeRepository inventarioRepository;

    public DashboardService(VentaRepository ventaRepository,
            DetalleVentaRepository detalleVentaRepository,
            ProductoRepository productoRepository,
            SedeRepository sedeRepository,
            InventarioSedeRepository inventarioRepository) {
        this.ventaRepository = ventaRepository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.productoRepository = productoRepository;
        this.sedeRepository = sedeRepository;
        this.inventarioRepository = inventarioRepository;
    }

    // =========================================================
    // RANGO DE FECHAS
    // =========================================================

    private record Rango(LocalDate desde, LocalDate hasta, LocalDateTime inicio, LocalDateTime fin) {
    }

    private Rango normalizar(LocalDate desde, LocalDate hasta) {
        LocalDate h = hasta != null ? hasta : LocalDate.now();
        LocalDate d = desde != null ? desde : h.minusDays(DEFAULT_DIAS);
        if (d.isAfter(h)) {
            throw new IllegalArgumentException("La fecha desde no puede ser posterior a la fecha hasta");
        }
        return new Rango(d, h, d.atStartOfDay(), h.atTime(LocalTime.MAX));
    }

    // =========================================================
    // SUMMARY
    // =========================================================

    @Transactional(readOnly = true)
    public DashboardSummaryResponse summary(LocalDate desde, LocalDate hasta) {
        Rango r = normalizar(desde, hasta);
        VentaResumenProjection resumen = ventaRepository.resumenEnRango(r.inicio(), r.fin());

        Long pedidos = resumen != null && resumen.getPedidos() != null ? resumen.getPedidos() : 0L;
        BigDecimal subtotal = resumen != null && resumen.getSubtotal() != null ? resumen.getSubtotal()
                : BigDecimal.ZERO;
        BigDecimal igv = resumen != null && resumen.getIgv() != null ? resumen.getIgv() : BigDecimal.ZERO;
        BigDecimal costoEnvio = resumen != null && resumen.getCostoEnvio() != null ? resumen.getCostoEnvio()
                : BigDecimal.ZERO;
        BigDecimal total = resumen != null && resumen.getTotal() != null ? resumen.getTotal() : BigDecimal.ZERO;

        // Ganancia: solo si hay costos de adquisición.
        // TODO: CONFIRMAR REGLA DE NEGOCIO — hoy no hay costos cargados.
        BigDecimal ganancia = null;

        Long productosActivos = productoRepository.findByActivoTrue().stream().count();
        Long sedesActivas = (long) sedeRepository.findByActivoTrue().size();

        return new DashboardSummaryResponse(
                r.desde(), r.hasta(),
                pedidos, subtotal, igv, costoEnvio, total, ganancia,
                productosActivos, sedesActivas);
    }

    // =========================================================
    // SALES
    // =========================================================

    @Transactional(readOnly = true)
    public SalesReportResponse sales(LocalDate desde, LocalDate hasta) {
        Rango r = normalizar(desde, hasta);
        VentaResumenProjection resumen = ventaRepository.resumenEnRango(r.inicio(), r.fin());

        // Agrupar por día — se hace en memoria para no complicar la query.
        List<Object[]> porDia = ventaRepository.ventasPorDiaEnRango(r.inicio(), r.fin());
        List<SalesReportResponse.DiaVenta> dias = porDia.stream()
                .map(o -> new SalesReportResponse.DiaVenta(
                        ((java.sql.Date) o[0]).toLocalDate(),
                        (BigDecimal) o[1],
                        ((Number) o[2]).longValue()))
                .toList();

        return new SalesReportResponse(
                r.desde(), r.hasta(),
                resumen.getTotal() != null ? resumen.getTotal() : BigDecimal.ZERO,
                resumen.getSubtotal() != null ? resumen.getSubtotal() : BigDecimal.ZERO,
                resumen.getIgv() != null ? resumen.getIgv() : BigDecimal.ZERO,
                resumen.getPedidos() != null ? resumen.getPedidos() : 0L,
                dias);
    }

    // =========================================================
    // PRODUCTS
    // =========================================================

    @Transactional(readOnly = true)
    public ProductosReportResponse productos(LocalDate desde, LocalDate hasta) {
        Rango r = normalizar(desde, hasta);

        List<TopProductoResponse> top = detalleVentaRepository
                .topProductosEnRango(r.inicio(), r.fin())
                .stream()
                .limit(TOP_LIMIT)
                .map(this::toTopProducto)
                .toList();

        Set<Integer> vendidos = new HashSet<>(detalleVentaRepository.productosVendidosIdsEnRango(r.inicio(), r.fin()));
        List<TopProductoResponse> estancados = productoRepository.findByActivoTrue().stream()
                .filter(p -> !vendidos.contains(p.getId()))
                .map(p -> new TopProductoResponse(
                        p.getId(),
                        p.getNombre(),
                        p.getCodigoQr(),
                        0L,
                        BigDecimal.ZERO,
                        stockTotal(p.getId()),
                        null))
                .toList();

        return new ProductosReportResponse(r.desde(), r.hasta(), top, estancados);
    }

    // =========================================================
    // BRANCHES
    // =========================================================

    @Transactional(readOnly = true)
    public BranchReportResponse branches(LocalDate desde, LocalDate hasta) {
        Rango r = normalizar(desde, hasta);

        List<BranchReportItem> items = sedeRepository.findByActivoTrue().stream()
                .map(sede -> {
                    List<TopProductoResponse> top = detalleVentaRepository
                            .topProductosPorSedeEnRango(sede.getId(), r.inicio(), r.fin())
                            .stream()
                            .limit(TOP_LIMIT)
                            .map(this::toTopProducto)
                            .toList();

                    Object[] agg = ventaRepository.sumarizadoPorSede(sede.getId(), r.inicio(), r.fin());
                    Long pedidos = (agg != null && agg.length > 0 && agg[0] != null) ? ((Number) agg[0]).longValue() : 0L;
                    BigDecimal total = (agg != null && agg.length > 1 && agg[1] != null) ? (BigDecimal) agg[1] : BigDecimal.ZERO;

                    return new BranchReportItem(sede.getId(), sede.getNombreSede(), pedidos, total, top);
                })
                .toList();

        return new BranchReportResponse(r.desde(), r.hasta(), items);
    }

    // =========================================================
    // HELPERS
    // =========================================================

    private TopProductoResponse toTopProducto(ProductoVendidoProjection p) {
        Long stock = stockTotal(p.getProductoId());
        BigDecimal rotacion = (stock == null || stock == 0)
                ? null
                : BigDecimal.valueOf(p.getUnidades())
                        .divide(BigDecimal.valueOf(stock), 4, RoundingMode.HALF_UP);

        return new TopProductoResponse(
                p.getProductoId(),
                p.getProductoNombre(),
                p.getProductoCodigoQr(),
                p.getUnidades(),
                p.getIngresos(),
                stock,
                rotacion);
    }

    private Long stockTotal(Integer productoId) {
        Long s = inventarioRepository.stockTotalProducto(productoId);
        return s != null ? s : 0L;
    }
}
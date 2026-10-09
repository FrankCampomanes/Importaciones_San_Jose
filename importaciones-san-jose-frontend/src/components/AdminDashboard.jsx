import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  X, 
  Check, 
  DollarSign, 
  Package, 
  Layers, 
  Save, 
  AlertCircle, 
  Search, 
  Building, 
  RefreshCw, 
  Filter, 
  FileText, 
  UserCheck, 
  Receipt,
  Tag,
  Calendar,
  TrendingUp,
  Gift,
  Percent,
  Sparkles,
  Truck,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { promotionsService } from '../services/promotions';
import CustomDropdown from './CustomDropdown';

const CATEGORIAS_OPTIONS = [
  { value: 'all', label: 'Todas las Categorías', icon: Tag },
  { value: 'Hogar y Cocina', label: 'Hogar y Cocina' },
  { value: 'Juguetería y Niños', label: 'Juguetería y Niños' },
  { value: 'Útiles y Papelería', label: 'Útiles y Papelería' },
  { value: 'Belleza y Cuidado Personal', label: 'Belleza y Cuidado Personal' },
  { value: 'Novedades y Temporada', label: 'Novedades y Temporada' }
];

const CATEGORIAS_FORM = [
  'Hogar y Cocina',
  'Juguetería y Niños',
  'Útiles y Papelería',
  'Belleza y Cuidado Personal',
  'Novedades y Temporada'
];

export default function AdminDashboard({ products, onRefreshProducts, sedes, onClose }) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'inventory', 'economic'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  
  // Modal Crear / Editar Producto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS_FORM[0]);
  const [codigoQr, setCodigoQr] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [imagenPreview, setImagenPreview] = useState('');
  
  // Ofertas y Promociones
  const [isPromoActive, setIsPromoActive] = useState(false);
  const [promoTipo, setPromoTipo] = useState('descuento_directo'); // 'descuento_directo', 'descuento_volumen', 'bonificacion'
  const [precioOferta, setPrecioOferta] = useState('');
  const [cantidadMinimaVolumen, setCantidadMinimaVolumen] = useState(3);
  const [porcentajeDescuentoVolumen, setPorcentajeDescuentoVolumen] = useState(15);
  const [llevaCantidad, setLlevaCantidad] = useState(3);
  const [regaloCantidad, setRegaloCantidad] = useState(1);
  const [motivoPromo, setMotivoPromo] = useState('');
  const [fechaFinPromo, setFechaFinPromo] = useState('');

  // Stock inicial por sedes
  const [stocksPorSede, setStocksPorSede] = useState({
    1: 15,
    2: 15,
    3: 10,
    4: 10,
    5: 10
  });

  // Modal Inventario Multisede Rápido
  const [selectedProductInventory, setSelectedProductInventory] = useState(null);
  const [inventoryStocks, setInventoryStocks] = useState({});

  // Inventario completo de las 5 sedes en tiempo real desde MySQL
  const [fullInventoryMap, setFullInventoryMap] = useState({});
  const [inventoryLoading, setInventoryLoading] = useState(false);

  // Feedback & Loading
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reportes y Ventas
  const [summaryData, setSummaryData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [productsReport, setProductsReport] = useState(null);
  const [branchReport, setBranchReport] = useState(null);
  const [ordersList, setOrdersList] = useState([]);
  const [salesSearchTerm, setSalesSearchTerm] = useState('');

  useEffect(() => {
    if (token) {
      loadReports();
      loadFullInventory();
    }
  }, [token, sedes]);

  const loadFullInventory = async () => {
    if (!token || !sedes || sedes.length === 0) return;
    setInventoryLoading(true);
    try {
      const results = await Promise.all(sedes.map(s => api.getInventoryBySede(s.id, token)));
      const map = {};
      results.forEach((sedeInventory, idx) => {
        const sedeId = sedes[idx].id;
        if (Array.isArray(sedeInventory)) {
          sedeInventory.forEach(item => {
            if (!map[item.productoId]) map[item.productoId] = {};
            map[item.productoId][sedeId] = item.stockActual;
          });
        }
      });
      setFullInventoryMap(map);
    } catch (err) {
      console.warn('Error cargando inventario multisede:', err);
    } finally {
      setInventoryLoading(false);
    }
  };

  const loadReports = async () => {
    try {
      const [sum, sales, orders, prodRep, branchRep] = await Promise.all([
        api.getDashboardSummary(token).catch(() => null),
        api.getSalesReport(token).catch(() => null),
        api.getOrders(token).catch(() => []),
        api.getProductsReport(token).catch(() => null),
        api.getBranchSalesReport(token).catch(() => null)
      ]);
      setSummaryData(sum);
      setSalesData(sales);
      setOrdersList(Array.isArray(orders) ? orders : (orders?.value || []));
      setProductsReport(prodRep);
      setBranchReport(branchRep);
    } catch (e) {
      console.warn('Error cargando reportes:', e);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setCategoria(CATEGORIAS_FORM[0]);
    const nextId = String(products.length + 1).padStart(3, '0');
    setCodigoQr(`SJ-PROD-${nextId}`);
    setImagenUrl('');
    setImagenPreview('');
    setStocksPorSede({ 1: 15, 2: 15, 3: 10, 4: 10, 5: 10 });
    
    // Reset Promo
    setIsPromoActive(false);
    setPromoTipo('descuento_directo');
    setPrecioOferta('');
    setCantidadMinimaVolumen(3);
    setPorcentajeDescuentoVolumen(15);
    setLlevaCantidad(3);
    setRegaloCantidad(1);
    setMotivoPromo('');
    setFechaFinPromo('');

    setIsModalOpen(true);
    setFeedback(null);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setNombre(prod.nombre || '');
    setDescripcion(prod.descripcion || '');
    setPrecio(prod.precio ? String(prod.precio) : '');
    setCategoria(prod.categoria || CATEGORIAS_FORM[0]);
    setCodigoQr(prod.codigoQr || `SJ-PROD-${String(prod.id).padStart(3, '0')}`);
    setImagenUrl(prod.imagenUrl || '');
    setImagenPreview(prod.imagenUrl || '');

    // Cargar promo si existe para este producto
    const existingPromo = promotionsService.getForProduct(prod.id);
    if (existingPromo && existingPromo.activo !== false) {
      setIsPromoActive(true);
      setPromoTipo(existingPromo.tipo || 'descuento_directo');
      setPrecioOferta(existingPromo.precioOferta ? String(existingPromo.precioOferta) : '');
      setCantidadMinimaVolumen(existingPromo.cantidadMinima || 3);
      setPorcentajeDescuentoVolumen(existingPromo.porcentajeDescuento || 15);
      setLlevaCantidad(existingPromo.llevaCantidad || 3);
      setRegaloCantidad(existingPromo.regaloCantidad || 1);
      setMotivoPromo(existingPromo.motivo || '');
      setFechaFinPromo(existingPromo.fechaFin || '');
    } else {
      setIsPromoActive(false);
      setPromoTipo('descuento_directo');
      setPrecioOferta(prod.precio ? String((prod.precio * 0.85).toFixed(2)) : '');
      setCantidadMinimaVolumen(3);
      setPorcentajeDescuentoVolumen(15);
      setLlevaCantidad(3);
      setRegaloCantidad(1);
      setMotivoPromo('');
      setFechaFinPromo('');
    }

    setIsModalOpen(true);
    setFeedback(null);
  };

  // Manejador de subida de fotos
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
        setImagenUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar (Crear o Actualizar) Producto en MySQL
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !precio) {
      setFeedback({ type: 'error', text: 'Nombre y precio son obligatorios.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    const numPrecio = parseFloat(precio);

    const productPayload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || `${nombre.trim()} de calidad garantizada en Importaciones San José.`,
      precio: numPrecio,
      costoAdquisicion: parseFloat((numPrecio * 0.65).toFixed(2)),
      categoria,
      codigoQr: codigoQr.trim() || `SJ-PROD-${Date.now().toString().slice(-4)}`,
      imagenUrl: imagenUrl || (imagenPreview.startsWith('data:') ? imagenPreview : '/images/products/img001.png'),
      activo: true
    };

    try {
      let savedProdId = null;
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productPayload, token);
        savedProdId = editingProduct.id;
        setFeedback({ type: 'success', text: `¡"${nombre}" actualizado con éxito en MySQL!` });
      } else {
        const nuevo = await api.createProduct(productPayload, token);
        if (nuevo && nuevo.id) {
          savedProdId = nuevo.id;
          for (const sede of sedes) {
            const qty = stocksPorSede[sede.id] || 10;
            await api.updateInventoryStock(nuevo.id, sede.id, qty, token).catch(() => {});
          }
        }
        setFeedback({ type: 'success', text: `¡"${nombre}" registrado exitosamente en el catálogo!` });
      }

      // Guardar o remover promoción asociada
      if (savedProdId) {
        if (isPromoActive) {
          let finalMotivo = motivoPromo.trim();
          if (!finalMotivo) {
            if (promoTipo === 'descuento_directo') {
              finalMotivo = '¡Precio rebajado por oferta especial!';
            } else if (promoTipo === 'descuento_volumen') {
              finalMotivo = `A partir de ${cantidadMinimaVolumen} unidades, ${porcentajeDescuentoVolumen}% de descuento`;
            } else if (promoTipo === 'bonificacion') {
              finalMotivo = `Por la compra de ${llevaCantidad} unidades, te regalamos ${regaloCantidad} gratis`;
            }
          }

          await promotionsService.saveForProduct(savedProdId, {
            activo: true,
            tipo: promoTipo,
            precioOferta: promoTipo === 'descuento_directo' && precioOferta ? parseFloat(precioOferta) : null,
            cantidadMinima: parseInt(cantidadMinimaVolumen) || 3,
            porcentajeDescuento: parseFloat(porcentajeDescuentoVolumen) || 15,
            llevaCantidad: parseInt(llevaCantidad) || 3,
            regaloCantidad: parseInt(regaloCantidad) || 1,
            motivo: finalMotivo,
            fechaFin: fechaFinPromo || null
          }, token);
        } else {
          await promotionsService.removeForProduct(savedProdId, existingPromo?.id, token);
        }
      }

      await onRefreshProducts();
      await loadFullInventory();
      setIsModalOpen(false);
    } catch (err) {
      setFeedback({ type: 'error', text: 'Error al guardar: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const handleDelete = async (id, prodNombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${prodNombre}" del catálogo y la base de datos?`)) return;
    
    setLoading(true);
    try {
      await api.deleteProduct(id, token);
      setFeedback({ type: 'success', text: `Producto "${prodNombre}" eliminado correctamente.` });
      await onRefreshProducts();
      await loadFullInventory();
    } catch (err) {
      setFeedback({ type: 'error', text: 'Error al eliminar: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  // Abrir gestión de inventario por sede
  const openInventoryModal = async (prod) => {
    setSelectedProductInventory(prod);
    const initial = {};
    sedes.forEach(s => { initial[s.id] = 15; });
    
    try {
      const invList = await api.getInventoryByProduct(prod.id, token);
      if (Array.isArray(invList)) {
        invList.forEach(item => {
          if (item.sedeId) initial[item.sedeId] = item.stockActual || 0;
        });
      }
    } catch (e) {}

    setInventoryStocks(initial);
  };

  const handleSaveInventory = async () => {
    if (!selectedProductInventory) return;
    setLoading(true);
    try {
      for (const sede of sedes) {
        const qty = parseInt(inventoryStocks[sede.id] ?? 0);
        await api.updateInventoryStock(selectedProductInventory.id, sede.id, qty, token).catch(() => {});
      }
      setFeedback({ type: 'success', text: `Stock de "${selectedProductInventory.nombre}" actualizado en las 5 sedes.` });
      setSelectedProductInventory(null);
      await onRefreshProducts();
      await loadFullInventory();
    } catch (e) {
      setFeedback({ type: 'error', text: 'Error actualizando stock: ' + e.message });
    } finally {
      setLoading(false);
    }
  };

  // Filtrado de productos por texto y por categoría seleccionada
  const displayedProducts = products.filter(p => {
    const matchesCategory = selectedCategoryFilter === 'all' || p.categoria === selectedCategoryFilter;
    const matchesSearch = !searchTerm || 
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigoQr?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtrado de órdenes de ventas por buscador
  const displayedOrders = ordersList.filter(o => {
    if (!salesSearchTerm.trim()) return true;
    const term = salesSearchTerm.toLowerCase();
    const cliente = (o.razonSocialCliente || o.usuarioNombre || '').toLowerCase();
    const doc = (o.numDocumentoCliente || '').toLowerCase();
    const comprobante = (o.numeroComprobante || '').toLowerCase();
    const sede = (o.sedeNombre || '').toLowerCase();
    return cliente.includes(term) || doc.includes(term) || comprobante.includes(term) || sede.includes(term);
  });

  // Cálculos dinámicos del Mes Actual para balance financiero
  const today = new Date();
  const currentMonthName = today.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
  const currentDayOfMonth = today.getDate();

  const currentMonthOrders = ordersList.filter(o => {
    if (!o.fechaHora) return true;
    const d = new Date(o.fechaHora);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });

  const monthTotalVentas = currentMonthOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const monthSubtotal = currentMonthOrders.reduce((acc, o) => acc + (Number(o.subtotal) || 0), 0);
  const monthIGV = currentMonthOrders.reduce((acc, o) => acc + (Number(o.igv) || 0), 0);
  const monthEnvio = currentMonthOrders.reduce((acc, o) => acc + (Number(o.costoEnvio) || 0), 0);
  const monthGananciaEstimada = monthSubtotal * 0.35;

  return (
    <div className="admin-view-wrapper">
      {/* Header del Panel */}
      <div className="admin-topbar-header glass-panel">
        <div className="admin-brand-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/images/Logo.png" 
            alt="Logo Oficial" 
            style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="logo-badge-circle sm" style={{ display: 'none' }}>
            <span>SJ</span>
          </div>
          <div>
            <h2>Panel de Control — Importaciones San José</h2>
            <p>Gestión directa de catálogo, stock por sedes y reportes</p>
          </div>
        </div>

        <div className="admin-header-actions">
          <button className="primary-action-btn" onClick={openCreateModal}>
            <Plus size={18} />
            <span>Agregar Producto</span>
          </button>
        </div>
      </div>

      {/* Tabs de Navegación del Admin */}
      <div className="admin-nav-tabs">
        <button 
          className={`admin-tab-item ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={17} />
          <span>Catálogo de Productos ({products.length})</span>
        </button>
        <button 
          className={`admin-tab-item ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Layers size={17} />
          <span>Stock Multisede</span>
        </button>
        <button 
          className={`admin-tab-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Truck size={17} />
          <span>Gestión de Envíos ({ordersList.filter(o => o.metodoEntrega === 'Delivery').length})</span>
        </button>
        <button 
          className={`admin-tab-item ${activeTab === 'economic' ? 'active' : ''}`}
          onClick={() => setActiveTab('economic')}
        >
          <DollarSign size={17} />
          <span>Historial de Ventas & Comprobantes</span>
        </button>
      </div>

      {/* Banner de Feedback */}
      {feedback && (
        <div className={`admin-alert-banner ${feedback.type}`}>
          {feedback.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)}>×</button>
        </div>
      )}

      {/* ─────────── TAB 1: PRODUCTOS (CON BUSCADOR REDISEÑADO Y FILTRO DE CATEGORÍAS) ─────────── */}
      {activeTab === 'products' && (
        <div className="admin-tab-content">
          {/* Barra de Controles con Buscador Píldora y Dropdown de Categorías */}
          <div className="admin-search-filter-bar glass-panel">
            <div className="admin-pill-search-box">
              <Search size={18} className="search-icon-accent" />
              <input 
                type="text"
                placeholder="Buscar por nombre, código QR o rubro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search-pill" onClick={() => setSearchTerm('')}>×</button>
              )}
            </div>

            {/* Custom Dropdown para filtrar por Categoría */}
            <div className="admin-category-dropdown-wrap">
              <CustomDropdown 
                options={CATEGORIAS_OPTIONS}
                value={selectedCategoryFilter}
                onChange={(val) => setSelectedCategoryFilter(val)}
                icon={Filter}
                className="admin-cat-dropdown"
              />
            </div>

            <div className="search-counter-badge">
              <span>{displayedProducts.length}</span> productos encontrados
            </div>

            <button className="refresh-btn" onClick={onRefreshProducts} title="Recargar lista">
              <RefreshCw size={15} />
              <span>Actualizar</span>
            </button>
          </div>

          {/* Tabla de Productos */}
          <div className="admin-table-card glass-panel">
            <table className="admin-custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Foto</th>
                  <th>Nombre del Producto</th>
                  <th>Categoría</th>
                  <th>Precio Venta</th>
                  <th>Cód. QR</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      No se encontraron productos con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map(prod => (
                    <tr key={prod.id}>
                      <td><span className="id-badge">#{prod.id}</span></td>
                      <td>
                        <div className="admin-prod-thumb">
                          {prod.imagenUrl ? (
                            <img 
                              src={prod.imagenUrl} 
                              alt={prod.nombre} 
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className="thumb-placeholder" 
                            style={{ display: prod.imagenUrl ? 'none' : 'flex' }}
                          >
                            SJ
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="prod-title-cell">
                          <strong>{prod.nombre}</strong>
                          <small>{prod.descripcion || 'Sin descripción adicional'}</small>
                        </div>
                      </td>
                      <td style={{ minWidth: '135px', maxWidth: '175px' }}>
                        <span className="category-tag">{prod.categoria}</span>
                        {promotionsService.getForProduct(prod.id) && (
                          <div style={{ marginTop: '4px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#FEF2F2', color: '#800020', border: '1px solid #FECACA', borderRadius: '12px', padding: '2px 7px', fontSize: '10px', fontWeight: 700 }}>
                              <Tag size={10} /> OFERTA BD
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        <strong className="price-tag">S/ {Number(prod.precio).toFixed(2)}</strong>
                      </td>
                      <td>
                        <code className="qr-code-pill">{prod.codigoQr || `SJ-PROD-${prod.id}`}</code>
                      </td>
                      <td>
                        <div className="table-row-actions">
                          <button 
                            className="action-btn-edit" 
                            onClick={() => openEditModal(prod)}
                            title="Editar datos y foto"
                          >
                            <Edit3 size={15} />
                            <span>Editar</span>
                          </button>
                          <button 
                            className="action-btn-stock" 
                            onClick={() => openInventoryModal(prod)}
                            title="Ajustar stock en sedes"
                          >
                            <Building size={15} />
                            <span>Stock</span>
                          </button>
                          <button 
                            className="action-btn-delete" 
                            onClick={() => handleDelete(prod.id, prod.nombre)}
                            title="Eliminar producto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────── TAB 2: INVENTARIO MULTISEDE EN VIVO DESDE MYSQL ─────────── */}
      {activeTab === 'inventory' && (
        <div className="admin-tab-content">
          <div className="admin-table-card glass-panel">
            <div className="table-header-info flex-between" style={{ flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0 }}>Matriz de Existencias por Sede Física (En Tiempo Real)</h3>
                <p style={{ margin: '4px 0 0 0' }}>Control de unidades en MySQL sincronizado en vivo para las 5 sedes comerciales.</p>
              </div>
              <button 
                className="refresh-btn" 
                onClick={loadFullInventory} 
                disabled={inventoryLoading}
                title="Sincronizar stock con MySQL"
              >
                <RefreshCw size={15} className={inventoryLoading ? 'spin-anim' : ''} />
                <span>{inventoryLoading ? 'Sincronizando...' : 'Recargar Inventario'}</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-custom-table formal-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>1. Puente Piedra<br/><small className="header-sub">Principal</small></th>
                    <th>2. Los Olivos<br/><small className="header-sub">Av. 2 de Octubre</small></th>
                    <th>3. Villasol<br/><small className="header-sub">Av. Huandoy</small></th>
                    <th>4. Ventanilla<br/><small className="header-sub">Pachacútec</small></th>
                    <th>5. Comas<br/><small className="header-sub">Collique</small></th>
                    <th>Total Stock</th>
                    <th>Ajustar</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const pStock = fullInventoryMap[p.id] || {};
                    const s1 = pStock[1] ?? 0;
                    const s2 = pStock[2] ?? 0;
                    const s3 = pStock[3] ?? 0;
                    const s4 = pStock[4] ?? 0;
                    const s5 = pStock[5] ?? 0;
                    const totalProdStock = s1 + s2 + s3 + s4 + s5;
                    const hasLowStock = s1 < 10 || s2 < 10 || s3 < 10 || s4 < 10 || s5 < 10;

                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="flex-align-gap">
                            <div className="admin-prod-thumb sm">
                              {p.imagenUrl && <img src={p.imagenUrl} alt="" />}
                            </div>
                            <div>
                              <strong style={{ display: 'block', fontSize: '13.5px' }}>{p.nombre}</strong>
                              {hasLowStock && (
                                <span className="stock-alert-pill" title="Una o más sedes tienen menos de 10 unidades disponibles">
                                  Bajo stock (&lt;10 u.)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`stock-number ${s1 < 10 ? 'low-stock-cell' : ''}`}>
                            {s1} u.
                          </span>
                        </td>
                        <td>
                          <span className={`stock-number ${s2 < 10 ? 'low-stock-cell' : ''}`}>
                            {s2} u.
                          </span>
                        </td>
                        <td>
                          <span className={`stock-number ${s3 < 10 ? 'low-stock-cell' : ''}`}>
                            {s3} u.
                          </span>
                        </td>
                        <td>
                          <span className={`stock-number ${s4 < 10 ? 'low-stock-cell' : ''}`}>
                            {s4} u.
                          </span>
                        </td>
                        <td>
                          <span className={`stock-number ${s5 < 10 ? 'low-stock-cell' : ''}`}>
                            {s5} u.
                          </span>
                        </td>
                        <td>
                          <strong className="stock-total-badge">{totalProdStock} unid.</strong>
                        </td>
                        <td>
                          <button className="action-btn-edit" onClick={() => openInventoryModal(p)} title="Ajustar stock en sedes">
                            <Edit3 size={14} /> Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────── TAB 3: REGISTRO DE VENTAS & REPORTES FINANCIEROS FORMALES ─────────── */}
      {activeTab === 'economic' && (
        <div className="admin-tab-content">
          {/* Header Superior del Reporte */}
          <div className="admin-table-card glass-panel" style={{ padding: '22px 24px', marginBottom: '22px' }}>
            <div className="section-head-bar flex-between" style={{ flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '9px', margin: 0, fontSize: '18px', color: '#0F172A' }}>
                  <TrendingUp size={22} className="brand-red" />
                  Cálculo de Ganancias del Mes — [{currentMonthName.toUpperCase()}]
                </h3>
                <p className="text-muted" style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
                  Consolidado financiero contable, ventas por sedes físicas, análisis de rotación de productos y registro de comprobantes.
                </p>
              </div>
              <button className="refresh-btn" onClick={loadReports} title="Sincronizar métricas con MySQL">
                <RefreshCw size={15} />
                <span>Recalcular Mes</span>
              </button>
            </div>
          </div>

          {/* SECCIÓN: BALANCE CONTABLE Y LIQUIDACIÓN MENSUAL */}
          <div className="admin-table-card glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '15.5px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} className="brand-red" />
                Balance Contable y Liquidación Mensual ({currentMonthName.toUpperCase()})
              </h4>
              <p className="text-muted" style={{ margin: '4px 0 0 0', fontSize: '12.5px' }}>
                Desglose financiero de facturación bruta, base gravada para impuestos y margen de ganancia comercial.
              </p>
            </div>

            <div className="table-responsive">
              <table className="admin-custom-table formal-table">
                <thead>
                  <tr>
                    <th>Concepto Financiero</th>
                    <th>Base de Cálculo</th>
                    <th>Importe Calculado (S/.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Total Facturado (Ventas Brutas)</strong></td>
                    <td>{currentMonthOrders.length} pedido(s) emitidos en el periodo actual</td>
                    <td><strong style={{ fontSize: '15px', color: '#1E293B' }}>S/ {monthTotalVentas.toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Base Imponible Neta (Subtotal)</strong></td>
                    <td>Ventas netas antes de aplicación de impuestos</td>
                    <td><strong>S/ {monthSubtotal.toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Débito Fiscal IGV (18% SUNAT)</strong></td>
                    <td>Impuesto General a las Ventas correspondiente al periodo</td>
                    <td><strong>S/ {monthIGV.toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Recaudación por Servicios de Entrega (Delivery)</strong></td>
                    <td>Fletes de distribución cobrados a domicilio</td>
                    <td><strong>S/ {monthEnvio.toFixed(2)}</strong></td>
                  </tr>
                  <tr style={{ background: '#F8FAFC' }}>
                    <td><strong style={{ color: '#0F766E', fontSize: '14px' }}>Margen Comercial Bruto Estimado</strong></td>
                    <td>Margen promedio ~35% sobre base neta comercializada</td>
                    <td><strong style={{ fontSize: '16px', color: '#0F766E' }}>S/ {monthGananciaEstimada.toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECCIÓN: RENDIMIENTO COMERCIAL POR SEDE FÍSICA */}
          <div className="admin-table-card glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '15.5px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={18} className="brand-orange" />
                Rendimiento Comercial por Sede Física
              </h4>
              <p className="text-muted" style={{ margin: '4px 0 0 0', fontSize: '12.5px' }}>
                Volumen de ventas, pedidos despachados y porcentaje de contribución por cada local físico de Importaciones San José.
              </p>
            </div>

            <div className="table-responsive">
              <table className="admin-custom-table formal-table">
                <thead>
                  <tr>
                    <th>Sede Comercial</th>
                    <th>Dirección / Local</th>
                    <th>Comprobantes Emitidos</th>
                    <th>Facturación Total (S/.)</th>
                    <th>Participación (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const stats = sedes.map(sede => {
                      const sedeOrders = ordersList.filter(o => o.sedeId === sede.id);
                      const totalAmt = sedeOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
                      return {
                        id: sede.id,
                        nombre: sede.nombreSede,
                        direccion: sede.direccion,
                        pedidos: sedeOrders.length,
                        total: totalAmt
                      };
                    });
                    const grandTotal = stats.reduce((sum, s) => sum + s.total, 0);

                    return (
                      <>
                        {stats.map(st => {
                          const pct = grandTotal > 0 ? ((st.total / grandTotal) * 100).toFixed(1) : '0.0';
                          return (
                            <tr key={st.id}>
                              <td>
                                <strong>{st.nombre}</strong>
                              </td>
                              <td>
                                <span className="text-muted" style={{ fontSize: '12.5px' }}>{st.direccion}</span>
                              </td>
                              <td>
                                <span className="orders-count-badge">{st.pedidos} pedido(s)</span>
                              </td>
                              <td>
                                <strong style={{ color: st.total > 0 ? '#1E293B' : '#64748B' }}>
                                  S/ {st.total.toFixed(2)}
                                </strong>
                              </td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ flex: 1, height: '6px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${pct}%`, height: '100%', background: '#B91C1C', borderRadius: '4px' }}></div>
                                  </div>
                                  <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '38px', textAlign: 'right' }}>{pct}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        <tr style={{ background: '#F8FAFC', fontWeight: 700 }}>
                          <td colSpan="2"><strong>Total Consolidado de las 5 Sedes</strong></td>
                          <td><strong>{ordersList.length} pedidos</strong></td>
                          <td><strong style={{ color: '#B91C1C', fontSize: '14.5px' }}>S/ {grandTotal.toFixed(2)}</strong></td>
                          <td><strong>100.0%</strong></td>
                        </tr>
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECCIÓN: REGISTRO OFICIAL DE COMPROBANTES DE PAGO */}
          <div className="admin-table-card glass-panel" style={{ padding: '24px' }}>
            <div className="section-head-bar flex-between" style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '15.5px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Receipt size={18} className="brand-orange" />
                  Registro Oficial de Comprobantes de Pago ({ordersList.length})
                </h4>
                <p className="text-muted" style={{ margin: '4px 0 0 0', fontSize: '12.5px' }}>
                  Historial correlativo de boletas y facturas emitidas en tienda física y plataforma web.
                </p>
              </div>
              <div className="admin-pill-search-box" style={{ maxWidth: '320px' }}>
                <Search size={16} className="search-icon-accent" />
                <input 
                  type="text" 
                  placeholder="Buscar por cliente, documento o sede..." 
                  value={salesSearchTerm}
                  onChange={(e) => setSalesSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-custom-table formal-table">
                <thead>
                  <tr>
                    <th>N° Comprobante</th>
                    <th>Fecha & Hora</th>
                    <th>Adquirente / Razón Social</th>
                    <th>Sede & Despacho</th>
                    <th>Artículos Detallados</th>
                    <th>Total Facturado</th>
                    <th>Estado del Pedido</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '45px 20px', color: '#64748B' }}>
                        <AlertCircle size={32} style={{ margin: '0 auto 10px', display: 'block', color: '#94A3B8' }} />
                        <strong style={{ fontSize: '15px', color: '#1E293B' }}>No hay comprobantes que coincidan con la búsqueda</strong>
                        <p style={{ margin: '6px 0 0 0', fontSize: '13px' }}>
                          Verifica el texto ingresado o limpia el buscador para ver todas las compras.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    displayedOrders.map(order => (
                      <tr key={order.id}>
                        <td>
                          <span className={`voucher-pill ${order.comprobante === 'Factura' ? 'factura' : 'boleta'}`}>
                            {order.numeroComprobante || `${order.comprobante} #${order.id}`}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                            {order.fechaHora ? new Date(order.fechaHora).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                          </span>
                        </td>
                        <td>
                          <div>
                            <strong style={{ fontSize: '13px', color: '#0F172A' }}>{order.razonSocialCliente || order.usuarioNombre || 'Cliente General'}</strong>
                            {order.numDocumentoCliente && (
                              <small style={{ display: 'block', color: '#64748B', fontFamily: 'monospace' }}>Doc: {order.numDocumentoCliente}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong style={{ fontSize: '13px', color: '#1E293B' }}>{order.sedeNombre || 'Sede Principal'}</strong>
                            <small style={{ display: 'block', color: order.metodoEntrega === 'Delivery' ? '#D97706' : '#2563EB', fontWeight: 600 }}>
                              {order.metodoEntrega}
                            </small>
                          </div>
                        </td>
                        <td>
                          {order.detalles && order.detalles.length > 0 ? (
                            <div style={{ fontSize: '12px', lineHeight: '1.4', color: '#334155' }}>
                              {order.detalles.slice(0, 3).map((d, i) => (
                                <div key={i}>• {d.cantidad}x {d.productoNombre}</div>
                              ))}
                              {order.detalles.length > 3 && (
                                <span style={{ color: '#64748B', fontStyle: 'italic' }}>+{order.detalles.length - 3} más...</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '12px' }}>Compra directa</span>
                          )}
                        </td>
                        <td>
                          <strong style={{ fontSize: '14.5px', color: '#0F172A', fontFamily: 'monospace' }}>
                            S/ {Number(order.total || 0).toFixed(2)}
                          </strong>
                        </td>
                        <td>
                          <span className="badge-formal-status success">
                            {order.estado || 'Emitido'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────── TAB 4: GESTIÓN OPERATIVA DE ENVÍOS & DELIVERY ─────────── */}
      {activeTab === 'orders' && (
        <div className="admin-tab-content">
          <div className="admin-table-card glass-panel" style={{ padding: '22px 24px', marginBottom: '22px' }}>
            <div className="section-head-bar flex-between" style={{ flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '9px', margin: 0, fontSize: '18px', color: '#0F172A' }}>
                  <Truck size={22} className="brand-red" />
                  Gestión de Envíos & Delivery a Domicilio
                </h3>
                <p className="text-muted" style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
                  Control exclusivo de pedidos con modalidad Delivery. Monitorea y actualiza el estado de despacho en tiempo real con impacto directo en MySQL.
                </p>
              </div>
              <button className="refresh-btn" onClick={loadReports} title="Actualizar lista de envíos">
                <RefreshCw size={15} />
                <span>Actualizar Envíos</span>
              </button>
            </div>
          </div>

          <div className="admin-table-card glass-panel" style={{ padding: '20px 24px' }}>
            <div className="table-responsive">
              <table className="admin-custom-table formal-table">
                <thead>
                  <tr>
                    <th>Nº Pedido</th>
                    <th>Fecha de Compra</th>
                    <th>Cliente / Razón Social</th>
                    <th>Dirección & Distrito de Envío</th>
                    <th>Artículos Solicitados</th>
                    <th>Importe Total</th>
                    <th>Estado de Despacho</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const deliveryOrders = ordersList.filter(o => o.metodoEntrega === 'Delivery');
                    if (deliveryOrders.length === 0) {
                      return (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                            No hay pedidos registrados con modalidad de Envío a Domicilio.
                          </td>
                        </tr>
                      );
                    }
                    return deliveryOrders.map(order => (
                      <tr key={order.id}>
                        <td>
                          <span className={`voucher-pill ${order.comprobante === 'Factura' ? 'factura' : 'boleta'}`}>
                            {order.numeroComprobante || `Pedido #${order.id}`}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                            {order.fechaHora ? new Date(order.fechaHora).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                          </span>
                        </td>
                        <td>
                          <div>
                            <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>{order.razonSocialCliente || order.usuarioNombre || 'Cliente General'}</strong>
                            {order.numDocumentoCliente && (
                              <small style={{ display: 'block', color: '#64748B', fontFamily: 'monospace' }}>Doc: {order.numDocumentoCliente}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong style={{ fontSize: '13px', color: '#1E293B', display: 'block' }}>
                              {order.direccionEnvio || 'Dirección registrada'}
                            </strong>
                            <span style={{ 
                              display: 'inline-block',
                              marginTop: '3px',
                              padding: '2px 8px', 
                              borderRadius: '8px', 
                              fontSize: '11px', 
                              fontWeight: 700,
                              background: '#FEF3C7',
                              color: '#92400E'
                            }}>
                              Distrito: {order.distritoEnvio || 'Lima Norte'}
                            </span>
                          </div>
                        </td>
                        <td>
                          {order.detalles && order.detalles.length > 0 ? (
                            <div style={{ fontSize: '12px', lineHeight: '1.4', color: '#334155' }}>
                              {order.detalles.slice(0, 3).map((d, i) => (
                                <div key={i}>• {d.cantidad}x {d.productoNombre}</div>
                              ))}
                              {order.detalles.length > 3 && (
                                <span style={{ color: '#64748B', fontStyle: 'italic' }}>+{order.detalles.length - 3} más...</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '12px' }}>Compra procesada</span>
                          )}
                        </td>
                        <td>
                          <strong style={{ fontSize: '14.5px', color: '#800020', fontFamily: 'monospace' }}>
                            S/ {Number(order.total || 0).toFixed(2)}
                          </strong>
                        </td>
                        <td>
                          <select
                            value={order.estado || 'Preparando'}
                            onChange={async (e) => {
                              const nuevo = e.target.value;
                              try {
                                await api.updateOrderStatus(order.id, nuevo, token);
                                loadReports();
                              } catch (err) {
                                alert(err.message || 'Error actualizando estado');
                              }
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: '1.5px solid #CBD5E1',
                              background: order.estado === 'Entregado' ? '#DEF7EC' : order.estado === 'En Camino' ? '#DBEAFE' : '#FEF3C7',
                              color: order.estado === 'Entregado' ? '#03543F' : order.estado === 'En Camino' ? '#1E40AF' : '#92400E'
                            }}
                          >
                            <option value="Preparando">📦 Preparando Pedido</option>
                            <option value="En Camino">🚚 En Camino</option>
                            <option value="Entregado">✅ Entregado</option>
                          </select>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────── MODAL CREAR / EDITAR PRODUCTO (CON NOMBRES CLAROS DE SEDES) ─────────── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content modal-lg glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex-align-gap">
                <Package size={22} className="brand-red" />
                <h3>{editingProduct ? `Editar Producto #${editingProduct.id}` : 'Añadir Nuevo Producto al Catálogo'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-product-form">
              <div className="form-grid-columns">
                {/* Columna Izquierda: Subida de Foto */}
                <div className="photo-upload-col">
                  <label className="form-label">Fotografía del Producto</label>
                  
                  <div className="image-dropzone">
                    {imagenPreview ? (
                      <div className="preview-container">
                        <img src={imagenPreview} alt="Vista previa" className="image-preview" />
                        <button 
                          type="button" 
                          className="remove-img-btn"
                          onClick={() => { setImagenPreview(''); setImagenUrl(''); }}
                        >
                          <X size={16} /> Cambiar Foto
                        </button>
                      </div>
                    ) : (
                      <label className="upload-placeholder-label">
                        <Upload size={32} className="brand-orange" />
                        <strong>Subir foto desde tu dispositivo</strong>
                        <small>Arrastra o haz clic (.png, .jpg, .webp)</small>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageFileChange} 
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Columna Derecha: Datos Comerciales */}
                <div className="form-fields-col">
                  <div className="input-group">
                    <label>Nombre Comercial del Producto *</label>
                    <input 
                      type="text" 
                      required 
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="input-group">
                      <label>Categoría Oficial *</label>
                      <select 
                        value={categoria} 
                        onChange={(e) => setCategoria(e.target.value)}
                      >
                        {CATEGORIAS_FORM.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Precio de Venta (S/.) *</label>
                      <input 
                        type="number" 
                        step="0.10" 
                        required 
                        placeholder="7.50"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Código QR / Identificador del Producto</label>
                    <input 
                      type="text" 
                      placeholder="SJ-PROD-001"
                      value={codigoQr}
                      onChange={(e) => setCodigoQr(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Descripción Comercial</label>
                    <textarea 
                      rows="2"
                      placeholder="Breve detalle del producto para el cliente..."
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                    ></textarea>
                  </div>

                  {/* ─────────── CONFIGURACIÓN DE OFERTAS & PROMOCIONES ─────────── */}
                  <div className="admin-promo-box">
                    <div className="promo-box-header">
                      <div className="promo-box-title">
                        <Tag size={18} className="promo-icon" />
                        <div>
                          <strong>🏷️ Oferta y Promoción Comercial</strong>
                          <p className="promo-subtext">Configura ofertas directas, por volumen mayorista o bonificación con unidades de regalo</p>
                        </div>
                      </div>
                      <label className="toggle-switch-promo">
                        <input 
                          type="checkbox" 
                          checked={isPromoActive}
                          onChange={(e) => setIsPromoActive(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-status-text">{isPromoActive ? 'OFERTA ACTIVA' : 'Sin Oferta'}</span>
                      </label>
                    </div>

                    {isPromoActive && (
                      <div className="promo-box-content">
                        {/* Selector de los 3 tipos de promoción */}
                        <div className="promo-types-nav">
                          <button
                            type="button"
                            className={`promo-type-btn ${promoTipo === 'descuento_directo' ? 'active' : ''}`}
                            onClick={() => setPromoTipo('descuento_directo')}
                          >
                            <Tag size={15} />
                            <span>1. Precio Rebajado Directo</span>
                          </button>
                          <button
                            type="button"
                            className={`promo-type-btn ${promoTipo === 'descuento_volumen' ? 'active' : ''}`}
                            onClick={() => setPromoTipo('descuento_volumen')}
                          >
                            <Percent size={15} />
                            <span>2. Descuento por Volumen</span>
                          </button>
                          <button
                            type="button"
                            className={`promo-type-btn ${promoTipo === 'bonificacion' ? 'active' : ''}`}
                            onClick={() => setPromoTipo('bonificacion')}
                          >
                            <Gift size={15} />
                            <span>3. Regalo / Bonificación</span>
                          </button>
                        </div>

                        {/* Parámetros de cada tipo */}
                        <div className="promo-fields-container">
                          {promoTipo === 'descuento_directo' && (
                            <div className="form-row-2">
                              <div className="input-group">
                                <label>Precio de Oferta Especial (S/.) *</label>
                                <input 
                                  type="number" 
                                  step="0.10" 
                                  min="0.10"
                                  placeholder={precio ? (parseFloat(precio) * 0.85).toFixed(2) : "11.50"}
                                  value={precioOferta}
                                  onChange={(e) => setPrecioOferta(e.target.value)}
                                  required={isPromoActive}
                                />
                                <small className="text-muted">
                                  Precio normal actual: S/ {precio ? parseFloat(precio).toFixed(2) : '0.00'}
                                </small>
                              </div>
                              <div className="promo-preview-badge-box">
                                <small>Vista previa en Catálogo:</small>
                                <span className="promo-badge sale">
                                  <Tag size={11} /> OFERTA
                                </span>
                                <span className="striked-preview">
                                  Antes: S/ {precio ? parseFloat(precio).toFixed(2) : '15.00'} ➔ Oferta: S/ {precioOferta || '11.50'}
                                </span>
                              </div>
                            </div>
                          )}

                          {promoTipo === 'descuento_volumen' && (
                            <div className="form-row-2">
                              <div className="input-group">
                                <label>A partir de cuántas unidades:</label>
                                <input 
                                  type="number" 
                                  min="2" 
                                  value={cantidadMinimaVolumen}
                                  onChange={(e) => setCantidadMinimaVolumen(Math.max(2, parseInt(e.target.value) || 2))}
                                />
                              </div>
                              <div className="input-group">
                                <label>Porcentaje de Descuento (%):</label>
                                <input 
                                  type="number" 
                                  min="1" 
                                  max="90"
                                  value={porcentajeDescuentoVolumen}
                                  onChange={(e) => setPorcentajeDescuentoVolumen(Math.max(1, parseInt(e.target.value) || 10))}
                                />
                              </div>
                            </div>
                          )}

                          {promoTipo === 'bonificacion' && (
                            <div className="form-row-2">
                              <div className="input-group">
                                <label>Por la compra de (unidades):</label>
                                <input 
                                  type="number" 
                                  min="1" 
                                  value={llevaCantidad}
                                  onChange={(e) => setLlevaCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                              </div>
                              <div className="input-group">
                                <label>Te regalamos gratis (unidades):</label>
                                <input 
                                  type="number" 
                                  min="1" 
                                  value={regaloCantidad}
                                  onChange={(e) => setRegaloCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Motivo o Descripción Personalizada / Automática */}
                        <div className="input-group mt-2">
                          <div className="flex-between">
                            <label>Mensaje o Motivo de la Promoción (opcional):</label>
                            <button
                              type="button"
                              className="btn-auto-text-link"
                              onClick={() => {
                                if (promoTipo === 'descuento_directo') {
                                  setMotivoPromo('¡Precio rebajado por oferta especial!');
                                } else if (promoTipo === 'descuento_volumen') {
                                  setMotivoPromo(`A partir de ${cantidadMinimaVolumen} unidades, ${porcentajeDescuentoVolumen}% de descuento`);
                                } else if (promoTipo === 'bonificacion') {
                                  setMotivoPromo(`Por la compra de ${llevaCantidad} unidades, te regalamos ${regaloCantidad} gratis`);
                                }
                              }}
                            >
                              ⚡ Generar texto automático
                            </button>
                          </div>
                          <input 
                            type="text" 
                            placeholder={
                              promoTipo === 'descuento_directo' 
                                ? 'Ej: Precio rebajado por navidad' 
                                : promoTipo === 'descuento_volumen'
                                ? `Ej: A partir de ${cantidadMinimaVolumen} unidades, ${porcentajeDescuentoVolumen}% de descuento`
                                : `Ej: Por la compra de ${llevaCantidad} unidades, te regalamos ${regaloCantidad} gratis`
                            }
                            value={motivoPromo}
                            onChange={(e) => setMotivoPromo(e.target.value)}
                          />
                        </div>

                        {/* Fecha Límite de Vigencia */}
                        <div className="input-group mt-2">
                          <label>Promoción válida HASTA (Fecha límite):</label>
                          <input 
                            type="date" 
                            value={fechaFinPromo}
                            onChange={(e) => setFechaFinPromo(e.target.value)}
                          />
                          <small className="text-muted">
                            {fechaFinPromo 
                              ? `Pasando el ${fechaFinPromo}, la oferta expira automáticamente y el producto vuelve a su precio regular.`
                              : 'Si se deja sin fecha, la oferta se mantendrá activa hasta que se desactive manualmente.'}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stock Inicial por Sedes con Nombres Claros */}
                  {!editingProduct && (
                    <div className="initial-stock-box">
                      <label className="section-label-sm">Stock Inicial en Sedes:</label>
                      <div className="stock-inputs-row">
                        <div className="stock-sede-field">
                          <small>1. Pte Piedra</small>
                          <input 
                            type="number" min="0" 
                            value={stocksPorSede[1] ?? 15}
                            onChange={(e) => setStocksPorSede({ ...stocksPorSede, 1: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="stock-sede-field">
                          <small>2. Los Olivos</small>
                          <input 
                            type="number" min="0" 
                            value={stocksPorSede[2] ?? 15}
                            onChange={(e) => setStocksPorSede({ ...stocksPorSede, 2: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="stock-sede-field">
                          <small>3. Villasol</small>
                          <input 
                            type="number" min="0" 
                            value={stocksPorSede[3] ?? 10}
                            onChange={(e) => setStocksPorSede({ ...stocksPorSede, 3: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="stock-sede-field">
                          <small>4. Ventanilla</small>
                          <input 
                            type="number" min="0" 
                            value={stocksPorSede[4] ?? 10}
                            onChange={(e) => setStocksPorSede({ ...stocksPorSede, 4: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="stock-sede-field">
                          <small>5. Comas</small>
                          <input 
                            type="number" min="0" 
                            value={stocksPorSede[5] ?? 10}
                            onChange={(e) => setStocksPorSede({ ...stocksPorSede, 5: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-secondary-link" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="primary-action-btn" disabled={loading}>
                  <Save size={18} />
                  <span>{loading ? 'Guardando en MySQL...' : editingProduct ? 'Actualizar Producto' : 'Guardar Producto en Catálogo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────── MODAL AJUSTE RÁPIDO DE INVENTARIO CON NOMBRES COMPLETOS ─────────── */}
      {selectedProductInventory && (
        <div className="modal-overlay" onClick={() => setSelectedProductInventory(null)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex-align-gap">
                <Building size={20} className="brand-orange" />
                <h3>Stock de "{selectedProductInventory.nombre}"</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedProductInventory(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-inventory">
              <p className="mb-3 text-muted">Ajusta las existencias físicas disponibles en cada una de las 5 tiendas:</p>
              
              <div className="sedes-stock-editor-list">
                <div className="sede-stock-edit-row">
                  <div>
                    <strong>1. Sede Puente Piedra (Principal)</strong>
                    <small>Mza. B Lote 9, Coop. San Lorenzo</small>
                  </div>
                  <div className="stock-input-wrap">
                    <input 
                      type="number" min="0"
                      value={inventoryStocks[1] ?? 15}
                      onChange={(e) => setInventoryStocks({ ...inventoryStocks, 1: parseInt(e.target.value) || 0 })}
                    />
                    <span>unidades</span>
                  </div>
                </div>

                <div className="sede-stock-edit-row">
                  <div>
                    <strong>2. Sede Los Olivos (2 de Octubre)</strong>
                    <small>Av. 2 de Octubre, 3W29+CVF</small>
                  </div>
                  <div className="stock-input-wrap">
                    <input 
                      type="number" min="0"
                      value={inventoryStocks[2] ?? 15}
                      onChange={(e) => setInventoryStocks({ ...inventoryStocks, 2: parseInt(e.target.value) || 0 })}
                    />
                    <span>unidades</span>
                  </div>
                </div>

                <div className="sede-stock-edit-row">
                  <div>
                    <strong>3. Sede Los Olivos - Villasol</strong>
                    <small>Av. Huandoy, Mz. J, Lote 16</small>
                  </div>
                  <div className="stock-input-wrap">
                    <input 
                      type="number" min="0"
                      value={inventoryStocks[3] ?? 10}
                      onChange={(e) => setInventoryStocks({ ...inventoryStocks, 3: parseInt(e.target.value) || 0 })}
                    />
                    <span>unidades</span>
                  </div>
                </div>

                <div className="sede-stock-edit-row">
                  <div>
                    <strong>4. Sede Ventanilla - Pachacútec</strong>
                    <small>C. Piloto Pachacútec, Ventanilla 07071</small>
                  </div>
                  <div className="stock-input-wrap">
                    <input 
                      type="number" min="0"
                      value={inventoryStocks[4] ?? 10}
                      onChange={(e) => setInventoryStocks({ ...inventoryStocks, 4: parseInt(e.target.value) || 0 })}
                    />
                    <span>unidades</span>
                  </div>
                </div>

                <div className="sede-stock-edit-row">
                  <div>
                    <strong>5. Sede Comas - Collique</strong>
                    <small>Av. Revolución 3.ª Zona, Mz. C1, Lote 10C</small>
                  </div>
                  <div className="stock-input-wrap">
                    <input 
                      type="number" min="0"
                      value={inventoryStocks[5] ?? 10}
                      onChange={(e) => setInventoryStocks({ ...inventoryStocks, 5: parseInt(e.target.value) || 0 })}
                    />
                    <span>unidades</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer-actions mt-4">
                <button type="button" className="btn-secondary-link" onClick={() => setSelectedProductInventory(null)}>
                  Cerrar
                </button>
                <button type="button" className="primary-action-btn" onClick={handleSaveInventory} disabled={loading}>
                  <Save size={16} />
                  <span>{loading ? 'Actualizando...' : 'Guardar Stock en MySQL'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

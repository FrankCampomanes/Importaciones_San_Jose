import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import QrScannerModal from './components/QrScannerModal';
import MyPurchasesModal from './components/MyPurchasesModal';
import UserProfileModal from './components/UserProfileModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { searchProducts } from './utils/searchUtils';
import { 
  Sparkles, 
  Home, 
  Baby, 
  BookOpen, 
  Sparkle, 
  Gift, 
  ShoppingBag, 
  ChevronRight,
  ShieldCheck,
  Truck,
  Building2,
  Clock,
  ArrowRight,
  Flame,
  Tag,
  LayoutDashboard
} from 'lucide-react';
import './App.css';

import { promotionsService } from './services/promotions';

const CATEGORIAS = [
  { id: 'all', nombre: 'Todos los Productos', icon: Sparkles },
  { id: 'mas-vendidos', nombre: 'Más Vendidos', icon: Flame },
  { id: 'ofertas', nombre: 'Ofertas Especiales', icon: Tag },
  { id: 'Hogar y Cocina', nombre: 'Hogar y Cocina', icon: Home },
  { id: 'Juguetería y Niños', nombre: 'Juguetería y Niños', icon: Baby },
  { id: 'Útiles y Papelería', nombre: 'Útiles y Papelería', icon: BookOpen },
  { id: 'Belleza y Cuidado Personal', nombre: 'Belleza y Cuidado Personal', icon: Sparkle },
  { id: 'Novedades y Temporada', nombre: 'Novedades y Temporada', icon: Gift }
];

export default function App() {
  const { user, isAdmin } = useAuth();
  const { isCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [selectedSede, setSelectedSede] = useState(null); // null significa "Todas las sedes"
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Vistas: 'home', 'catalog', 'admin'
  const [currentView, setCurrentView] = useState('home');

  // Modales
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMyPurchasesOpen, setIsMyPurchasesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState('datos');
  const [loading, setLoading] = useState(true);
  const [, setPromosTick] = useState(0);

  useEffect(() => {
    loadInitialData();

    // Sincronizar promociones de BD
    promotionsService.fetchFromBackend();

    const handlePromosUpdated = () => setPromosTick(t => t + 1);
    window.addEventListener('promotions-updated', handlePromosUpdated);
    return () => window.removeEventListener('promotions-updated', handlePromosUpdated);
  }, []);

  // Redirección de seguridad: Si el usuario no es Admin y está en la vista admin, volver a home
  useEffect(() => {
    if (user && user.rol !== 'Admin' && currentView === 'admin') {
      setCurrentView('home');
    }
  }, [user, currentView]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [prodsData, sedesData] = await Promise.all([
        api.getProducts(true),
        api.getSedes()
      ]);
      setProducts(prodsData || []);
      setSedes(sedesData || []);

      // Auto-abrir producto si el cliente escaneó el QR con su celular
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const qrCode = urlParams.get('qr');
        if (qrCode && prodsData && prodsData.length > 0) {
          const match = prodsData.find(p => 
            p.codigoQr && p.codigoQr.trim().toUpperCase() === qrCode.trim().toUpperCase()
          );
          if (match) {
            setSelectedProduct(match);
          }
        }
      }
    } catch (e) {
      console.error('Error cargando datos:', e);
    } finally {
      setLoading(false);
    }
  };

  // Unidades históricas vendidas registradas en MySQL (detalles_ventas)
  const ventasPorProducto = {
    1: 3,  // Guantes para lavar de silicona (3 u.)
    2: 2,  // Jarra de vidrio de 1.8L (2 u.)
    6: 2,  // Perchero organizador multiusos (2 u.)
    11: 2, // Mini joyero de cuero (2 u.)
    17: 2, // Cartera para mujer de hombro (2 u.)
    3: 1,  // Platos cerámicos (1 u.)
    4: 1,  // Set cocina espátulas (1 u.)
    5: 1,  // Espejo LED maquillaje (1 u.)
    7: 1   // Dispensador jabón líquido (1 u.)
  };

  // Cálculo Dinámico: Top 30% de productos con mayor rotación en ventas
  // (Regla: El 30% superior por volumen de ventas, ej. 30 de cada 100 productos)
  const topVendidosCount = Math.max(1, Math.ceil(products.length * 0.30));
  const sortedBySales = [...products].sort((a, b) => {
    const salesB = ventasPorProducto[b.id] || 0;
    const salesA = ventasPorProducto[a.id] || 0;
    return salesB - salesA;
  });
  const topVendidosIds = sortedBySales
    .slice(0, topVendidosCount)
    .filter(p => (ventasPorProducto[p.id] || 0) > 0)
    .map(p => p.id);

  // Filtrado de productos mediante el buscador ultra-potente y categoría
  const searchedProducts = searchProducts(products, searchTerm);
  const filteredProducts = searchedProducts.filter(p => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'mas-vendidos') {
      return topVendidosIds.includes(p.id);
    }
    if (selectedCategory === 'ofertas') {
      const promo = promotionsService.getForProduct(p.id);
      return Boolean(promo);
    }
    return p.categoria === selectedCategory;
  });

  return (
    <div className={`app-container ${isCartOpen ? 'cart-docked-open' : ''}`}>
      {/* Header Corporativo con navegación directa y enlace al panel si es Admin */}
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSede={selectedSede}
        setSelectedSede={setSelectedSede}
        sedes={sedes}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenMyPurchases={() => { setProfileInitialTab('compras'); setIsProfileOpen(true); }}
        onOpenProfile={() => { setProfileInitialTab('datos'); setIsProfileOpen(true); }}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Botón Flotante / Acceso Rápido al Panel de Admin si el usuario tiene rol Admin */}
      {isAdmin && (
        <div className="admin-floating-badge">
          <button 
            className={`admin-toggle-pill ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
          >
            <LayoutDashboard size={16} />
            <span>{currentView === 'admin' ? 'Ver Tienda' : 'Panel de Admin'}</span>
          </button>
        </div>
      )}

      {/* ─────────── VISTA 1: INICIO (HOME) ─────────── */}
      {currentView === 'home' && (
        <main className="main-home-content">
          {/* Hero Banner Corporativo */}
          <section className="hero-banner">
            <div className="container hero-inner">
              <div className="hero-text-col">
                <span className="hero-badge">
                  <Sparkles size={14} /> Grupo Importaciones San José S.R.L.
                </span>
                <h1>
                  Todo lo que buscas para tu hogar, negocio y familia en un solo lugar.
                </h1>
                <p>
                  Artículos para el hogar, juguetes, útiles, belleza y novedades con precios por mayor y menor. 
                  Atención continua en nuestras 5 sedes de <strong>9:00 am a 10:00 pm</strong>.
                </p>
                <div className="hero-actions-row">
                  <button 
                    className="hero-primary-btn"
                    onClick={() => {
                      setSelectedCategory('all');
                      setCurrentView('catalog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <span>Ver Catálogo Completo</span>
                    <ChevronRight size={18} />
                  </button>
                  <button 
                    className="hero-secondary-btn btn-mas-vendidos"
                    onClick={() => {
                      setSelectedCategory('mas-vendidos');
                      setCurrentView('catalog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Flame size={16} />
                    <span>Más Vendidos</span>
                  </button>
                  <button 
                    className="hero-secondary-btn btn-ofertas-hero"
                    onClick={() => {
                      setSelectedCategory('ofertas');
                      setCurrentView('catalog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Tag size={16} />
                    <span>Ofertas Especiales</span>
                  </button>
                </div>
              </div>

              {/* Highlight Card Informativa */}
              <div className="hero-highlight-card glass-panel">
                <div className="highlight-badge">RUC: 20607725731</div>
                <h3>5 Años de Trayectoria</h3>
                <p>Comercio mayorista y minorista con presencia activa en Lima Norte y Callao.</p>
                <div className="highlight-stats-grid">
                  <div className="stat-box">
                    <span className="stat-number">+1,000</span>
                    <span className="stat-desc">Variedad de artículos</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">5</span>
                    <span className="stat-desc">Sedes en Lima y Callao</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number text-highlight-sm">Mayor y Menor</span>
                    <span className="stat-desc">Precios de importación</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cintillo de Beneficios y Confianza */}
          <section className="trust-features-strip">
            <div className="container features-grid">
              <div className="feature-item">
                <div className="feature-icon"><Truck size={22} /></div>
                <div>
                  <strong>Delivery en Lima & Callao</strong>
                  <small>Mínimo S/ 20 • Gratis desde S/ 60.00</small>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Building2 size={22} /></div>
                <div>
                  <strong>Recojo Presencial Gratis</strong>
                  <small>En cualquiera de nuestras 5 sedes</small>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Clock size={22} /></div>
                <div>
                  <strong>Atención 9:00 AM - 10:00 PM</strong>
                  <small>Lunes a Domingo ininterrumpido</small>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><ShieldCheck size={22} /></div>
                <div>
                  <strong>Boleta y Factura con RUC</strong>
                  <small>Garantía de compra 100% formal</small>
                </div>
              </div>
            </div>
          </section>

          {/* Sección de Productos Destacados en Portada */}
          <section className="home-featured-section">
            <div className="container">
              <div className="section-header-row flex-between">
                <div>
                  <span className="section-eyebrow-accent">Destacados de la Tienda</span>
                  <h2>Productos de Mayor Demanda</h2>
                  <p>Catálogo verificado con fotografías reales y precios en Soles.</p>
                </div>
                <button 
                  className="view-all-link-btn"
                  onClick={() => {
                    setCurrentView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Ver Catálogo</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {loading ? (
                <div className="catalog-loading-state">
                  <div className="spinner"></div>
                  <p>Cargando productos de portada...</p>
                </div>
              ) : (
                <div className="products-grid-layout">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onSelect={(prod) => setSelectedProduct(prod)}
                    />
                  ))}
                </div>
              )}

              {/* Botón Central para ir a Catálogo */}
              <div className="text-center mt-5 mb-3">
                <button 
                  className="primary-action-btn lg-btn"
                  onClick={() => {
                    setCurrentView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <BookOpen size={18} />
                  <span>Ver Catálogo</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ─────────── VISTA 2: CATÁLOGO DE PRODUCTOS ─────────── */}
      {currentView === 'catalog' && (
        <main className="main-catalog-content">
          <div className="catalog-banner-vibrant">
            <div className="container catalog-banner-inner">
              <div className="catalog-banner-text">
                <span className="catalog-tag-pill">
                  <Tag size={13} /> Catálogo
                </span>
                <h1>Catálogo de Productos</h1>
                <p>Variedad de artículos para el hogar, juguetes, útiles, cosméticos y novedades.</p>
              </div>
              <div className="catalog-banner-badge">
                <span className="badge-count-num">{filteredProducts.length}</span>
                <span className="badge-count-lbl">Artículos disponibles</span>
              </div>
            </div>
          </div>

          {/* Barra de Filtro de Categorías */}
          <section className="categories-filter-section">
            <div className="container">
              <div className="categories-pill-scroll">
                {CATEGORIAS.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      className={`category-nav-pill ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <Icon size={16} />
                      <span>{cat.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Grilla de Productos */}
          <section className="products-grid-section">
            <div className="container">
              <div className="catalog-meta-bar">
                <span className="results-count">
                  Mostrando <strong>{filteredProducts.length}</strong> productos
                  {selectedCategory !== 'all' && ` en "${selectedCategory}"`}
                  {searchTerm && ` para "${searchTerm}"`}
                  {selectedSede && ` (Sede: ${selectedSede.nombreSede})`}
                  {!selectedSede && ` (Todas las Sedes)`}
                </span>
                {searchTerm && (
                  <button 
                    className="clear-filter-btn"
                    onClick={() => setSearchTerm('')}
                  >
                    Borrar búsqueda ("{searchTerm}")
                  </button>
                )}
              </div>

              {loading ? (
                <div className="catalog-loading-state">
                  <div className="spinner"></div>
                  <p>Cargando catálogo...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="catalog-empty-search glass-panel">
                  <ShoppingBag size={48} className="brand-orange" />
                  <h3>No se encontraron productos para "{searchTerm}"</h3>
                  <p>Intenta con otra palabra clave como "jarra", "guantes" o "colador".</p>
                  <button 
                    className="primary-action-btn"
                    onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
                  >
                    Ver Todo el Catálogo
                  </button>
                </div>
              ) : (
                <div className="products-grid-layout">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onSelect={(prod) => setSelectedProduct(prod)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* ─────────── VISTA 3: PANEL DE ADMINISTRADOR ─────────── */}
      {currentView === 'admin' && (
        <main className="main-admin-content">
          <div className="container">
            <AdminDashboard 
              products={products}
              sedes={sedes}
              onRefreshProducts={loadInitialData}
              onClose={() => setCurrentView('home')}
            />
          </div>
        </main>
      )}

      {/* Footer Corporativo Oficial */}
      <Footer sedes={sedes} onSelectSede={(s) => setSelectedSede(s)} />

      {/* Modales y Drawers */}
      <CartDrawer 
        selectedSede={selectedSede}
        sedes={sedes}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMyPurchases={() => { setIsCartOpen(false); setProfileInitialTab('compras'); setIsProfileOpen(true); }}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        selectedSede={selectedSede}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        products={products}
      />

      <MyPurchasesModal
        isOpen={isMyPurchasesOpen}
        onClose={() => setIsMyPurchasesOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        initialTab={profileInitialTab}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}

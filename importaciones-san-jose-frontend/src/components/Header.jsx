import React from 'react';
import { 
  ShoppingCart, 
  Search, 
  MapPin, 
  Clock, 
  Truck, 
  User, 
  LogOut, 
  QrCode, 
  BookOpen, 
  Home, 
  Building2,
  Package 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CustomDropdown from './CustomDropdown';

export default function Header({ 
  searchTerm, 
  setSearchTerm, 
  selectedSede, 
  setSelectedSede, 
  sedes, 
  onOpenAuth, 
  onOpenScanner, 
  currentView, 
  setCurrentView,
  onOpenMyPurchases,
  onOpenProfile
}) {
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();

  // Opciones para el Custom Dropdown de Sedes
  const sedeOptions = [
    { value: 'all', label: 'Sedes: Todas (Lima & Callao)', subLabel: '5 tiendas disponibles', icon: Building2 },
    ...sedes.map(s => ({
      value: String(s.id),
      label: s.nombreSede,
      subLabel: `${s.distrito} • 9am - 10pm`,
      icon: MapPin
    }))
  ];

  const currentSedeValue = selectedSede ? String(selectedSede.id) : 'all';

  const handleSedeChange = (val) => {
    if (val === 'all') {
      setSelectedSede(null);
    } else {
      const s = sedes.find(item => String(item.id) === val);
      setSelectedSede(s || null);
    }
  };

  return (
    <header className="site-header">
      {/* Topbar Corporativa Sutil */}
      <div className="topbar">
        <div className="container topbar-content">
          <div className="topbar-left">
            <span className="topbar-item">
              <Clock size={13} className="topbar-icon" />
              Horario: <strong>9:00 AM - 10:00 PM</strong> (Todas las sedes)
            </span>
            <span className="topbar-divider">•</span>
            <span className="topbar-item">
              <Truck size={13} className="topbar-icon" />
              Delivery en Lima & Callao (Gratis desde S/ 60)
            </span>
          </div>
          <div className="topbar-right">
            <a 
              href="https://www.facebook.com/people/Imp-San-Jose-Olivos/61561207173879/" 
              target="_blank" 
              rel="noreferrer" 
              className="topbar-link"
            >
              Facebook Oficial: Imp San Jose Olivos
            </a>
            <span className="topbar-divider">•</span>
            <span className="topbar-item">RUC: 20607725731</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-nav glass-panel">
        <div className="container nav-content">
          {/* Logo Oficial Importaciones San José */}
          <div className="logo-container" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/images/Logo.png" 
              alt="Importaciones San José Logo Oficial" 
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo-badge-circle" style={{ display: 'none' }}>
              <span>SJ</span>
            </div>
            <div className="logo-text">
              <div className="brand-title">
                <span className="brand-red">IMPORTACIONES</span>{' '}
                <span className="brand-orange">SAN JOSÉ</span>
              </div>
              <span className="brand-subtitle">Bazar, Hogar & Novedades</span>
            </div>
          </div>

          {/* Navegación Directa: Inicio & Catálogo */}
          <nav className="header-nav-links">
            <button 
              className={`nav-link-btn ${currentView === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentView('home')}
            >
              <Home size={16} />
              <span>Inicio</span>
            </button>
            <button 
              className={`nav-link-btn ${currentView === 'catalog' ? 'active' : ''}`}
              onClick={() => setCurrentView('catalog')}
            >
              <BookOpen size={16} />
              <span>Catálogo</span>
            </button>
          </nav>

          {/* Buscador Ultra-Potente en el Header */}
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar productos por nombre, código o rubro..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (currentView !== 'catalog') {
                  setCurrentView('catalog');
                }
              }}
            />
            {searchTerm && (
              <button 
                className="clear-search" 
                onClick={() => setSearchTerm('')}
                title="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>

          {/* Acciones del Header */}
          <div className="nav-actions">
            {/* Custom Dropdown Elegante para Sedes */}
            <CustomDropdown 
              options={sedeOptions}
              value={currentSedeValue}
              onChange={handleSedeChange}
              icon={MapPin}
              className="header-sede-dropdown"
            />

            {/* Usuario / Ingresar */}
            {user ? (
              <div className="user-menu" style={{ display: 'flex', alignItems: 'center' }}>
                {user.rol === 'Admin' ? (
                  <button 
                    className="user-badge" 
                    onClick={() => setCurrentView('admin')}
                    title="Abrir Panel de Control Administrador"
                    style={{ 
                      background: '#FEF2F2', 
                      border: '1.5px solid #FCA5A5', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <User size={15} color="#800020" />
                    <span className="user-name" style={{ fontWeight: 700, color: '#800020' }}>
                      Panel Admin
                    </span>
                  </button>
                ) : (
                  <button 
                    className="user-badge" 
                    onClick={onOpenProfile}
                    title="Gestionar Mi Perfil y Mis Compras"
                    style={{ 
                      background: '#F8FAFC', 
                      border: '1.5px solid #CBD5E1', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <User size={15} color="#800020" />
                    <span className="user-name" style={{ fontWeight: 600, color: '#1E293B' }}>
                      {user.nombreCompleto?.split(' ')[0] || 'Mi Perfil'}
                    </span>
                  </button>
                )}
                <button className="logout-btn" onClick={logout} title="Cerrar Sesión" style={{ marginLeft: '10px' }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button className="login-btn" onClick={onOpenAuth}>
                <User size={16} />
                <span>Ingresar</span>
              </button>
            )}

            {/* Carrito con Contador Flotante */}
            <button 
              className="cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir Carrito"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="cart-badge-count">{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

import { Link } from 'react-router-dom';
import { Search, MapPin, ShoppingCart, User } from 'lucide-react';
import './Header.css';

export default function Header() {
  return (
    <header className="main-header glass-header">
      <div className="container header-content">
        <Link to="/" className="logo-section">
          {/* Reemplazar con <img src="/assets/images/logo.png" /> cuando esté disponible */}
          <div className="logo-placeholder">ISJ</div>
          <div className="brand-text">
            <h1>IMPORTACIONES SAN JOSÉ</h1>
            <span>Mayoristas y Minoristas</span>
          </div>
        </Link>
        
        <div className="search-bar">
          <input type="text" placeholder="Busca organizadores, juguetes, cosméticos, útiles..." />
          <button className="search-btn"><Search size={20} /></button>
        </div>

        <div className="header-actions">
          <div className="location-badge">
            <MapPin size={16} />
            <span>Lima Norte / Callao</span>
          </div>
          <button className="icon-btn" aria-label="Carrito">
            <ShoppingCart size={22} />
            <span className="cart-count">0</span>
          </button>
          <button className="btn-outline user-btn">
            <User size={18} />
            <span>Ingresar</span>
          </button>
        </div>
      </div>
      
      <nav className="bottom-nav">
        <div className="container nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/catalogo">Catálogo Completo</Link>
          <Link to="/sedes">Nuestras Sedes</Link>
          <Link to="/nosotros">Nosotros</Link>
        </div>
      </nav>
    </header>
  );
}

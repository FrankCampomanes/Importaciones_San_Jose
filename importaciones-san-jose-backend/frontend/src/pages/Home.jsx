import { Link } from 'react-router-dom';
import { Truck, Store, ShieldCheck, MessageCircle } from 'lucide-react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Franja de Beneficios */}
      <div className="benefits-strip">
        <div className="container benefits-container">
          <div className="benefit-item">
            <Truck size={18} />
            <span>Envíos Rápidos y Transporte</span>
          </div>
          <div className="benefit-item">
            <Store size={18} />
            <span>Retiro Inmediato en 5 Sedes</span>
          </div>
          <div className="benefit-item">
            <ShieldCheck size={18} />
            <span>Empresa Formal RUC 20607725731</span>
          </div>
          <div className="benefit-item">
            <MessageCircle size={18} />
            <span>Atención Personalizada 9am - 10pm</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="glass-badge hero-badge">
              ✨ Novedades para tu hogar, familia y negocio
            </div>
            <h1>Todo lo que buscas en un solo lugar y al mejor precio</h1>
            <p>
              Encuentra accesorios para el hogar, juguetes, cosméticos, artículos escolares y novedades de temporada. 
              Contamos con múltiples sedes estratégicas en Lima Norte y Callao para tu mayor comodidad.
            </p>
            <div className="hero-actions">
              <Link to="/catalogo" className="btn-primary">Explorar Catálogo</Link>
              <Link to="/sedes" className="btn-outline glass-btn">Ver Nuestras Sedes</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrapper glass-panel">
              <div className="placeholder-image hero-placeholder">
                <Store size={48} opacity={0.3} />
                <span>Foto de Catálogo/Tienda</span>
                <small>/assets/images/hero-banner.jpg</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explorador de Categorías Rápidas */}
      <section className="categories-section container">
        <div className="section-header">
          <h2>Explora nuestras categorías</h2>
          <Link to="/catalogo" className="view-all">Ver todo el catálogo →</Link>
        </div>
        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <Link to={`/catalogo?cat=${cat.id}`} key={idx} className="category-card">
              <div className="category-img-wrapper">
                <div className="placeholder-image category-placeholder">
                  <cat.icon size={32} opacity={0.4} />
                </div>
              </div>
              <div className="category-info">
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

const categories = [
  { id: 'hogar', name: 'Hogar & Cocina', desc: 'Organizadores, tapers y decoración', icon: Store },
  { id: 'juguetes', name: 'Juguetes & Niños', desc: 'Juegos didácticos y carros', icon: Store },
  { id: 'belleza', name: 'Belleza & Cosméticos', desc: 'Brochas y cuidado personal', icon: Store },
  { id: 'utiles', name: 'Útiles & Oficina', desc: 'Cuadernos y papelería', icon: Store },
  { id: 'limpieza', name: 'Limpieza & Baño', desc: 'Dispensadores y accesorios', icon: Store },
  { id: 'temporada', name: 'Novedades & Temporada', desc: 'Campaña escolar y fiestas', icon: Store },
];

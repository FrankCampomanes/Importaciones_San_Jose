import React from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Truck,
  CreditCard,
  Globe,
  Sparkles,
  MessageCircle
} from 'lucide-react';

export default function Footer({ sedes, onSelectSede, onOpenTerms }) {
  const WHATSAPP_NUM = "51926577602";
  const WHATSAPP_DISPLAY = "+51 926 577 602";

  return (
    <footer className="site-footer" id="sedes-footer-section">
      {/* Sección Sedes Físicas Oficiales */}
      <div className="sedes-showcase-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-eyebrow">Red de Tiendas Físicas</span>
            <h2>Nuestras 5 Sedes en Lima y Callao</h2>
            <p>Atención continua de <strong>9:00 AM a 10:00 PM</strong> todos los días del año.</p>
          </div>

          <div className="sedes-grid">
            {sedes.map((sede) => (
              <div
                key={sede.id}
                className="sede-card glass-panel"
                onClick={() => onSelectSede && onSelectSede(sede)}
              >
                <div className="sede-card-header">
                  <div className="sede-icon-bubble">
                    <Building2 size={20} />
                  </div>
                  <span className="sede-district-tag">{sede.distrito}</span>
                </div>
                <h4 className="sede-name">{sede.nombreSede}</h4>
                <p className="sede-address">
                  <MapPin size={14} />
                  <span>{sede.direccion}</span>
                </p>
                <div className="sede-footer-info">
                  <div className="sede-time">
                    <Clock size={13} />
                    <span>9:00 am - 10:00 pm</span>
                  </div>
                  <div className="sede-phone">
                    <Phone size={13} />
                    <span>{sede.telefono}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links & Company Details */}
      <div className="footer-bottom-block">
        <div className="container footer-content-grid">
          {/* Columna Marca */}
          <div className="footer-brand-col">
            <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src="/images/Logo.png"
                alt="Logo Oficial"
                style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
              />
              <strong className="brand-title-sm">GRUPO IMPORTACIONES SAN JOSÉ S.R.L.</strong>
            </div>
            <p className="footer-desc">
              Empresa peruana constituida con <strong>RUC 20607725731</strong>.
              Más de 5 años ofreciendo variedad de artículos para el hogar, juguetes,
              útiles, belleza y novedades de temporada con los precios más competitivos.
            </p>
            <div className="company-badge-box">
              <ShieldCheck size={16} className="text-green" />
              <span>Estado: ACTIVA Y HABIDA (SUNAT)</span>
            </div>
          </div>

          {/* Columna Beneficios */}
          <div className="footer-links-col">
            <h4>Beneficios de Compra</h4>
            <ul className="footer-list">
              <li>
                <Truck size={15} />
                <span>Delivery: pedido mínimo S/ 20 (Gratis desde S/ 60)</span>
              </li>
              <li>
                <Building2 size={15} />
                <span>Recojo gratuito en cualquiera de nuestras 5 sedes</span>
              </li>
              <li>
                <CreditCard size={15} />
                <span>Emisión de Boleta y Factura con RUC</span>
              </li>
              <li>
                <Sparkles size={15} />
                <span>Precios por mayor y menor todo el año</span>
              </li>
            </ul>
          </div>

          {/* Columna Redes & WhatsApp 926577602 */}
          <div className="footer-links-col">
            <h4>Atención & Contacto Directo</h4>
            <ul className="footer-list">
              <li>
                <MessageCircle size={16} className="text-green" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUM}?text=Hola%20Importaciones%20San%20Jos%C3%A9,%20deseo%20consultar%20sobre%20un%20pedido`}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  WhatsApp: <strong>{WHATSAPP_DISPLAY}</strong>
                </a>
              </li>
              <li>
                <Globe size={16} />
                <a
                  href="https://www.facebook.com/people/Imp-San-Jose-Olivos/61561207173879/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  Facebook Oficial: Imp San Jose Olivos
                </a>
              </li>
              <li>
                <MapPin size={16} />
                <span>Domicilio Fiscal: Mza. B Lote 9, Coop. San Lorenzo, Puente Piedra, Lima</span>
              </li>
              <li>
                <ShieldCheck size={16} style={{ color: '#e11d48' }} />
                <button
                  type="button"
                  onClick={onOpenTerms}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#93c5fd',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0,
                    font: 'inherit',
                    fontSize: '13.5px',
                    textAlign: 'left'
                  }}
                >
                  Términos, Condiciones y Privacidad (Ley N.° 29733)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright-bar">
          <div className="container flex-between" style={{ flexWrap: 'wrap', gap: '8px' }}>
            <span>© {new Date().getFullYear()} Grupo Importaciones San José S.R.L. — Todos los derechos reservados.</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={onOpenTerms}
                style={{ background: 'none', border: 'none', color: '#94a3b8', textDecoration: 'underline', cursor: 'pointer', fontSize: '12px', padding: 0 }}
              >
                Términos y Privacidad
              </button>
              <span>• RUC 20607725731</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

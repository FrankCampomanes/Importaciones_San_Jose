import React, { useState, useEffect } from 'react';
import { X, Package, Calendar, MapPin, Search, Receipt } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyPurchasesModal({ isOpen, onClose }) {
  const { user, token } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && user && token) {
      cargarCompras();
    }
  }, [isOpen, user, token]);

  const cargarCompras = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getOrders(token);
      setCompras(data || []);
    } catch (err) {
      console.error("Error al cargar compras:", err);
      setError("No se pudieron cargar tus compras. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel my-purchases-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
        <div className="modal-header" style={{ background: '#FEF3C7', borderBottom: '1.5px solid #FDE68A' }}>
          <div className="modal-header-title">
            <Package size={20} className="brand-red" />
            <h2 style={{ color: '#7F1D1D' }}>Mis Compras y Pedidos</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} style={{ color: '#991B1B' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '20px' }}>
          {loading ? (
            <div className="loading-spinner" style={{ textAlign: 'center', padding: '40px' }}>
              <Search size={32} className="brand-orange rotating" style={{ animation: 'spin 2s linear infinite' }} />
              <p style={{ marginTop: '10px', color: '#6B7280' }}>Buscando tu historial de compras...</p>
            </div>
          ) : error ? (
            <div className="alert-warning-box">
              <p>{error}</p>
            </div>
          ) : compras.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
              <Package size={48} style={{ color: '#D1D5DB', margin: '0 auto' }} />
              <h3 style={{ color: '#4B5563', marginTop: '15px' }}>Aún no tienes compras realizadas</h3>
              <p style={{ color: '#6B7280', marginTop: '10px' }}>¡Explora nuestro catálogo y aprovecha nuestras ofertas!</p>
              <button className="primary-action-btn" onClick={onClose} style={{ marginTop: '20px' }}>
                Ir al Catálogo
              </button>
            </div>
          ) : (
            <div className="purchases-list">
              {compras.map((compra) => (
                <div key={compra.id} className="purchase-card" style={{ border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '15px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
                  <div className="purchase-info" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', color: '#111827', fontSize: '16px' }}>Pedido #{compra.id}</span>
                      <span style={{ background: '#DEF7EC', color: '#03543F', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
                        {compra.estado}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', color: '#6B7280', fontSize: '13px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} /> {new Date(compra.fechaHora).toLocaleDateString()}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {compra.metodoEntrega}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Receipt size={14} /> {compra.comprobante}: {compra.numeroComprobante}
                      </span>
                    </div>
                  </div>
                  <div className="purchase-action" style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#991B1B', marginBottom: '8px' }}>
                      S/ {Number(compra.total).toFixed(2)}
                    </div>
                    <button className="btn-secondary-link" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', background: '#FFF' }}>
                      <Receipt size={14} /> Ver Comprobante
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

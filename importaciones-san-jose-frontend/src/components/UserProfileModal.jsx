import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  CreditCard, 
  AlertTriangle, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Lock,
  Calendar,
  Package,
  MapPin,
  Receipt,
  Search,
  Clock,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function UserProfileModal({ isOpen, onClose, initialTab = 'datos' }) {
  const { user, token, logout, login } = useAuth();

  // 4 pestañas: 'datos', 'compras', 'tarjetas', 'eliminar'
  const [activeTab, setActiveTab] = useState(initialTab); 

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]); 
  
  // Datos Personales Form
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileError, setProfileError] = useState(null);

  // Mis Compras
  const [compras, setCompras] = useState([]);
  const [loadingCompras, setLoadingCompras] = useState(false);
  const [comprasError, setComprasError] = useState(null);

  // Tarjetas
  const [tarjetas, setTarjetas] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    titular: '',
    numero: '',
    mes: '12',
    anio: '2028',
    cvv: ''
  });
  const [cardMsg, setCardMsg] = useState(null);

  // Eliminar Cuenta
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      cargarPerfil();
      cargarTarjetas();
      cargarCompras();
    }
  }, [isOpen, token]);

  const cargarPerfil = async () => {
    try {
      setLoadingProfile(true);
      const data = await api.getUserProfile(token);
      setNombreCompleto(data.nombreCompleto || user?.nombreCompleto || '');
      setTelefono(data.telefono || '');
    } catch {
      setNombreCompleto(user?.nombreCompleto || '');
    } finally {
      setLoadingProfile(false);
    }
  };

  const cargarCompras = async () => {
    try {
      setLoadingCompras(true);
      setComprasError(null);
      const data = await api.getOrders(token);
      setCompras(data || []);
    } catch (e) {
      console.warn('Error cargando compras:', e);
      setComprasError('No se pudieron cargar tus compras. Inténtalo más tarde.');
    } finally {
      setLoadingCompras(false);
    }
  };

  const cargarTarjetas = async () => {
    try {
      setLoadingCards(true);
      const list = await api.getPaymentMethods(token);
      setTarjetas(list || []);
    } catch (e) {
      console.warn('Error cargando tarjetas:', e);
    } finally {
      setLoadingCards(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileError(null);
    setLoadingProfile(true);

    try {
      const payload = {
        nombreCompleto: nombreCompleto.trim(),
        telefono: telefono.trim(),
        password: password.trim() ? password.trim() : null
      };
      const res = await api.updateUserProfile(payload, token);
      
      if (user) {
        login({ ...user, nombreCompleto: res.nombreCompleto }, token);
      }
      setProfileMsg('Tus datos han sido actualizados con éxito.');
      setPassword('');
      setTimeout(() => setProfileMsg(null), 4000);
    } catch (err) {
      setProfileError(err.message || 'Error al actualizar perfil');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setCardMsg(null);

    const cleanNum = newCard.numero.replace(/\s/g, '');
    if (cleanNum.length < 15) {
      setCardMsg({ type: 'error', text: 'El número de tarjeta debe tener al menos 15 dígitos' });
      return;
    }

    const ultimos = cleanNum.slice(-4);
    const tokenSimulado = `tok_sim_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    try {
      await api.savePaymentMethod({
        tokenSimulado,
        ultimosDigitos: ultimos,
        titular: newCard.titular.toUpperCase(),
        mesExpiracion: newCard.mes.padStart(2, '0'),
        anioExpiracion: newCard.anio
      }, token);

      setCardMsg({ type: 'success', text: 'Tarjeta registrada exitosamente.' });
      setShowAddCard(false);
      setNewCard({ titular: '', numero: '', mes: '12', anio: '2028', cvv: '' });
      cargarTarjetas();
      setTimeout(() => setCardMsg(null), 4000);
    } catch (err) {
      setCardMsg({ type: 'error', text: err.message || 'Error al guardar tarjeta' });
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este método de pago?')) return;
    try {
      await api.deletePaymentMethod(cardId, token);
      setTarjetas(prev => prev.filter(t => t.id !== cardId));
    } catch (err) {
      alert(err.message || 'Error al eliminar tarjeta');
    }
  };

  const handleDownloadReceipt = (compra) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor permite ventanas emergentes para descargar tu comprobante.');
      return;
    }

    const deliveryFee = compra.metodoEntrega === 'Delivery' ? Number(compra.costoEnvio || 0) : 0;
    const finalTotal = Number(compra.total);
    const productsTotal = Math.max(0, finalTotal - deliveryFee);
    const subtotal = (productsTotal / 1.18).toFixed(2);
    const igv = (productsTotal - Number(subtotal)).toFixed(2);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Comprobante ${compra.comprobante} - ${compra.numeroComprobante || compra.id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #1e293b; max-width: 650px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #800020; padding-bottom: 15px; margin-bottom: 20px; }
          .company-name { font-size: 22px; font-weight: bold; color: #800020; margin: 0; }
          .company-sub { font-size: 13px; color: #64748b; margin: 4px 0 0 0; }
          .doc-box { border: 2px solid #800020; border-radius: 8px; padding: 12px; margin: 15px 0; text-align: center; background: #fffdfa; }
          .doc-type { font-size: 16px; font-weight: bold; color: #800020; text-transform: uppercase; }
          .doc-num { font-size: 18px; font-weight: bold; color: #1e293b; margin-top: 4px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; margin-bottom: 20px; }
          .info-item strong { color: #475569; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          th { background: #800020; color: white; text-align: left; padding: 8px; }
          td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
          .totals { margin-left: auto; width: 240px; font-size: 13px; }
          .totals-row { display: flex; justify-content: space-between; padding: 4px 0; }
          .totals-total { font-size: 16px; font-weight: bold; color: #800020; border-top: 2px solid #800020; padding-top: 6px; }
          .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 15px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">IMPORTACIONES SAN JOSÉ</div>
          <div class="company-sub">Bazar, Hogar, Juguetes & Novedades • RUC: 20607725731</div>
          <div class="company-sub">Lima Norte y Callao • Teléfono: 926 577 602</div>
        </div>

        <div class="doc-box">
          <div class="doc-type">${compra.comprobante === 'Factura' ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA'}</div>
          <div class="doc-num">${compra.numeroComprobante || `SJ-${String(compra.id).padStart(6, '0')}`}</div>
        </div>

        <div class="info-grid">
          <div class="info-item"><strong>Fecha de Emisión:</strong> ${new Date(compra.fechaHora).toLocaleDateString('es-PE')} ${new Date(compra.fechaHora).toLocaleTimeString('es-PE')}</div>
          <div class="info-item"><strong>Modalidad:</strong> ${compra.metodoEntrega}</div>
          <div class="info-item"><strong>Cliente:</strong> ${compra.razonSocialCliente || user?.nombreCompleto || 'Cliente'}</div>
          <div class="info-item"><strong>Documento:</strong> ${compra.numDocumentoCliente || 'No registrado'}</div>
          ${compra.direccionEnvio ? `<div class="info-item" style="grid-column: span 2;"><strong>Dirección de Entrega:</strong> ${compra.direccionEnvio} (${compra.distritoEnvio || 'Lima'})</div>` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Cant.</th>
              <th>Descripción</th>
              <th style="text-align: right;">Total (S/.)</th>
            </tr>
          </thead>
          <tbody>
            ${compra.detalles && compra.detalles.length > 0 ? compra.detalles.map(d => `
              <tr>
                <td>${d.cantidad}</td>
                <td>${d.productoNombre}</td>
                <td style="text-align: right;">${Number(d.subtotal).toFixed(2)}</td>
              </tr>
            `).join('') : `
              <tr>
                <td>1</td>
                <td>Compra General de Bazar / Artículos seleccionados</td>
                <td style="text-align: right;">${Number(productsTotal).toFixed(2)}</td>
              </tr>
            `}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row"><span>Op. Gravada:</span><span>S/ ${subtotal}</span></div>
          <div class="totals-row"><span>I.G.V. (18%):</span><span>S/ ${igv}</span></div>
          ${deliveryFee > 0 ? `<div class="totals-row"><span>Costo de Envío:</span><span>S/ ${deliveryFee.toFixed(2)}</span></div>` : ''}
          <div class="totals-row totals-total"><span>TOTAL:</span><span>S/ ${finalTotal.toFixed(2)}</span></div>
        </div>

        <div class="footer">
          <p>Representación impresa del Comprobante de Pago Electrónico.</p>
          <p>¡Gracias por tu preferencia en Importaciones San José!</p>
        </div>

        <div class="no-print" style="text-align: center; margin-top: 25px;">
          <button onclick="window.print()" style="background: #800020; color: white; border: none; padding: 10px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px;">
            🖨️ Imprimir / Guardar en PDF
          </button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setDeleting(true);
    try {
      await api.deleteUserAccount(token);
      alert('Tu cuenta ha sido desactivada en el sistema.');
      logout();
      onClose();
    } catch (err) {
      alert(err.message || 'Error al desactivar la cuenta');
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', width: '92%', borderRadius: '16px', padding: '0', overflow: 'hidden' }}
      >
        {/* Header Modal - Tonos Corporativos San José (Guinda Granate / Dorado) */}
        <div style={{ 
          background: 'linear-gradient(135deg, #800020 0%, #4A0E17 100%)', 
          color: '#FFF', 
          padding: '20px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '2px solid #D97706'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.18)', padding: '10px', borderRadius: '50%' }}>
              <User size={22} color="#FFF" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 700, letterSpacing: '-0.3px', color: '#FFF' }}>Mi Perfil</h3>
              <small style={{ color: '#FEF3C7', fontSize: '12px' }}>{user?.correo} • {user?.rol || 'Cliente'}</small>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Barra de 4 Pestañas */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #E2E8F0', 
          background: '#FFFDF9',
          padding: '0 8px',
          overflowX: 'auto'
        }}>
          <button 
            onClick={() => setActiveTab('datos')}
            style={{
              flex: 1,
              padding: '13px 8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'datos' ? 600 : 500,
              color: activeTab === 'datos' ? '#800020' : '#64748B',
              borderBottom: activeTab === 'datos' ? '3px solid #800020' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '13.5px',
              whiteSpace: 'nowrap'
            }}
          >
            <User size={16} /> Mis Datos
          </button>

          <button 
            onClick={() => setActiveTab('compras')}
            style={{
              flex: 1,
              padding: '13px 8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'compras' ? 600 : 500,
              color: activeTab === 'compras' ? '#800020' : '#64748B',
              borderBottom: activeTab === 'compras' ? '3px solid #800020' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '13.5px',
              whiteSpace: 'nowrap'
            }}
          >
            <Package size={16} /> Mis Compras
          </button>

          <button 
            onClick={() => setActiveTab('tarjetas')}
            style={{
              flex: 1,
              padding: '13px 8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'tarjetas' ? 600 : 500,
              color: activeTab === 'tarjetas' ? '#800020' : '#64748B',
              borderBottom: activeTab === 'tarjetas' ? '3px solid #800020' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '13.5px',
              whiteSpace: 'nowrap'
            }}
          >
            <CreditCard size={16} /> Métodos de Pago
          </button>

          <button 
            onClick={() => setActiveTab('eliminar')}
            style={{
              flex: 1,
              padding: '13px 8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'eliminar' ? 600 : 500,
              color: activeTab === 'eliminar' ? '#B91C1C' : '#64748B',
              borderBottom: activeTab === 'eliminar' ? '3px solid #B91C1C' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '13.5px',
              whiteSpace: 'nowrap'
            }}
          >
            <Trash2 size={16} /> Eliminar Cuenta
          </button>
        </div>

        {/* Contenido de Pestañas */}
        <div style={{ padding: '24px', maxHeight: '520px', overflowY: 'auto', background: '#FAFAF9' }}>
          
          {/* TAB 1: MIS DATOS */}
          {activeTab === 'datos' && (
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {profileMsg && (
                <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} />
                  <span>{profileMsg}</span>
                </div>
              )}
              {profileError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} />
                  <span>{profileError}</span>
                </div>
              )}

              <div className="input-group">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={15} color="#800020" /> Correo Electrónico
                </label>
                <input 
                  type="email" 
                  value={user?.correo || ''} 
                  disabled 
                  style={{ background: '#F1F5F9', cursor: 'not-allowed', color: '#64748B' }}
                />
                <small style={{ color: '#94A3B8', fontSize: '11px', marginTop: '3px' }}>Tu correo es el identificador principal de tu cuenta.</small>
              </div>

              <div className="input-group">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={15} color="#800020" /> Nombre Completo
                </label>
                <input 
                  type="text" 
                  required
                  value={nombreCompleto} 
                  onChange={(e) => setNombreCompleto(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
                />
              </div>

              <div className="input-group">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={15} color="#800020" /> Teléfono Celular (9 dígitos)
                </label>
                <input 
                  type="tel" 
                  maxLength="9"
                  value={telefono} 
                  onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className="input-group">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={15} color="#800020" /> Cambiar Contraseña (Opcional)
                </label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Dejar en blanco si deseas mantener la actual"
                />
              </div>

              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="submit" 
                  className="primary-action-btn"
                  disabled={loadingProfile}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#800020', color: '#FFF' }}
                >
                  <Save size={16} />
                  <span>{loadingProfile ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MIS COMPRAS */}
          {activeTab === 'compras' && (
            <div>
              {loadingCompras ? (
                <div style={{ textAlign: 'center', padding: '36px' }}>
                  <Search size={30} color="#800020" style={{ animation: 'spin 2s linear infinite', margin: '0 auto' }} />
                  <p style={{ marginTop: '10px', color: '#64748B', fontSize: '13px' }}>Consultando tu historial de compras...</p>
                </div>
              ) : comprasError ? (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
                  {comprasError}
                </div>
              ) : compras.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <Package size={44} color="#CBD5E1" style={{ margin: '0 auto' }} />
                  <h4 style={{ color: '#475569', marginTop: '12px', fontSize: '16px' }}>Aún no tienes compras realizadas</h4>
                  <p style={{ color: '#94A3B8', fontSize: '13px', marginTop: '6px' }}>Explora nuestro catálogo para encontrar novedades y promociones exclusivas.</p>
                </div>
              ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {compras.map((compra) => {
                      const diasTranscurridos = Math.floor((new Date() - new Date(compra.fechaHora)) / (1000 * 60 * 60 * 24));
                      const diasRestantes = Math.max(0, 5 - diasTranscurridos);
                      const entregaTexto = diasRestantes === 0 
                        ? '¡Tu pedido ha llegado a destino!' 
                        : diasRestantes === 1 
                          ? 'Entrega estimada: ¡Llega mañana!' 
                          : `Entrega estimada en ${diasRestantes} días`;

                      return (
                        <div 
                          key={compra.id} 
                          style={{ 
                            border: '1px solid #E2E8F0', 
                            borderRadius: '12px', 
                            padding: '16px 18px', 
                            background: '#FFFFFF',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ flex: 1, minWidth: '240px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <span style={{ fontWeight: '700', color: '#1E293B', fontSize: '15px' }}>
                                  Pedido #{compra.id}
                                </span>
                                <span style={{ 
                                  background: compra.estado === 'Completada' ? '#DEF7EC' : '#FEF3C7', 
                                  color: compra.estado === 'Completada' ? '#03543F' : '#92400E', 
                                  padding: '2px 8px', 
                                  borderRadius: '12px', 
                                  fontSize: '11px', 
                                  fontWeight: '600' 
                                }}>
                                  {compra.estado}
                                </span>
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', color: '#64748B', fontSize: '12.5px', marginBottom: '8px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Calendar size={13} color="#800020" /> {new Date(compra.fechaHora).toLocaleDateString()}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <MapPin size={13} color="#800020" /> {compra.metodoEntrega}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Receipt size={13} color="#800020" /> {compra.comprobante}: {compra.numeroComprobante || `SJ-${String(compra.id).padStart(6, '0')}`}
                                </span>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '18px', fontWeight: '800', color: '#800020' }}>
                                S/ {Number(compra.total).toFixed(2)}
                              </div>
                              <small style={{ color: '#94A3B8', fontSize: '11px' }}>Total Pagado</small>
                            </div>
                          </div>

                          {/* Estado dinámico de Delivery con cuenta regresiva */}
                          {compra.metodoEntrega === 'Delivery' && (
                            <div style={{ marginTop: '10px', padding: '10px 14px', background: '#FFFBEB', borderRadius: '8px', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clock size={16} color="#B45309" />
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400E' }}>
                                  {entregaTexto}
                                </span>
                              </div>
                              <span style={{ fontSize: '11.5px', color: '#78350F' }}>
                                {compra.direccionEnvio || 'Dirección de envío'} {compra.distritoEnvio ? `(${compra.distritoEnvio})` : ''}
                              </span>
                            </div>
                          )}

                          {/* Botón de Descarga de Comprobante Oficial */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                            <button
                              type="button"
                              onClick={() => handleDownloadReceipt(compra)}
                              style={{
                                background: '#FFF',
                                border: '1.5px solid #800020',
                                color: '#800020',
                                borderRadius: '6px',
                                padding: '6px 14px',
                                fontSize: '12.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.background = '#800020'; e.currentTarget.style.color = '#FFF'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = '#FFF'; e.currentTarget.style.color = '#800020'; }}
                            >
                              <Download size={14} /> Descargar Comprobante (PDF)
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
              )}
            </div>
          )}

          {/* TAB 3: MÉTODOS DE PAGO */}
          {activeTab === 'tarjetas' && (
            <div>
              {cardMsg && (
                <div style={{ 
                  background: cardMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2', 
                  border: `1px solid ${cardMsg.type === 'success' ? '#6EE7B7' : '#FCA5A5'}`, 
                  color: cardMsg.type === 'success' ? '#065F46' : '#991B1B', 
                  padding: '10px 14px', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  marginBottom: '16px',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  {cardMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                  <span>{cardMsg.text}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#1E293B', fontWeight: 600 }}>Tus Tarjetas Vinculadas</h4>
                  <small style={{ color: '#64748B', fontSize: '12px' }}>Tarjetas de débito o crédito para compras rápidas</small>
                </div>
                {!showAddCard && (
                  <button 
                    type="button"
                    onClick={() => setShowAddCard(true)}
                    style={{
                      background: '#800020',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={15} /> Agregar Tarjeta
                  </button>
                )}
              </div>

              {/* Formulario Agregar Tarjeta */}
              {showAddCard && (
                <form onSubmit={handleAddCard} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                  <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#800020', fontWeight: 600 }}>Nueva Tarjeta de Débito/Crédito</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="input-group">
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>Nombre del Titular</label>
                      <input 
                        type="text" 
                        required 
                        value={newCard.titular}
                        onChange={(e) => setNewCard({ ...newCard, titular: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') })}
                      />
                    </div>
                    <div className="input-group">
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>Número de Tarjeta (16 dígitos)</label>
                      <input 
                        type="text" 
                        required 
                        maxLength="19"
                        value={newCard.numero}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                          setNewCard({ ...newCard, numero: v });
                        }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <div className="input-group">
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>Mes Exp.</label>
                        <select 
                          value={newCard.mes} 
                          onChange={(e) => setNewCard({ ...newCard, mes: e.target.value })}
                          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                        >
                          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                      <div className="input-group">
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>Año Exp.</label>
                        <select 
                          value={newCard.anio} 
                          onChange={(e) => setNewCard({ ...newCard, anio: e.target.value })}
                          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                        >
                          {[2026, 2027, 2028, 2029, 2030, 2031, 2032].map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      <div className="input-group">
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>CVV</label>
                        <input 
                          type="password" 
                          maxLength="4" 
                          required 
                          value={newCard.cvv}
                          onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '') })}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                      <button 
                        type="button" 
                        onClick={() => setShowAddCard(false)}
                        style={{ background: '#F1F5F9', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#475569' }}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        style={{ background: '#800020', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                      >
                        Guardar Tarjeta
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {loadingCards ? (
                <p style={{ textAlign: 'center', color: '#64748B', fontSize: '13px' }}>Cargando tarjetas...</p>
              ) : tarjetas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', background: '#FFFFFF', borderRadius: '12px', border: '1.5px dashed #CBD5E1' }}>
                  <CreditCard size={32} color="#94A3B8" style={{ margin: '0 auto 8px auto' }} />
                  <p style={{ margin: 0, color: '#64748B', fontSize: '13px' }}>No tienes tarjetas registradas.</p>
                  <small style={{ color: '#94A3B8' }}>Agrega una tarjeta para agilizar tus compras en línea.</small>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tarjetas.map(card => (
                    <div 
                      key={card.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '14px 18px', 
                        background: '#FFFFFF', 
                        borderRadius: '12px', 
                        border: '1.5px solid #E2E8F0',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ background: '#FFF1F2', padding: '10px', borderRadius: '8px', color: '#800020' }}>
                          <CreditCard size={22} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#1E293B', display: 'block' }}>
                            •••• •••• •••• {card.ultimosDigitos}
                          </strong>
                          <small style={{ color: '#64748B', fontSize: '12px' }}>
                            Titular: {card.titular} | Expira: {card.mesExpiracion}/{card.anioExpiracion}
                          </small>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleDeleteCard(card.id)}
                        title="Eliminar método de pago"
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '6px' }}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ELIMINAR CUENTA */}
          {activeTab === 'eliminar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                background: '#FEF2F2', 
                border: '1px solid #FCA5A5', 
                borderRadius: '12px', 
                padding: '16px', 
                display: 'flex', 
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <Trash2 size={24} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#991B1B', fontSize: '15px', fontWeight: 600 }}>Desactivación de Cuenta</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#7F1D1D', lineHeight: 1.5 }}>
                    Al confirmar la baja de tu cuenta, tu usuario se desactivará en nuestro sistema. Ya no podrás acceder con tus credenciales actuales.
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#991B1B' }}>
                    * Los comprobantes de compras anteriores se mantendrán archivados de acuerdo con la normativa tributaria.
                  </p>
                </div>
              </div>

              {confirmDelete && (
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '14px', borderRadius: '10px', fontSize: '13px', color: '#92400E' }}>
                  <strong>¿Deseas confirmar la baja?</strong> Esta acción cerrará tu sesión activa y desactivará tu cuenta.
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                {confirmDelete ? (
                  <>
                    <button 
                      type="button" 
                      onClick={() => setConfirmDelete(false)}
                      style={{ background: '#E2E8F0', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      style={{ background: '#DC2626', color: '#FFF', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                    >
                      {deleting ? 'Procesando...' : 'Confirmar y Dar de Baja'}
                    </button>
                  </>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setConfirmDelete(true)}
                    style={{ background: '#DC2626', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Trash2 size={16} /> Dar de Baja Mi Cuenta
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

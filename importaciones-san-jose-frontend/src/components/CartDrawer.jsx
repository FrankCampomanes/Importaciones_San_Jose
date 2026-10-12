import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CreditCard,
  CheckCircle2,
  Building2,
  Truck,
  AlertCircle,
  Tag,
  Gift,
  QrCode,
  ArrowLeft,
  Download
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { resolveProductImage } from '../utils/imageUtils';

export default function CartDrawer({ selectedSede, sedes, onOpenAuth, onOpenMyPurchases }) {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    getItemPricing
  } = useCart();
  const { user, token } = useAuth();

  const [step, setStep] = useState('cart'); // 'cart', 'checkout', 'success'
  const [metodoEntrega, setMetodoEntrega] = useState('Recojo en Tienda');
  const [tipoComprobante, setTipoComprobante] = useState('Boleta');
  const [numDocumento, setNumDocumento] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [direccionEnvio, setDireccionEnvio] = useState(user?.direccion || 'Av. Principal 123');
  const [distritoEnvio, setDistritoEnvio] = useState(user?.distrito || 'Puente Piedra');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [validationMsg, setValidationMsg] = useState(null);
  const [metodoPago, setMetodoPago] = useState('Tarjeta'); // 'Tarjeta' o 'Yape'

  // Sede vinculada estrictamente al inventario y reserva del producto
  const activeItemSede = items.find(i => i.sedeId);
  const resolvedSedeId = activeItemSede?.sedeId || selectedSede?.id || (sedes && sedes.length > 0 ? sedes[0].id : 1);
  const resolvedSedeObj = (sedes && sedes.length > 0)
    ? sedes.find(s => Number(s.id) === Number(resolvedSedeId))
    : null;
  const resolvedSedeNombre = activeItemSede?.sedeNombre || resolvedSedeObj?.nombreSede || selectedSede?.nombreSede || 'Sede Puente Piedra (Principal)';
  const resolvedSedeDireccion = resolvedSedeObj?.direccion
    ? `${resolvedSedeObj.direccion} (${resolvedSedeObj.distrito})`
    : (resolvedSedeObj?.distrito || (resolvedSedeNombre.includes('Puente Piedra') ? 'Mza. B Lote 9, Coop. San Lorenzo (Puente Piedra)' : ''));

  // Estados de Tarjeta (Culqi Sandbox)
  const [cardNum, setCardNum] = useState('4111 2222 3333 4444');
  const [cardHolder, setCardHolder] = useState(user?.nombreCompleto || 'CLIENTE REGISTRADO');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  // Estados de Yape Oficial (Celular + OTP 6 dígitos)
  const [yapePhone, setYapePhone] = useState(user?.telefono || '987654321');
  const [yapeUseOtherPhone, setYapeUseOtherPhone] = useState(false);
  const [yapeOtp, setYapeOtp] = useState('123456');

  if (!isCartOpen) return null;

  // Reglas de negocio confirmadas:
  // Delivery: mínimo S/ 20.00. Si es < 60 se cobra S/ 2.00. A partir de S/ 60.00 es GRATIS.
  let costoEnvio = 0;
  if (metodoEntrega === 'Delivery') {
    costoEnvio = subtotal >= 60 ? 0 : 2.00;
  }
  const total = subtotal + costoEnvio;

  const handleStartCheckout = () => {
    // Si no está registrado o logueado, se abre el modal de autenticación obligatoria
    if (!user) {
      onOpenAuth();
      return;
    }

    // Un administrador no puede comprar
    if (user.rol === 'Admin') {
      setValidationMsg('Para realizar compras, inicia sesión como Cliente');
      return;
    }

    // Validación de pedido mínimo para delivery
    if (metodoEntrega === 'Delivery' && subtotal < 20) {
      setValidationMsg('El monto mínimo para solicitar Delivery es de S/ 20.00. Por favor agrega más productos al carrito.');
      return;
    }

    setValidationMsg(null);
    setNumDocumento(tipoComprobante === 'Factura' ? '20607725731' : '72849102');
    if (user?.nombreCompleto) setCardHolder(user.nombreCompleto.toUpperCase());
    if (user?.telefono) setYapePhone(user.telefono);
    if (!direccionEnvio) setDireccionEnvio(user?.direccion || 'Av. Principal 123');
    if (!distritoEnvio) setDistritoEnvio(resolvedSedeObj?.distrito || user?.distrito || 'Puente Piedra');
    setStep('checkout');
  };

  const handleProcessOrder = async (e) => {
    e.preventDefault();
    setValidationMsg(null);

    if (metodoEntrega === 'Delivery' && subtotal < 20) {
      setValidationMsg('El monto mínimo para Delivery es de S/ 20.00.');
      return;
    }

    setLoading(true);

    const activeItemSedeId = items.length > 0 && items[0].sedeId ? items[0].sedeId : (selectedSede?.id || 1);

    const payload = {
      sedeId: activeItemSedeId,
      metodoPagoId: metodoPago === 'Yape' ? 2 : 1,
      metodoEntrega,
      comprobante: tipoComprobante,
      numDocumentoCliente: numDocumento || (tipoComprobante === 'Factura' ? '20607725731' : '72849102'),
      razonSocialCliente: tipoComprobante === 'Factura' ? (razonSocial || user?.nombreCompleto) : null,
      direccionEnvio: metodoEntrega === 'Delivery' ? direccionEnvio : null,
      distritoEnvio: metodoEntrega === 'Delivery' ? distritoEnvio : null,

      // Datos de procesamiento bancario (Culqi Sandbox / Yape Oficial)
      tipoPago: metodoPago === 'Yape' ? 'YAPE' : 'TARJETA',
      numeroTarjeta: metodoPago === 'Tarjeta' ? cardNum.replace(/\s/g, '') : null,
      mesExpiracion: metodoPago === 'Tarjeta' ? (cardExpiry.includes('/') ? cardExpiry.split('/')[0] : '12') : null,
      anioExpiracion: metodoPago === 'Tarjeta' ? (cardExpiry.includes('/') ? (cardExpiry.split('/')[1].length === 2 ? '20' + cardExpiry.split('/')[1] : cardExpiry.split('/')[1]) : '2028') : null,
      cvv: metodoPago === 'Tarjeta' ? cardCvv : null,
      titularTarjeta: metodoPago === 'Tarjeta' ? cardHolder : null,
      yapeTelefono: metodoPago === 'Yape' ? yapePhone : null,
      yapeOtp: metodoPago === 'Yape' ? yapeOtp : null,
      codigoOperacion: metodoPago === 'Yape' ? yapeOtp : null,

      items: items.map(i => ({
        productoId: i.id,
        cantidad: i.cantidad
      }))
    };

    try {
      const res = await api.checkout(payload, token);
      // Garantizar que el Total Pagado sea EXACTO al monto presupuestado y verificado en carrito (ej: S/ 23.00)
      const finalTotal = total;
      setOrderResult({
        ...res,
        total: finalTotal,
        costoEnvio: costoEnvio,
        detalles: items.map(i => ({
          cantidad: i.cantidad,
          productoNombre: i.nombre,
          subtotal: i.precio * i.cantidad
        }))
      });
      clearCart();
      setStep('success');
    } catch (err) {
      console.error('Error al procesar compra:', err);
      setValidationMsg(err.message || 'Error al procesar el pago bancario. Por favor revisa los datos ingresados.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep('cart');
    setIsCartOpen(false);
    setOrderResult(null);
    setValidationMsg(null);
  };

  return (
    <div className="drawer-overlay non-blocking">
      <div className="cart-drawer glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header Drawer */}
        <div className="drawer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="drawer-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                title="Volver a ver mis productos seleccionados"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'background 0.2s, color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#800020'; e.currentTarget.style.background = '#F1F5F9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = 'transparent'; }}
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <ShoppingBag size={20} className="brand-red" />
            <h2 style={{ margin: 0, fontSize: '17px' }}>
              {step === 'cart' && 'Mi Carrito de Compras'}
              {step === 'checkout' && 'Finalizar Compra Segura'}
              {step === 'success' && '¡Pedido Confirmado!'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="drawer-close-btn" onClick={resetAll} title="Cerrar">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Step 1: Lista de Productos en el Carrito */}
        {step === 'cart' && (
          <>
            <div className="drawer-body">
              {validationMsg && (
                <div className="alert-warning-box">
                  <AlertCircle size={16} />
                  <span>{validationMsg}</span>
                </div>
              )}

              {items.length === 0 ? (
                <div className="cart-empty-state">
                  <div className="empty-icon-wrap">
                    <ShoppingBag size={48} />
                  </div>
                  <h3>Tu carrito está vacío</h3>
                  <p>Explora nuestro catálogo y agrega productos a tu compra.</p>
                  <button className="primary-action-btn" onClick={() => setIsCartOpen(false)}>
                    Explorar Catálogo
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {items.map(item => (
                    <div key={item.id} className="cart-item-row">
                      <div className="cart-item-thumb">
                        {(() => {
                          const imgSrc = resolveProductImage(item);
                          return (
                            <img
                              src={imgSrc}
                              alt={item.nombre}
                              className="cart-item-img"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          );
                        })()}
                        <div
                          className="cart-item-placeholder"
                          style={{ display: 'none' }}
                        >
                          SJ
                        </div>
                      </div>

                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.nombre}</h4>
                        {(item.sedeNombre || selectedSede?.nombreSede) && (
                          <div className="cart-item-sede-tag">
                            <Building2 size={11} />
                            <span>Sede: {item.sedeNombre || selectedSede?.nombreSede}</span>
                          </div>
                        )}
                        {(() => {
                          const pricing = getItemPricing ? getItemPricing(item) : { lineTotal: item.precio * item.cantidad, bonusUnits: 0, promoDescription: null };
                          return (
                            <>
                              <div className="cart-item-prices-row">
                                <span className="cart-item-unit-price">
                                  S/ {Number(pricing.effectiveUnitPrice || item.precio).toFixed(2)} c/u
                                </span>
                                {pricing.discountAmount > 0 && (
                                  <span className="cart-item-original-price">
                                    S/ {Number(item.precio).toFixed(2)}
                                  </span>
                                )}
                              </div>

                              {pricing.promoDescription && (
                                <div className="cart-item-promo-tag" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Tag size={12} color="#800020" />
                                  <span>{pricing.promoDescription}</span>
                                </div>
                              )}

                              {pricing.bonusUnits > 0 && (
                                <div className="cart-item-bonus-tag" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Gift size={12} color="#15803D" />
                                  <span>+{pricing.bonusUnits} unidad(es) de regalo gratis</span>
                                </div>
                              )}

                              <div className="cart-item-actions">
                                <div className="qty-selector">
                                  <button onClick={() => updateQuantity(item.id, -1)}>
                                    <Minus size={14} />
                                  </button>
                                  <span>{item.cantidad}</span>
                                  <button onClick={() => updateQuantity(item.id, 1)}>
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <span className="cart-item-total">
                                  S/ {pricing.lineTotal.toFixed(2)}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                      <button
                        className="remove-item-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="drawer-footer">
                {/* Selector Rápido de Modalidad para cálculo de delivery */}
                <div className="modalidad-preview-box">
                  <span className="modalidad-label">Modalidad de entrega:</span>
                  <div className="doc-type-toggle">
                    <button
                      type="button"
                      className={metodoEntrega === 'Recojo en Tienda' ? 'active' : ''}
                      onClick={() => setMetodoEntrega('Recojo en Tienda')}
                    >
                      Recojo en Tienda (Gratis)
                    </button>
                    <button
                      type="button"
                      className={metodoEntrega === 'Delivery' ? 'active' : ''}
                      onClick={() => setMetodoEntrega('Delivery')}
                    >
                      Delivery {subtotal >= 60 ? '(Gratis)' : '(+S/ 2.00)'}
                    </button>
                  </div>
                  {metodoEntrega === 'Delivery' && subtotal < 20 && (
                    <small className="text-warning-sub">
                      * Mínimo de compra para delivery: S/ 20.00
                    </small>
                  )}
                  {metodoEntrega === 'Delivery' && subtotal >= 20 && subtotal < 60 && (
                    <small className="text-info-sub">
                      * ¡Agrega S/ {(60 - subtotal).toFixed(2)} más para obtener Delivery Gratis!
                    </small>
                  )}
                  {metodoEntrega === 'Delivery' && subtotal >= 60 && (
                    <small className="text-success-sub">
                      * ¡Genial! Tu pedido califica para Delivery Gratis (pedido ≥ S/ 60.00).
                    </small>
                  )}
                </div>

                <div className="cart-summary-box">
                  <div className="summary-row">
                    <span>Subtotal ({items.length} artículos)</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  {metodoEntrega === 'Delivery' && (
                    <div className="summary-row">
                      <span>Costo de Envío</span>
                      <span>{costoEnvio === 0 ? 'Gratis (S/ 0.00)' : 'S/ 2.00'}</span>
                    </div>
                  )}
                  <div className="summary-row total-highlight">
                    <span>Total Estimado</span>
                    <span>S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                {user?.rol === 'Admin' && (
                  <div className="alert-warning-box" style={{ background: '#FEF3C7', border: '1.5px solid #F59E0B', color: '#92400E', margin: '10px 0' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>Para realizar compras, inicia sesión como Cliente</span>
                  </div>
                )}

                <button
                  className="checkout-btn"
                  onClick={handleStartCheckout}
                  disabled={user?.rol === 'Admin'}
                  style={user?.rol === 'Admin' ? { opacity: 0.7, cursor: 'not-allowed', background: '#94A3B8' } : {}}
                >
                  <span>{user?.rol === 'Admin' ? 'Para realizar compras, inicia sesión como Cliente' : (user ? 'Continuar al Pago' : 'Iniciar Sesión para Comprar')}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Step 2: Checkout Form */}
        {step === 'checkout' && (
          <form className="drawer-body checkout-form" onSubmit={handleProcessOrder}>
            {validationMsg && (
              <div className="alert-warning-box">
                <AlertCircle size={16} />
                <span>{validationMsg}</span>
              </div>
            )}

            <div className="checkout-section">
              <label className="section-label">1. Modalidad de Entrega</label>
              <div className="delivery-options-grid">
                <label className={`option-card ${metodoEntrega === 'Recojo en Tienda' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="entrega"
                    checked={metodoEntrega === 'Recojo en Tienda'}
                    onChange={() => setMetodoEntrega('Recojo en Tienda')}
                  />
                  <Building2 size={20} />
                  <div>
                    <strong>Recojo en Tienda (Gratis)</strong>
                    <small>En nuestras sedes</small>
                  </div>
                </label>
                <label className={`option-card ${metodoEntrega === 'Delivery' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="entrega"
                    checked={metodoEntrega === 'Delivery'}
                    onChange={() => setMetodoEntrega('Delivery')}
                  />
                  <Truck size={20} />
                  <div>
                    <strong>Delivery {costoEnvio === 0 ? '(Gratis)' : '(+S/ 2.00)'}</strong>
                    <small>Mínimo S/ 20. Gratis a partir de S/ 60</small>
                  </div>
                </label>
              </div>

              {metodoEntrega === 'Recojo en Tienda' && (
                <div className="pickup-sede-confirmed-box mt-2">
                  <div className="pickup-sede-header-row">
                    <Building2 size={16} className="brand-red" />
                    <span className="pickup-sede-title">Sede de recojo confirmada para tu pedido:</span>
                  </div>
                  <div className="pickup-sede-details">
                    <strong className="pickup-sede-name">{resolvedSedeNombre}</strong>
                    {resolvedSedeDireccion && (
                      <span className="pickup-sede-address">{resolvedSedeDireccion}</span>
                    )}
                  </div>
                  <div className="pickup-sede-badge-sync">
                    <CheckCircle2 size={13} />
                    <span>Inventario y disponibilidad verificados en esta sede</span>
                  </div>
                </div>
              )}

              {metodoEntrega === 'Delivery' && (
                <div className="delivery-inputs mt-2">
                  <div className="input-group">
                    <label>Dirección de Envío</label>
                    <input
                      type="text"
                      required
                      value={direccionEnvio}
                      onChange={(e) => setDireccionEnvio(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Distrito</label>
                    <input
                      type="text"
                      required
                      value={distritoEnvio}
                      onChange={(e) => setDistritoEnvio(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-section">
              <label className="section-label">2. Comprobante de Pago Electrónico</label>
              <div className="doc-type-toggle">
                <button
                  type="button"
                  className={tipoComprobante === 'Boleta' ? 'active' : ''}
                  onClick={() => setTipoComprobante('Boleta')}
                >
                  Boleta de Venta
                </button>
                <button
                  type="button"
                  className={tipoComprobante === 'Factura' ? 'active' : ''}
                  onClick={() => setTipoComprobante('Factura')}
                >
                  Factura (con RUC)
                </button>
              </div>

              <div className="input-group mt-2">
                <label>{tipoComprobante === 'Boleta' ? 'Documento de Identidad (DNI - 8 dígitos)' : 'Número de RUC Oficial (11 dígitos)'}</label>
                <input
                  type="text"
                  required
                  maxLength={tipoComprobante === 'Boleta' ? 8 : 11}
                  value={numDocumento}
                  onChange={(e) => setNumDocumento(e.target.value.replace(/\D/g, ''))}
                  style={{
                    borderColor: (tipoComprobante === 'Factura' && numDocumento && numDocumento.length !== 11) || (tipoComprobante === 'Boleta' && numDocumento && numDocumento.length !== 8) ? '#DC2626' : undefined
                  }}
                />
                {tipoComprobante === 'Factura' && numDocumento && numDocumento.length < 11 && (
                  <small style={{ color: '#DC2626', fontSize: '11.5px', marginTop: '3px', display: 'block' }}>
                    * El RUC debe contener exactamente 11 dígitos numéricos (faltan {11 - numDocumento.length}).
                  </small>
                )}
                {tipoComprobante === 'Boleta' && numDocumento && numDocumento.length < 8 && (
                  <small style={{ color: '#DC2626', fontSize: '11.5px', marginTop: '3px', display: 'block' }}>
                    * El DNI debe contener exactamente 8 dígitos numéricos (faltan {8 - numDocumento.length}).
                  </small>
                )}
              </div>

              {tipoComprobante === 'Factura' && (
                <div className="input-group mt-2">
                  <label>Razón Social</label>
                  <input
                    type="text"
                    required
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="checkout-section">
              <label className="section-label">3. Método de Pago</label>
              <div className="doc-type-toggle" style={{ marginBottom: '15px' }}>
                <button
                  type="button"
                  className={metodoPago === 'Tarjeta' ? 'active' : ''}
                  onClick={() => setMetodoPago('Tarjeta')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <CreditCard size={15} /> Tarjeta de Débito/Crédito
                </button>
                <button
                  type="button"
                  className={metodoPago === 'Yape' ? 'active' : ''}
                  onClick={() => setMetodoPago('Yape')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <QrCode size={15} /> Yape / Plin (QR Oficial)
                </button>
              </div>

              {metodoPago === 'Tarjeta' ? (
                <div className="payment-card-box" style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <CreditCard size={18} className="brand-red" />
                    <strong style={{ fontSize: '14px', color: '#1E293B' }}>Tarjeta de Débito o Crédito</strong>
                  </div>

                  {/* Formulario de Tarjeta */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="input-group">
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>Número de Tarjeta</label>
                      <input
                        type="text"
                        required
                        maxLength="19"
                        value={cardNum}
                        onChange={(e) => setCardNum(e.target.value)}
                        style={{ letterSpacing: '2px', fontWeight: 600 }}
                      />
                    </div>

                    <div className="input-group">
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>Nombre del Titular</label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="input-group">
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>Vencimiento (MM/AA)</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/AA"
                          maxLength="5"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          style={{ textAlign: 'center' }}
                        />
                      </div>
                      <div className="input-group">
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>CVV</label>
                        <input
                          type="password"
                          required
                          maxLength="4"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          style={{ textAlign: 'center', letterSpacing: '2px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="yape-payment-box" style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <QrCode size={18} style={{ color: '#742284' }} />
                    <strong style={{ fontSize: '14px', color: '#742284' }}>Yape</strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Opción de Celular */}
                    <div className="input-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>Número de Celular</label>
                        <label style={{ fontSize: '11.5px', color: '#800020', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                          <input
                            type="checkbox"
                            checked={yapeUseOtherPhone}
                            onChange={(e) => {
                              setYapeUseOtherPhone(e.target.checked);
                              if (!e.target.checked && user?.telefono) setYapePhone(user.telefono);
                            }}
                          />
                          Pagar con otro número
                        </label>
                      </div>

                      <input
                        type="text"
                        required
                        maxLength="9"
                        value={yapePhone}
                        disabled={!yapeUseOtherPhone}
                        onChange={(e) => setYapePhone(e.target.value.replace(/\D/g, ''))}
                        style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          letterSpacing: '1px',
                          background: !yapeUseOtherPhone ? '#F1F5F9' : '#FFF'
                        }}
                      />
                    </div>

                    {/* Código OTP de 6 dígitos */}
                    <div className="input-group">
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>
                        Código de Aprobación Yape
                      </label>
                      <small style={{ color: '#64748B', fontSize: '11.5px', display: 'block', marginBottom: '4px' }}>
                        Obtenlo en tu App Yape &gt; Menú &gt; Código de aprobación
                      </small>
                      <input
                        type="text"
                        required
                        maxLength="6"
                        value={yapeOtp}
                        onChange={(e) => setYapeOtp(e.target.value.replace(/\D/g, ''))}
                        style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '18px', fontWeight: 700, color: '#742284' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-summary-box">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Costo de Envío</span>
                <span>{costoEnvio === 0 ? 'Gratis (S/ 0.00)' : 'S/ 2.00'}</span>
              </div>
              <div className="summary-row total-highlight">
                <span>Total a Pagar</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="checkout-actions">
              <button type="button" className="btn-secondary-link" onClick={() => setStep('cart')}>
                Volver al carrito
              </button>
              <button
                type="submit"
                className="checkout-btn"
                disabled={loading || (metodoPago === 'Yape' && (!yapeOtp || yapeOtp.trim().length < 6))}
              >
                {loading ? 'Procesando Transacción...' : (metodoPago === 'Yape' ? `Confirmar Pago Yape S/ ${total.toFixed(2)}` : `Pagar S/ ${total.toFixed(2)}`)}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Voucher */}
        {step === 'success' && orderResult && (
          <div className="drawer-body order-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={56} className="text-green" />
            </div>
            <h3>¡Compra Completada con Éxito!</h3>
            <p>Se ha generado tu comprobante de pago oficial de Importaciones San José.</p>

            <div className="voucher-card">
              <div className="voucher-header">
                <strong>GRUPO IMPORTACIONES SAN JOSÉ S.R.L.</strong>
                <small>RUC 20607725731</small>
                <span>{orderResult.comprobante}: {orderResult.numeroComprobante}</span>
              </div>
              <div className="voucher-divider"></div>
              <div className="voucher-details">
                <div><span>Cliente / Doc:</span> <strong>{orderResult.numDocumentoCliente}</strong></div>
                <div><span>Modalidad:</span> <strong>{orderResult.metodoEntrega}</strong></div>
                {orderResult.metodoEntrega === 'Recojo en Tienda' && (
                  <div><span>Sede:</span> <strong>{selectedSede?.nombreSede || 'Sede Principal'}</strong></div>
                )}
                <div><span>Total Pagado:</span> <strong className="voucher-total">S/ {Number(orderResult.total).toFixed(2)}</strong></div>
              </div>
            </div>

            <div className="success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="primary-action-btn full-width"
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (!printWindow) {
                    alert('Por favor permite ventanas emergentes para descargar tu comprobante.');
                    return;
                  }
                  const deliveryFee = orderResult.metodoEntrega === 'Delivery' ? Number(orderResult.costoEnvio ?? costoEnvio) : 0;
                  const finalTotal = Number(orderResult.total);
                  const productsTotal = Math.max(0, finalTotal - deliveryFee);
                  const subtotalCalc = (productsTotal / 1.18).toFixed(2);
                  const igvCalc = (productsTotal - Number(subtotalCalc)).toFixed(2);

                  printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="utf-8">
                      <title>Comprobante ${orderResult.comprobante} - ${orderResult.numeroComprobante}</title>
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
                        @media print { .no-print { display: none; } }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <div class="company-name">IMPORTACIONES SAN JOSÉ</div>
                        <div class="company-sub">Bazar, Hogar, Juguetes & Novedades • RUC: 20607725731</div>
                        <div class="company-sub">Lima Norte y Callao • Teléfono: 926 577 602</div>
                      </div>
                      <div class="doc-box">
                        <div class="doc-type">${orderResult.comprobante === 'Factura' ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA'}</div>
                        <div class="doc-num">${orderResult.numeroComprobante || `SJ-${String(orderResult.id).padStart(6, '0')}`}</div>
                      </div>
                      <div class="info-grid">
                        <div class="info-item"><strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}</div>
                        <div class="info-item"><strong>Modalidad:</strong> ${orderResult.metodoEntrega}</div>
                        <div class="info-item"><strong>Cliente:</strong> ${orderResult.razonSocialCliente || user?.nombreCompleto || 'Cliente'}</div>
                        <div class="info-item"><strong>Documento:</strong> ${orderResult.numDocumentoCliente}</div>
                      </div>
                      <table>
                        <thead>
                          <tr><th>Cant.</th><th>Descripción</th><th style="text-align: right;">Total (S/.)</th></tr>
                        </thead>
                        <tbody>
                          ${orderResult.detalles && orderResult.detalles.length > 0 ? orderResult.detalles.map(d => `
                            <tr><td>${d.cantidad}</td><td>${d.productoNombre}</td><td style="text-align: right;">${Number(d.subtotal).toFixed(2)}</td></tr>
                          `).join('') : `
                            <tr><td>1</td><td>Compra de Artículos seleccionados</td><td style="text-align: right;">${Number(productsTotal).toFixed(2)}</td></tr>
                          `}
                        </tbody>
                      </table>
                      <div class="totals">
                        <div class="totals-row"><span>Op. Gravada:</span><span>S/ ${subtotalCalc}</span></div>
                        <div class="totals-row"><span>I.G.V. (18%):</span><span>S/ ${igvCalc}</span></div>
                        ${deliveryFee > 0 ? `<div class="totals-row"><span>Costo de Envío:</span><span>S/ ${deliveryFee.toFixed(2)}</span></div>` : ''}
                        <div class="totals-row totals-total"><span>TOTAL:</span><span>S/ ${finalTotal.toFixed(2)}</span></div>
                      </div>
                      <div class="footer">
                        <p>Representación impresa del Comprobante de Pago Electrónico.</p>
                        <p>¡Gracias por tu compra en Importaciones San José!</p>
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
                }}
                style={{
                  background: '#800020',
                  color: '#FFF',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Download size={16} /> Descargar Comprobante PDF
              </button>

              <button
                type="button"
                className="btn-secondary-link full-width"
                onClick={onOpenMyPurchases}
                style={{
                  background: '#FEF3C7',
                  color: '#92400E',
                  border: '1.5px solid #FDE68A',
                  padding: '11px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Ver Mis Compras en Mi Perfil
              </button>

              <button
                type="button"
                className="btn-secondary-link full-width"
                onClick={resetAll}
                style={{
                  background: '#F1F5F9',
                  color: '#475569',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Seguir Comprando en el Catálogo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

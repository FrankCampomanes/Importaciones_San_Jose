import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, QrCode, MapPin, Truck, Tag, Gift, Percent, Share2, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { promotionsService } from '../services/promotions';
import { api } from '../services/api';

const DEFAULT_STOCKS_FALLBACK = { 1: 15, 2: 12, 3: 8, 4: 10, 5: 14 };

const SEDES_FALLBACK = [
  { id: 1, nombreSede: 'Sede Puente Piedra (Principal)', distrito: 'Puente Piedra' },
  { id: 2, nombreSede: 'Sede Los Olivos', distrito: 'Los Olivos' },
  { id: 3, nombreSede: 'Sede Los Olivos - Villasol', distrito: 'Los Olivos' },
  { id: 4, nombreSede: 'Sede Ventanilla - Pachacútec', distrito: 'Ventanilla' },
  { id: 5, nombreSede: 'Sede Comas - Collique', distrito: 'Comas' }
];

export default function ProductModal({ product, onClose, selectedSede, sedes = [], onSelectSede }) {
  const { addToCart, getItemPricing } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [inventoryList, setInventoryList] = useState([]);
  const [activeSede, setActiveSede] = useState(selectedSede || null);
  const [sedeErrorPrompt, setSedeErrorPrompt] = useState(false);

  // Lista unificada y garantizada de las 5 sedes
  const branchList = (sedes && sedes.length > 0) ? sedes : SEDES_FALLBACK;

  useEffect(() => {
    // Si viene una sede desde el filtro del encabezado, seleccionarla de inmediato
    setActiveSede(selectedSede || null);
    setQuantity(1);
    setSedeErrorPrompt(false);

    if (product?.id) {
      api.getInventoryByProduct(product.id)
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setInventoryList(data);
          }
        })
        .catch(err => {
          console.warn('Consulta de inventario fallida, usando valores de tienda:', err);
        });
    }
  }, [product, selectedSede]);

  if (!product) return null;

  // Obtener stock real o predeterminado para una sede
  const getBranchStock = (sedeId) => {
    const inv = inventoryList.find(i => i.sedeId === sedeId);
    if (inv && typeof inv.stockActual === 'number') {
      return inv.stockActual;
    }
    return DEFAULT_STOCKS_FALLBACK[sedeId] ?? 10;
  };

  // Stock disponible en la sede actualmente seleccionada en el modal
  const currentStock = activeSede ? getBranchStock(activeSede.id) : 0;
  const isOutOfStock = Boolean(activeSede && currentStock === 0);
  const isLimitReached = Boolean(activeSede && quantity >= currentStock && currentStock > 0);

  const handleShare = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://importaciones-san-jose.vercel.app';
    const shareUrl = `${origin}/?qr=${product.codigoQr || product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.nombre} - Importaciones San José`,
          text: `Mira ${product.nombre} a solo S/ ${Number(product.precio).toFixed(2)} en Importaciones San José:`,
          url: shareUrl,
        });
        return;
      } catch (err) {}
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleChooseSede = (branch) => {
    const stock = getBranchStock(branch.id);
    if (stock <= 0) return;
    setActiveSede(branch);
    setSedeErrorPrompt(false);
    setQuantity(1);
    if (onSelectSede && !selectedSede) {
      onSelectSede(branch);
    }
  };

  const handleAdd = () => {
    if (!activeSede) {
      setSedeErrorPrompt(true);
      return;
    }
    if (isOutOfStock) return;
    addToCart(product, quantity, activeSede, currentStock);
    onClose();
  };

  const hasLocalImage = product.imagenUrl && product.imagenUrl.startsWith('/images/products/') && !imgError;
  const pricing = getItemPricing 
    ? getItemPricing({ ...product, cantidad: quantity }) 
    : { lineTotal: product.precio * quantity, promoDescription: null };

  // Consulta de promoción oficial en base de datos
  const promo = promotionsService.getForProduct(product.id);
  let promoDesc = pricing.promoDescription;
  if (!promoDesc && promo) {
    if (promo.tipo === 'descuento_directo' && promo.precioOferta) {
      promoDesc = `Precio oferta: S/ ${Number(promo.precioOferta).toFixed(2)} (Antes S/ ${Number(product.precio).toFixed(2)})`;
    } else if (promo.tipo === 'bonificacion') {
      promoDesc = `Promoción: Lleva ${promo.llevaCantidad} y recibe ${promo.regaloCantidad} de regalo gratis`;
    } else if (promo.tipo === 'descuento_volumen') {
      promoDesc = `Promoción por volumen: ${promo.porcentajeDescuento}% de descuento desde ${promo.cantidadMinima} unidades`;
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="product-modal-grid">
          {/* Imagen Grande o Placeholder Neutro */}
          <div className="product-modal-image-col">
            <div className="modal-img-container">
              {hasLocalImage || (product.imagenUrl && product.imagenUrl.startsWith('data:')) ? (
                <img
                  src={product.imagenUrl}
                  alt={product.nombre}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="modal-placeholder-clean">
                  <div className="placeholder-brand-icon lg">
                    <span>SJ</span>
                  </div>
                  <span className="placeholder-text">Fotografía en actualización física</span>
                  <span className="placeholder-brand-sub">Grupo Importaciones San José S.R.L.</span>
                </div>
              )}
            </div>
            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleShare}
                  className="btn-secondary-link"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    cursor: 'pointer'
                  }}
                  title="Compartir enlace del producto"
                >
                  <Share2 size={15} className="brand-red" />
                  <span>{copied ? '¡Enlace Copiado!' : 'Compartir Producto'}</span>
                </button>

                {product.codigoQr && (
                  <button
                    type="button"
                    onClick={() => setShowQr(!showQr)}
                    className="btn-secondary-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: showQr ? '#fee2e2' : '#f8fafc',
                      color: showQr ? '#991b1b' : '#334155',
                      cursor: 'pointer'
                    }}
                    title="Ver etiqueta QR para tienda física"
                  >
                    <QrCode size={15} />
                    <span>{showQr ? 'Ocultar QR' : 'Etiqueta QR'}</span>
                  </button>
                )}
              </div>

              {showQr && product.codigoQr && (
                <div className="modal-qr-preview" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '8px', textAlign: 'center' }}>
                    Etiqueta QR de estante para escaneo físico en sedes
                  </div>
                  <div style={{ background: '#FFF', padding: '8px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                        `${typeof window !== 'undefined' ? window.location.origin : 'https://importaciones-san-jose.vercel.app'}/?qr=${product.codigoQr}`
                      )}`}
                      alt={`QR de ${product.nombre}`}
                      style={{ width: '120px', height: '120px', display: 'block' }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Código: {product.codigoQr}</span>
                </div>
              )}
            </div>
          </div>

          {/* Detalles */}
          <div className="product-modal-details-col">
            <div className="modal-badge-row">
              <span className="category-pill">{product.categoria}</span>
              {activeSede ? (
                <span className={`stock-status-pill ${currentStock > 5 ? 'in-stock' : currentStock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                  {currentStock > 5 
                    ? `Disponibles en esta sede: ${currentStock} u.`
                    : currentStock > 0 
                      ? `¡Últimas ${currentStock} unidades disponibles!`
                      : 'Agotado en esta sede.'}
                </span>
              ) : (
                <span className="stock-status-pill choose-sede">
                  Selecciona una tienda física
                </span>
              )}
            </div>

            <h2 className="modal-product-title">{product.nombre}</h2>

            <div className="modal-price-box">
              {promo && promo.tipo === 'descuento_directo' && promo.precioOferta ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ textDecoration: 'line-through', color: '#94A3B8', fontSize: '18px' }}>
                    S/ {Number(product.precio).toFixed(2)}
                  </span>
                  <span className="modal-currency brand-red">S/</span>
                  <span className="modal-amount brand-red">{Number(promo.precioOferta).toFixed(2)}</span>
                </div>
              ) : (
                <>
                  <span className="modal-currency">S/</span>
                  <span className="modal-amount">{Number(product.precio).toFixed(2)}</span>
                </>
              )}
            </div>

            <p className="modal-product-desc">
              {product.descripcion || 'Producto garantizado de primera calidad en Grupo Importaciones San José S.R.L.'}
            </p>

            {/* Selector interactivo con atajos de tiendas físicas (Siempre visible para fácil cambio) */}
            <div className="modal-branch-selector-card">
              <div className="modal-branch-header">
                <MapPin size={15} />
                <span>📍 Disponibilidad en nuestras tiendas:</span>
              </div>
              <div className="modal-branch-chips-grid">
                {branchList.map(branch => {
                  const isSelected = activeSede?.id === branch.id;
                  const stockVal = getBranchStock(branch.id);
                  const hasStock = stockVal > 0;
                  const shortName = branch.nombreSede ? branch.nombreSede.replace(/^Sede\s+/i, '').replace(/\s*\(Principal\)/i, '') : `Tienda ${branch.id}`;
                  return (
                    <button
                      key={branch.id}
                      type="button"
                      disabled={!hasStock}
                      onClick={() => handleChooseSede(branch)}
                      className={`modal-branch-chip ${isSelected ? 'selected' : ''} ${!hasStock ? 'disabled' : ''}`}
                      title={hasStock ? `Seleccionar ${branch.nombreSede} (${stockVal} u.)` : `Agotado en ${branch.nombreSede}`}
                    >
                      <span className="chip-name">{shortName}:</span>
                      <span className={`chip-stock ${hasStock ? (stockVal > 5 ? 'good' : 'low') : 'none'}`}>
                        {hasStock ? `${stockVal} u.` : 'Agotado'}
                      </span>
                      {isSelected && <Check size={13} className="chip-check" />}
                    </button>
                  );
                })}
              </div>
              {sedeErrorPrompt && !activeSede && (
                <div className="branch-error-alert">
                  <AlertCircle size={14} />
                  <span>Por favor, elija la sede donde desea comprar para verificar disponibilidad.</span>
                </div>
              )}
            </div>

            {/* Cuadro de Beneficios y Promociones Oficiales */}
            <div className="store-benefits-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="benefit-item">
                <Truck size={18} className="brand-orange" />
                <div>
                  <strong>Modalidad Delivery o Recojo</strong>
                  <small>Delivery disponible en Lima & Callao. Envío gratis en compras desde S/ 60.00.</small>
                </div>
              </div>

              {promoDesc && (
                <div className="benefit-item" style={{ background: '#FEF2F2', borderColor: '#FCA5A5', borderLeft: '4px solid #800020' }}>
                  <Tag size={18} color="#800020" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#800020' }}>¡Promoción Especial Disponible!</strong>
                    <small style={{ color: '#4A0E17', display: 'block', marginTop: '2px', fontWeight: 500 }}>
                      {promoDesc}
                    </small>
                  </div>
                </div>
              )}
            </div>

            {/* Acciones de compra con contador y límite estricto */}
            <div className="modal-purchase-actions">
              <div className="quantity-counter-wrapper">
                <div className="quantity-counter">
                  <button 
                    type="button"
                    disabled={!activeSede || isOutOfStock || quantity <= 1} 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >-</button>
                  <span>{activeSede && !isOutOfStock ? quantity : 0}</span>
                  <button 
                    type="button"
                    disabled={!activeSede || isOutOfStock || quantity >= currentStock} 
                    onClick={() => {
                      if (quantity < currentStock) {
                        setQuantity(quantity + 1);
                      }
                    }}
                  >+</button>
                </div>

                {isLimitReached && (
                  <span className="stock-limit-note">Límite disponible alcanzado.</span>
                )}
                {activeSede && currentStock > 0 && !isLimitReached && (
                  <span className="stock-remaining-note">Quedan {currentStock - quantity} u. en esta sede</span>
                )}
              </div>

              <button 
                type="button"
                className={`primary-action-btn flex-1 ${(!activeSede || isOutOfStock) ? 'btn-disabled-friendly' : ''}`}
                onClick={handleAdd}
              >
                <ShoppingCart size={18} />
                <span>
                  {!activeSede 
                    ? 'Por favor elija una sede' 
                    : isOutOfStock 
                      ? 'Agotado en esta sede' 
                      : `Agregar S/ ${(pricing.lineTotal || product.precio * quantity).toFixed(2)} al Carrito`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

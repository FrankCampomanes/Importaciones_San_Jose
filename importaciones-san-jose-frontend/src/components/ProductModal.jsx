import React, { useState } from 'react';
import { X, ShoppingCart, QrCode, MapPin, Truck, Tag, Gift, Percent, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { promotionsService } from '../services/promotions';

export default function ProductModal({ product, onClose, selectedSede }) {
  const { addToCart, getItemPricing } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!product) return null;

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

  const hasLocalImage = product.imagenUrl && product.imagenUrl.startsWith('/images/products/') && !imgError;
  const pricing = getItemPricing ? getItemPricing({ ...product, cantidad: quantity }) : { lineTotal: product.precio * quantity, promoDescription: null };

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

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

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
              {hasLocalImage ? (
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
              <span className="stock-status-pill in-stock">
                Disponible en {selectedSede?.nombreSede || 'Tienda'}
              </span>
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

            <div className="modal-purchase-actions">
              <div className="quantity-counter">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button className="primary-action-btn flex-1" onClick={handleAdd}>
                <ShoppingCart size={18} />
                <span>Agregar S/ {(pricing.lineTotal || product.precio * quantity).toFixed(2)} al Carrito</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

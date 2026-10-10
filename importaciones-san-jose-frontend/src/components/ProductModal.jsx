import React, { useState } from 'react';
import { X, ShoppingCart, QrCode, MapPin, Truck, Tag, Gift, Percent } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { promotionsService } from '../services/promotions';

export default function ProductModal({ product, onClose, selectedSede }) {
  const { addToCart, getItemPricing } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

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
            {product.codigoQr && (
              <div className="modal-qr-preview" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '15px', padding: '15px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <QrCode size={16} className="brand-red" />
                  Escanea para ver en celular
                </h4>
                <div style={{ background: '#FFF', padding: '10px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                      `${typeof window !== 'undefined' ? window.location.origin : 'https://importaciones-san-jose.vercel.app'}/?qr=${product.codigoQr}`
                    )}`}
                    alt={`QR de ${product.nombre}`}
                    style={{ width: '120px', height: '120px', display: 'block' }}
                  />
                </div>
              </div>
            )}
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

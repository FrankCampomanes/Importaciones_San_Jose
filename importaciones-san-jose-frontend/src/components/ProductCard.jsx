import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, QrCode, Tag, Gift, Percent } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { promotionsService } from '../services/promotions';

export default function ProductCard({ product, onSelect }) {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [, setTick] = useState(0);

  // Escuchar actualizaciones dinámicas de promociones
  useEffect(() => {
    const handleUpdate = () => setTick(t => t + 1);
    window.addEventListener('promotions-updated', handleUpdate);
    return () => window.removeEventListener('promotions-updated', handleUpdate);
  }, []);

  // Consulta de promoción activa para este producto desde la base de datos
  const promo = promotionsService.getForProduct(product.id);

  // Determina si tiene imagen local real
  const hasLocalImage = product.imagenUrl && product.imagenUrl.startsWith('/images/products/') && !imgError;

  return (
    <div className={`product-card ${promo ? 'has-promotion' : ''}`}>
      {/* Badges de Categoría y Oferta */}
      <div className="card-top-badges">
        <span className="category-pill" title={product.categoria}>{product.categoria}</span>

        {/* Badge de Promoción si aplica */}
        {promo && promo.tipo === 'descuento_directo' && (
          <span className="promo-badge sale" title={promo.motivo || 'Precio rebajado'}>
            <Tag size={11} /> OFERTA
          </span>
        )}
        {promo && promo.tipo === 'bonificacion' && (
          <span className="promo-badge bonus" title={promo.motivo || `Lleva ${promo.llevaCantidad} + ${promo.regaloCantidad} gratis`}>
            <Gift size={11} /> {`LLEVA ${promo.llevaCantidad}+${promo.regaloCantidad} GRATIS`}
          </span>
        )}
        {promo && promo.tipo === 'descuento_volumen' && (
          <span className="promo-badge volume" title={promo.motivo || `Descuento a partir de ${promo.cantidadMinima} unidades`}>
            <Percent size={11} /> {`-${promo.porcentajeDescuento}% x ${promo.cantidadMinima}+ U.`}
          </span>
        )}

        {product.codigoQr && (
          <span className="qr-badge" title={`Código: ${product.codigoQr}`}>
            <QrCode size={12} />
          </span>
        )}
      </div>

      {/* Imagen del Producto */}
      <div className="card-image-wrap" onClick={() => onSelect(product)}>
        {hasLocalImage ? (
          <img 
            src={product.imagenUrl} 
            alt={product.nombre}
            className="card-image"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="card-placeholder-clean">
            <div className="placeholder-brand-icon">
              <span>SJ</span>
            </div>
            <span className="placeholder-text">Foto en actualización física</span>
            <span className="placeholder-brand-sub">Importaciones San José</span>
          </div>
        )}
        <div className="card-hover-overlay">
          <span className="quick-view-btn">
            <Eye size={16} /> Ver Detalle
          </span>
        </div>
      </div>

      {/* Información del Producto */}
      <div className="card-content">
        <h3 className="card-title" onClick={() => onSelect(product)} title={product.nombre}>
          {product.nombre}
        </h3>
        
        <p className="card-desc">
          {product.descripcion || 'Producto garantizado de Grupo Importaciones San José S.R.L.'}
        </p>

        {promo?.motivo && (
          <div className="card-promo-note">
            <Tag size={12} className="brand-red" />
            <span>{promo.motivo}</span>
          </div>
        )}

        <div className="card-footer">
          <div className="price-container">
            {promo && promo.tipo === 'descuento_directo' && promo.precioOferta ? (
              <div className="price-offer-stacked">
                <span className="price-original-striked">S/ {Number(product.precio).toFixed(2)}</span>
                <div className="price-highlight-row">
                  <span className="price-currency">S/</span>
                  <span className="price-value offer">{Number(promo.precioOferta).toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="price-regular-row">
                <span className="price-currency">S/</span>
                <span className="price-value">{Number(product.precio).toFixed(2)}</span>
              </div>
            )}
          </div>

          <button 
            className="add-to-cart-btn"
            onClick={() => addToCart(product)}
            title="Agregar al carrito"
          >
            <ShoppingCart size={16} />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { promotionsService } from '../services/promotions';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('sj_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sj_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1, sede = null, maxStock = null) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const allowedMax = maxStock || existing.maxStock || 999;
        const newQty = Math.min(existing.cantidad + quantity, allowedMax);
        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          cantidad: newQty,
          maxStock: allowedMax,
          sedeId: sede?.id || existing.sedeId,
          sedeNombre: sede?.nombreSede || existing.sedeNombre
        };
        return updated;
      }
      return [...prev, {
        ...product,
        cantidad: quantity,
        maxStock: maxStock || null,
        sedeId: sede?.id || null,
        sedeNombre: sede?.nombreSede || null
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setItems(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.cantidad + delta;
            if (newQty <= 0) return null;
            if (item.maxStock && newQty > item.maxStock) {
              return { ...item, cantidad: item.maxStock };
            }
            return { ...item, cantidad: newQty };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setItems([]);

  // Cálculo de subtotales y promociones activas
  const getItemPricing = (item) => {
    const promo = promotionsService.getForProduct(item.id);
    let effectiveUnitPrice = Number(item.precio);
    let discountAmount = 0;
    let bonusUnits = 0;
    let promoDescription = null;

    if (promo) {
      if (promo.tipo === 'descuento_directo' && promo.precioOferta) {
        effectiveUnitPrice = Number(promo.precioOferta);
        discountAmount = (Number(item.precio) - effectiveUnitPrice) * item.cantidad;
        promoDescription = promo.motivo || 'Oferta especial';
      } else if (promo.tipo === 'descuento_volumen' && item.cantidad >= (promo.cantidadMinima || 2)) {
        const pct = (promo.porcentajeDescuento || 10) / 100;
        effectiveUnitPrice = Number(item.precio) * (1 - pct);
        discountAmount = (Number(item.precio) * pct) * item.cantidad;
        promoDescription = `-${promo.porcentajeDescuento}% por ${item.cantidad} unid.`;
      } else if (promo.tipo === 'bonificacion' && promo.llevaCantidad > 0) {
        const sets = Math.floor(item.cantidad / promo.llevaCantidad);
        if (sets > 0) {
          bonusUnits = sets * (promo.regaloCantidad || 1);
          promoDescription = `¡+${bonusUnits} u. de regalo gratis!`;
        }
      }
    }

    const lineTotal = effectiveUnitPrice * item.cantidad;
    return { effectiveUnitPrice, lineTotal, discountAmount, bonusUnits, promoDescription, promo };
  };

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const subtotal = items.reduce((sum, item) => {
    const { lineTotal } = getItemPricing(item);
    return sum + lineTotal;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        getItemPricing,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

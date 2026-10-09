// src/services/promotions.js
// Servicio de gestión de promociones sincronizado 100% con MySQL y Spring Boot

import { api } from './api';

const PROMOTIONS_KEY = 'sj_promociones_activas_cache';

// Memoria caché para respuesta síncrona en renderizados de React
let promotionsCache = {};

function normalizePromo(p) {
  if (!p) return null;
  return {
    ...p,
    id: p.id,
    productoId: p.productoId,
    tipo: p.tipo,
    precioOferta: p.precioOferta != null ? Number(p.precioOferta) : null,
    porcentajeDescuento: p.descuentoPorcentaje ?? p.porcentajeDescuento,
    descuentoPorcentaje: p.descuentoPorcentaje ?? p.porcentajeDescuento,
    cantidadMinima: p.unidadesMinimas ?? p.cantidadMinima,
    unidadesMinimas: p.unidadesMinimas ?? p.cantidadMinima,
    llevaCantidad: p.unidadesLleva ?? p.llevaCantidad,
    unidadesLleva: p.unidadesLleva ?? p.llevaCantidad,
    regaloCantidad: p.unidadesGratis ?? p.regaloCantidad,
    unidadesGratis: p.unidadesGratis ?? p.regaloCantidad,
    motivo: p.motivo,
    fechaFin: p.fechaFin,
    activo: Boolean(p.activo),
    expirado: Boolean(p.expirado)
  };
}

// Inicializar caché desde almacenamiento local inicial
try {
  const local = localStorage.getItem(PROMOTIONS_KEY);
  if (local) {
    const parsed = JSON.parse(local);
    Object.keys(parsed).forEach(k => {
      promotionsCache[k] = normalizePromo(parsed[k]);
    });
  }
} catch {
  // Ignorar errores de parseo
}

export const promotionsService = {
  /**
   * Sincroniza desde el backend MySQL y actualiza el caché
   */
  async fetchFromBackend() {
    try {
      const list = await api.getPromotions();
      if (Array.isArray(list)) {
        const nextCache = {};
        list.forEach(item => {
          if (item && item.productoId) {
            nextCache[item.productoId] = normalizePromo(item);
          }
        });
        promotionsCache = nextCache;
        localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(nextCache));
        window.dispatchEvent(new Event('promotions-updated'));
        return nextCache;
      }
    } catch (err) {
      console.warn('No se pudo sincronizar promociones con backend, usando caché local:', err);
    }
    return promotionsCache;
  },

  /**
   * Obtiene todas las promociones vigentes desde el caché síncrono
   */
  getAll() {
    return promotionsCache;
  },

  /**
   * Obtiene la promoción vigente de un producto específico (si está activa y no expirada)
   */
  getForProduct(productId) {
    if (!productId) return null;
    const promo = promotionsCache[productId];
    if (!promo || !promo.activo) return null;

    if (promo.fechaFin) {
      const today = new Date().toISOString().split('T')[0];
      if (today > promo.fechaFin) return null;
    }

    return promo;
  },

  /**
   * Obtiene todas las promociones (incluyendo inactivas) para el Panel de Administrador
   */
  async getAllForAdmin(token) {
    try {
      const list = await api.getAllPromotions(token);
      return list.map(normalizePromo);
    } catch (e) {
      console.warn('Error fetching admin promotions:', e);
      // Fallback a lista del caché actual
      return Object.values(promotionsCache);
    }
  },

  /**
   * Guarda o actualiza una promoción en la Base de Datos MySQL
   */
  async saveForProduct(productId, promoData, token) {
    if (!productId) return null;

    const payload = {
      productoId: Number(productId),
      tipo: promoData.tipo,
      precioOferta: promoData.precioOferta ? Number(promoData.precioOferta) : null,
      descuentoPorcentaje: promoData.porcentajeDescuento || promoData.descuentoPorcentaje ? Number(promoData.porcentajeDescuento || promoData.descuentoPorcentaje) : null,
      unidadesMinimas: promoData.cantidadMinima || promoData.unidadesMinimas ? Number(promoData.cantidadMinima || promoData.unidadesMinimas) : null,
      unidadesLleva: promoData.llevaCantidad || promoData.unidadesLleva ? Number(promoData.llevaCantidad || promoData.unidadesLleva) : null,
      unidadesGratis: promoData.regaloCantidad || promoData.unidadesGratis ? Number(promoData.regaloCantidad || promoData.unidadesGratis) : null,
      motivo: promoData.motivo || 'Promoción comercial',
      fechaFin: promoData.fechaFin || null,
      activo: promoData.activo !== undefined ? Boolean(promoData.activo) : true
    };

    try {
      const saved = await api.savePromotion(payload, token);
      const normalized = normalizePromo(saved);
      promotionsCache[productId] = normalized;
      localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promotionsCache));
      window.dispatchEvent(new Event('promotions-updated'));
      return normalized;
    } catch (err) {
      console.error('Error guardando promoción en BD:', err);
      // Actualización optimista de contingencia
      const fallback = normalizePromo({ ...payload, id: promoData.id || Date.now() });
      promotionsCache[productId] = fallback;
      localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promotionsCache));
      window.dispatchEvent(new Event('promotions-updated'));
      return fallback;
    }
  },

  /**
   * Alterna activo/inactivo (1/0) sin borrar de la Base de Datos
   */
  async toggleActive(promoId, productId, token) {
    try {
      if (promoId) {
        const updated = await api.togglePromotion(promoId, token);
        const normalized = normalizePromo(updated);
        if (normalized.productoId) {
          promotionsCache[normalized.productoId] = normalized;
        }
        localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promotionsCache));
        window.dispatchEvent(new Event('promotions-updated'));
        return normalized;
      }
    } catch (e) {
      console.error('Error toggling promotion en BD:', e);
    }
    return null;
  },

  /**
   * Desactiva la promoción en la Base de Datos
   */
  async removeForProduct(productId, promoId, token) {
    try {
      if (promoId) {
        await api.deletePromotion(promoId, token);
      }
    } catch (e) {
      console.warn('Error desactivando promoción en backend:', e);
    }
    delete promotionsCache[productId];
    localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promotionsCache));
    window.dispatchEvent(new Event('promotions-updated'));
  }
};

// Sincronizar automáticamente en background
promotionsService.fetchFromBackend();

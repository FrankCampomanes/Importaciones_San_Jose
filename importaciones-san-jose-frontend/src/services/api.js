const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8089/api';

export const api = {
  // Productos
  async getProducts(todos = false) {
    try {
      const res = await fetch(`${API_BASE}/products${todos ? '?todos=true' : ''}`);
      if (!res.ok) throw new Error('Error al cargar productos');
      return await res.json();
    } catch (e) {
      console.warn('API error (getProducts):', e);
      return [];
    }
  },

  async getProductByQr(qr) {
    const res = await fetch(`${API_BASE}/products/qr/${qr}`);
    if (!res.ok) throw new Error('Producto no encontrado por QR');
    return await res.json();
  },

  async createProduct(product, token) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const detailsMsg = err.details ? ' -> ' + Object.entries(err.details).map(([k, v]) => `${k}: ${v}`).join('; ') : '';
      throw new Error((err.message || 'Error al registrar producto') + detailsMsg);
    }
    return await res.json();
  },

  async updateProduct(id, product, token) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const detailsMsg = err.details ? ' -> ' + Object.entries(err.details).map(([k, v]) => `${k}: ${v}`).join('; ') : '';
      throw new Error((err.message || 'Error al actualizar producto') + detailsMsg);
    }
    return await res.json();
  },

  async deleteProduct(id, token) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
    return true;
  },

  // Inventario por sedes
  async getInventoryByProduct(productId, token) {
    try {
      const res = await fetch(`${API_BASE}/inventory/product/${productId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async updateInventoryStock(productId, sedeId, stock, token) {
    const numStock = parseInt(stock, 10) || 0;
    const res = await fetch(`${API_BASE}/inventory/product/${productId}/sede/${sedeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ stockActual: numStock, nuevoStock: numStock })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error actualizando stock');
    }
    return await res.json();
  },

  async getInventoryBySede(sedeId, token) {
    try {
      const res = await fetch(`${API_BASE}/inventory/sede/${sedeId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  // Sedes
  async getSedes() {
    try {
      const res = await fetch(`${API_BASE}/sedes`);
      if (!res.ok) throw new Error('Error al cargar sedes');
      return await res.json();
    } catch (e) {
      console.warn('API error (getSedes), usando sedes fijas:', e);
      return [
        { id: 1, nombreSede: 'Sede Puente Piedra (Principal)', direccion: 'Mza. B Lote 9, Coop. San Lorenzo', distrito: 'Puente Piedra', horarioAtencion: 'Lunes a Domingo: 9:00 AM - 10:00 PM', telefono: '01-555-1001' },
        { id: 2, nombreSede: 'Sede Los Olivos', direccion: 'Av. 2 de Octubre, 3W29+CVF', distrito: 'Los Olivos', horarioAtencion: 'Lunes a Domingo: 9:00 AM - 10:00 PM', telefono: '01-555-1002' },
        { id: 3, nombreSede: 'Sede Los Olivos - Villasol', direccion: 'Av. Huandoy, Mz. J, Lote 16', distrito: 'Los Olivos', horarioAtencion: 'Lunes a Domingo: 9:00 AM - 10:00 PM', telefono: '01-555-1003' },
        { id: 4, nombreSede: 'Sede Ventanilla - Pachacútec', direccion: 'C. Piloto Pachacútec, Ventanilla 07071', distrito: 'Ventanilla', horarioAtencion: 'Lunes a Domingo: 9:00 AM - 10:00 PM', telefono: '01-555-1004' },
        { id: 5, nombreSede: 'Sede Comas - Collique', direccion: 'Av. Revolución 3.ª Zona, Mz. C1, Lote 10C', distrito: 'Comas', horarioAtencion: 'Lunes a Domingo: 9:00 AM - 10:00 PM', telefono: '01-555-1005' }
      ];
    }
  },

  // Auth
  async login(correo, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Credenciales inválidas');
    }
    return await res.json();
  },

  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error en registro');
    }
    return await res.json();
  },

  // Checkout / Venta
  async checkout(orderData, token) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error procesando la compra');
    }
    return await res.json();
  },

  async getOrders(token) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.warn('Error al cargar órdenes:', e);
      return [];
    }
  },

  async updateOrderStatus(orderId, estado, token) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ estado })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error actualizando estado del envío');
    }
    return await res.json();
  },

  // Métodos de Pago
  async getPaymentMethods(token) {
    const res = await fetch(`${API_BASE}/payment-methods`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async savePaymentMethod(method, token) {
    const res = await fetch(`${API_BASE}/payment-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(method)
    });
    if (!res.ok) throw new Error('Error al guardar método de pago');
    return await res.json();
  },

  async deletePaymentMethod(id, token) {
    const res = await fetch(`${API_BASE}/payment-methods/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al eliminar método de pago');
    return true;
  },

  // Promociones Reales en Base de Datos
  async getPromotions() {
    try {
      const res = await fetch(`${API_BASE}/promotions`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.warn('API error (getPromotions):', e);
      return [];
    }
  },

  async getAllPromotions(token) {
    const res = await fetch(`${API_BASE}/promotions/all`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Error al consultar promociones');
    return await res.json();
  },

  async savePromotion(promo, token) {
    const res = await fetch(`${API_BASE}/promotions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(promo)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al guardar promoción');
    }
    return await res.json();
  },

  async togglePromotion(id, token) {
    const res = await fetch(`${API_BASE}/promotions/${id}/toggle`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al alternar estado de la promoción');
    return await res.json();
  },

  async deletePromotion(id, token) {
    const res = await fetch(`${API_BASE}/promotions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al desactivar la promoción');
    return true;
  },

  // Perfil de Usuario y Gestión de Cuenta
  async getUserProfile(token) {
    const res = await fetch(`${API_BASE}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al obtener perfil');
    return await res.json();
  },

  async updateUserProfile(profileData, token) {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar perfil');
    }
    return await res.json();
  },

  async deleteUserAccount(token) {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al desactivar cuenta');
    return true;
  },

  // Dashboard / Reportes
  async getDashboardSummary(token) {
    const res = await fetch(`${API_BASE}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al cargar resumen');
    return await res.json();
  },

  async getSalesReport(token) {
    const res = await fetch(`${API_BASE}/dashboard/sales`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al cargar ventas');
    return await res.json();
  },

  async getProductsReport(token) {
    const res = await fetch(`${API_BASE}/dashboard/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al cargar estadísticas');
    return await res.json();
  },

  async getBranchSalesReport(token) {
    try {
      const res = await fetch(`${API_BASE}/dashboard/branches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};

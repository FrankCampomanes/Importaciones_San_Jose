/**
 * Utilidad oficial para resolver la imagen de un producto en Importaciones San José.
 * Regla de Oro: Muestra ÚNICAMENTE las fotos reales legítimas del producto.
 * 
 * Prioridad de resolución:
 * 1. Foto real guardada en la base de datos (catálogo oficial /images/products/imgXXX.png, URL o base64 data:image/...)
 * 2. Foto real subida en sesión por el administrador en localStorage
 * 3. Si no tiene foto real asignada, retorna null para que la interfaz muestre el placeholder institucional neutro
 * 
 * NUNCA asigna fotos de Unsplash ni recicla fotos de otros productos.
 */
export function resolveProductImage(product) {
  if (!product) return null;

  // 1. Imagen directa real asignada al producto (catálogo oficial o base64 en base de datos)
  if (product.imagenUrl && !product.imagenUrl.startsWith('local:')) {
    if (
      product.imagenUrl.startsWith('data:') ||
      product.imagenUrl.startsWith('/images/') ||
      product.imagenUrl.startsWith('http://') ||
      product.imagenUrl.startsWith('https://')
    ) {
      return product.imagenUrl;
    }
  }

  // 2. Imagen real subida por el usuario y guardada en localStorage
  if (typeof localStorage !== 'undefined') {
    if (product.codigoQr) {
      const customByQr = localStorage.getItem('sj_custom_img_' + product.codigoQr);
      if (customByQr) return customByQr;
    }
    if (product.id) {
      const customById = localStorage.getItem('sj_custom_img_id_' + product.id);
      if (customById) return customById;
    }
    if (product.imagenUrl && product.imagenUrl.startsWith('local:')) {
      const qrTag = product.imagenUrl.replace('local:', '');
      const customByTag = localStorage.getItem('sj_custom_img_' + qrTag);
      if (customByTag) return customByTag;
    }
  }

  // 3. Si no tiene foto real propia todavía, retornamos null (sin fotos inventadas)
  return null;
}

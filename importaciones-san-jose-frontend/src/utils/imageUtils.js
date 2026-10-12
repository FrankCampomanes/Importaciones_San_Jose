/**
 * Utilidad para resolver la imagen de un producto.
 * Permite compatibilidad con:
 * - Imágenes subidas localmente por el administrador (guardadas en cache local con prefijo 'local:')
 * - Imágenes de catálogo estáticas (/images/products/...)
 * - URLs remotas (https://...)
 * - Data URLs base64
 */
export function resolveProductImage(product) {
  if (!product) return '/images/products/img001.png';

  // 1. Revisar si hay imagen personalizada subida por el admin en localStorage mediante el código QR
  if (product.codigoQr && typeof localStorage !== 'undefined') {
    const customByQr = localStorage.getItem('sj_custom_img_' + product.codigoQr);
    if (customByQr) return customByQr;
  }

  // 2. Si tiene el tag 'local:CODIGO_QR'
  if (product.imagenUrl && product.imagenUrl.startsWith('local:')) {
    const qr = product.imagenUrl.replace('local:', '');
    if (typeof localStorage !== 'undefined') {
      const custom = localStorage.getItem('sj_custom_img_' + qr);
      if (custom) return custom;
    }
  }

  // 3. Si tiene una URL base64 directa, remota o de ruta de catálogo
  if (product.imagenUrl) {
    if (
      product.imagenUrl.startsWith('data:') ||
      product.imagenUrl.startsWith('http://') ||
      product.imagenUrl.startsWith('https://') ||
      product.imagenUrl.startsWith('/images/')
    ) {
      return product.imagenUrl;
    }
  }

  // Fallback a imagen por defecto
  return '/images/products/img001.png';
}

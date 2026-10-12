/**
 * Utilidad integral para resolver la imagen de un producto.
 * Permite compatibilidad con:
 * - URLs remotas (https://...)
 * - Data URLs base64 (data:image/...)
 * - Imágenes de catálogo estáticas (/images/products/...)
 * - Imágenes subidas en sesión local por el administrador ('local:QR')
 * - Mapeo contextual por nombre de artículo para asegurar que nunca se vea rota
 */
export function resolveProductImage(product) {
  if (!product) return '/images/products/img001.png';

  // 1. Si el producto ya tiene una URL remota válida (https://, http://, data:, /images/)
  if (product.imagenUrl && !product.imagenUrl.startsWith('local:')) {
    if (
      product.imagenUrl.startsWith('data:') ||
      product.imagenUrl.startsWith('http://') ||
      product.imagenUrl.startsWith('https://') ||
      product.imagenUrl.startsWith('/images/')
    ) {
      return product.imagenUrl;
    }
  }

  // 2. Revisar si hay imagen personalizada subida por el admin en localStorage mediante QR o ID
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

  // 3. Mapeo contextual por nombre y rubro comercial (garantiza fotos atractivas e inmediatas)
  const n = (product.nombre || '').toLowerCase();
  if (n.includes('pistola') || n.includes('polic') || n.includes('rescate')) {
    return 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500';
  }
  if (n.includes('alcanc')) {
    return 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500';
  }
  if (n.includes('perchero')) {
    return 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500';
  }
  if (n.includes('m') && (n.includes('scara') || n.includes('halloween') || n.includes('haloween'))) {
    return 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500';
  }
  if (n.includes('pañuelo') || n.includes('panuelo') || n.includes('desechable') || n.includes('facial')) {
    return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500';
  }
  if (n.includes('dispensador') || n.includes('jab') || n.includes('jabon')) {
    return 'https://images.unsplash.com/photo-1584949514122-261559868725?w=500';
  }
  if (n.includes('secadora') || n.includes('cabello') || n.includes('pelo')) {
    return 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500';
  }
  if (n.includes('raqueta') || n.includes('tenis') || n.includes('ping')) {
    return 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500';
  }
  if (n.includes('afeitador') || n.includes('rasurador') || n.includes('barber')) {
    return 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500';
  }
  if (n.includes('vidrio') || n.includes('boleria') || n.includes('taza') || n.includes('jarra')) {
    return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500';
  }

  // 4. Fallback dinámico con las imágenes base del catálogo oficial
  if (product.id) {
    const defaultCatalogue = [
      '/images/products/img001.png',
      '/images/products/img002.png',
      '/images/products/img003.png',
      '/images/products/img005.png',
      '/images/products/img007.png',
      '/images/products/img008.png',
      '/images/products/img009.png',
      '/images/products/img010.png',
      '/images/products/img011.png',
      '/images/products/img012.png',
      '/images/products/img013.png',
      '/images/products/img014.png',
      '/images/products/img015.png',
      '/images/products/img017.png',
      '/images/products/img021.png',
      '/images/products/img022.png',
      '/images/products/img023.png',
      '/images/products/img024.png',
      '/images/products/img025.png',
      '/images/products/img026.png',
      '/images/products/img028.png',
      '/images/products/img030.png'
    ];
    return defaultCatalogue[product.id % defaultCatalogue.length];
  }

  return '/images/products/img001.png';
}

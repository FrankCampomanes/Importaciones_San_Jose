// Normaliza texto: remueve tildes, mayúsculas y caracteres especiales
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Buscador ultra-potente: subcadenas, palabras desordenadas y códigos QR
export function searchProducts(products, query) {
  if (!query || !query.trim()) return products;

  const normalizedQuery = normalizeText(query);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return products.filter(product => {
    const normName = normalizeText(product.nombre);
    const normCategory = normalizeText(product.categoria);
    const normDesc = normalizeText(product.descripcion);
    const normQr = normalizeText(product.codigoQr);
    const prodIdStr = String(product.id || '');

    // 1. Coincidencia directa por código QR o ID (ej. "001", "SJ-PROD-001", "1")
    if (normQr.includes(normalizedQuery) || prodIdStr === normalizedQuery) {
      return true;
    }

    // 2. Coincidencia completa en el nombre
    if (normName.includes(normalizedQuery)) {
      return true;
    }

    // 3. Multi-palabra: Si el usuario busca "vaso vidrio", ambas palabras deben coincidir en el nombre, categoría o descripción
    const allTokensMatch = queryTokens.every(token => 
      normName.includes(token) || 
      normCategory.includes(token) || 
      normDesc.includes(token) ||
      normQr.includes(token)
    );

    return allTokensMatch;
  });
}

// src/utils/location.js

/**
 * Convierte el código de país (ISO 3166-1 alpha-2) a nombre completo en español.
 * Ejemplo: "ES" -> "España", "SV" -> "El Salvador"
 */
export const getCountryName = (countryCode) => {
  if (!countryCode) return "";
  
  try {
    // Intl.DisplayNames es una API nativa moderna de JavaScript (no requiere librerías)
    const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
    return regionNames.of(countryCode.toUpperCase());
  } catch (error) {
    console.warn("Código de país inválido:", countryCode, error);
    return countryCode; // Si falla, devolvemos el código original
  }
};

/**
 * Diccionario manual para códigos de estados comunes.
 * Nota: Si tu app escala mundialmente, te recomendaré instalar la librería 'country-state-city'.
 */
const stateMap = {
  // España
  "MAD": "Madrid",
  "CT": "Cataluña",
  "AN": "Andalucía",
  // El Salvador
  "SS": "San Salvador",
  "LI": "La Libertad",
  "SA": "Santa Ana",
  // Estados Unidos
  "CA": "California",
  "TX": "Texas",
  "NY": "New York",
  "FL": "Florida"
};

/**
 * Intenta obtener el nombre del estado.
 */
export const getStateName = (stateCode) => {
  if (!stateCode) return "";
  const code = stateCode.toUpperCase();
  return stateMap[code] || stateCode; // Devuelve el nombre o el código si no lo encuentra
};

/**
 * Función combinada para mostrar "Madrid, España"
 */
export const formatLocation = (countryCode, stateCode) => {
  const country = getCountryName(countryCode);
  const state = getStateName(stateCode);

  if (state && country) {
    return `${state}, ${country}`;
  }
  return country || state || "Ubicación desconocida";
};
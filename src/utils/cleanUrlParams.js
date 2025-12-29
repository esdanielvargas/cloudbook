// export function cleanUrlParams(url = "") {
//   try {
//     const parsedUrl = new URL(url);
//     parsedUrl.search = ""; // Elimina todos los parámetros
//     return parsedUrl.toString();
//   } catch (error) {
//     console.error("Error en el enlace: ", error);
//     return url; // Por si es texto no válido
//   }
// }

// export function cleanUrlParams(url: string = "") {
//   try {
//     const { hostname } = new URL(url);
//     return hostname.replace(/^www\./, ""); // Quita el www si lo deseas
//   } catch {
//     return url; // fallback si no es una URL válida
//   }
// }

export function cleanUrlParams(url = "") {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, ""); // opcional: quitar www.
  } catch {
    return url;
  }
}

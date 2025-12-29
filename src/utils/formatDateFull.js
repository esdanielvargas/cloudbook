export function formatDateFull(timestamp, lang = "es") {
  if (!timestamp?.seconds) return "Fecha no disponible";

  return new Date(timestamp.seconds * 1000).toLocaleDateString(lang, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

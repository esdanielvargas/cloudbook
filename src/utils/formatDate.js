import { formatDistanceToNowStrict } from "date-fns";
import { enUS, es } from "date-fns/locale";

export const formatDate = (timestamp, locale) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    const dateLocale = locale === "es" ? es : enUS;
    const timeAgo = formatDistanceToNowStrict(date, {
      includeSeconds: true,
      addSuffix: true,
      locale: dateLocale,
    });
    return `${timeAgo}`;
  };
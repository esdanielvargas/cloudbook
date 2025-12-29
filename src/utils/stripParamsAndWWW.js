export function stripParamsAndWWW(url = "") {
  try {
    const parsed = new URL(url);

    const hostname = parsed.hostname.replace(/^www\./, "");
    const pathname = parsed.pathname === "/" ? "" : parsed.pathname;

    return `${parsed.protocol}//${hostname}${pathname}`;
  } catch {
    return url;
  }
}

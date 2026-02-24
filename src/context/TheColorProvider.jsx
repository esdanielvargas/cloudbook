import { useEffect, useState } from "react";
import { ThemeColorContext } from "./ThemeColorContext";
import { accentHexMap } from "../utils";

const DEFAULT_ACCENT = "sky";
const STORAGE_KEY = "accent-color";

export function ThemeColorProvider({ children }) {
  const colors = accentHexMap;

  // Leer el color de acento de localStorage al inicializar el estado
  const [accent, setAccent] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && colors[stored] ? stored : DEFAULT_ACCENT;
  });

  // Actualizar la variable CSS y localStorage cuando cambie el acento
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, accent);
    const color = colors[accent] || colors[DEFAULT_ACCENT];
    document.documentElement.style.setProperty("--accent-color", color.hex);
  }, [accent, colors]);

  const value = {
    setAccent,
    accent: colors[accent].name,
    displayName: colors[accent].displayName,
    accentHex: colors[accent].hex,
    bgClass: colors[accent].bgClass,
    bgTransluce: colors[accent].bgTransluce,
    bgTransluce20: colors[accent].bgTransluce20,
    hoverClass: colors[accent].hoverClass,
    hoverTransluce: colors[accent].hoverTransluce,
    txtClass: colors[accent].txtClass,
    txtTransluce: colors[accent].txtTransluce,
    borderClass: colors[accent].borderClass,
    borderTransluce: colors[accent].borderTransluce,
  };

  return (
    <ThemeColorContext.Provider value={value}>
      {children}
    </ThemeColorContext.Provider>
  );
}
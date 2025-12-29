import { useContext } from "react";
import { ThemeColorContext } from "./ThemeColorContext";

export function useThemeColor() {
  return useContext(ThemeColorContext);
}
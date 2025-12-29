import { createContext, useContext } from "react";

export const MediaModalContext = createContext();

export const useMediaModal = () => {
  const context = useContext(MediaModalContext);
  if (!context) {
    throw new Error("useMediaModal debe usarse dentro de un MediaModalProvider");
  }
  return context;
};

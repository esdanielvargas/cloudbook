import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeColorProvider } from "./context/TheColorProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeColorProvider>
      <App />
    </ThemeColorProvider>
  </StrictMode>
);

import { BrowserRouter } from "react-router-dom";
import { Loader, ScrollToTop } from "./components";
import { Suspense } from "react";
import AppRoutes from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

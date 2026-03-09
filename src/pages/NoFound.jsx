import { EmptyState, PageHeader } from "@/components";
import { CloudOff, } from "lucide-react";

export default function NoFound() {
  return (
    <div className="size-full flex flex-col items-center justify-center">
      <PageHeader title={`CloudBook`} />
      <EmptyState
        Icon={CloudOff}
        title="¡Oops! Página no encontrada"
        caption="Tal vez esta página fue eliminada, movida o simplemente se cambio de nube."
        path="/"
        actionText="Volver al inicio"
      />
    </div>
  );
}

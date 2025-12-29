import { ArrowLeftIcon, CpuChipIcon } from "@heroicons/react/24/outline";
import { ArrowLeft, CloudOff, Compass, Ghost } from "lucide-react";
import { Link } from "react-router-dom";
import { PageBox } from "../components";
import { useThemeColor } from "../context";

export default function NoFound() {
  const { bgClass, hoverClass } = useThemeColor();

  return (
    <div className="size-full flex flex-col items-center justify-center">
      <div className="w-full min-h-4" />
      <PageBox active className="items-center justify-center">
        <span className="text-6xl font-bold">404</span>
        <div className="w-full flex flex-col items-center justify-center my-8">
          <h1 className="text-center text-lg text-balance text-neutral-300">
            ¡Oops! No encontramos lo que buscabas.
          </h1>
          <p className="text-center text-sm text-balance text-neutral-400 italic">
            Tal vez esta página fue eliminada, movida o simplemente se
            desintegró.
          </p>
        </div>
        <Link
          to={{
            pathname: "/",
            search:
              "?utm_source=cloudbook&utm_medium=social&utm_campaign=page-no-found",
          }}
          className={`h-10 px-4 inline-flex items-center gap-2 ${bgClass} ${hoverClass} rounded-xl text-white transition-all duration-300 ease-out`}
        >
          <span className="min-w-max">Volver al feed</span>
        </Link>
      </PageBox>
    </div>
  );
}

import { useEffect } from "react";
import { useState } from "react";

export default function PostLink({ link, poster }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!link) {
      setData(null);
      return;
    }

    const timer = setTimeout(() => {
      fetchPreviewData(link);
    }, 1000);

    return () => clearTimeout(timer);
  }, [link]);

  const fetchPreviewData = async (linkUrl) => {
    if (!linkUrl || typeof linkUrl !== "string") return;

    const cleanText = linkUrl.trim();

    const linkWithoutProtocol = cleanText.replace(/^https?:\/\//, "");

    try {
      const response = await fetch(
        `https://api.microlink.io/?url=https://${encodeURIComponent(
          linkWithoutProtocol
        )}`
      );

      const result = await response.json();

      if (result.status === "success") {
        setData(result.data);
      } else {
        console.log("No pudimos obtener información de este enlace.");
      }
    } catch (err) {
      console.log("Error de conexión.", err);
    }
  };

  return (
    <div className="w-full space-y-2 md:space-y-4">
      {/* VISUALIZACIÓN DE LA TARJETA (Solo si hay data) */}
      {data && (
        <a
          href={data.url || link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full relative flex flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950/50 border-y border-neutral-200/75 dark:border-neutral-800/75"
        >
          {/* Imagen de portada */}
          {data?.image && (
            <img
              src={poster ? poster : data?.image?.url}
              width={566}
              height={566}
              loading="eager"
              alt={`${data?.title}: ${data?.description}`}
              title={`${data?.title}: ${data?.description}`}
              className="size-full max-h-85 md:max-h-141.5 object-cover object-center pointer-events-none select-none bg-neutral-50 dark:bg-neutral-950"
            />
          )}

          <div className="w-full p-2 md:p-4 space-y-1 md:space-y-2 border-t border-neutral-200/75 dark:border-neutral-800/75">
            {/* Título */}
            <h3
              className="line-clamp-1 text-md"
              title={data?.title || "Sin título"}
            >
              {data?.title || "Sin título"}
            </h3>

            {/* Descripción */}
            <p
              className="line-clamp-2 text-xs text-neutral-500"
              title={data?.description || "Sin descripción disponible."}
            >
              {data?.description || "Sin descripción disponible."}
            </p>

            {/* Pequeño Favicon + Dominio (Toque extra) */}
            <div className="w-full mt-2 md:mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
              {data.logo && (
                <img
                  src={
                    data?.logo?.url
                      ? `https://www.google.com/s2/favicons?domain=${link}&sz=64`
                      : data?.logo?.url
                  }
                  width={16}
                  height={16}
                  loading="lazy"
                  alt={`Favicon de ${data?.publisher || new URL(data?.url).hostname}`}
                  title={`Favicon de ${data?.publisher || new URL(data?.url).hostname}`}
                  className="object-cover object-center pointer-events-none select-none rounded-xs"
                />
              )}
              <span>{data?.publisher || new URL(data?.url).hostname}</span>
            </div>
          </div>
        </a>
      )}
    </div>
  );
}

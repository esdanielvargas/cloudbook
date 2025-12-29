import { useState, useEffect } from "react";
import { FormField } from "./form";

export const LinkPreview = (props) => {
  const { edit = false, poster = "" } = props;
  const [url, setUrl] = useState(props.link);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Si el input está vacío, limpiamos la data y no hacemos nada
    if (!url) {
      setData(null);
      setError(null);
      return;
    }

    // 2. Iniciamos el TEMPORIZADOR (Debounce)
    // Esperará 1000ms (1 segundo) después de que dejes de escribir
    const timer = setTimeout(() => {
      fetchPreviewData(url);
    }, 1000);

    // 3. Función de LIMPIEZA
    // Esto es magia de React: Si el usuario escribe antes de que pase el segundo,
    // esta línea se ejecuta primero, mata el timer anterior y crea uno nuevo.
    return () => clearTimeout(timer);
  }, [url]); // Se ejecuta cada vez que 'url' cambia

  const fetchPreviewData = async (linkUrl) => {
    setLoading(true);
    setError(null);

    const link = linkUrl.replace(/^https?:\/\//, "");

    try {
      // Usamos Microlink
      const response = await fetch(
        `https://api.microlink.io/?url=https://${encodeURIComponent(link)}`
      );
      const result = await response.json();

      // console.log(result);

      if (result.status === "success") {
        setData(result.data);
      } else {
        setError("No pudimos obtener información de este enlace.");
      }
    } catch (err) {
      setError("Error de conexión.", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2 md:space-y-4">
      {edit && (
        <>
          {/* INPUT */}
          <div className="w-full mb-2 md:mb-4 px-2 md:px-4">
            <FormField
              type="search"
              placeholder="Ingresa el enlace que deseas compartir"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          {/* ESTADO DE CARGA */}
          {loading && (
            <p
              className="px-2 md:px-4  pb-2 md:pb-4 text-xs"
              style={{ color: "#666" }}
            >
              Buscando info del enlace...
            </p>
          )}

          {/* MENSAJE DE ERROR */}
          {error && (
            <p className="px-2 md:px-4 pb-2 md:pb-4 text-xs text-rose-600">
              {error}
            </p>
          )}
        </>
      )}

      {/* VISUALIZACIÓN DE LA TARJETA (Solo si hay data y no está cargando) */}
      {!loading && data && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
          className="w-full relative flex flex-col overflow-hidden bg-neutral-950/50 border-y border-neutral-800/75"
        >
          {/* Imagen de portada */}
          {data?.image && (
            <img
              src={poster ? poster : data?.image?.url}
              alt="Preview"
              className="size-full max-h-85 md:max-h-141.5 object-cover object-center pointer-events-none select-none bg-neutral-950"
            />
          )}

          <div className="w-full p-2 md:p-4 space-y-1 md:space-y-2">
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
                      ? `https://www.google.com/s2/favicons?domain=${url}&sz=64`
                      : data?.logo?.url
                  }
                  width="16"
                  height="16"
                  alt=""
                />
              )}
              <span>{data?.publisher || new URL(data?.url).hostname}</span>
            </div>
          </div>
        </a>
      )}
    </div>
  );
};

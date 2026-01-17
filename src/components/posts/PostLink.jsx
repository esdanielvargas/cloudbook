export default function PostLink(props) {
  const { url, image, title, description, logo, publisher } = props;

  // 1. Si no hay data guardada, mostramos un enlace simple
  if (!image && !title && !description && url) {
    return (
      <div className="w-full mx-2 md:mx-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm break-all"
        >
          {url}
        </a>
      </div>
    );
  }

  // 2. Si no hay ni data ni link, no renderizamos nada
  if (!url) return null;

  // 3. Renderizamos la tarjeta con la información estática
  return (
    <div className="w-full space-y-2 md:space-y-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full relative flex flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950/50 transition-opacity hover:opacity-90"
      >
        {/* Imagen de portada */}
        {image && (
          <picture className="w-full flex items-center justify-center border-y border-neutral-200/75 dark:border-neutral-800/75">
            <img
              src={image}
              width={566}
              height={566}
              loading="lazy"
              alt={title || "Vista previa del enlace"}
              className="size-full max-h-85 md:max-h-141.5 object-cover object-center pointer-events-none select-none bg-neutral-50 dark:bg-neutral-950"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/photo.png";
              }}
            />
          </picture>
        )}

        <div
          className="w-full p-2 md:p-4 space-y-1 md:space-y-2 border-b border-neutral-200/75 dark:border-neutral-800/75"
        >
          {/* Título */}
          <h3
            className="line-clamp-1 text-md font-medium text-neutral-900 dark:text-neutral-100"
            title={title || "Sin título"}
          >
            {title || "Sin título"}
          </h3>

          {/* Descripción */}
          <p
            className="line-clamp-2 text-xs text-neutral-500"
            title={description || ""}
          >
            {description || "Sin descripción disponible."}
          </p>

          {/* Favicon + Dominio */}
          <div className="w-full mt-2 md:mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
            {logo && (
              <img
                src={
                  // Si guardaste la URL del logo, úsala, si no, usa el truco de Google
                  logo.startsWith("http")
                    ? logo
                    : `https://www.google.com/s2/favicons?domain=${url}&sz=64`
                }
                width={16}
                height={16}
                loading="lazy"
                alt=""
                className="rounded-xs"
              />
            )}
            <span>{publisher || new URL(url).hostname}</span>
          </div>
        </div>
      </a>
    </div>
  );
}

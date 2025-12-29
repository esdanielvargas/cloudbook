import { useLinksModal } from "../context/ModalProvider";
import { formatLink } from "../utils";
import { useThemeColor } from "../context";

export const LinksModal = () => {
  const { isOpen, closeModal, modalData } = useLinksModal();
  const { txtClass } = useThemeColor();

  // Si no está abierto o no hay datos, no renderizamos nada
  if (!isOpen) return null;

  return (
    <div className="size-full fixed z-[150] inset-0 flex items-center justify-center bg-neutral-950/50 -backdrop-blur-xs transition-all duration-300 ease-out">
      {/* Fondo transparente que cierra el modal al hacer click */}
      <div className="absolute inset-0" onClick={closeModal}></div>

      <div className="relative size-full md:ml-[calc(80px_+_32px)] flex items-end md:items-center justify-center pointer-events-none">
        {/* Contenedor del Modal */}
        <div className="pointer-events-auto w-full md:w-110 py-2 md:bottom flex flex-col gap-0.5 rounded-t-3xl md:rounded-3xl bg-neutral-900 border-t md:border border-neutral-800 shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* Encabezado opcional del modal */}
          <div className="px-4 py-2 flex justify-between items-center">
            <span className="text-neutral-50 text-lg font-medium">Enlaces</span>
            <button
              onClick={closeModal}
              className="size-8 p-1 bg-neutral-800 rounded-full cursor-pointer"
            >
              <span className="text-white text-xs">✕</span>
            </button>
          </div>

          {/* Mapeamos modalData en lugar de user.links */}
          {modalData?.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer" // Buena práctica de seguridad
              className="w-full h-14 py-2 px-4 flex items-center justify-between gap-2.5 group"
            >
              <div className="flex items-center justify-center">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${item?.link}&sz=64`}
                  alt={`Logotipo de ${item?.title}`}
                  title={`Logotipo de ${item?.title}`}
                  width={36}
                  height={36}
                  onError={(e) => { e.target.style.display = 'none' }}
                  className="object-cover object-center pointer-events-none select-none rounded-md"
                />
              </div>
              <div className="size-full flex flex-col justify-center">
                <span className="font-bold text-sm text-white md:text-md">
                  {item?.title || formatLink(item?.link)}{" "}
                  {/* Fallback si no hay titulo */}
                </span>
                <span
                  className={`font-normal text-xs md:text-sm ${txtClass} opacity-80 group-active:underline group-hover:underline`}
                >
                  {formatLink(item?.link)}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";
import PageLine from "./PageLine";
import { Nudge } from "./buttons";
import MenuAlt from "./MenuAlt";

function HeaderButton({ Icon, title, onClick, className }) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={onClick}
      className="size-9.5 flex items-center justify-center cursor-pointer rounded-lg bg-neutral-100 dark:bg-neutral-900/75 border border-neutral-200 dark:border-neutral-800/75"
    >
      {Icon && <Icon size={20} className={`size-4.5 ${className}`} strokeWidth={1.5} />}
    </button>
  );
}

export default function PageHeader({
  title,
  header,
  caption,
  buttonLeft,
  buttonRight,
  hideUpgrade = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Valores por defecto para el botón izquierdo (Volver)
  const leftAction = {
    icon: ChevronLeft,
    title: "Volver atrás",
    onClick: () => window.history.back(),
    ...buttonLeft, // Sobrescribe con lo que pases por props
  };

  // Valores por defecto para el botón derecho (Upgrade o Acción)
  const rightAction = {
    icon: Sparkles,
    title: "Mejorar plan",
    onClick: () => alert("CloudBook Premium 🚀"),
    ...buttonRight,
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLeftClick = () => {
    if (leftAction.path) {
      navigate(leftAction.path);
    } else {
      leftAction.onClick();
    }
  };

  const handleRightClick = () => {
    if (rightAction.menuOptions?.length > 0) {
      setIsOpen((prev) => !prev);
    } else {
      rightAction.onClick();
    }
  };

  return (
    <>
      <header className="w-full md:w-142 p-2 md:py-4 md:px-0 z-10 fixed md:sticky left-0 md:left-auto top-0 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-xl">
        {/* Lado Izquierdo */}
        <div className="min-w-max flex items-center justify-start">
          <HeaderButton
            Icon={leftAction.icon}
            title={leftAction.title}
            onClick={handleLeftClick}
          />
        </div>

        {/* Centro */}
        <div className="w-full h-9.5 flex flex-col items-center justify-center overflow-hidden">
          <title>{header ?? `${title} ~ CloudBook`}</title>
          {caption && <meta name="description" content={caption} />}
          <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
          <h1 className="sr-only">{header ?? title}</h1>
          <h2 className="w-full cursor-default text-center font-bold text-lg font-sans truncate px-2">
            {title ?? "Cargando..."}
          </h2>
        </div>

        {/* Lado Derecho */}
        <div className="min-w-max flex items-center justify-end relative">
          {buttonRight || !hideUpgrade ? (
            <HeaderButton
              Icon={rightAction.icon}
              title={rightAction.title}
              onClick={handleRightClick}
              className={rightAction.className}
            />
          ) : (
            <div className="size-9.5" />
          )}

          {/* Menú desplegable */}
          {rightAction.menuOptions?.length > 0 && isOpen && (
            <MenuAlt ref={menuRef} isOpen={isOpen} className="top-11 right-0">
              {rightAction.menuOptions
                .filter((item) => item.show !== false)
                .map((item, index) =>
                  item.type === "divider" ? (
                    <PageLine key={index} />
                  ) : (
                    <Nudge
                      key={index}
                      Icon={item.icon}
                      onClick={() => {
                        item.onClick?.();
                        setIsOpen(false);
                      }}
                      {...item}
                    />
                  ),
                )}
            </MenuAlt>
          )}
        </div>
      </header>
      <div className="w-full min-h-13.5 mb-0.5 md:mb-1.5 flex md:hidden" />
    </>
  );
}

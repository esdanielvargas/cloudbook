import { ChevronLeft, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MenuAlt from "./MenuAlt";
import { Nudge } from "./buttons";
import PageLine from "./PageLine";

function HeaderButton({ Icon, title, onClick }) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={onClick}
      className="size-9.5 flex items-center justify-center cursor-pointer rounded-lg bg-neutral-100 dark:bg-neutral-900/75 border border-neutral-200 dark:border-neutral-800/75"
    >
      {Icon && <Icon size={20} className="size-4.5" strokeWidth={1.5} />}
    </button>
  );
}

function PromoButton() {
  return (
    <HeaderButton
      Icon={Sparkles}
      title="Mejorar plan"
      onClick={() => alert("Upsell a Premium 🚀")}
    />
  );
}

export default function PageHeader({
  title,
  header,
  Icon = null,
  iconTitle = "",
  menuOptions = null,
  iconOnClick = null,
  hideUpgrade = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleRightActionClick = () => {
    if (menuOptions?.length) {
      setIsOpen((prev) => !prev);
    } else if (iconOnClick) {
      iconOnClick();
    }
  };

  return (
    <>
      <header className="w-full md:w-142 p-2 md:py-4 md:px-0 z-10 fixed md:sticky left-0 md:left-auto top-0 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-xl">
        {/* Izquierda: Volver atrás */}
        <div className="min-w-max flex items-center justify-start">
          <HeaderButton
            Icon={ChevronLeft}
            title="Volver atrás"
            onClick={() => window.history.back()}
          />
        </div>

        {/* Centro: Título dinámico */}
        <div className="w-full h-9.5 flex items-center justify-center overflow-hidden">
          <h1 className="sr-only">{header ?? "Header no disponible..."}</h1>
          <h2 className="w-full cursor-default text-center font-bold text-lg md:text-lg font-sans truncate">
            {title ?? "Cargando..."}
          </h2>
          <title>{title ? `${title} ~ CloudBook` : "CloudBook"}</title>
        </div>

        {/* Derecha: Acción personalizable o Upgrade */}
        <div className="min-w-max flex items-center justify-end relative">
          {Icon ? (
            <HeaderButton
              Icon={Icon}
              title={iconTitle}
              onClick={handleRightActionClick}
            />
          ) : !hideUpgrade ? (
            <HeaderButton
              Icon={Sparkles}
              title="Mejorar plan"
              onClick={() => alert("Próximamente: CloudBook Premium 🚀")}
            />
          ) : (
            <div className="size-9.5" /> 
          )}

          {/* Menú de opciones */}
          {menuOptions?.length > 0 && isOpen && (
            <MenuAlt ref={menuRef} isOpen={isOpen} className="top-0 right-0">
              {menuOptions.map((item, index) =>
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

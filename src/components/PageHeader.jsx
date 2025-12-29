import { ChevronLeft, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MenuAlt from "./MenuAlt";
import { Nudge } from "./buttons";

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
  Icon = null,
  iconTitle = "",
  menuOptions = null,
  iconOnClick = null,
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

  const handleIconClick = () => {
    if (menuOptions?.length) {
      setIsOpen((prev) => !prev);
    } else if (iconOnClick) {
      iconOnClick();
    }
  };

  return (
    <>
    <div className="w-full md:w-142 p-2 md:py-4 md:px-0  -min-h-17.5 z-10 fixed md:sticky left-0 md:left-auto top-0 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-xl">
      {/* Botón volver atrás */}
      <div className="min-w-max flex items-center justify-start">
        <HeaderButton
          Icon={ChevronLeft}
          title="Volver atrás"
          onClick={() => window.history.back()}
        />
      </div>

      {/* Título */}
      <div className="w-full h-9.5 flex items-center justify-center overflow-hidden">
        <h1 className="sr-only">{`Perfil de ${title}`}</h1>
        <h2 className="w-full cursor-default text-center font-bold text-lg md:text-lg font-sans truncate">
          {title ?? "Cargando..."}
          <title>{title ? `${title} ~ CloudBook` : "CloudBook"}</title>
        </h2>
      </div>

      {/* Acción o promo */}
      <div className="min-w-max flex items-center justify-end relative">
        {Icon ? (
          <HeaderButton
            Icon={Icon}
            title={iconTitle}
            onClick={handleIconClick}
          />
        ) : (
          <PromoButton />
        )}

        {/* Menú de opciones */}
        {menuOptions?.length > 0 && (
          <MenuAlt ref={menuRef} isOpen={isOpen} className="top-0 right-0">
            {menuOptions.map((item, idx) =>
              item.type === "divider" ? (
                <hr
                  key={`divider-${idx}`}
                  className="my-1.5 border-solid border-neutral-200 dark:border-neutral-800"
                />
              ) : (
                <Nudge
                  key={`nudge-${idx}`}
                  Icon={item.icon}
                  title={item.title}
                  alert={item.alert}
                  rotate={item.rotate}
                  to={item.to}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                />
              )
            )}
          </MenuAlt>
        )}
      </div>
    </div>
    <div className="w-full h-16 md:h-18.5 mb-0.5 md:mb-1.5 flex md:hidden" />
    </>
  );
}

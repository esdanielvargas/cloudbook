import { ChevronRight, SquareArrowOutUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Tab({
  Icon,
  Icon2,
  title,
  caption,
  flag = "",
  path = false,
  href = false,
  action = false,
  secondaryAction = null,
}) {
  // Centralizamos las clases de colores según el "flag"
  const getFlagClasses = (isCaption = false) => {
    if (flag === "info") return isCaption ? "text-sky-500/75!" : "text-sky-500!";
    if (flag === "danger") return isCaption ? "text-rose-600/75!" : "text-rose-600!";
    if (flag === "warning") return isCaption ? "text-red-500/75!" : "text-red-500!";
    return isCaption ? "text-neutral-600 dark:text-neutral-400" : "text-neutral-800 dark:text-neutral-200";
  };

  // Definimos el contenedor según el tipo de interactividad
  let Component = "div";
  const props = {
    className: "group w-full min-h-14 py-3 px-4 flex items-center justify-start gap-4 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-out cursor-pointer",
  };

  if (path) {
    Component = Link;
    props.to = path;
  } else if (href) {
    Component = "a";
    props.href = href;
    props.target = "_blank";
    props.rel = "noopener noreferrer";
  } else if (action) {
    Component = "button";
    props.type = "button";
    props.onClick = action;
  } else {
    props.cursor = "cursor-default";
  }

  // Renderizado único y limpio
  return (
    <Component {...props}>
      {/* Sección Icono Principal */}
      {Icon && (
        <div className="size-6 aspect-square flex items-center justify-center">
          <Icon size={24} strokeWidth={1.5} className={getFlagClasses()} />
        </div>
      )}

      {/* Sección Textos */}
      <div className="w-full flex flex-col items-start justify-center">
        {title && (
          <div className={`w-full flex items-center justify-start text-sm md:text-md leading-tight ${getFlagClasses()}`}>
            {title}
          </div>
        )}
        {caption && (
          <div className={`w-full flex items-center justify-start text-xs md:text-sm leading-tight ${getFlagClasses(true)}`}>
            {caption}
          </div>
        )}
      </div>

      {/* Sección Icono Final (Acción Secundaria, External o Chevron) */}
      <div className="size-6 aspect-square flex items-center justify-center">
        {secondaryAction ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              secondaryAction.onClick();
            }}
            className={`p-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer`}
          >
            <secondaryAction.icon 
              size={20}
              fill={secondaryAction.active ? "currentColor" : "none"}
            />
          </button>
        ) : href ? (
          <SquareArrowOutUpRight size={20} className="text-neutral-600 dark:text-neutral-400" />
        ) : Icon2 ? (
          <Icon2 size={20} className="text-neutral-600 dark:text-neutral-400" />
        ) : (path || action) ? (
          <ChevronRight size={20} className="text-neutral-600 dark:text-neutral-400" />
        ) : null}
      </div>
    </Component>
  );
}
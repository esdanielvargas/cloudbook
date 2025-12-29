import { Link } from "react-router-dom";

export default function Nudge(props) {
  const {
    Icon,
    title,
    to,
    onClick,
    className = "",
    rotate,
    alert,
    ...rest
  } = props;

  const isLink = Boolean(to);
  const isAlert = Boolean(alert);
  const Component = isLink ? Link : "button";

  return (
    <Component
      {...(isLink ? { to } : { type: "button" })}
      onClick={onClick}
      className={`w-full px-2.5 h-11 cursor-pointer flex items-center justify-start gap-2.5 rounded-lg transition-all duration-300 ease-out hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 active:bg-neutral-50/50 dark:active:bg-neutral-800/50 ${
        className ? ` ${className}` : ""
      }${
        isAlert ? " text-rose-600" : " text-neutral-700 dark:text-neutral-300"
      }`}
      {...rest}
    >
      {Icon && (
        <div
          className="min-w-5 h-full flex items-center justify-center"
          style={{ transform: rotate ? `rotate(${rotate}deg)` : "none" }}
        >
          {Icon && <Icon size={20} strokeWidth={1.5} className="size-5" />}
        </div>
      )}
      {title && typeof title === "string" && (
        <div
          className={`min-w-max size-full flex items-center justify-start select-none text-sm${
            Icon && title ? " pr-4" : ""
          }`}
        >
          {title || "Título del botón"}
        </div>
      )}
    </Component>
  );
}

import { Link } from "react-router-dom";
import { useThemeColor } from "../../context";

export default function Button({
  children,
  to,
  href,
  full,
  variant = "default",
  className = "",
  disabled = false,
  ...props
}) {
  const { bgClass, hoverClass, txtClass, borderClass } = useThemeColor();

  const base = `${
    full ? "w-full " : ""
  }h-9 px-2.5 md:px-4 min-w-max flex items-center justify-center gap-2 cursor-pointer rounded-lg text-sm md:text-md tracking-wide transition-all duration-300 ease-out`;

  const variants = {
    default: `text-neutral-950 dark:text-neutral-50 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 ${
      disabled ? "!cursor-no-drop dark:text-neutral-500" : ""
    }`,
    secondary:
      "bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700",
    follow: `!min-w-24 ${bgClass} ${hoverClass} text-white ${borderClass}`,
    followed: `!min-w-24 ${txtClass} border ${borderClass}`,
    icon: "w-9 h-9 !px-0 rounded-xl hover:bg-neutral-200/50 hover:dark:bg-neutral-800/50",
    filter:
      "border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800",
    active:
      "bg-neutral-950 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-950",
    inactive:
      "bg-neutral-100/75 hover:bg-neutral-200/75 dark:bg-neutral-800/75 hover:dark:bg-neutral-700/75 text-neutral-950 dark:text-white text-sm border border-neutral-300/50 dark:border-neutral-700/75",
    submit: `!min-w-24 ${bgClass} ${hoverClass} text-white ${borderClass}`,
  };

  if (to) {
    return (
      <Link
        to={to}
        className={`${base} ${variants[variant]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${variants[variant]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className} tracking-wide`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

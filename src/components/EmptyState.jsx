import { Link } from "react-router-dom";

export default function EmptyState({
  Icon,
  title,
  caption,
  path,
  actionText,
}) {
  return (
    <div className="size-full p-6 md:p-8 flex flex-col items-center justify-center gap-3 rounded-xl bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75">
      {Icon && (
        <Icon
          strokeWidth={1.5}
          className="size-12 text-neutral-400 dark:text-neutral-500"
        />
      )}

      {title && (
        <span className="text-base font-bold text-center text-neutral-800 dark:text-neutral-200">
          {title}
        </span>
      )}

      {caption && (
        <span className="w-full max-w-sm text-sm text-center text-neutral-500 dark:text-neutral-400">
          {caption}
        </span>
      )}

      {path && actionText && (
        <Link
          to={path}
          className="px-4 py-2 mt-2 flex items-center justify-center rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 font-medium text-sm text-neutral-900 dark:text-neutral-100 transition-all duration-300 ease-out"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
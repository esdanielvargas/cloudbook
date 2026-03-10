import { Button } from "./buttons";

export default function EmptyState({
  Icon,
  title,
  caption,
  path,
  actionText,
  className = "",
}) {
  return (
    <div className={`size-full p-6 md:p-8 flex flex-col items-center justify-center gap-3 rounded-xl bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75 ${className}`}>
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
        <Button to={path} variant="submit" className="mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
}
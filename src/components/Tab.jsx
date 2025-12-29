import {
  ChevronRight,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Tab({
  Icon,
  Icon2,
  title,
  caption,
  path = false,
  href = false,
  action = false,
}) {
  if (path) {
    return (
      <Link
        to={`${path}`}
        className="w-full min-h-14 py-3 px-4 flex items-center justify-start gap-4 bg-neutral-100/75 hover:bg-neutral-200/75 dark:bg-neutral-900/75 dark:hover:bg-neutral-800/75 transition-all duration-300 ease-out cursor-pointer"
      >
        {Icon && (
          <div className="size-6 aspect-square flex items-center justify-center">
            <Icon size={24} strokeWidth={1.5} className="text-neutral-800 dark:text-neutral-200" />
          </div>
        )}
        <div className="w-full flex flex-col items-start justify-center">
          {title && (
            <div className="w-full flex items-center justify-start text-sm md:text-md text-neutral-800 dark:text-neutral-200">
              {title}
            </div>
          )}
          {caption && (
            <div className="w-full flex items-center justify-start text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
              {caption}
            </div>
          )}
        </div>
        {path && (
          <div className="size-6 aspect-square flex items-center justify-center">
            <ChevronRight size={20} className="text-neutral-600 dark:text-neutral-400" />
          </div>
        )}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={`${href}`}
        target="_blank"
        className="w-full min-h-14 py-3 px-4 flex items-center justify-start gap-4 -rounded-md bg-neutral-100/75 hover:bg-neutral-200/75 dark:bg-neutral-900/75 dark:hover:bg-neutral-800/75 transition-all duration-300 ease-out cursor-pointer"
      >
        {Icon && (
          <div className="size-6 aspect-square flex items-center justify-center">
            <Icon size={24} strokeWidth={1.5} className="text-neutral-800 dark:text-neutral-200" />
          </div>
        )}
        <div className="w-full flex flex-col items-start justify-center">
          {title && (
            <div className="w-full flex items-center justify-start text-sm md:text-md text-neutral-800 dark:text-neutral-200">
              {title}
            </div>
          )}
          {caption && (
            <div className="w-full flex items-center justify-start text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
              {caption}
            </div>
          )}
        </div>
        {href && (
          <div className="size-6 aspect-square flex items-center justify-center">
            <SquareArrowOutUpRight size={20} className="text-neutral-600 dark:text-neutral-400" />
          </div>
        )}
      </a>
    );
  }
  if (action) {
    return (
      <button
        type="button"
        className="w-full min-h-14 py-3 px-4 flex items-center justify-start gap-4 -rounded-md bg-neutral-100/75 hover:bg-neutral-200/75 dark:bg-neutral-900/75 dark:hover:bg-neutral-800/75 transition-all duration-300 ease-out cursor-pointer"
        onClick={() => action()}
      >
        {Icon && (
          <div className="size-6 aspect-square flex items-center justify-center">
            <Icon size={24} strokeWidth={1.5} className="text-neutral-800 dark:text-neutral-200" />
          </div>
        )}
        <div className="w-full flex flex-col items-start justify-center">
          {title && (
            <div className="w-full flex items-center justify-start text-sm md:text-md text-neutral-800 dark:text-neutral-200">
              {title}
            </div>
          )}
          {caption && (
            <div className="w-full flex items-center justify-start text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
              {caption}
            </div>
          )}
        </div>
        {action && Icon2 && (
          <div className="size-6 aspect-square flex items-center justify-center">
            <Icon2 size={20} className="text-neutral-600 dark:text-neutral-400" />
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="w-full min-h-14 py-3 px-4 flex items-center justify-start gap-4 -rounded-md bg-neutral-100/75 hover:bg-neutral-200/75 dark:bg-neutral-900/75 dark:hover:bg-neutral-800/75 transition-all duration-300 ease-out cursor-default">
      {Icon && (
        <div className="size-6 aspect-square flex items-center justify-center">
          <Icon size={24} strokeWidth={1.5} className="text-neutral-800 dark:text-neutral-200" />
        </div>
      )}
      <div className="w-full flex flex-col items-start justify-center">
        {title && (
          <div className="w-full flex items-center justify-start text-sm md:text-md text-neutral-800 dark:text-neutral-200">
            {title}
          </div>
        )}
        {caption && (
          <div className="w-full flex items-center justify-start text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
            {caption}
          </div>
        )}
      </div>
      {path ||
        (action && (
          <div className="size-6 aspect-square flex items-center justify-center">
            <ChevronRight size={20} className="text-neutral-600 dark:text-neutral-400" />
          </div>
        ))}
    </div>
  );
}

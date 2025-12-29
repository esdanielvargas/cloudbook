import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar({
  Icon,
  value,
  onChange,
  placeholder = "Buscar",
}) {
  return (
    <div className="w-full flex items-center justify-center gap-2">
      <div className="w-full h-10 flex items-center justify-center overflow-hidden rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
        <div className="size-10 min-w-10 flex items-center justify-center">
          {Icon ? (
            <Icon size={20} classNames="size-5" strokeWidth={1.5} />
          ) : (
            <MagnifyingGlassIcon className="size-5" />
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="size-full bg-transparent text-xs md:text-sm font-sans focus:outline-none"
        />
      </div>
    </div>
  );
}

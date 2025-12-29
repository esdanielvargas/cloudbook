import { abbrNumber } from "../../utils";

export default function Reactive({ counter = 0, active, color, children, ...props }) {
  return (
    <button
      type="button"
      className={`h-9 px-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer ${
        active ? color : ""
      }`}
      {...props}
    >
      <div className="size-4.5">{children}</div>
      {counter > 0 && (
        <div className="text-[12.5px] font-mono mr-0.5">
          {abbrNumber(counter)}
        </div>
      )}
    </button>
  );
}

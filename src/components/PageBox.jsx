export default function PageBox({ active = false, children, className = "" }) {
  return (
    <>
      <div
        className={`size-full z-1 flex flex-col gap-1 md:gap-2 ${
          active
            ? "p-2 md:p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75 "
            : ""
        }mb-2 md:mb-4 overflow-hidden ${className}`}
      >
        {children}
      </div>
      <div className="w-full min-h-20 md:min-h-4" />
    </>
  );
}

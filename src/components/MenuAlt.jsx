export default function MenuAlt(props) {
  const { className, children, isOpen, ...rest } = props;

  return (
    <div
      className={`min-w-50 p-1 md:p-1.5 absolute overflow-hidden flex flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-3xl transition-all duration-300 ease-out ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      } ${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children}
    </div>
  );
}

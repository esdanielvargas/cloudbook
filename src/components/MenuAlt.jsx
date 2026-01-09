export default function MenuAlt(props) {
  const { className, children, isOpen, root = "all", ...rest } = props;

  const roots = {
    "all": "rounded-xl",
    "top-left": "rounded-xl rounded-tl-none!",
    "top-right": "rounded-xl rounded-tr-none!",
    "bottom-left": "rounded-xl rounded-bl-none!",
    "bottom-right": "rounded-xl rounded-br-none!",
  };

  return (
    <div
      className={`min-w-50 p-1 md:p-1.5 absolute overflow-hidden flex flex-col bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-3xl transition-all duration-300 ease-out ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      } ${className ? ` ${className}` : ""} ${roots[root]}`}
      {...rest}
    >
      {children}
    </div>
  );
}

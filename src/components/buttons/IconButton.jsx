export default function IconButton(props) {
  const { Icon, title, label, ...rest } = props;

  return (
    <button
      type="button"
      title={title}
      aria-label={label}
      className="size-9.5 flex items-center justify-center cursor-pointer rounded-lg bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75"
      {...rest}
    >
      {Icon && <Icon size={20} strokeWidth={1.5} />}
    </button>
  );
}

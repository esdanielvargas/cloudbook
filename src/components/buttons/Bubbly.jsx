import { Link } from "react-router-dom";
import { useThemeColor } from "../../context";

export default function Bubbly({
  Icon,
  title,
  path,
  onClick,
  active = false,
}) {
  const { bgClass, hoverClass } = useThemeColor();

  const commonProps = {
    className:
      "group size-15 flex flex-col items-center justify-center gap-0.5 relative rounded-xl cursor-pointer focus-visible:outline-0",
  };

  const content = (
    <>
      {Icon && <Icon className={`size-6 md:size-7 z-2${active ? " text-white" : ""}`} />}
      {title && (
        <div
          className={`min-w-max z-2 px-2.5 py-1 font-normal text-xs font-sans tracking-[.2px] md:absolute md:left-[calc(100%_+_16px)] md:bg-neutral-100 md:dark:bg-neutral-800 rounded-md md:border border-neutral-200 dark:border-neutral-700 transition-all duration-300 ease-out md:invisible md:opacity-0 group-hover:visible group-hover:opacity-100${
            active ? " text-white" : ""
          }`}
        >
          {title}
        </div>
      )}
      <div
        className={`absolute ${
          active
            ? `size-full ${bgClass} ${hoverClass}`
            : "size-0 bg-neutral-200/75 dark:bg-neutral-800 group-hover:size-full group-focus:size-full"
        } rounded-xl transition-all duration-300 ease-out z-0`}
      />
    </>
  );

  if (path) {
    return (
      <Link to={path} {...commonProps}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} {...commonProps}>
      {content}
    </button>
  );
}

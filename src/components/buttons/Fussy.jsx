import { Link } from "react-router-dom";

export default function Fussy({ title, path }) {
  return (
    <Link to={`${path}`} className="min-w-max h-9 px-3 cursor-pointer text-sm select-none flex items-center rounded-xl bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75 transition-all duration-300 ease-out md:active:underline md:active:transform md:active:scale-106 md:active:-rotate-6 md:hover:underline md:hover:transform md:hover:scale-106 md:hover:-rotate-6">
      {title}
    </Link>
  );
}

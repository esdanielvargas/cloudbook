import { Link } from "react-router-dom";

export default function Fussy({ title, path }) {
  return (
    <Link to={`${path}`} className="min-w-max h-9 px-3 cursor-pointer text-sm flex items-center rounded-xl bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75 transition-all duration-300 ease-out active:underline active:transform active:scale-106 active:-rotate-6 hover:underline hover:transform hover:scale-106 hover:-rotate-6">
      {title}
    </Link>
  );
}

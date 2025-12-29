import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Plank(props) {
  return (
    <Link
      to={`/settings/${props?.path}`}
      className="w-full h-12 px-4 flex items-center justify-center rounded-xl hover:bg-neutral-800 cursor-pointer transition-all duration-300 ease-out"
    >
      <div className="w-full flex items-center justify-start">
        {props?.title || "Título"}
      </div>
      <div className="w-full flex items-center justify-end">
        {props?.icon || <ChevronRight strokeWidth={1.5} />}
      </div>
    </Link>
  );
}

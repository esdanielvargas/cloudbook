import { Link, useParams } from "react-router-dom";
import { abbrNumber, formatDateFull } from "../../utils";

export default function PostMeta(props) {
  const { posted, isAuthor } = props;
  const { username, postId } = useParams();
  const views = 100;

  console.log(isAuthor)

  return (
    <div className="w-full px-2 py-3 md:px-4 flex items-center justify-between">
      <div className="w-full flex items-center justify-start">
        <div className="min-w-max text-xs font-mono text-neutral-400 cursor-pointer active:underline hover:underline">
          {formatDateFull(posted)}
        </div>
      </div>
      <div className="w-full flex items-center justify-end">
        {isAuthor ? (
          <Link
            to={`/${username}/post/${postId}/activity`}
            className="min-w-max text-xs font-mono text-neutral-400 cursor-pointer active:underline hover:underline"
          >
            Ver actividad
          </Link>
        ) : (
          <div className="min-w-max flex items-center gap-1 text-xs font-mono text-neutral-400 cursor-pointer active:underline hover:underline">
            {abbrNumber(views) + " "}
            {views > 0 ? "Vistas" : "Vista"}
          </div>
        )}
      </div>
    </div>
  );
}

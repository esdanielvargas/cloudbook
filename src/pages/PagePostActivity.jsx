import { PageBox, PageHeader, PageLine, Range } from "../components";
import { Link, useParams } from "react-router-dom";
import { db, usePosts } from "../hooks";
import {
  ArrowDownTrayIcon,
  ArrowPathRoundedSquareIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export default function PagePostActivity() {
  const posts = usePosts(db);

  const { username, postId } = useParams();

  const postSelected = posts.find((post) => post.id === postId);

  // Validación si aún no se ha cargado el post.
  if (!postSelected) return <div className="p-4">Cargando publicación...</div>;

  const { likes = [], comments = [], reposts = [], 
    // quotes = [],
     shared = [], saved = [] } = postSelected;

  const all = likes?.length + comments?.length + reposts?.length + saved.length;

  const quotes = postSelected.reposts || postSelected.text;

  console.log("quote", quotes);

  return (
    <>
      <PageHeader
        title="Actividad"
        icon={<ArrowDownTrayIcon className="size-5" />}
      />
      <PageBox active className="p-1! md:p-2!">
        <div className="w-full flex flex-col">
          <div className="w-full px-1 md:px-2 pt-1 md:pt-2 select-none">
            <div className="font-bold text-xl">Interacciones</div>
          </div>
          <div className="w-full px-1 md:px-2 py-4 flex items-end justify-start gap-1 md:gap-2 select-none">
            <div className="text-5xl">{all}</div>
            <div className="text-neutral-400">Total de interacciones</div>
          </div>
          <div className="w-full mb-1 flex flex-col">
            {/* likes */}
            <Link
              to={`/${username}/post/${postId}/activity/likes`}
              className="w-full px-1 md:px-2 py-2 cursor-pointer flex flex-col gap-0.5 select-none rounded-xl transition-all duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-neutral-800/45"
            >
              <div className="w-full flex items-center justify-start gap-1">
                <HeartIcon className="size-4.5" />
                Me gustas
              </div>
              <div className="w-full flex items-center gap-2">
                <Range value={likes.length} total={all} />
                <div className="min-w-4 flex items-center justify-end">
                  {likes.length}
                </div>
              </div>
            </Link>
            {/* comments */}
            <Link
              to={`/${username}/post/${postId}/activity/comments`}
              className="w-full px-1 md:px-2 py-2 cursor-pointer flex flex-col gap-0.5 select-none rounded-xl transition-all duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-neutral-800/45"
            >
              <div className="w-full flex items-center justify-start gap-1">
                <ChatBubbleBottomCenterTextIcon className="size-4.5" />
                Comentarios
              </div>
              <div className="w-full flex items-center gap-2">
                <Range value={comments.length} total={all} />
                <div className="min-w-4 flex items-center justify-end">
                  {comments.length}
                </div>
              </div>
            </Link>
            {/* reposts */}
            <Link
              to={`/${username}/post/${postId}/activity/reposts`}
              className="w-full px-1 md:px-2 py-2 cursor-pointer flex flex-col gap-0.5 select-none rounded-xl transition-all duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-neutral-800/45"
            >
              <div className="w-full flex items-center justify-start gap-1">
                <ArrowPathRoundedSquareIcon className="size-4.5" />
                Republicados
              </div>
              <div className="w-full flex items-center gap-2">
                <Range value={reposts.length} total={all} />
                <div className="min-w-4 flex items-center justify-end">
                  {reposts.length}
                </div>
              </div>
            </Link>
            {/* Quotes */}
            <Link
              to={`/${username}/post/${postId}/activity/quotes`}
              className="w-full px-1 md:px-2 py-2 cursor-pointer flex flex-col gap-0.5 select-none rounded-xl transition-all duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-neutral-800/45"
            >
              <div className="w-full flex items-center justify-start gap-1">
                <ChatBubbleLeftEllipsisIcon className="size-4.5" />
                Citas
              </div>
              <div className="w-full flex items-center gap-2">
                <Range value={reposts.length} total={all} />
                <div className="min-w-4 flex items-center justify-end">
                  {reposts.length}
                </div>
              </div>
            </Link>
            {/* Shared */}
            <Link
              to={`/${username}/post/${postId}/activity/shared`}
              className="w-full px-1 md:px-2 py-2 cursor-pointer flex flex-col gap-0.5 select-none rounded-xl transition-all duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-neutral-800/45"
            >
              <div className="w-full flex items-center justify-start gap-1">
                <PaperAirplaneIcon className="size-4.5" />
                Compartidos
              </div>
              <div className="w-full flex items-center gap-2">
                <Range value={shared.length} total={all} />
                <div className="min-w-4 flex items-center justify-end">
                  {shared.length}
                </div>
              </div>
            </Link>
            {/* saved */}
            <Link
              to={`/${username}/post/${postId}/activity/saved`}
              className="w-full px-1 md:px-2 py-2 cursor-pointer flex flex-col gap-0.5 select-none rounded-xl transition-all duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-neutral-800/45"
            >
              <div className="w-full flex items-center justify-start gap-1">
                <BookmarkIcon className="size-4.5" />
                Guardados
              </div>
              <div className="w-full flex items-center justify-between gap-2">
                <Range value={saved.length} total={all} />
                <div className="min-w-4 flex items-center justify-end">
                  {saved.length}
                </div>
              </div>
            </Link>
          </div>
        </div>
        <PageLine />
      </PageBox>
    </>
  );
}

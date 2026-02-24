import { useParams } from "react-router-dom";
import { db, usePosts, useUsers } from "@/hooks";
import { PlayIcon } from "@heroicons/react/24/solid";
import { ImagesIcon } from "lucide-react";
import MediaItem from "./MediaItem";

export default function ProfileMedia() {
  const posts = usePosts(db);
  const users = useUsers(db);

  const { username } = useParams();

  const user = users.find((u) => u.username === username);

  if (!user) return null;

  // Filtramos solo posts de este usuario
  const userPost = posts.filter((post) => post?.userId === user?.id);

  // Filtramos solo posts con media (fotos o miniaturas de videos)
  const mediaPosts = userPost.filter(
    (post) =>
      (Array.isArray(post?.photos) && post?.photos?.length > 0) ||
      Boolean(post?.videoId) ||
      Boolean(post?.video)
  );

  // Filtramos solo los posts publicos
  const statusPosts = mediaPosts.filter((post) => post?.status === "public");

  // Ordenamos del más nuevo al más viejo (asumimos que hay una propiedad post.createdAt)
  const sortedMedia = [...statusPosts].sort((a, b) => a.posted - b.posted);

  return (
    <div className="w-full grid grid-cols-3 gap-0.5 md:gap-1">
      {sortedMedia?.length > 0 ? (
        sortedMedia.map((post) => <MediaItem key={post?.id} post={post} />)
      ) : (
        <div className="size-full col-span-3 p-4 flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900">
          <span className="text-xs md:text-sm text-neutral-400">
            Aún no hay fotos o videos en tú perfil.
          </span>
        </div>
      )}
    </div>
  );
}

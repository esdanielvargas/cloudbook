import { useParams } from "react-router-dom";
import { db, usePosts, useUsers } from "@/hooks";
import { PlayIcon } from "@heroicons/react/24/solid";
import { Images } from "lucide-react";
import MediaItem from "./MediaItem";
import EmptyState from "../EmptyState";

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
      Boolean(post?.video),
  );

  // Filtramos solo los posts publicos
  const statusPosts = mediaPosts.filter((post) => post?.status === "public");

  // Ordenamos del más nuevo al más viejo
  const sortedMedia = [...statusPosts].sort((a, b) => b.posted - a.posted);

  return (
    <div className="w-full grid grid-cols-3 gap-0.5 md:gap-1">
      {sortedMedia?.length > 0 ? (
        sortedMedia.map((post) => <MediaItem key={post?.id} post={post} />)
      ) : (
        <EmptyState
          Icon={Images}
          title={"Sin archivos multimedia"}
          caption={"Aún no hay fotos ni videos de este perfil."}
          className="col-span-3"
        />
      )}
    </div>
  );
}

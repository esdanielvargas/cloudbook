import { useParams } from "react-router-dom";
import { db, usePosts, useUsers } from "../../hooks";
import Post from "../Post";

export default function ProfileReposts() {
  const posts = usePosts(db);
  const users = useUsers(db);

  const { username } = useParams();

  const user = users.find((u) => u.username === username);

  if (!user) return null;

  // Filtramos solo posts de este usuario
  const userPosts = posts.filter((post) => post?.userId === user?.id);

  // Filtramos solo los posts publicos
  const statusPosts = userPosts.filter((post) => post?.show === true);

  // Filtramos solo los posts que sean reposts
  const reposts = statusPosts.filter((post) => post?.repost);

  // Ordenamos del más nuevo al más antiguo
  const sortedPosts = [...reposts].sort(
    (a, b) =>
      new Date(b.posted.seconds * 1000) - new Date(a.posted.seconds * 1000)
  );

  console.log(sortedPosts);

  return (
    <div className="w-full flex flex-col gap-1">
      {sortedPosts?.length > 0 ? (
        sortedPosts.map((post) => (
          <Post key={post.id} {...post} {...user} postId={post?.id} />
        ))
      ) : (
        <div className="size-full p-4 flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900">
          <span className="text-xs md:text-sm text-neutral-400">
            Aún no hay publicaciones reposteadas en tú perfil.
          </span>
        </div>
      )}
    </div>
  );
}

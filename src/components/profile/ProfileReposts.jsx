import { useParams } from "react-router-dom";
import { db, usePosts, useUsers } from "@/hooks";
import { Repeat } from "lucide-react";
import EmptyState from "../EmptyState";
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
  const statusPosts = userPosts.filter((post) => post?.status === "public");

  // Filtramos solo los posts que sean reposts
  const reposts = statusPosts.filter((post) => post?.repost);

  // Ordenamos del más nuevo al más antiguo
  const sortedPosts = [...reposts].sort((a, b) => b.posted - a.posted);

  return (
    <div className="w-full flex flex-col gap-1">
      {sortedPosts?.length > 0 ? (
        sortedPosts.map((post) => (
          <Post key={post.id} {...post} {...user} postId={post?.id} />
        ))
      ) : (
        <EmptyState
          Icon={Repeat}
          title={"Aún no hay republicaciones"}
          caption={"Aún no se han compartido publicaciones de otros usuarios."}
          className="col-span-3"
        />
      )}
    </div>
  );
}

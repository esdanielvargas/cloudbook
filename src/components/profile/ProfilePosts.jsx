import { useParams } from "react-router-dom";
import { db, usePosts, useUsers } from "../../hooks";
import Post from "../Post";
import { getAuth } from "firebase/auth";
import EmptyState from "../EmptyState";
import { File, FileText } from "lucide-react";

export default function ProfilePosts() {
  const auth = getAuth();
  const posts = usePosts(db);
  const users = useUsers(db);

  const { username } = useParams();

  const user = users.find((u) => u.username === username);

  if (!user) return null;

  // Filtramos solo posts de este usuario
  const userPosts = posts.filter((post) => post?.userId === user?.id);

  // Filtramos solo los posts publicos
  const statusPosts = userPosts.filter((post) => post?.status === "public");

  // Ordenamos del más nuevo al más antiguo
  const sortedPosts = [...statusPosts].sort((a, b) => b.posted - a.posted);

  // Comparamos el usuario de este perfil con el usuario logeado
  const isAuthor = auth?.currentUser?.uid === user?.uid;

  return (
    <div className="w-full flex flex-col gap-1">
      {sortedPosts?.length > 0 ? (
        sortedPosts.map((post) => (
          <Post
            key={post.id}
            {...post}
            {...user}
            author={isAuthor}
            postId={post?.id}
          />
        ))
      ) : (
        <EmptyState
          Icon={FileText}
          title={"Sin publicaciones"}
          caption={"Aún no hay publicaciones de este perfil."}
        />
      )}
    </div>
  );
}

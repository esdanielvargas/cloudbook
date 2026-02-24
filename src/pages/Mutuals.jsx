import { getAuth } from "firebase/auth";
import { db, usePosts, useUsers } from "../hooks";
import Post from "../components/Post";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components";

export default function Mutuals() {
  const auth = getAuth();
  const users = useUsers(db);
  const posts = usePosts(db);

  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid,
  );

  const postsEnriched = posts
    .filter((post) => post?.status === "public")
    .filter(
      (post) =>
        currentUser?.following?.includes(post?.userId) &&
        currentUser?.followers?.includes(post?.userId),
    )
    .map((post) => {
      const user = users.find((u) => u.id === post.userId);
      const isAuthor = auth.currentUser?.uid === user?.uid;

      return {
        ...post,
        ...user,
        postId: post.id,
        author: isAuthor ? user : null,
      };
    });

  return (
    <>
      {postsEnriched?.length > 0 ? (
        postsEnriched.map((post) => <Post key={post.postId} {...post} />)
      ) : (
        <EmptyState
          Icon={Users}
          title="Aún no hay publicaciones"
          caption="Aquí aparecerán las publicaciones de las personas que sigues y te siguen de vuelta."
          path="/"
          actionText="Descubrir contenido"
        />
      )}
    </>
  );
}

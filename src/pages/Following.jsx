import { getAuth } from "firebase/auth";
import { db, usePosts, useUsers } from "../hooks";
import Post from "../components/Post";
import { EmptyState } from "@/components";
import { UserCheck } from "lucide-react";

export default function Following() {
  const auth = getAuth();
  const users = useUsers(db);
  const posts = usePosts(db);

  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid,
  );

  const postsEnriched = posts
    .filter((post) => post.show === true || post.status === "public")
    .filter((post) => currentUser?.following?.includes(post?.userId))
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
          Icon={UserCheck}
          title={"No hay publicaciones recientes"}
          caption={"Las personas que sigues no han publicado nada nuevo. ¡Busca más perfiles interesantes!"}
          path={"/search"}
          actionText={"Buscar usuarios"}
        />
      )}
    </>
  );
}

import { db, usePosts, useUsers } from "@/hooks";
import { getAuth } from "firebase/auth";
import Post from "@/components/Post";
import { UserCheck } from "lucide-react";
import { EmptyState } from "@/components";

export default function ForYou() {
  const auth = getAuth();
  const users = useUsers(db);
  const posts = usePosts(db);

  const postsEnriched = posts
    .filter((post) => post?.show === true || post?.status === "public")
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

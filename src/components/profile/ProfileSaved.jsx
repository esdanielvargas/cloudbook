import { db, usePosts, useUsers } from "../../hooks";
import { useParams } from "react-router-dom";
import Post from "../Post";
import { getAuth } from "firebase/auth";
import EmptyState from "../EmptyState";
import { Ban, BookmarkX } from "lucide-react";

export default function ProfileSaved() {
  const auth = getAuth();
  const users = useUsers(db);
  const posts = usePosts(db);

  const { username } = useParams();

  const userSelected = users.find((user) => user?.username === username);
  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid,
  );

  const postsFiltered = posts.filter((post) => {
    if (!Array.isArray(post.saved)) return false;

    const isSavedByUser = post.saved.some(
      (savedItem) => savedItem.id === userSelected?.id,
    );

    const isPublic = post.status === "public";

    return isSavedByUser && isPublic;
  });

  return (
    <>
      {currentUser?.username === username ? (
        <div className="size-full flex flex-col gap-1">
          {postsFiltered.length > 0 ? (
            postsFiltered.map((post, index) => {
              // Buscar usuario asociado a la publicación
              const user = users.find((u) => u.id === post.userId);

              return (
                <Post
                  {...user}
                  {...post}
                  key={post.id || index}
                  postId={post.id}
                  authorId={user?.id}
                />
              );
            })
          ) : (
            <EmptyState
              Icon={BookmarkX}
              title={"Sin guardados"}
              caption={"Aún no hay publicaciones guardadas."}
            />
          )}
        </div>
      ) : (
        <EmptyState
          Icon={Ban}
          title={"Acceso restringido"}
          caption={"No tienes acceso a esta página."}
        />
      )}
    </>
  );
}

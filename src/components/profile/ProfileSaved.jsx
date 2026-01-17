import { db, usePosts, useUsers } from "../../hooks";
import { useParams } from "react-router-dom";
import Post from "../Post";
import { getAuth } from "firebase/auth";

export default function ProfileSaved() {
  const auth = getAuth();
  const users = useUsers(db);
  const posts = usePosts(db);

  const { username } = useParams();

  const userSelected = users.find((user) => user?.username === username);
  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid
  );

  const postsFiltered = posts.filter((post) => {
    if (!Array.isArray(post.saved)) return false;

    const isSavedByUser = post.saved.some(
      (savedItem) => savedItem.id === userSelected?.id
    );

    const isPublic = post.status === "public";

    return isSavedByUser && isPublic;
  });

  return (
    <>
      {currentUser?.username === username ? (
        <div className="w-full flex flex-col gap-1">
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
            <div className="w-full p-4 flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900">
              <span className="text-xs md:text-sm text-neutral-400">
                Aún no hay publicaciones guardadas en tú perfil.
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full p-4 flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900">
          <span className="text-xs md:text-sm text-neutral-400">
            No tienes acceso a esta página.
          </span>
        </div>
      )}
    </>
  );
}

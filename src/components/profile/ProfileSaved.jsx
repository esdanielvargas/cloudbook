import { useParams } from "react-router-dom";
import { db, useAuth, usePosts, useUsers } from "../../hooks";
import Post from "../Post";

export default function ProfileSaved() {
  const auth = useAuth(db);
  const users = useUsers(db);
  const posts = usePosts(db);
  const { username } = useParams();
  const userSelected = users.find((user) => user.username === username);
  const currentUser = users.find((user) => user.email === auth?.email);

  const postsFiltered = posts.filter(
    (post) => Array.isArray(post.saved) && post.saved.includes(userSelected?.id)
  );

  return (
    <>
      {currentUser?.username === username ? (
        <div className="w-full flex flex-col gap-1">
          {postsFiltered.length > 0 ? (
            postsFiltered.map((post, index) => {
              // Buscar usuario asociado a la publicación
              const user = users.find((u) => u.id === post.userId);

              return (
                post.show && (
                  <Post
                    {...user}
                    {...post}
                    key={index}
                    postId={post.id}
                    authorId={user?.id}
                  />
                )
              );
            })
          ) : (
            // <div className="code">Aún no hay publicaciones guardadas.</div>
            <div className="size-full p-4 flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900">
              <span className="text-xs md:text-sm text-neutral-400">
                Aún no hay publicaciones guardadas en tú perfil.
              </span>
            </div>
          )}
        </div>
      ) : (
        // <div className="code">No tienes acceso a está página.</div>
        <div className="size-full p-4 flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900">
          <span className="text-xs md:text-sm text-neutral-400">
            No tienes acceso a esta página.
          </span>
        </div>
      )}
    </>
  );
}

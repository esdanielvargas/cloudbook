import { Link } from "react-router-dom";
import { db, usePosts, useUsers } from "../../hooks";
import PostContent from "./PostContent";
import PostHeader from "./PostHeader";
import PostText from "./PostText";

export default function PostRepost(props) {
  const posts = usePosts(db);
  const users = useUsers(db);

  // 1. Encontrar el post al que hacemos referencia
  const repostedPost = posts.find((post) => post?.id === props?.repost);

  // 2. Verificar disponibilidad (Lógica nueva)
  const isUnavailable =
    repostedPost?.status === "archived" || repostedPost?.status === "deleted";

  // Si el post no existe en la BD (aún cargando o borrado físico), retornamos null por seguridad
  // O si prefieres mostrar el mensaje también cuando no se encuentra, quita este if.
  if (!repostedPost && !isUnavailable) return null;

  // 3. RENDERIZADO DE ESTADO "NO DISPONIBLE"
  if (isUnavailable) {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="w-full mx-2 md:mx-4 flex items-center justify-start min-h-14 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900/50">
          <span className="mx-4 font-medium text-xs font-sans text-neutral-500 italic select-none pointer-events-none">
            Esta publicación no está disponible.
          </span>
        </div>
      </div>
    );
  }

  // 4. Encontrar al dueño de ese post
  const repostUser = users.find((user) => user?.id === repostedPost?.userId);

  // 5. VERIFICACIÓN CLAVE: ¿Este post que encontramos TIENE un campo 'repost'?
  // Si 'repostedPost.repost' tiene un ID, significa que es un "repost de un repost" (Nivel 2)
  const isNestedRepost = repostedPost?.repost;

  // Si no se ha cargado la data aún, no mostramos nada para evitar errores
  // if (!repostedPost) return null;

  return (
    <div className="w-full mb-2 md:mb-2 flex items-center justify-center">
      <div className="w-full mx-2 md:mx-4 flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {/* LÓGICA CONDICIONAL */}
        {isNestedRepost ? (
          // CASO A: ES UN REPOST ANIDADO -> MOSTRAR SOLO ENLACE
          <Link
            to={`/${repostUser?.username}/post/${repostedPost.id}`}
            className="w-full min-h-12 pb-2 md:pb-4 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-neutral-950/40 -hover:bg-gray-200 dark:hover:bg-neutral-950/50 transition-all duration-300 ease-out"
          >
            <PostHeader
              {...repostUser}
              {...repostedPost}
              postId={repostedPost?.id}
              action={false}
            />
            {repostedPost?.caption ? (
              <div className="w-full flex items-center justify-center">
                <PostText caption={repostedPost?.caption} />
              </div>
            ) : (
              <div className="w-full flex items-center justify-start">
                <span className="w-full mx-2 md:mx-4 text-xs whitespace-pre-wrap">
                  Ver la publicación original...
                </span>
              </div>
            )}
          </Link>
        ) : (
          // CASO B: ES CONTENIDO ORIGINAL -> MOSTRAR TODO
          <Link
            to={`/${repostUser?.username}/post/${repostedPost.id}`}
            className="w-full min-h-12 flex flex-col items-center justify-center bg-neutral-50/75 dark:bg-neutral-900/75 dark:hover:bg-neutral-900/50 transition-all duration-300 ease-out"
          >
            <PostHeader
              {...repostUser}
              {...repostedPost}
              postId={repostedPost?.id}
              action={false}
            />
            {repostedPost?.link ? (
              <div className="w-full mb-2 md:mb-4 flex items-center justify-start">
                <span className="w-full mx-2 md:mx-4 text-xs whitespace-pre-wrap">
                  Ver la publicación original...
                </span>
              </div>
            ) : (
              <PostContent {...repostedPost} action={false} />
            )}
          </Link>
        )}
      </div>
    </div>
  );
}

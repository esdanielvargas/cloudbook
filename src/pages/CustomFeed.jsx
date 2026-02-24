import { getAuth } from "firebase/auth";
import { db, useFeeds, usePosts, useUsers } from "@/hooks";
import Post from "@/components/Post";
import { useParams } from "react-router-dom";
import { EmptyState } from "@/components";
import { LayoutList, Newspaper, Rss } from "lucide-react";

export default function CustomFeed() {
  const auth = getAuth();
  const users = useUsers(db);
  const posts = usePosts(db);
  const feeds = useFeeds(db);

  const { feedId } = useParams();

  // 1. Obtener la lista actual
  const feedSelected = feeds?.find((feed) => feed.id === feedId);

  // Mientras carga o si no existe, mostramos un pequeño esqueleto
  if (!feedSelected)
    return (
      <div className="p-10 text-center text-gray-500">Cargando cielo... ☁️</div>
    );

  // 2. Obtener el array de miembros de ESTA lista específica
  // Usamos || [] por si la lista aún no tiene miembros para que no dé error de undefined
  const feedMembers = feedSelected?.members || [];

  // 3. Procesamiento de las publicaciones
  const postsEnriched = posts
    // A. Mostrar SOLO los posts de los usuarios que pertenecen a esta lista
    .filter((post) => feedMembers.includes(post?.userId))
    // B. Que sean públicos o estén activos
    .filter((post) => post?.show === true || post?.status === "public")
    // C. Ordenar de más reciente a más antiguo
    .sort((a, b) => {
      // Dependiendo de cómo guardes la fecha en Firebase, esto puede variar.
      // Si usas serverTimestamp() de Firebase, a veces devuelve un objeto con .seconds
      const dateA = a.createdAt?.seconds || a.createdAt || 0;
      const dateB = b.createdAt?.seconds || b.createdAt || 0;
      return dateB - dateA;
    })
    // D. Enriquecer con la info del usuario
    .map((post) => {
      const user = users.find((u) => (u.id || u.email) === post.userId);
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
      {/* Header opcional de la lista para saber dónde estamos */}
      <div className="p-4 hidden border border-gray-800">
        <h2 className="text-xl font-bold">{feedSelected.title}</h2>
        {feedSelected.description && (
          <p className="text-sm text-gray-400">{feedSelected.description}</p>
        )}
      </div>

      {/* Renderizado de Posts o Estado Vacío */}
      {postsEnriched.length > 0 ? (
        postsEnriched.map((post) => <Post key={post.postId} {...post} />)
      ) : (
        <EmptyState
          Icon={Newspaper}
          title={"Esta lista está tranquila"}
          caption={
            "No hay publicaciones recientes de las personas que agregaste a este feed personalizado."
          }
          path={"/"}
          actionText={"Ver feed principal"}
        />
      )}
    </>
  );
}

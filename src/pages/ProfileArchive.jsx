import { EmptyState, PageBox, PageHeader } from "../components";
import { db, usePosts, useUsers } from "../hooks";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Post from "../components/Post";
import { Archive, Trash2 } from "lucide-react";

export default function ProfileArchive() {
  const auth = getAuth();
  const posts = usePosts(db);
  const users = useUsers(db);
  const navigate = useNavigate();

  const { username } = useParams();

  const user = users.find((u) => u.username === username);

  if (!user) return null;

  // Filtramos solo posts de este usuario
  const userPosts = posts.filter((post) => post.userId === user.id);

  // Filtramos solo los posts publicos
  const statusPosts = userPosts.filter((post) => post?.status === "archived");

  // Ordenamos del más nuevo al más viejo (asumimos que hay una propiedad post.createdAt)
  const sortedPosts = [...statusPosts].sort((a, b) => b.posted - a.posted);

  // Comparamos el usuario de este perfil con el usuario logeado
  const isAuthor = auth?.currentUser?.uid === user?.uid;

  return (
    <>
      <PageHeader
        title="Archivo"
        hideUpgrade={true}
        buttonRight={{
          icon: Trash2,
          title: "Papelera",
          onClick: () => navigate(`/${username}/trash-can`),
        }}
      />
      <PageBox className="p-0!">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post, index) => (
            <Post
              key={post.id || index}
              {...post}
              {...user}
              author={isAuthor}
              postId={post?.id}
            />
          ))
        ) : (
          <EmptyState
            Icon={Archive}
            title={"Sin publicaciones archivadas"}
            caption={
              "Las publicaciones que archives de tu perfil aparecerán aquí."
            }
          />
        )}
      </PageBox>
    </>
  );
}

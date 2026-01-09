import { PageBox, PageHeader } from "../components";
import { db, usePosts, useUsers } from "../hooks";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Post from "../components/Post";
import { Trash2 } from "lucide-react";

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
  const sortedPosts = [...statusPosts].sort(
    (a, b) =>
      new Date(b.posted.seconds * 1000) - new Date(a.posted.seconds * 1000)
  );

  // Comparamos el usuario de este perfil con el usuario logeado
  const isAuthor = auth?.currentUser?.uid === user?.uid;

  return (
    <>
      <PageHeader
        title="Archivo"
        Icon={Trash2}
        iconTitle="Papelera"
        iconOnClick={() => navigate(`/${username}/trash-can`)}
      />
      <PageBox className="p-0!">
        {sortedPosts.map((post, index) => (
          <Post
            key={post.id || index}
            {...post}
            {...user}
            author={isAuthor}
            postId={post?.id}
          />
        ))}
      </PageBox>
    </>
  );
}

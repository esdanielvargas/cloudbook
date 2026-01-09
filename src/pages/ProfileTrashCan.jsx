import { PageBox, PageHeader } from "../components";
import { db, usePosts, useUsers } from "../hooks";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Post from "../components/Post";

export default function ProfileArchive() {
  const auth = getAuth();
  const posts = usePosts(db);
  const users = useUsers(db);

  const { username } = useParams();

  const user = users.find((u) => u.username === username);

  if (!user) return null;

  // Filtramos solo posts de este usuario
  const userPosts = posts.filter((post) => post.userId === user.id);

  // Filtramos solo los posts publicos
  const statusPosts = userPosts.filter((post) => post?.status === "deleted");

  // Ordenamos del más nuevo al más viejo (asumimos que hay una propiedad post.createdAt)
  const sortedPosts = [...statusPosts].sort(
    (a, b) =>
      new Date(b.posted.seconds * 1000) - new Date(a.posted.seconds * 1000)
  );

  // Comparamos el usuario de este perfil con el usuario logeado
  const isAuthor = auth?.currentUser?.uid === user?.uid;

  return (
    <>
      <PageHeader title="Papelera" />
      <PageBox p="p-0">
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

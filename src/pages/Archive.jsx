import { useParams } from "react-router-dom";
import { PageBox, PageHeader } from "../components";
import { db, usePosts, useUsers } from "../hooks";
import Post from "../components/Post";

export default function Archive() {
  const posts = usePosts(db);
  const users = useUsers(db);

  const { username } = useParams();

  const user = users.find((u) => u.username === username);

  if (!user) return null;

  // 1. Filtramos solo posts de este usuario
  const userPosts = posts.filter((post) => post.userId === user.id);

  // 2. Ordenamos del más nuevo al más viejo (asumimos que hay una propiedad post.createdAt)
  const sortedPosts = [...userPosts].sort(
    (a, b) => new Date(b.posted) - new Date(a.posted)
  );

  return (
    <>
      <PageHeader title="Archivo" />
      <PageBox p="p-0">
        {sortedPosts
          .filter((post) => post.show === false)
          .map((post, index) => (
            <Post
              key={post.id || index}
              {...post}
              {...user}
              postId={post?.id}
            />
          ))}
      </PageBox>
    </>
  );
}

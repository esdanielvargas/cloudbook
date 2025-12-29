import { getAuth } from "firebase/auth";
import { db, usePosts, useUsers } from "../hooks";
import Post from "../components/Post";

export default function Favorites() {
  const auth = getAuth();
  const users = useUsers(db);
  const posts = usePosts(db);

  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid
  );

  const postsEnriched = posts
    .filter((post) => post.show)
    .filter((post) => currentUser?.favorites?.includes(post?.userId))
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
      {postsEnriched.map((post) => (
        <Post key={post.postId} {...post} />
      ))}
    </>
  );
}
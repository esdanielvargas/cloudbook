import { db, usePosts, useUsers } from "../hooks";
import { getAuth } from "firebase/auth";
import Post from "../components/Post";

export default function ForYou() {
  const auth = getAuth();
  const users = useUsers(db);
  const posts = usePosts(db);

  const postsEnriched = posts
    .filter((post) => post.show)
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

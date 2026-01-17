import {
  PageHeader,
  PageBox,
  PostHeader,
  PostContent,
  PostMeta,
  PostLine,
  PostInput,
  PostAction,
  PostComments,
} from "../components";
import { useParams } from "react-router-dom";
import { db, usePosts, useUsers } from "../hooks";
import { EllipsisVertical } from "lucide-react";
import { getAuth } from "firebase/auth";

export default function PagePost() {
  const auth = getAuth();
  const users = useUsers(db);
  const posts = usePosts(db);
  const { username, postId } = useParams();

  // Obtener el autor del post.
  const author = users.find((user) => user.username === username);

  // Obtener el post específico.
  const postSelected = posts.find(
    (post) => post.id === postId && post.userId === author?.id
  );

  // Comparamos el usuario de este perfil con el usuario logeado
  const isAuthor = author?.uid === auth?.currentUser?.uid;

  const status = postSelected?.status === "public";

  return (
    <>
      <PageHeader title="Publicación" Icon={EllipsisVertical} />
      <PageBox className="p-0! gap-0!" active>
        {status ? (
          <>
            <PostHeader
              author={author}
              {...author}
              {...postSelected}
              postId={postId}
            />
            <PostContent author={author} {...postSelected} />
            <PostMeta {...postSelected} isAuthor={isAuthor} />
            <PostLine />
            <PostAction {...author} {...postSelected} postId={postId} />
            <PostLine />
            <PostInput {...postSelected} />
            <PostLine />
            <PostComments {...postSelected} />
          </>
        ) : (
          <div className="m-auto font-normal text-xs font-mono text-neutral-500 select-none pointer-events-none">
            Esta publicación no esta disponible...
          </div>
        )}
      </PageBox>
    </>
  );
}

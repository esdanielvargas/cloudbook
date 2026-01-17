import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { db, useAuth, useUsers } from "../../hooks";
import { useParams } from "react-router-dom";
import CommentBox from "./CommentBox";

export default function PostComments(props) {
  const { comments } = props;
  const auth = useAuth(db);
  const users = useUsers(db);
  const { postId } = useParams();

  const currentUser = users.find((user) => user?.uid === auth?.uid);

  return (
    <div className="size-full flex flex-col items-center justify-center">
      {comments?.length > 0 ? (
        <div className="size-full flex flex-col">
          {comments
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((comment, index) => {
              const commentAuthor = users.find(
                (user) => user?.id === comment?.userId
              );

              const isAuthor = commentAuthor?.uid === auth?.uid;
              const author = users.find((user) => user?.uid === auth?.uid);
              const lovedByUser = comment?.likes?.includes(author?.id);

              return (
                <CommentBox
                  key={comment.id}
                  index={index}
                  postId={postId}
                  author={author}
                  comment={comment}
                  comments={comments}
                  isAuthor={isAuthor}
                  lovedByUser={lovedByUser}
                  currentUser={currentUser}
                  commentAuthor={commentAuthor}
                />
              );
            })}
        </div>
      ) : (
        <div className="size-full min-h-80 md:min-h-100 flex flex-col items-center justify-center gap-2">
          <ChatBubbleBottomCenterTextIcon
            className="size-20 select-none pointer-events-none"
            strokeWidth={1}
          />
          <div className="font-bold text-lg md:text-xl font-sans select-none pointer-events-none">
            Aún no hay comentarios
          </div>
          <div className="font-normal text-xs md:text-sm font-sans text-neutral-400 select-none pointer-events-none">
            Sé el primero en comentar.
          </div>
        </div>
      )}
    </div>
  );
}

import {
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import UserCard from "../UserCard";
import { Reactive } from "../buttons";
import { db, useAuth, useUsers } from "../../hooks";
import { toggleCommentLike } from "../../utils";
import { useParams } from "react-router-dom";

export default function PostComments(props) {
  const { comments } = props;
  const auth = useAuth(db);
  const users = useUsers(db);
  const { postId } = useParams();

  const currentUser = users.find((user) => user?.uid === auth?.uid);

  return (
    <div className="size-full flex flex-col items-center justify-center">
      {comments?.length > 0 ? (
        <div className="size-full p-4 flex flex-col gap-4">
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
                <div
                  key={comment.id}
                  className={`w-full flex flex-col${
                    comments?.length === index + 1
                      ? ""
                      : " pb-4 border-b border-dashed border-neutral-800"
                  }`}
                >
                  <UserCard
                    {...commentAuthor}
                    posted={comment.createdAt}
                    p="pb-4"
                  />
                  <div className="w-full flex items-start gap-2">
                    <div className="min-w-9 flex items-center justify-center">
                      <div className="w-0.5 h-full hidden bg-neutral-800"></div>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                      <div className="w-full flex items-start">
                        <div className="w-full text-[12.5px]">
                          {comment.text}
                        </div>
                      </div>
                      <div className="w-full flex items-center justify-start gap-2">
                        <Reactive
                          title="Me gusta"
                          count={comment?.likes?.length}
                          active={lovedByUser}
                          color="text-rose-500"
                          onclick={() =>
                            toggleCommentLike(
                              postId,
                              comment.id,
                              currentUser.id
                            )
                          }
                        >
                          <HeartIcon strokeWidth={2} />
                        </Reactive>
                        {isAuthor ? (
                          <Reactive title="Eliminar comentario">
                            <TrashIcon
                              strokeWidth={2}
                              className="transition-all duration-300 ease-out hover:text-red-500"
                            />
                          </Reactive>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="size-full min-h-100 flex flex-col items-center justify-center gap-2">
          <ChatBubbleBottomCenterTextIcon
            className="size-20 select-none pointer-events-none"
            strokeWidth={1.5}
          />
          <div className="font-bold text-xl font-sans select-none pointer-events-none">
            Aún no hay comentarios
          </div>
          <div className="font-normal text-[13px] font-sans text-neutral-400 select-none pointer-events-none">
            Sé el primero en comentar.
          </div>
        </div>
      )}
    </div>
  );
}

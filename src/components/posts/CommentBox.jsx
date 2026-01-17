import { formatText, likeComment, deleteComment } from "../../utils";
import { Copy, EllipsisVertical, Heart, Trash2 } from "lucide-react";
import { Button, Nudge, Reactive } from "../buttons";
import { useEffect, useRef, useState } from "react";
import { db, useUsers } from "../../hooks";
import UserCard from "../UserCard";
import MenuAlt from "../MenuAlt";
import PageLine from "../PageLine";

export default function CommentBox({
  index,
  postId,
  comment,
  comments,
  isAuthor,
  currentUser,
  commentAuthor,
}) {
  const users = useUsers(db);
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const safeLikes = comment?.likes || [];
  const isLikedByMe = safeLikes.includes(currentUser?.id);

  const handleLike = async () => {
    await likeComment(postId, comment.id, currentUser?.id);
  };

  const copyComment = (username, text) => {
    navigator.clipboard.writeText(`@${username}: ${text}`);
  };

  return (
    <div
      className={`w-full flex flex-col${
        comments?.length === index + 1 ? "" : " border-b border-neutral-800"
      }`}
      id={comment?.id}
    >
      <div className="w-full flex items-center justify-between">
        <UserCard {...commentAuthor} posted={comment.createdAt} />
        <div className="m-2 md:m-4 z-1 relative flex items-center justify-end">
          <Button variant="icon" onClick={() => setIsOpen((prev) => !prev)}>
            <EllipsisVertical size={18} strokeWidth={1.5} />
          </Button>
          <MenuAlt ref={menuRef} isOpen={isOpen} className="z-2 top-0 right-0">
            {isAuthor ? (
              <>
                <Nudge
                  Icon={Trash2}
                  title="Eliminar comentario"
                  onClick={() =>
                    deleteComment(postId, comment?.id) +
                    setIsOpen((prev) => !prev)
                  }
                  alert
                />
                <PageLine />
              </>
            ) : null}
            <Nudge
              Icon={Copy}
              title="Copiar comentario"
              onClick={() => {
                copyComment(commentAuthor?.username, comment?.text) +
                  setIsOpen((prev) => !prev);
              }}
            />
          </MenuAlt>
        </div>
      </div>
      <div className="w-full px-2 md:px-4 flex -items-start gap-2 md:gap-3">
        <div className="min-w-9 flex items-center justify-center"></div>
        <div className="w-full flex flex-col gap-2 md:gap-4">
          <div className="w-full flex items-start justify-start">
            <p className="w-full font-normal text-xs/5 font-sans">
              {formatText(comment?.text, users, commentAuthor?.premium)}
            </p>
          </div>
          <div className="w-full pb-4 flex items-center justify-start gap-1 md:gap-2">
            <div className="w-full -ml-3 flex items-center justify-start gap-1 md:gap-2">
              <Reactive
                title={isLikedByMe ? "Ya no me gusta" : "Me gusta"}
                counter={safeLikes.length}
                active={isLikedByMe}
                color="text-rose-500"
                onClick={handleLike}
              >
                <Heart
                  size={16}
                  className={isLikedByMe ? "fill-current" : "fill-none"}
                />
              </Reactive>
            </div>
            <div className="w-full flex items-center justify-end gap-1 md:gap-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

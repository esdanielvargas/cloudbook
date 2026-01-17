import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { BadgeCheck } from "lucide-react";
import { abbrNumber, formatDate, formatDateFull } from "../utils";
import { Button } from "./buttons";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { db, useUsers } from "../hooks";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export default function UserCard({
  id,
  avatar,
  name,
  postId,
  posted,
  username,
  authorId,
  followers = [],
  verified = false,
  show_followers = false,
  action,
  showFollowButton = false,
}) {
  const auth = getAuth();
  const users = useUsers(db);
  const currentUser = users.find((user) => user.uid === auth?.currentUser?.uid);

  const targetId = id || authorId;

  const isFollowing = currentUser?.following?.includes(targetId) || false;
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    if (!currentUser || !targetId || isLoading) return;

    setIsLoading(true);
    try {
      const currentUserRef = doc(db, "users", currentUser.uid);
      const authorRef = doc(db, "users", targetId);

      if (isFollowing) {
        await updateDoc(currentUserRef, {
          following: arrayRemove(targetId),
        });
        await updateDoc(authorRef, {
          followers: arrayRemove(currentUser.uid),
        });
      } else {
        await updateDoc(currentUserRef, {
          following: arrayUnion(targetId),
        });
        await updateDoc(authorRef, {
          followers: arrayUnion(currentUser.uid),
        });
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const noFollow = currentUser?.uid === targetId;

  return (
    <div className="w-full p-2 md:p-4 flex items-center justify-between gap-2">
      <div className="w-full flex items-center gap-2 md:gap-3">
        <Avatar
          avatar={avatar}
          name={name}
          username={username}
          postId={postId}
          action={action}
        />
        <div className="size-full flex flex-col">
          <div className="w-full flex items-center justify-start gap-1">
            {action ? (
              <Link
                to={`/${username}`}
                className="font-bold text-[14.5px] font-sans"
              >
                {name || "Display Name"}
              </Link>
            ) : (
              <span className="font-bold text-[14.5px] font-sans">
                {name || "Display Name"}
              </span>
            )}
            {verified?.status && (
              <div className="h-full flex items-center gap-1">
                <BadgeCheck size={14.5} strokeWidth={2.5} className="mb-0.5" />
              </div>
            )}
          </div>
          <div className="w-full max-h-3.5 flex items-center justify-start gap-1 text-neutral-500 dark:text-neutral-400">
            {action ? (
              <Link
                to={`/${username}`}
                className="max-w-28 font-normal text-xs font-sans truncate"
              >
                {`@${username || "username"}`}
              </Link>
            ) : (
              <span className="max-w-28 font-normal text-xs font-sans truncate">{`@${
                username || "username"
              }`}</span>
            )}
            {posted && (
              <>
                <div className="select-none pointer-events-none">·</div>
                {postId ? (
                  <Link
                    to={`/${username}/post/${postId}`}
                    className="min-w-max font-normal text-xs font-sans"
                    title={formatDateFull(posted)}
                  >
                    {formatDate(posted, "es")}
                  </Link>
                ) : (
                  <div
                    className="min-w-max font-normal text-xs font-sans"
                    title={formatDateFull(posted)}
                  >
                    {formatDate(posted, "es")}
                  </div>
                )}
              </>
            )}
            {show_followers && followers && (
              <>
                <div className="select-none pointer-events-none">·</div>
                <div className="min-w-max font-normal text-xs font-sans">
                  {abbrNumber(followers?.length)}
                  {followers.length > 1 || followers.length === 0
                    ? " Seguidores"
                    : " Seguidor"}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showFollowButton && (
        <div className="flex items-center justify-end">
          {noFollow ? (
            <Button variant="inactive" to={`/${username}`}>
              Ver perfil
            </Button>
          ) : (
            <Button
              variant={isFollowing ? "followed" : "follow"}
              onClick={handleFollowToggle}
              disabled={isLoading || !currentUser}
            >
              {isFollowing ? "Siguiendo" : "Seguir"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

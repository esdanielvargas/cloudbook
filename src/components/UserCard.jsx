import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { BadgeCheck, EllipsisVertical } from "lucide-react";
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
  followers = [], // Default to empty array to avoid undefined errors
  verified = false,
  show_followers = false,
}) {
  const auth = getAuth();
  const users = useUsers(db);
  const currentUser = users.find((user) => user.uid === auth?.currentUser?.uid);

  // Initialize follow state based on whether currentUser is following authorId
  const isFollowing = currentUser?.following?.includes(id || authorId) || false;
  const [isLoading, setIsLoading] = useState(false); // Track loading state for UX

  // Handle follow/unfollow action
  const handleFollowToggle = async () => {
    if (!currentUser || !authorId || isLoading) return; // Prevent action if not logged in or loading

    setIsLoading(true);
    try {
      const currentUserRef = doc(db, "users", currentUser.uid);
      const authorRef = doc(db, "users", authorId);

      if (isFollowing) {
        // Unfollow: Remove authorId from currentUser.following and currentUser.uid from author.followers
        await updateDoc(currentUserRef, {
          following: arrayRemove(authorId),
        });
        await updateDoc(authorRef, {
          followers: arrayRemove(currentUser.uid),
        });
        // setFollow(false);
      } else {
        // Follow: Add authorId to currentUser.following and currentUser.uid to author.followers
        await updateDoc(currentUserRef, {
          following: arrayUnion(authorId),
        });
        await updateDoc(authorRef, {
          followers: arrayUnion(currentUser.uid),
        });
        // setFollow(true);
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      // Optionally, revert state or show error to user
      // setFollow(follow); // Revert to previous state on error
    } finally {
      setIsLoading(false);
    }
  };

  const noFollow = currentUser?.id === id || authorId;

  return (
    <div className="w-full p-2 md:p-4 flex items-center justify-between gap-2">
      <div className="w-full flex items-center gap-2 md:gap-3">
        <Avatar
          avatar={avatar}
          name={name}
          username={username}
          postId={postId}
        />
        <div className="size-full flex flex-col">
          <div className="w-full flex items-center justify-start gap-1">
            <Link
              to={`/${username}`}
              className="font-bold text-[14.5px] font-sans"
            >
              {name || "Display Name"}
            </Link>
            {verified && (
              <div className="h-full flex items-center gap-1">
                <BadgeCheck size={14.5} strokeWidth={2.5} className="mb-0.5" />
              </div>
            )}
          </div>
          <div className="w-full max-h-3.5 flex items-center justify-start gap-1 text-neutral-500 dark:text-neutral-400">
            <Link
              to={`/${username}`}
              className="max-w-28 font-normal text-xs font-sans truncate"
            >
              {`@${username || "username"}`}
            </Link>
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
                  {abbrNumber(followers.length)}
                  {followers.length > 1 ? " Seguidores" : " Seguidor"}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="hidden items-center justify-end">
        {noFollow ? (
          <>
            <Button variant="inactive" to={`/${username}?post=${postId}`}>
              Ver perfil
            </Button>
          </>
        ) : (
          <Button
            variant={isFollowing ? "followed" : "follow"}
            onClick={handleFollowToggle}
            disabled={isLoading || !currentUser || currentUser.uid === authorId} // Disable if loading or same user
          >
            {isFollowing ? "Siguiendo" : "Seguir"}
          </Button>
        )}
      </div>
    </div>
  );
}

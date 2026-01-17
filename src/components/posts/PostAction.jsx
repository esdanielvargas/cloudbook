import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { db, useNotify, useUsers } from "../../hooks";
import { Nudge, Reactive } from "../buttons";
import {
  ArrowPathRoundedSquareIcon as ArrowsRounded,
  BookmarkIcon,
  ChatBubbleBottomCenterTextIcon as ChatBubble,
  ChatBubbleLeftRightIcon as ChatsBubble,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import MenuAlt from "../MenuAlt";
import { useEffect, useRef, useState } from "react";
import { Bookmark, Heart, Link2 as Link, Share } from "lucide-react";
import { copyPostLink, toggleLike } from "../../utils";
import { getAuth } from "firebase/auth";
import PageLine from "../PageLine";
import { toggleSave } from "../../utils/toggleSave";

export default function PostAction(props) {
  const {
    likes = [],
    comments = [],
    reposts = [],
    shared = [],
    saved = [],
    username,
    postId,
    author,
  } = props;

  const auth = getAuth();
  const users = useUsers(db);
  const navigate = useNavigate();
  const notifications = useNotify(db);

  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid,
  );

  const [repost, setRepost] = useState(false);
  const [isOpenRepost, setIsOpenRepost] = useState(false);
  const menuRepostRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRepostRef.current &&
        !menuRepostRef.current.contains(event.target)
      ) {
        setIsOpenRepost(false);
      }
    }

    if (isOpenRepost) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenRepost]);

  const [isOpenShare, setIsOpenShare] = useState(false);
  const menuShareRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuShareRef.current &&
        !menuShareRef.current.contains(event.target)
      ) {
        setIsOpenShare(false);
      }
    }

    if (isOpenShare) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenShare]);

  // ================================ //

  const safeLikes = Array.isArray(likes) ? likes : [];
  const isLikedByMe = safeLikes.some((like) => like.userId === currentUser?.id);

  const existingLikeNotification = notifications?.find(
    (notif) =>
      notif.targetUserId === props?.userId &&
      notif.currentUserId === currentUser?.id &&
      notif.type === "like",
  );

  const handleLike = async () => {
    await toggleLike({
      postId,
      targetUserId: props?.userId,
      currentUserId: currentUser?.id,
      currentLikesArray: safeLikes,
      notificationId: existingLikeNotification?.id,
    });
  };

  const safeSaved = Array.isArray(saved) ? saved : [];
  const isSavedByMe = safeSaved.some((save) => save.userId === currentUser?.id);

  const handleSave = async () => {
    await toggleSave({
      postId,
      currentUserId: currentUser?.id,
      currentSavedArray: safeSaved,
    });
  };

  const webShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Publicación de @${username}`,
          text: "¡Mira esta publicación, te puede interesar!",
          url: `${window.location.origin}/${username}/post/${postId}`,
        })
        .then(() => console.log("Compartido con éxito"))
        .catch((error) => console.error("Error al compartir:", error));
    } else {
      console.log("La API de Web Share no es compatible con este navegador.");
    }
  };

  return (
    <div
      className="w-full px-2 py-1.5 md:px-4 flex items-center justify-between"
      id="comments"
    >
      <div className="w-full flex items-center justify-start gap-1 md:gap-2">
        <Reactive
          counter={likes?.length}
          active={isLikedByMe}
          color="text-rose-500"
          onClick={handleLike}
          title={isLikedByMe ? "Ya no me gusta" : "Me gusta"}
        >
          <Heart
            size={18}
            className={isLikedByMe ? "fill-current" : "fill-none"}
          />
        </Reactive>
        <Reactive
          counter={comments?.length}
          onClick={() => navigate(`/${username}/post/${postId}#comments`)}
        >
          <ChatBubble strokeWidth={2} />
        </Reactive>
        <div className="relative flex items-center justify-center">
          <Reactive
            counter={reposts?.length}
            onClick={() => setIsOpenRepost((prev) => !prev)}
          >
            <ArrowsRounded strokeWidth={2} />
          </Reactive>
          <MenuAlt
            ref={menuRepostRef}
            isOpen={isOpenRepost}
            className="z-5 bottom-10.5"
          >
            <Nudge
              Icon={repost ? ArrowsRounded : ArrowsRounded}
              title={repost ? "Deshacer" : "Republicar"}
              alert={repost}
              onClick={() => {
                setRepost(!repost);
                setIsOpenRepost(false);
              }}
              to={`/compose?repost=${postId}`}
            />
            <Nudge
              Icon={ChatBubble}
              title="Citar"
              to={`/compose?repost=${postId}`}
            />
            {author && (
              <>
                <PageLine />
                <Nudge Icon={ChatsBubble} title="Ver citas" />
              </>
            )}
          </MenuAlt>
        </div>
        <div className="relative flex items-center justify-center">
          <Reactive
            counter={shared?.length}
            onClick={() => setIsOpenShare((prev) => !prev)}
          >
            <PaperAirplaneIcon
              strokeWidth={2}
              style={{ transform: "rotate(-45deg)" }}
            />
          </Reactive>
          <MenuAlt
            isOpen={isOpenShare}
            ref={menuShareRef}
            className="z-5 bottom-10.5"
          >
            <Nudge
              Icon={Link}
              rotate={-45}
              title="Copiar enlace"
              onClick={() =>
                copyPostLink(username, postId) + setIsOpenShare((prev) => !prev)
              }
            />
            <Nudge
              Icon={Share}
              title="Compartir en otras apps"
              onClick={() => webShare() + setIsOpenShare((prev) => !prev)}
            />
          </MenuAlt>
        </div>
      </div>
      <div className="w-full flex items-center justify-end">
        <Reactive
          counter={saved?.length || 0}
          active={isSavedByMe}
          color="text-sky-500"
          onClick={handleSave}
          title={isSavedByMe ? "Desguardar publicación" : "Guardar publicación"}
        >
          {/* {isSavedByMe ? <BookmarkSolid /> : <BookmarkIcon strokeWidth={2} />} */}
          <Bookmark
            size={18}
            className={isSavedByMe ? "fill-current" : "fill-none"}
          />
        </Reactive>
      </div>
    </div>
  );
}

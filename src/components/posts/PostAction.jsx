import {
  BookmarkIcon as BookmarkSolid,
  HeartIcon as HeartSolid,
} from "@heroicons/react/24/solid";
import { db, useAuth, useNotify, useUsers } from "../../hooks";
import { Nudge, Reactive } from "../buttons";
import {
  ArrowPathRoundedSquareIcon as ArrowsRounded,
  BookmarkIcon,
  ChatBubbleBottomCenterTextIcon as ChatBubble,
  ChatBubbleLeftRightIcon as ChatsBubble,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  // getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import MenuAlt from "../MenuAlt";
import { useEffect, useRef, useState } from "react";
import { Link2 as Link, Share } from "lucide-react";
import { copyPostLink } from "../../utils";

export default function PostAction(props) {
  const {
    likes = [],
    comments = [],
    reposts = [],
    shared = [],
    // saved = [],
    username,
    postId,
    author,
  } = props;

  const auth = useAuth(db);
  const users = useUsers(db);
  const navigate = useNavigate();
  const notifications = useNotify(db);

  // Usuario logeado
  const currentUser = users.find((user) => user?.uid === auth?.uid);
  const userId = currentUser?.id || null;

  // Love & Likes
  const lovedByUser = likes?.includes(currentUser?.id);
  
  const loved = Array.isArray(props?.likes)
    ? props?.likes?.includes(userId)
    : false;

  const giveLove = async (postId, targetUserId, currentUserId) => {
    try {
      // Referencia al documento de la publicación
      const postRef = doc(db, "photos", postId);

      // Referencia a la colección de notificaciones
      const notificationsRef = collection(db, "notifications");

      const notification = notifications.find(
        (notif) =>
          notif.targetUserId === targetUserId &&
          notif.currentUserId === currentUserId &&
          notif.type === "like"
      );

      if (loved) {
        // Eliminar al usuario actual de los me gustas de la publicación
        await updateDoc(postRef, {
          likes: arrayRemove(currentUserId),
        });

        // Eliminar notificación de seguimiento
        if (notification?.id) {
          // Referencia al documento de la notificación
          const notificationRef = doc(db, "notifications", notification.id);
          await deleteDoc(notificationRef);
        }
      } else {
        // Agregar al usuario actual a los me gustas de la publicación
        await updateDoc(postRef, {
          likes: arrayUnion(currentUserId),
        });

        // Crear notificación de seguimiento
        await addDoc(notificationsRef, {
          targetUserId,
          currentUserId: currentUser?.id,
          postId,
          type: "like",
          time: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error("Error al dar like: ", error);
    }
  };

  // Reposts
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

  // Share
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

  // save
  // const savedByUser = saved?.includes(currentUser?.id);

  const saved = Array.isArray(props?.saved)
    ? props?.saved.includes(userId)
    : false;

  const savePost = async (postId, currentUserId) => {
    try {
      // Referencia al documento de la publicación
      const postRef = doc(db, "photos", postId);

      if (saved) {
        // Eliminar al usuario actual de los guardados de la publicación
        await updateDoc(postRef, { saved: arrayRemove(currentUserId) });
      } else {
        // Agregar al usuario actual a los guardados de la publicación
        await updateDoc(postRef, { saved: arrayUnion(currentUserId) });
      }
    } catch (error) {
      console.error("Error al guardar la publicación: ", error);
    }
  };

  return (
    <div className="w-full p-2 md:p-4 flex items-center justify-between">
      <div className="w-full flex items-center justify-start gap-1 md:gap-2">
        <Reactive
          counter={likes?.length}
          active={lovedByUser}
          color="text-rose-500"
          // onClick={() => toggleLike(postId, currentUser?.id)}
          onClick={() => giveLove(props.postId, props.userId, userId)}
        >
          {lovedByUser ? <HeartSolid /> : <HeartIcon strokeWidth={2} />}
        </Reactive>
        <Reactive
          counter={comments?.length}
          onClick={() => navigate(`/${username}/post/${postId}`)}
        >
          <ChatBubble strokeWidth={2} />
        </Reactive>
        <div className="flex items-center justify-center relative">
          <Reactive
            counter={reposts?.length}
            onClick={() => setIsOpenRepost((prev) => !prev)}
          >
            <ArrowsRounded strokeWidth={2} />
          </Reactive>
          <MenuAlt
            isOpen={isOpenRepost}
            ref={menuRepostRef}
            className="z-5 bottom-[calc(100%_+_8px)]"
          >
            <Nudge
              Icon={repost ? ArrowsRounded : ArrowsRounded}
              title={repost ? "Deshacer" : "Republicar"}
              alert={repost}
              onClick={() => {
                setRepost(!repost);
                setIsOpenRepost(false);
              }}
            />
            <Nudge Icon={ChatBubble} title="Citar" />
            {author && (
              <>
                <hr className="my-1.5 border-dashed border-neutral-200 dark:border-neutral-800" />
                <Nudge Icon={ChatsBubble} title="Ver citas" />
              </>
            )}
          </MenuAlt>
        </div>
        <div className="flex items-center justify-center relative">
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
            className="z-5 bottom-[calc(100%_+_8px)]"
          >
            <Nudge
              Icon={Link}
              title="Copiar enlace"
              rotate={-45}
              onClick={() =>
                copyPostLink(username, postId) + setIsOpenShare(false)
              }
            />
            <Nudge Icon={Share} title="Compartir en otras apps" />
            <Nudge Icon={Link} title="Enviar por mensaje directo" />
          </MenuAlt>
        </div>
      </div>
      <div className="w-full flex items-center justify-end">
        <Reactive
          counter={saved?.length || 0}
          active={saved}
          color="text-sky-500"
          // onClick={() => toggleSavePost(author?.id, postId)}
          onClick={() => savePost(props?.postId, userId)}
        >
          {saved ? <BookmarkSolid /> : <BookmarkIcon strokeWidth={2} />}
        </Reactive>
      </div>
    </div>
  );
}

import {
  Archive,
  AudioLines,
  BadgeCheck,
  Ban,
  Camera,
  EllipsisVertical,
  Eye,
  Folder,
  Grid3X3,
  Info,
  LayoutDashboard,
  Link2,
  ListPlus,
  ListX,
  Lock,
  LockKeyhole,
  Newspaper,
  OctagonAlert,
  Rss,
  Share,
  ShieldAlert,
  SquareKanban,
  Star,
  StarOff,
  UserLock,
  UserMinus,
  UserPen,
  UserX,
  VolumeOff,
} from "lucide-react";
import { Avatar, EmptyState, PageHeader } from "@/components";
import { Link, Outlet, useParams } from "react-router-dom";
import { db, useNotify, usePosts, useUsers } from "@/hooks";
import {
  ArrowPathRoundedSquareIcon,
  BookmarkIcon,
  HeartIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { abbrNumber, cleanUrlParams, copyProfileLink } from "@/utils";
import { Button } from "@/components/buttons";
import { useThemeColor } from "@/context";
import { getAuth } from "firebase/auth";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useLinksModal } from "@/context/ModalProvider";

export default function Profile() {
  const auth = getAuth();
  const users = useUsers(db);
  const posts = usePosts(db);
  const notifications = useNotify(db);
  const { username } = useParams();
  const { accentHex, txtClass } = useThemeColor();
  const { openModal } = useLinksModal();

  // Información del perfil
  const user = users.find((user) => user?.username === username);

  // Información del usuario logeado
  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid,
  );

  // Verificamos si el perfil es del usuario logeado
  const isOwner = currentUser?.id === user?.id;

  // Initialize follow state based on whether currentUser is following authorId
  const isFollowing = user?.followers?.includes(currentUser?.id) || false;
  const followMe = user?.following?.includes(currentUser?.id) || false;
  const isFavorite = user?.favorites?.includes(currentUser?.id) || false;

  const follow = async (targetUserId, currentUserId) => {
    try {
      // Referencia al documento del usuario objetivo
      const targetUserRef = doc(db, "users", targetUserId);

      // Referencia al documento del usuario actual
      const currentUserRef = doc(db, "users", currentUserId);

      // Referencia a la colección de notificaciones
      const notificationsRef = collection(db, "notifications");

      const notification = notifications.find(
        (notif) =>
          notif.targetUserId === targetUserId &&
          notif.currentUserId === currentUserId &&
          notif.type === "follow",
      );

      if (isFollowing) {
        // Eliminar al usuario actual de los seguidores
        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUserId),
        });

        // Eliminar al usuario objetivo de los seguidores
        await updateDoc(currentUserRef, {
          following: arrayRemove(targetUserId),
        });

        // Eliminar notificación de seguimiento
        if (notification?.id) {
          // Referencia al documento de la notificación
          const notificationRef = doc(db, "notifications", notification.id);

          await deleteDoc(notificationRef);
        }
      } else {
        // Agregar al usuario actual a los seguidores
        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUserId),
        });

        // Agregar al usuario objetivos a los seguidores
        await updateDoc(currentUserRef, {
          following: arrayUnion(targetUserId),
        });

        // Crear notificación de seguimiento
        await addDoc(notificationsRef, {
          targetUserId: targetUserId,
          currentUserId: currentUserId,
          type: "follow",
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error al actualizar los seguidores: ", error);
    }
  };

  // Filtramos las publicaciones que sean del usuario y que esten publicas
  const postsFiltered = posts
    .filter((post) => post.userId === user?.id)
    .filter((post) => post?.status === "public");

  // Definimos qué pasa al hacer click
  const handleOpenLinks = () => {
    // Verificamos que user.links exista y sea un array
    if (user?.links && Array.isArray(user.links)) {
      openModal(user.links);
    }
  };

  // Array del menú de navegación
  const menu = [
    {
      id: "GyGYQ5wKyh10Ba",
      show: true,
      Icon: LayoutDashboard,
      title: "Publicaciones",
      path: "",
    },
    {
      id: "MuML3vSxMpJuiw",
      show: user?.music,
      Icon: AudioLines,
      title: "Música",
      path: "music",
    },
    {
      id: "ChYObT3IUuc4Go",
      show: user?.collections,
      Icon: Folder,
      title: "Collecciones",
      path: "collections",
    },
    {
      id: "KlrrZIk3zajdqU",
      show: true,
      Icon: Grid3X3,
      title: "Media",
      path: "media",
    },
    {
      id: "qENSSbZBPpbDVL",
      show: user?.shop,
      Icon: ShoppingBagIcon,
      title: "Tienda",
      path: "shop",
    },
    {
      id: "Pt5Uxk77mdi9Rv",
      show: true,
      Icon: ArrowPathRoundedSquareIcon,
      title: "Republicaciones",
      path: "reposts",
    },
  ];

  return (
    <>
      <PageHeader
        title={user?.name}
        header={`${user?.name} (@${user?.username}) ~ CloudBook`}
        Icon={EllipsisVertical}
        iconTitle="Más opciones"
        menuOptions={[
          {
            show: true,
            icon: Info,
            title: "Información sobre este perfil",
            to: `/${username}/info`,
          },
          {
            show: true,
            icon: Share,
            title: "Compartir perfil vía...",
            onClick: () =>
              navigator.share({
                title: `${user?.name} (@${user?.username}) ~ CloudBook`,
                text: user.bio ?? "Sin descripción.",
                url: window.location.href,
              }),
          },
          {
            show: true,
            icon: Link2,
            rotate: -45,
            title: "Copiar enlace del perfil",
            onClick: () => copyProfileLink(user?.username),
          },
          { show: true, type: "divider" },
          {
            show: !isOwner,
            icon: Newspaper,
            title: "Agregar a una lista",
            to: `/lists?add_user=${username}`,
          },
          {
            show: !isOwner && user?.followMe,
            icon: UserMinus,
            title: "Eliminar seguidor",
            // onClick: () => handleRemoveFollower(username),
          },
          {
            show: isOwner,
            icon: BadgeCheck,
            title: "Obtener la verificación",
          },
          { show: !isOwner, type: "divider" },
          {
            show: !isOwner,
            icon: Ban,
            title: `Bloquear a @${username}`,
            alert: true,
          },
          {
            show: !isOwner,
            icon: OctagonAlert,
            title: `Reportar a @${username}`,
            alert: true,
          },
        ]}
      />
      <div className="w-full flex flex-col items-center justify-start rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/75 dark:border-neutral-800/75">
        {/* Portada del perfil */}
        <div className="w-full h-36 min-h-36 md:h-50 md:min-h-50 relative flex items-center justify-center rounded-t-xl overflow-hidden bg-neutral-200/75 dark:bg-neutral-950/45 border-b border-neutral-200/75 dark:border-neutral-800/75">
          {user?.banner && (
            <img
              src={user?.banner}
              alt={`Portada de ${user?.name} (@${user?.username})`}
              title={`Portada de ${user?.name} (@${user?.username})`}
              loading="eager"
              width={568}
              height={200}
              className="size-full object-cover object-center pointer-events-none select-none"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/photo.png";
                e.currentTarget.style.objectFit = "contain";
              }}
            />
          )}
          {!user?.banner && (
            <div className="inset-0 absolute backdrop-blur-sm">
              <img
                src="/images/photo.png"
                alt="undefined"
                className="size-full object-contain object-center pointer-events-none select-none"
              />
            </div>
          )}
        </div>
        {/* Información del perfil */}
        <div className="w-full p-2 md:p-4 flex flex-col items-center gap-2">
          {/* Foto de perfil y botones de acción */}
          <div className="w-full flex items-end justify-between">
            {/* Foto de perfil */}
            <div className="z-2 absolute flex items-center justify-center overflow-hidden rounded-3xl! md:rounded-4xl!">
              <Avatar
                size={88}
                action={false}
                avatar={user?.avatar}
                {...user}
                className="size-22! md:size-26! rounded-3xl! md:rounded-4xl!"
              />
            </div>
            {/* Botones de acción */}
            <div className="w-full z-1 relative flex items-center justify-end gap-1">
              {currentUser && currentUser?.uid !== user?.uid ? (
                <>
                  <Button
                    variant="inactive"
                    className="px-0! aspect-square!"
                    title={
                      isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
                    }
                  >
                    <Star
                      size={20}
                      strokeWidth={1.5}
                      fill={isFavorite ? accentHex : "none"}
                      stroke={isFavorite ? accentHex : "currentColor"}
                    />
                  </Button>
                  <Button
                    variant={isFollowing ? "followed" : "follow"}
                    onClick={() => follow(user?.id, currentUser?.id)}
                  >
                    {!isFollowing
                      ? followMe
                        ? "Seguir también"
                        : "Seguir"
                      : "Siguiendo"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="inactive"
                    className="px-0! aspect-square!"
                    to={`/${user?.username}/stats`}
                    title="Estadísticas"
                  >
                    <SquareKanban
                      size={20}
                      strokeWidth={1.5}
                      className="rotate-180"
                    />
                  </Button>
                  <Button
                    variant="inactive"
                    className="px-0! aspect-square!"
                    to={`/${user?.username}/archive`}
                    title="Archivo"
                  >
                    <Archive size={20} strokeWidth={1.5} />
                  </Button>
                  <Button
                    variant="inactive"
                    className="px-0! aspect-square! md:px-3! md:aspect-auto!"
                    to={`/${user?.username}/edit`}
                    title="Editar perfil"
                  >
                    <span className="flex md:hidden">
                      <UserPen size={20} strokeWidth={1.5} />
                    </span>
                    <span className="hidden md:flex">Editar perfil</span>
                  </Button>
                </>
              )}
            </div>
          </div>
          {/* Información del perfil */}
          <div className="w-full flex flex-col">
            {/* Nombre visible */}
            <div className="w-full flex items-center justify-start gap-1">
              <span className="font-bold text-xl">
                {user?.name ? user?.name : "Display Name"}
              </span>
              {user?.verified?.status && (
                <div className="-mb-0.5 flex items-center justify-center">
                  <BadgeCheck size={18} />
                </div>
              )}
            </div>
            {/* Nombre de usuario */}
            <div className="w-full flex items-center justify-start gap-1">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                @{user?.username ?? "username"}
              </div>
            </div>
            {/* Categorías */}
            {user?.categories && user?.categories.length > 0 && (
              <div className="w-full mt-1 flex items-center justify-start gap-1 overflow-hidden">
                {user?.categories?.slice(0, 2).map((category, index) => (
                  <Link to={`/search?q=${category.trim(" ")}&serp_type=tags`} key={index} className="min-w-max py-0.5 px-1.5 rounded-md bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                    {category}
                  </Link>
                ))}
                {user?.categories?.length > 2 && (
                  <div className="min-w-max py-0.5 px-1.5 rounded-md bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                    +{user.categories.length - 2} más
                  </div>
                )}
              </div>
            )}
            {/* Description */}
            <div className="w-full flex items-center justify-start gap-1">
              <div className="w-full my-2 text-left text-sm text-balance line-clamp-2 whitespace-pre-wrap">
                {user?.bio || "Aún no hay descripción corta..."}
              </div>
            </div>
            {/* Enlaces */}
            {user?.links?.length > 0 && (
              <div className="w-full flex items-center justify-start gap-1 mb-2">
                {/* Primer enlace (Link Principal) */}
                <a
                  href={user.links[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-0.5 text-sm ${txtClass} active:underline hover:underline`}
                >
                  <Link2 size={14} className="-rotate-45" />
                  {cleanUrlParams(user.links[0].link)}
                </a>
                {/* Texto "y X enlaces" que abre el Modal */}
                {user.links.length > 1 && (
                  <span
                    className={`text-sm ${txtClass} cursor-pointer opacity-95`}
                    onClick={handleOpenLinks}
                  >
                    y {user.links.length - 1}
                    {user.links.length === 2 ? " enlace " : " enlaces "} más
                  </span>
                )}
              </div>
            )}
            {/* Seguidores, Seguidos, Publicaciones */}
            <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
              {/* Seguidores */}
              <div className="min-w-max text-sm text-neutral-600 dark:text-neutral-400/95">
                {currentUser?.uid !== user?.uid ? (
                  <>
                    <span className="font-mono text-neutral-950 dark:text-neutral-50">
                      {abbrNumber(user?.followers?.length)}
                    </span>
                    {user?.followers?.length === 1
                      ? " Seguidor"
                      : " Seguidores"}
                  </>
                ) : (
                  <Link
                    to={`/${user?.username}/followers`}
                    className="active:underline hover:underline"
                  >
                    <span className="font-mono text-neutral-950 dark:text-neutral-50">
                      {abbrNumber(user?.followers?.length)}
                    </span>
                    {user?.followers?.length === 1
                      ? " Seguidor"
                      : " Seguidores"}
                  </Link>
                )}
              </div>
              {/* Seguidos */}
              <div className="min-w-max text-sm text-neutral-600 dark:text-neutral-400/95">
                {currentUser?.uid !== user?.uid ? (
                  <>
                    <span className="font-mono text-neutral-950 dark:text-neutral-50">
                      {abbrNumber(user?.following?.length)}
                    </span>
                    {user?.following?.length === 1 ? " Seguido" : " Seguidos"}
                  </>
                ) : (
                  <Link
                    to={`/${user?.username}/following`}
                    className="active:underline hover:underline"
                  >
                    <span className="font-mono text-neutral-950 dark:text-neutral-50">
                      {abbrNumber(user?.following?.length)}
                    </span>
                    {user?.following?.length === 1 ? " Seguido" : " Seguidos"}
                  </Link>
                )}
              </div>
              {/* Publicaciones */}
              <div className="min-w-max text-sm text-neutral-600 dark:text-neutral-400/95">
                <span className="font-mono text-neutral-950 dark:text-neutral-50">
                  {abbrNumber(postsFiltered?.length)}
                </span>
                {postsFiltered?.length === 1
                  ? " Publicación"
                  : " Publicaciones"}
              </div>
            </div>
          </div>
        </div>
        {/* Navegación */}
        <div className="w-full flex gap-px rounded-b-xl border-t border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          {menu
            .filter((item) => item.show)
            .map((item, index) => (
              <Link
                key={item.id || index}
                to={`/${user?.username}${item.path ? `/${item.path}` : ""}`}
                title={item.title}
                className="w-full h-12 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 transition-all duration-300 ease-out"
              >
                {item.Icon && (
                  <item.Icon strokeWidth={1.5} className="size-6" />
                )}
              </Link>
            ))}
        </div>
      </div>
      <div className="size-full mt-1 mb-22 md:mb-4 rounded-xl overflow-hidden">
        {isOwner || !user?.private || isFollowing ? (
          <Outlet />
        ) : (
          <EmptyState
            Icon={LockKeyhole}
            title={"Contenido exclusivo para seguidores"}
            caption={
              "Haz clic en «Seguir» para conectar con este perfil y no perderte ninguna de sus actualizaciones."
            }
          />
        )}
      </div>
    </>
  );
}

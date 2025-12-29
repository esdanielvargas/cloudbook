import {
  Archive,
  AudioLines,
  BadgeCheck,
  ChartNoAxesCombined,
  EllipsisVertical,
  Folder,
  Grid3X3,
  Info,
  LayoutDashboard,
  Link2,
  ListPlus,
  ListX,
  Mail,
  OctagonAlert,
  Rss,
  Star,
  StarOff,
  UserLock,
  UserPen,
  UserX,
  VolumeOff,
} from "lucide-react";
import { Avatar, PageHeader } from "../components";
import { Link, Outlet, useParams } from "react-router-dom";
import { db, usePosts, useUsers } from "../hooks";
import {
  ArrowPathRoundedSquareIcon,
  BookmarkIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { abbrNumber, cleanUrlParams, copyProfileLink } from "../utils";
import { useState } from "react";
import { Button } from "../components/buttons";
import { useThemeColor } from "../context";
import { getAuth } from "firebase/auth";
import { useLinksModal } from "../context/ModalProvider";

export default function Profile() {
  const auth = getAuth();
  const users = useUsers(db);
  const posts = usePosts(db);
  const { username } = useParams();
  const { txtClass } = useThemeColor();
  const { openModal } = useLinksModal();

  // Información del perfil
  const user = users.find((user) => user?.username === username);

  // Información del usuario actual o logeado
  const currentUser = users.find((user) => user?.uid === auth.currentUser?.uid);

  // Initialize follow state based on whether currentUser is following authorId
  const isFollowing = user?.followers?.includes(currentUser?.id) || false;

  const [isFavorited, setIsFavorited] = useState(false);
  const [followed, setFollowed] = useState(isFollowing);

  const postsFiltered = posts
    .filter((post) => post.userId === user?.id)
    .filter((post) => post?.show === true);

  // Definimos qué pasa al hacer click
  const handleOpenLinks = () => {
    // Verificamos que user.links exista y sea un array
    if (user?.links && Array.isArray(user.links)) {
      openModal(user.links); // <--- AQUÍ LE PASAMOS LA DATA AL CONTEXTO
    }
  };

  return (
    <>
      <PageHeader
        title={user?.name}
        Icon={EllipsisVertical}
        iconTitle="Más opciones"
        menuOptions={[
          {
            icon: isFavorited ? StarOff : Star,
            title: isFavorited ? "Eliminar de favoritos" : "Añadir a favoritos",
            onClick: () => {
              setIsFavorited(!isFavorited);
              alert(
                isFavorited ? "Eliminado de favoritos" : "Añadido a favoritos"
              );
            },
          },
          {
            icon: isFavorited ? ListX : ListPlus,
            title: isFavorited ? "Eliminar de un feed" : "Agregar a un feed",
            onClick: () => {
              setIsFavorited(!isFavorited);
              alert(
                isFavorited ? "Eliminado de una lista" : "Añadido a una lista"
              );
            },
          },
          {
            icon: Rss,
            title: "Ver feeds",
            // to: `/${user?.username}/info`,
          },
          {
            icon: Info,
            title: "Información del perfil",
            to: `/${username}/info`,
          },
          { type: "divider" },
          {
            icon: BadgeCheck,
            title: "Obtener la verificación",
            // to: `/verify`
          },
          { type: "divider" },
          {
            icon: VolumeOff,
            title: `Silenciar a @${username}`,
          },
          {
            icon: UserLock,
            title: `Restringir a @${username}`,
            alert: true,
          },
          {
            icon: UserX,
            title: `Bloquear a @${username}`,
            alert: true,
          },
          {
            icon: OctagonAlert,
            title: `Reportar a @${username}`,
            alert: true,
          },
          { type: "divider" },
          {
            icon: Link2,
            title: "Copiar enlace del perfil",
            rotate: -45,
            onClick: () => copyProfileLink(user?.username),
          },
        ]}
      />
      <div className="w-full flex flex-col items-center justify-start rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/75 dark:border-neutral-800/75">
        {/* Portada del perfil */}
        <div className="w-full h-36 min-h-36 md:h-50 md:min-h-50 relative flex items-center justify-center rounded-t-xl overflow-hidden bg-neutral-200/75 dark:bg-neutral-950/45">
          {(user?.banner || user?.avatar) && (
            <img
              src={user?.banner || user?.avatar}
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
              <img src="/images/photo.png" alt="" className="size-full object-contain object-center pointer-events-none select-none" />
            </div>
          )}
        </div>
        <div className="w-full p-2 md:p-4 flex flex-col items-center gap-2">
          {/* Foto de perfil y botones de acción */}
          <div className="w-full flex items-end justify-between">
            {/* Foto de perfil */}
            <div className="absolute flex items-center justify-center">
              <Avatar
                size={80}
                action={false}
                avatar={user?.avatar}
                className="rounded-3xl!"
              />
            </div>
            {/* Botones de acción */}
            <div className="w-full relative flex items-center justify-end gap-1">
              {currentUser && currentUser?.uid !== user?.uid ? (
                <>
                  {/* <Button variant="inactive" className="px-0! aspect-square!">
                    <Star size={20} strokeWidth={1.5} />
                  </Button> */}
                  <Button variant="icon" className="px-0! aspect-square!">
                    <Mail size={20} strokeWidth={1.5} />
                  </Button>
                  <Button
                    variant={isFollowing ? "followed" : "follow"}
                    onClick={() => setFollowed(!followed)}
                  >
                    {isFollowing ? "Siguiendo" : "Seguir"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="icon"
                    className="px-0! aspect-square!"
                    to={`/${user?.username}/edit`}
                  >
                    <UserPen size={22} strokeWidth={1.5} />
                  </Button>
                  <Button
                    variant="icon"
                    className="px-0! aspect-square!"
                    to={`/${user?.username}/archive`}
                  >
                    <Archive size={22} strokeWidth={1.5} />
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
              {user?.verified && (
                <div className="-mb-0.5 flex items-center justify-center">
                  <BadgeCheck size={18} />
                </div>
              )}
            </div>
            {/* Nombre de usuario */}
            <div className="w-full flex items-center justify-start">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                @{user?.username ? user?.username : "username"}
              </div>
            </div>
            {/* Description */}
            <div className="w-full flex items-center justify-start gap-1">
              <div className="w-full py-2 text-left text-sm text-balance line-clamp-2 truncate">
                {user?.bio || "Aún no hay descripción corta..."}
              </div>
            </div>
            {/* Enlaces */}
            {user?.website && user?.links?.length > 0 && (
              <div className="w-full flex items-center justify-start gap-1 mb-2">
                {/* Primer enlace (Link Principal) */}
                <a
                  href={user?.website ? user?.website : user.links[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-0.5 text-sm ${txtClass} active:underline hover:underline`}
                >
                  <Link2 size={14} className="-rotate-45" />
                  {user?.website
                    ? cleanUrlParams(user?.website)
                    : cleanUrlParams(user.links[0].link)}
                </a>

                {/* Texto "y X enlaces más" que abre el Modal */}
                {user.links.length > 1 && (
                  <span
                    className={`text-sm ${txtClass} cursor-pointer opacity-95`}
                    onClick={handleOpenLinks} // <--- 3. Conectamos el evento
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
        <div className="w-full flex border-t border-neutral-200 dark:border-neutral-800">
          <Link
            to={`/${user?.username}`}
            className="w-full h-12 flex items-center justify-center hover:bg-neutral-800/50 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-out"
          >
            <LayoutDashboard strokeWidth={1.5} />
          </Link>
          {user?.music && (
            <Link
              to={`/${user?.username}/music`}
              className="w-full h-12 flex items-center justify-center hover:bg-neutral-800/50 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-out"
            >
              <AudioLines strokeWidth={1.5} />
            </Link>
          )}
          {user?.collections && (
            <Link
              to={`/${user?.username}/collections`}
              className="w-full h-12 flex items-center justify-center hover:bg-neutral-800/50 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-out"
            >
              <Folder strokeWidth={1.5} />
            </Link>
          )}
          <Link
            to={`/${user?.username}/media`}
            className="w-full h-12 flex items-center justify-center hover:bg-neutral-800/50 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-out"
          >
            <Grid3X3 strokeWidth={1.5} />
          </Link>
          {user?.shop && (
            <Link
              to={`/${user?.username}/shop`}
              className="w-full h-12 flex items-center justify-center hover:bg-neutral-800/50 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-out"
            >
              <ShoppingBagIcon className="size-6" />
            </Link>
          )}
          <Link
            to={`/${user?.username}/reposts`}
            className="w-full h-12 flex items-center justify-center hover:bg-neutral-800/50 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-out"
          >
            <ArrowPathRoundedSquareIcon className="size-6.5" />
          </Link>
          <Link
            to={`/${user?.username}/saved`}
            className="w-full h-12 flex items-center justify-center hover:bg-neutral-800/50 transition-all duration-300 ease-out"
          >
            <BookmarkIcon className="size-6.5" />
          </Link>
        </div>
      </div>
      <div className="size-full mt-1 mb-22 md:mb-4 rounded-xl overflow-hidden">
        <Outlet />
      </div>
    </>
  );
}

import {
  EmptyState,
  PageBox,
  PageHeader,
  PageTabs,
  Post,
  SearchBar,
  UserCard,
} from "../components";
import { BadgeCheck, Frown, Settings, Settings2, Star } from "lucide-react";
import { db, usePosts, useUsers } from "../hooks";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function Search() {
  const users = useUsers(db);
  const posts = usePosts(db);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Estado para el término de búsqueda y el tab activo
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const debouncedTerm = useDebounce(searchTerm, 500);

  // Actualizar el término de búsqueda desde los query params
  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  // Manejar cambios en la barra de búsqueda
  const handleSearchChange = (event) => {
    const newTerm = event.target.value.toLowerCase();
    setSearchTerm(newTerm);
  };

  // Normalizamos el término de búsqueda para evitar problemas de espacios
  const cleanTerm = debouncedTerm.trim().toLowerCase();

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user?.name
        ?.toLowerCase()
        .includes(cleanTerm.replace("#", "").replace("@", "")) ||
      user?.username
        ?.toLowerCase()
        .includes(cleanTerm.replace("#", "").replace("@", "")) ||
      user?.categories?.some((cat) =>
        cat.toLowerCase().includes(cleanTerm.replace("#", "").replace("@", "")),
      );

    return matchesSearch;
  });

  // Filtrar publicaciones
  const filteredPosts = posts.filter((post) => {
    const postContent = post?.caption?.toLowerCase() || "";

    return postContent.includes(cleanTerm);
  });

  // Si hay término, preparamos el query string, si no, string vacío
  const queryParam = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : "";

  return (
    <>
      <PageHeader
        title="Búsqueda"
        header="Búsqueda ~ CloudBook"
        buttonRight={{
          icon: Settings2,
          title: "Configuración de búsqueda",
          onClick: () => navigate(`/settings/search`),
        }}
      />
      <PageBox className="gap-2" active>
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar..."
        />
        <PageTabs
          tabs={[
            {
              id: "home",
              label: "Destacados",
              path: `/search${queryParam}`,
            },
            {
              id: "users",
              label: "Perfiles",
              path: `/search/profiles${queryParam}`,
            },
            {
              id: "posts",
              label: "Publicaciones",
              path: `/search/posts${queryParam}`,
            },
          ]}
          activeTab={`/search${queryParam}`}
        />
        <div className="w-full mt-2 flex flex-col gap-4">
          {/* SECCIÓN DE USUARIOS */}
          {filteredUsers.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="px-2 flex items-center justify-between">
                <h2 className="text-sm font-bold text-neutral-500 uppercase">
                  Perfiles
                </h2>
                {filteredUsers.length > 4 && (
                  <Link
                    to={`/search/profiles?q=${encodeURIComponent(searchTerm)}`}
                    className="text-xs font-medium text-sky-500 hover:underline"
                  >
                    Ver más perfiles
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {searchTerm ? (
                  filteredUsers.length > 0 ? (
                    filteredUsers
                      .sort(
                        (a, b) =>
                          (b.followers?.length || 0) -
                          (a.followers?.length || 0),
                      )
                      .slice(0, 4)
                      .map((user, index) => (
                        <div
                          key={index}
                          className="w-full flex items-center justify-between rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all cursor-pointer"
                        >
                          <UserCard {...user} showFollowButton={true} users />
                        </div>
                      ))
                  ) : (
                    <EmptyState
                      Icon={Frown}
                      title="Sin perfiles"
                      caption="No hay usuarios que coincidan con tu búsqueda."
                    />
                  )
                ) : (
                  users
                    .filter(
                      (u) =>
                        u?.followers?.length >= 1000 || u?.verified?.status,
                    )
                    .sort(
                      (a, b) =>
                        (b.followers?.length || 0) - (a.followers?.length || 0),
                    )
                    .slice(0, 4)
                    .map((user, index) => (
                      <div
                        key={index}
                        className="w-full flex items-center justify-between rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all cursor-pointer"
                      >
                        <UserCard {...user} showFollowButton={true} users />
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* SECCIÓN DE PUBLICACIONES */}
          <div className="flex flex-col gap-2">
            <div className="px-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-500 uppercase">
                Publicaciones
              </h2>
              {filteredPosts.length > 0 && (
                <Link
                  to={`/search/posts?q=${encodeURIComponent(searchTerm)}`}
                  className="text-xs font-medium text-sky-500 hover:underline"
                >
                  Ver más publicaciones
                </Link>
              )}
            </div>
            {filteredPosts.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filteredPosts
                  .filter(
                    (post) =>
                      post?.likes?.length > 0 && post?.status === "public",
                  )
                  .slice(0, 20)
                  .map((post) => {
                    const user = users.find((user) => user.id === post.userId);

                    return (
                      <Post
                        key={post.id}
                        postId={post?.id}
                        {...user}
                        {...post}
                      />
                    );
                  })}
              </div>
            ) : (
              <EmptyState
                Icon={Frown}
                title="Sin publicaciones"
                caption="No encontramos posts que coincidan con tu búsqueda."
              />
            )}
          </div>

          {/* ESTADO VACÍO GLOBAL (Si no hay ni usuarios ni posts) */}
          {filteredUsers.length === 0 && filteredPosts.length === 0 && (
            <EmptyState
              Icon={Frown}
              title="Sin resultados"
              caption={`No encontramos nada para «${searchTerm}»`}
            />
          )}
        </div>
      </PageBox>
    </>
  );
}

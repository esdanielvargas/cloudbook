import { BadgeCheck, Frown, Settings, Settings2, Star } from "lucide-react";
import {
  PageHeader,
  PageBox,
  SearchBar,
  PageTabs,
  UserCard,
  EmptyState,
} from "@/components";
import { db, useDebounce, useUsers } from "@/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchUsers() {
  const users = useUsers(db);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Estado para el término de búsqueda y el tab activo
  const [searchTerm, setSearchTerm] = useState("");
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

  // Si hay término, preparamos el query string, si no, string vacío
  const queryParam = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : "";

  return (
    <>
      <PageHeader
        title="Buscar perfiles"
        header="Buscar perfiles ~ CloudBook"
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
          placeholder="Buscar perfiles..."
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
          activeTab={`/search/profiles${queryParam}`}
        />
        <div className="w-full xmt-2 flex flex-col gap-1">
          {filteredUsers.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 gap-1">
                {searchTerm ? (
                  filteredUsers.length > 0 ? (
                    filteredUsers
                      .sort(
                        (a, b) =>
                          (b.followers?.length || 0) -
                          (a.followers?.length || 0),
                      )
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

          {filteredUsers.length === 0 && (
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

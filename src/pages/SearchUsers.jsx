import {
  BadgeCheck,
  Settings,
  Settings2,
  Star,
} from "lucide-react";
import {
  PageBox,
  PageHeader,
  PageTabs,
  SearchBar,
  UserCard,
} from "../components";
import { db, useDebounce, useUsers } from "../hooks";
import { useState } from "react";

export default function SearchUsers() {
  const users = useUsers(db);

  // Estado para el término de búsqueda y el tab activo
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebounce(searchTerm, 500);

  // Estado para filtrar
  const [filters, setFilters] = useState({
    popular: false,
    verified: false,
  });

  // Manejar cambios en la barra de búsqueda
  const handleSearchChange = (event) => {
    const newTerm = event.target.value.toLowerCase();
    setSearchTerm(newTerm);
  };

  // Alternar filtros
  const toggleFilter = (filter) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  // Determinar si es una búsqueda por hashtag
  const isHashtagSearch = debouncedTerm.startsWith("#");

  // Filtrar usuarios
  const filteredUsers = !isHashtagSearch
    ? users.filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(debouncedTerm) ||
          user.username.toLowerCase().includes(debouncedTerm);
        const matchesPopular =
          !filters.popular || user.followers.length >= 1000;
        const matchesVerified = !filters.verified || user.verified;
        return matchesSearch && matchesPopular && matchesVerified;
      })
    : [];

  //Usuarios populares para la búsqueda
  const popular = users.filter(
    (user) => user?.followers?.length >= 1000 || user?.verified
  );

  return (
    <>
      <PageHeader
        title="Buscar perfiles"
        icon={<Settings2 size={18} strokeWidth={1.5} />}
        menuOptions={[
          {
            icon: Star,
            title: "Filtrar por perfiles populares",
            onClick: () => toggleFilter("popular"),
          },
          {
            icon: BadgeCheck,
            title: "Filtrar por perfiles verificados",
            onClick: () => toggleFilter("verified"),
          },
          { type: "divider" },
          {
            icon: Settings,
            title: "Configuración de búsqueda",
            to: "/settings/search",
          },
        ]}
      />
      <PageBox active>
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
              to: "/search",
            },
            {
              id: "users",
              label: "Perfiles",
              to: "/search/profiles",
            },
            {
              id: "posts",
              label: "Publicaciones",
              to: "/search/posts",
            },
          ]}
          activeTab={"/search/profiles"}
        />
        <div className="w-full space-y-1">
          {searchTerm
            ? filteredUsers
                .sort((a, b) => b.followers.length - a.followers.length)
                .map((user, index) => (
                  <div
                    key={index}
                    className="w-full cursor-pointer flex items-center justify-between rounded-lg border border-neutral-200/50 dark:border-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-out"
                  >
                    <UserCard {...user} show_followers={true} />
                  </div>
                ))
            : popular
                .sort((a, b) => b?.followers?.length - a?.followers?.length)
                .map((user, index) => (
                  <div
                    key={index}
                    className="w-full cursor-pointer flex items-center justify-between rounded-lg border border-neutral-200/50 dark:border-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-out"
                  >
                    <UserCard {...user} show_followers={true} />
                  </div>
                ))}
          {filteredUsers.length === 0 && !isHashtagSearch && (
            <div className="py-10 text-center text-neutral-500 dark:text-neutral-400">
              No se encontraron usuarios con ese nombre o filtro. 😕
            </div>
          )}
        </div>
      </PageBox>
    </>
  );
}

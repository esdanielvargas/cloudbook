import { UserPlusIcon } from "@heroicons/react/24/outline";
import {
  PageBox,
  PageHeader,
  PageTabs,
  SearchBar,
  UserCard,
} from "../components";
import { BadgeCheck, Settings, Settings2, Star } from "lucide-react";
import { db, usePosts, useUsers } from "../hooks";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useThemeColor } from "../context";
import Post from "../components/Post";

export default function Search() {
  const users = useUsers(db);
  const posts = usePosts(db);
  const { bgClass, hoverClass } = useThemeColor();
  const [searchParams] = useSearchParams();

  // Estado para el término de búsqueda y el tab activo
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  // const [activeTab, setActiveTab] = useState(searchParams.get("f") || "");
  const debouncedTerm = useDebounce(searchTerm, 500);

  // Estado para filtrar
  const [filters, setFilters] = useState({
    popular: false,
    verified: false,
  });

  // Actualizar el término de búsqueda desde los query params
  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
    // setActiveTab(searchParams.get("f") || "foryou");
  }, [searchParams]);

  // Manejar cambios en la barra de búsqueda
  const handleSearchChange = (event) => {
    const newTerm = event.target.value.toLowerCase();
    setSearchTerm(newTerm);
    // navigate(`/search?q=${newTerm}&f=${activeTab}`);
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

  // Filtrar publicaciones (para hashtags)
  const filteredPosts = isHashtagSearch
    ? posts.filter((post) => post.content.toLowerCase().includes(debouncedTerm))
    : [];

  //Usuarios populares para la búsqueda
  const popular = users.filter(
    (user) => user?.followers?.length >= 1000 || user?.verified
  );

  // Contenido según el tab activo
  // const renderContent = () => {
  //   if (activeTab === "foryou") {
  //     return popular
  //       .sort((a, b) => b.followers.length - a.followers.length)
  //       .map((user, index) => (
  //         <div
  //           key={index}
  //           className="w-full px-3 cursor-pointer flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-out"
  //         >
  //           <UserCard {...user} users />
  //           <button
  //             type="button"
  //             className={`h-9 px-2 md:px-4 flex items-center justify-center cursor-pointer rounded-lg ${bgClass} ${hoverClass} transition-all`}
  //           >
  //             <div className="flex md:hidden">
  //               <UserPlusIcon className="size-6" />
  //             </div>
  //             <div className="hidden md:flex font-bold text-sm text-white">
  //               Seguir
  //             </div>
  //           </button>
  //         </div>
  //       ));
  //   }

  //   if (activeTab === "profiles") {
  //     return filteredUsers.length > 0 ? (
  //       filteredUsers
  //         .sort((a, b) => b.followers.length - a.followers.length)
  //         .map((user, index) => (
  //           <div
  //             key={index}
  //             className="w-full px-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300 ease-out"
  //           >
  //             <UserCard {...user} users />
  //             <button
  //               type="button"
  //               className={`h-9 px-2 md:px-4 flex items-center justify-center cursor-pointer rounded-lg ${bgClass} ${hoverClass} transition-all`}
  //             >
  //               <div className="flex md:hidden">
  //                 <UserPlusIcon className="size-6" />
  //               </div>
  //               <div className="hidden md:flex font-bold text-sm text-white">
  //                 Seguir
  //               </div>
  //             </button>
  //           </div>
  //         ))
  //     ) : (
  //       <div className="py-10 text-center text-neutral-500 dark:text-neutral-400">
  //         No se encontraron usuarios con ese nombre 😕
  //       </div>
  //     );
  //   }

  //   if (activeTab === "posts") {
  //     return filteredPosts.length > 0 ? (
  //       filteredPosts.map((post, index) => (
  //         <div
  //           key={index}
  //           className="w-full px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300 ease-out"
  //         >
  //           {/* Asumiendo que tienes un componente PostCard para mostrar publicaciones */}
  //           <div>{post.content}</div>
  //         </div>
  //       ))
  //     ) : (
  //       <div className="py-10 text-center text-neutral-500 dark:text-neutral-400">
  //         No se encontraron publicaciones con ese hashtag 😕
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="py-10 text-center text-neutral-500 dark:text-neutral-400">
  //       Esta sección está en desarrollo (lanzamientos, fotos, videos).
  //     </div>
  //   );
  // };

  return (
    <>
      <PageHeader
        title="Búsqueda"
        Icon={Settings2}
        menuOptions={[
          {
            icon: Star,
            title: "Filtrar por usuarios populares",
            onClick: () => toggleFilter("popular"),
          },
          {
            icon: BadgeCheck,
            title: "Filtrar por usuarios verificados",
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
      <PageBox active className="gap-2">
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
          activeTab={"/search"}
          // onChange={(tabId) => {
          //   setActiveTab(tabId);
          //   navigate(`/search?q=${searchTerm}&f=${tabId}`);
          // }}
        />
        <div className="w-full hidden space-y-1">
          {filteredUsers.length > 0 ? (
            filteredUsers
              .sort((a, b) => b.followers.length - a.followers.length)
              .map((user, index) => (
                <div
                  key={index}
                  className="w-full px-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300 ease-out"
                >
                  <UserCard {...user} users />
                  <button
                    type="button"
                    className={`h-9 px-2 md:px-4 flex items-center justify-center cursor-pointer rounded-lg ${bgClass} ${hoverClass} transition-all`}
                  >
                    <div className="flex md:hidden">
                      <UserPlusIcon className="size-6" />
                    </div>
                    <div className="hidden md:flex font-bold text-sm text-white">
                      Seguir
                    </div>
                  </button>
                </div>
              ))
          ) : (
            <div className="py-10 text-center text-neutral-500 dark:text-neutral-400">
              No se encontraron usuarios con ese nombre 😕
            </div>
          )}
          ---
          {filteredPosts.length > 0 ? (
            filteredPosts
              .slice(0, 3)
              .map((post) => <Post key={post.id} {...post} />)
          ) : (
            <div className="py-10 text-center text-neutral-500 dark:text-neutral-400">
              No se encontraron publicaciones con ese hashtag 😕
            </div>
          )}
        </div>
        <div className="w-full space-y-1">
          {searchTerm
            ? filteredUsers
                .sort((a, b) => b.followers.length - a.followers.length)
                .map((user, index) => (
                  <div
                    key={index}
                    className="w-full cursor-pointer flex items-center justify-between rounded-lg border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-out"
                  >
                    <UserCard {...user} users />
                  </div>
                ))
            : popular
                .sort((a, b) => b.followers.length - a.followers.length)
                .map((user, index) => (
                  <div
                    key={index}
                    className="w-full cursor-pointer flex items-center justify-between rounded-lg border border-neutral-200/50 dark:border-neutral-800/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-out"
                  >
                    <UserCard {...user} users />
                  </div>
                ))}
          {filteredUsers.length === 0 && !isHashtagSearch && (
            <div className="py-10 text-center text-neutral-500 dark:text-neutral-400">
              No se encontraron usuarios con ese nombre 😕
            </div>
          )}
        </div>
      </PageBox>
    </>
  );
}

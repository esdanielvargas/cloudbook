import { Hash, Settings, Settings2 } from "lucide-react";
import {
  PageBox,
  PageHeader,
  PageTabs,
  SearchBar,
  Button,
  PageLine,
} from "../components";
import Post from "../components/Post";
import { db, useDebounce, usePosts, useUsers } from "../hooks";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchPosts() {
  const posts = usePosts(db);
  const users = useUsers(db); // To get display name and username
  const [searchParams, setSearchParams] = useSearchParams();
  const [hashtag, setHashtag] = useState(false);

  // State for search term, hashtag, and pagination
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [tag, setTag] = useState(
    searchParams.get("tag")?.replace(/^#/, "") || ""
  ); // Remove # if present
  const debouncedTerm = useDebounce(searchTerm, 500);
  const [visiblePosts, setVisiblePosts] = useState(10); // Number of posts to show initially
  const postsPerPage = 10; // Number of posts to load each time

  // Update state from query params
  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
    setTag(searchParams.get("tag")?.replace(/^#/, "") || "");
    setVisiblePosts(10); // Reset pagination on new search
  }, [searchParams]);

  // Handle search bar input
  const handleSearchChange = (event) => {
    const newTerm = event.target.value;
    setSearchTerm(newTerm);
    // Update URL with debounced term
    const params = {};
    if (newTerm) params.q = newTerm;
    if (tag) params.tag = tag;
    setSearchParams(params);
  };

  // Filter posts based on search term and hashtag
  const filteredPosts = posts.filter((post) => {
    // Get author details for name/username search
    const author = users.find((user) => user.uid === post.authorId);
    const searchFields = [
      post.title?.toLowerCase() || "",
      post.text?.toLowerCase() || "",
      author?.name?.toLowerCase() || "",
      author?.username?.toLowerCase() || "",
    ].join(" ");

    // Check hashtag filter
    const tagMatch = tag
      ? post.text?.toLowerCase().includes(`#${tag.toLowerCase()}`)
      : true;

    // Check search term filter
    const termMatch = debouncedTerm
      ? searchFields.includes(debouncedTerm.toLowerCase())
      : true;

    return tagMatch && termMatch;
  });

  // Slice posts for pagination
  const displayedPosts = filteredPosts.slice(0, visiblePosts);

  // Handle "Load More" button
  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + postsPerPage);
  };

  return (
    <>
      <PageHeader
        title="Buscar publicaciones"
        icon={<Settings2 size={18} strokeWidth={1.5} />}
        menuOptions={[
          {
            icon: Hash,
            title: "Filtrar por hashtag",
            onClick: setHashtag(!hashtag),
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
        {/* Search bar for general search */}
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar por título, descripción, nombre o usuario..."
        />
        <SearchBar
          Icon={Hash}
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Ingresa un hashtag"
        />
        <PageTabs
          tabs={[
            { id: "home", label: "Destacados", to: "/search" },
            { id: "users", label: "Perfiles", to: "/search/profiles" },
            { id: "posts", label: "Publicaciones", to: "/search/posts" },
          ]}
          activeTab="/search/posts"
        />
        {tag && (
          <>
            <PageLine />
            <div className="w-full x.px-4 x.py-2 text-xs rounded-lg x.border text-neutral-600 dark:text-neutral-400">
              Mostrando publicaciones con #{tag}
            </div>
            <PageLine />
          </>
        )}
        <div className="w-full space-y-1">
          {displayedPosts.length > 0 ? (
            displayedPosts.map((post) => <Post key={post.id} {...post} />)
          ) : (
            <>
              <div className="w-full text-xs text-neutral-500 dark:text-neutral-400">
                No se encontraron publicaciones.
              </div>
            </>
          )}
        </div>
        {filteredPosts.length > visiblePosts && (
          <div className="flex justify-center py-4">
            <Button
              variant="inactive"
              onClick={handleLoadMore}
              // className="w-full"
            >
              Cargar más
            </Button>
          </div>
        )}
      </PageBox>
    </>
  );
}

// import { Settings2 } from "lucide-react";
// import { PageBox, PageHeader, PageTabs, SearchBar } from "../components";
// import Post from "../components/Post";
// import { db, useDebounce, usePosts } from "../hooks";
// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";

// export default function SearchPosts() {
//   const posts = usePosts(db);
//   const [searchParams] = useSearchParams();
//   const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
//   const debouncedTerm = useDebounce(searchTerm, 500);

//   // Actualizar el término de búsqueda desde los query params
//   useEffect(() => {
//     setSearchTerm(searchParams.get("q") || "");
//     // setActiveTab(searchParams.get("f") || "foryou");
//   }, [searchParams]);

//   // Manejar cambios en la barra de búsqueda
//   const handleSearchChange = (event) => {
//     const newTerm = event.target.value.toLowerCase();
//     setSearchTerm(newTerm);
//     // navigate(`/search?q=${newTerm}&f=${activeTab}`);
//   };

//   // Determinar si es una búsqueda por hashtag
//   const isHashtagSearch = debouncedTerm.startsWith("#");

//   // Filtrar publicaciones (para hashtags)
//   const filteredPosts = isHashtagSearch
//     ? posts.filter((post) => post.content.toLowerCase().includes(debouncedTerm))
//     : [];

//   return (
//     <>
//       <PageHeader
//         title="Buscar publicaciones"
//         icon={<Settings2 size={18} strokeWidth={1.5} />}
//       />
//       <PageBox active>
//         {/* Buscar por titulos, descripcion, nombres, usuarios */}
//         <SearchBar
//           value={""}
//           onChange={() => {}}
//           placeholder="Buscar publicaciones..."
//         />
//         <PageTabs
//           tabs={[
//             {
//               id: "home",
//               label: "Destacados",
//               to: "/search",
//             },
//             {
//               id: "users",
//               label: "Perfiles",
//               to: "/search/profiles",
//             },
//             {
//               id: "posts",
//               label: "Publicaciones",
//               to: "/search/posts",
//             },
//           ]}
//           activeTab={"/search/posts"}
//         />
//         <div className="w-full space-y-1">
//           {filteredPosts.map((post) => (
//             <Post {...post} />
//           ))}
//         </div>
//       </PageBox>
//     </>
//   );
// }

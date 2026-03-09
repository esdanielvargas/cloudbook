import { Hash, Settings2, Frown } from "lucide-react";
import {
  PageBox,
  PageHeader,
  PageTabs,
  SearchBar,
  Button,
  EmptyState,
} from "@/components";
import Post from "@/components/Post";
import { db, useDebounce, usePosts, useUsers } from "@/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export default function SearchPosts() {
  const auth = getAuth();
  const posts = usePosts(db);
  const users = useUsers(db);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Estados
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const debouncedTerm = useDebounce(searchTerm, 500);
  const [visiblePosts, setVisiblePosts] = useState(10);

  // Sincronizar con URL
  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
    setVisiblePosts(10);
  }, [searchParams]);

  const handleSearchChange = (event) => {
    const newTerm = event.target.value;
    setSearchTerm(newTerm);
  };

  const cleanTerm = debouncedTerm.trim().toLowerCase();

  // Lógica de filtrado
  const filteredPosts = posts.filter((post) => {
    const isPublic = post?.status === "public";
    if (!isPublic) return false;

    // SI HAY BÚSQUEDA: Filtramos por contenido
    if (cleanTerm) {
      const postContent = post?.caption?.toLowerCase() || "";
      return postContent.includes(cleanTerm);
    }

    // SI NO HAY BÚSQUEDA: Mostramos publicaciones Sugeridas
    return (post?.likes?.length >= 50);
  });

  // Ordenar: Si es búsqueda, por fecha. Si es sugerido, por popularidad.
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (!cleanTerm) {
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    }
    return (b.posted || 0) - (a.posted || 0);
  });

  const displayedPosts = sortedPosts.slice(0, visiblePosts);

  const handleLoadMore = () => setVisiblePosts((prev) => prev + 10);

  // Si hay término, preparamos el query string, si no, string vacío
  const queryParam = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : "";

  return (
    <>
      <PageHeader
        title="Buscar publicaciones"
        header="Buscar publicaciones ~ CloudBook"
        buttonRight={{
          icon: Settings2,
          title: "Configuración",
          onClick: () => navigate("/settings/search"),
        }}
      />
      <PageBox active className="gap-2">
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar por palabras clave o #hashtags..."
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
          activeTab={`/search/posts${queryParam}`}
        />

        <div className="w-full flex flex-col gap-2">
          {displayedPosts.length > 0 ? (
            displayedPosts.map((post) => {
              const postAuthor = users.find((user) => user.id === post.userId);

              return (
                <Post
                  key={post.id}
                  {...post}
                  {...postAuthor}
                  postId={post.id}
                  author={auth?.currentUser?.uid === postAuthor?.uid}
                />
              );
            })
          ) : (
            <EmptyState
              Icon={Frown}
              title="Sin publicaciones"
              caption={
                searchTerm
                  ? `No hay resultados para «${searchTerm}»`
                  : "No hay publicaciones públicas disponibles."
              }
            />
          )}

          {filteredPosts.length > visiblePosts && (
            <div className="flex justify-center py-4">
              <Button variant="inactive" onClick={handleLoadMore}>
                Cargar más publicaciones
              </Button>
            </div>
          )}
        </div>
      </PageBox>
    </>
  );
}

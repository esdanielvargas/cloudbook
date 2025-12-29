import { useParams } from "react-router-dom";
import { PageBox, PageHeader, PageLine, UserCard } from "../components";
import { db, usePosts, useUsers } from "../hooks";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function PagePostActivityUsers() {
  const { postId, action } = useParams();
  const users = useUsers(db);
  const posts = usePosts(db);

  const postSelected = posts.find((post) => post.id === postId);
  if (!postSelected) return <PageBox active>Cargando publicación...</PageBox>;

  const title = {
    likes: "Me gustas",
    comments: "Comentarios",
    reposts: "Republidos",
    quotes: "Citas",
    shared: "Compartidos",
    saved: "Guardados",
  };

  let list = [];

  if (action === "likes") {
    list = users.filter((user) => postSelected.likes?.includes(user.id));
  } else if (action === "reposts") {
    list = users.filter((user) => postSelected.reposts?.includes(user.id));
  } else if (action === "saved") {
    list = users.filter((user) => postSelected.saved?.includes(user.id));
  } else if (action === "comments") {
    list = postSelected.comments
      ?.map((comment) => {
        const user = users.find((u) => u.id === comment.userId);
        return user ? { ...user, commentText: comment.text } : null;
      })
      .filter(Boolean);
  }

  return (
    <>
      <PageHeader
        title={title[action]}
        icon={<MagnifyingGlassIcon className="size-5" />}
      />
      <PageBox active className="p-0! gap-0!">
        {list?.length > 0 ? (
          list.map((user) => (
            <div key={user.id} className="w-full">
              <UserCard {...user} />
              {user.quoteText && (
                <div className="ml-4 mt-1 text-sm text-neutral-400 border-l-2 pl-2 border-neutral-700 italic">
                  {user.quoteText}
                </div>
              )}
              {/* <hr className="text-neutral-800" /> */}
              <PageLine />
            </div>
          ))
        ) : (
          <div className="size-full p-2 md:p-4 flex items-center justify-center text-sm md:text-md text-neutral-500">
            No hay resultados.
          </div>
        )}
      </PageBox>
    </>
  );
}

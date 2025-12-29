import { Settings } from "lucide-react";
import { PageBox, PageHeader, PageTabs } from "../components";
import { db, useNotify, usePosts, useUsers } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NotifyBox from "../components/NotifyBox";

export default function Notify() {
  const users = useUsers(db);
  const posts = usePosts(db);
  const notify = useNotify(db);
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("all");

  const filteredNotify = notify.filter((notify) => {
    if (filterType === "all") return true;
    return (
      notify.type === filterType
    );
  });

  return (
    <>
      <PageHeader
        title="Notificaciones"
        icon={<Settings className="size-[18px]" strokeWidth={1.5} />}
        iconTitle="Configuración de notificaciones"
        iconOnClick={() => navigate("/settings/notifications")}
        // menuOptions={[
        //   {
        //     title: "Configuración de notificaciones",
        //     to: "/settings/notifications",
        //   },
        // ]}
      />
      <PageBox active>
        {/* <PageTabs
          className="hidden -mt-3"
          tabs={[
            {
              id: "all",
              label: "Todos",
              to: "/notify"
            },
            {
              id: "followers",
              label: "Seguidores",
              to: "/notify/followers"
            },
            {
              id: "likes",
              label: "Me gustas",
              to: "/notify/likes"
            },
            // {
            //   id: "",
            //   label: "Comentarios",
            // },
            // {
            //   id: "",
            //   label: "Reposteos",
            // },
            // {
            //   id: "",
            //   label: "Citas",
            // },
            // {
            //   id: "",
            //   label: "Compartidos",
            // },
            // {
            //   id: "",
            //   label: "Guardados",
            // },
            // {
            //   id: "",
            //   label: "Menciones",
            // },
            // {
            //   id: "",
            //   label: "Sistema",
            // },
            // {
            //   id: "",
            //   label: "Mensajes",
            // },
          ]}
        /> */}

        <div className="w-full pb-2 md:pb-4 flex items-center justify-start gap-1 md:gap-2 overflow-hidden overflow-x-auto">
          <button
            type="button"
            className="min-w-max h-8.5 md:h-9 px-2.5 md:px-3 text-xs md:text-sm cursor-pointer rounded-xl active:bg-neutral-800 hover:bg-neutral-800 border dark:border-neutral-800"
            onClick={() => setFilterType("all")}
          >
            Todas
          </button>
          <button
            type="button"
            className="min-w-max h-8.5 md:h-9 px-2.5 md:px-3 text-xs md:text-sm cursor-pointer rounded-xl active:bg-neutral-800 hover:bg-neutral-800 border dark:border-neutral-800"
            onClick={() => setFilterType("follow")}
          >
            Seguidores
          </button>
          <button
            type="button"
            className="min-w-max h-8.5 md:h-9 px-2.5 md:px-3 text-xs md:text-sm cursor-pointer rounded-xl active:bg-neutral-800 hover:bg-neutral-800 border dark:border-neutral-800"
            onClick={() => setFilterType("like")}
          >
            Me gustas
          </button>
          <button
            type="button"
            className="min-w-max h-8.5 md:h-9 px-2.5 md:px-3 text-xs md:text-sm cursor-pointer rounded-xl active:bg-neutral-800 hover:bg-neutral-800 border dark:border-neutral-800"
            onClick={() => setFilterType("comment")}
          >
            Comentarios
          </button>
        </div>
        <div className="w-full flex flex-col items-start justify-start">
          {filteredNotify.length > 0 ? (
              filteredNotify
                .sort((a, b) => b.time - a.time)
                .map((notify, index) => {
                  // Información del autor.
                  const user = users.find(
                    (user) => user.id === notify.currentUserId
                  );
                  // Información de la publicación.
                  const post = posts.find(
                    (post) => post.id === notify.postId
                  );

                  return (
                    <NotifyBox
                      key={index}
                      {...user}
                      {...post}
                      {...notify}
                    />
                  );
                })
            ) : (
              <div className="empty">
                <p>Aún no hay notificaciones que mostrar.</p>
              </div>
            )}
        </div>
      </PageBox>
    </>
  );
}

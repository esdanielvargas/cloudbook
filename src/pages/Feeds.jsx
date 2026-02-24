import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import {
  ArrowUpDown,
  CirclePlus,
  ListFilter,
  Newspaper,
  Pin,
  Plus,
} from "lucide-react";
import { PageBox, PageHeader, PageLine, Tab } from "@/components";
import { db, useFeeds, useUsers } from "@/hooks";
import { Nudge } from "@/components/buttons";

export default function Feeds() {
  const auth = getAuth();
  const feeds = useFeeds(db);
  const users = useUsers(db);
  const navigate = useNavigate();

  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid,
  );

  const feedsFiltered = feeds.filter(
    (feed) => feed.ownerId === currentUser?.uid,
  );

  const togglePin = async (feedId, currentPinnedStatus) => {
    try {
      const feedRef = doc(db, "feeds", feedId);
      await updateDoc(feedRef, {
        pinned: !currentPinnedStatus,
      });
    } catch (error) {
      console.error("Error al actualizar pin:", error);
    }
  };

  return (
    <>
      <PageHeader
        title="Listas"
        header={`Listas de ${currentUser?.name} (@${currentUser?.username})`}
        Icon={ArrowUpDown}
        iconTitle="Organizar listas"
        iconOnClick={() => navigate("/lists/reorder")}
      />
      <PageBox active className="p-0! gap-0!">
        <Tab
          Icon={CirclePlus}
          title={"Crear nueva lista"}
          caption={"Crea tu nueva lista personalizada."}
          path={"/lists/new"}
        />
        <PageLine />
        {feedsFiltered?.length > 0 ? (
          feedsFiltered
            ?.sort((a, b) => a.index - b.index)
            .map((feed) => (
              <Tab
                key={feed?.id}
                Icon={Newspaper}
                title={feed?.title}
                caption={feed?.caption}
                path={`/lists/${feed?.id}/edit`}
                secondaryAction={{
                  icon: Pin,
                  active: feed.pinned || false,
                  onClick: () => togglePin(feed.id, feed.pinned),
                }}
              />
            ))
        ) : (
          <>
            <Tab
              Icon={Newspaper}
              title={"Para ti"}
              caption={"Lista creada especificamente para ti."}
              path={"/"}
              secondaryAction={{
                icon: Pin,
                active: true,
              }}
            />
            <Tab
              Icon={Newspaper}
              title={"Seguidos"}
              caption={"Lista de perfiles que sigues."}
              path={"/following"}
              secondaryAction={{
                icon: Pin,
                active: false,
              }}
            />
            <Tab
              Icon={Newspaper}
              title={"Favoritos"}
              caption={"Lista de tus perfiles favoritos."}
              path={"/favorites"}
              secondaryAction={{
                icon: Pin,
                active: false,
              }}
            />
            <Tab
              Icon={Newspaper}
              title={"Mutuos"}
              caption={"Lista de perfiles que sigues y te siguen."}
              path={"/mutuos"}
              secondaryAction={{
                icon: Pin,
                active: false,
              }}
            />
          </>
        )}
      </PageBox>
    </>
  );
}

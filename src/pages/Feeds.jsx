import { getAuth } from "firebase/auth";
import { PageBox, PageHeader, PageLine } from "../components";
import { db, useUsers } from "../hooks";
import { Nudge } from "../components/buttons";
import {
  BadgeCheck,
  CirclePlus,
  CirclePlusIcon,
  Info,
  Newspaper,
  Plus,
  Rss,
  Scroll,
  ScrollText,
  Settings,
  SquarePlus,
  Sticker,
} from "lucide-react";

export default function Feeds({ title = "Feeds" }) {
  const auth = getAuth();
  const users = useUsers(db);

  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid
  );

  return (
    <>
      <PageHeader
        title={title}
        icon={<Info size={18} />}
        // iconTitle="Crear nuevo feed"
        // iconOnClick={() => navigate("/feeds/create")}
      />
      <PageBox active>
        <Nudge Icon={CirclePlus} title="Crear nuevo feed" to={`/feeds/create`} />
        <PageLine />
        <Nudge Icon={Rss} title="Lorem" to={`/feeds/create`} />
        <Nudge Icon={Rss} title="Cats" to={`/feeds/create`} />
        <Nudge Icon={Rss} title="Programación" to={`/feeds/create`} />
        <Nudge Icon={Rss} title="Casas" to={`/feeds/create`} />
        {currentUser?.feeds?.map((feed) => (
          <Nudge
            key={feed?.id}
            Icon={Rss}
            title={feed?.title}
            to={`/feeds/${feed?.id}/edit`}
          />
        ))}
      </PageBox>
    </>
  );
}

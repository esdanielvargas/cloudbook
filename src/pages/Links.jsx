import { ArrowUpDown, ChevronLeft, CirclePlus, Link2 } from "lucide-react";
import { PageBox, PageHeader, PageLine, Tab } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { db, useUsers } from "@/hooks";
import { cleanUrlParams } from "@/utils";

export default function Links() {
  const users = useUsers(db);
  const navigate = useNavigate();
  const { username } = useParams();
  const user = users.find((user) => user.username === username);

  return (
    <>
      <PageHeader
        title="Enlaces"
        header="Enlaces ~ CloudBook"
        buttonLeft={{
          icon: ChevronLeft,
          title: "Volver atrás",
          onClick: () => navigate(`/${username}/edit`),
        }}
        buttonRight={{
          icon: ArrowUpDown,
          title: "Organizar enlaces",
          onClick: () => navigate(`/${username}/links/reorder`),
        }}
      />
      <PageBox className="p-0! gap-0!" active>
        <Tab
          Icon={CirclePlus}
          title="Agregar un enlace"
          caption="Agrega un enlace"
          path={`/${username}/links/new`}
        />
        <PageLine />
        {user?.links?.map((link, index) => (
          <Tab
            key={index}
            Icon={Link2}
            title={link.title}
            caption={cleanUrlParams(link.link)}
            path={`/${username}/links/${link.id}/edit`}
          />
        ))}
      </PageBox>
    </>
  );
}

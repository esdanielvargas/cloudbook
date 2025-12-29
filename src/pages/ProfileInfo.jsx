import { useParams } from "react-router-dom";
import { PageBox, PageHeader, PageLine, Tab } from "../components";
import { Calendar1, CalendarHeart, MapPin, VerifiedIcon } from "lucide-react";
import { formatLocation } from "../utils";
import { db, useUsers } from "../hooks";

export default function ProfileInfo() {
  const users = useUsers(db);
  const { username } = useParams();
  const user = users.find((user) => user?.username === username);

  const since = user?.since
    ? ` ${new Date(user?.since?.seconds * 1000).toLocaleDateString("es", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`
    : "No verificado";

  const birthdate = new Date(user?.birthdate.seconds * 1000).toLocaleDateString(
    "es",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  const verified = user?.verified
    ? `Verificado desde ${new Date(
        user?.verified_at?.seconds * 1000
      ).toLocaleDateString("es", { month: "short", year: "numeric" })}`
    : "No verificado";

  const tabs = [
    {
      Icon: Calendar1,
      title: "Se unió el",
      caption: since,
    },
    {
      Icon: MapPin,
      title: "Ubicación",
      caption: formatLocation(user?.location?.country, user?.location?.state),
    },
    {
      Icon: CalendarHeart,
      title: "Fecha de nacimiento",
      caption: `${birthdate}`,
    },
    { type: "divider" },
    {
      Icon: VerifiedIcon,
      title: "Verificado",
      caption: verified,
      path: "/upgrade?ref=profile_info",
    },
    { type: "divider" },
  ];

  return (
    <>
      <PageHeader title="Información del perfil" />
      <PageBox active className="p-0! gap-0!">
        {tabs.map((tab, index) =>
          tab.type === "divider" ? (
            <PageLine key={index} />
          ) : (
            <Tab key={index} {...tab} />
          )
        )}
      </PageBox>
    </>
  );
}

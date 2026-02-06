import { useParams } from "react-router-dom";
import { PageBox, PageHeader, PageLine, Tab } from "../components";
import { Calendar1, CalendarHeart, MapPin, VerifiedIcon } from "lucide-react";
import { formatLocation } from "../utils";
import { db, useUsers } from "../hooks";

export default function ProfileInfo() {
  const users = useUsers(db);
  const { username } = useParams();
  const user = users.find((user) => user?.username === username);

  const createdAt = user?.createdAt
    ? ` ${new Date(user?.createdAt).toLocaleDateString("es", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`
    : "No especificado";

  const birthdate = new Date(user?.birthdate).toLocaleDateString("es", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const age =
    new Date().getFullYear() - new Date(user?.birthdate).getFullYear();

  const verified = user?.verified
    ? `Verificado desde ${new Date(
        user?.verified_at?.seconds * 1000,
      ).toLocaleDateString("es", { month: "short", year: "numeric" })}`
    : "No verificado";

  const tabs = [
    {
      show: true,
      Icon: Calendar1,
      title: "Se unió el",
      caption: createdAt,
    },
    {
      show: true,
      Icon: MapPin,
      title: "Ubicación",
      caption: formatLocation(user?.location?.country, user?.location?.state),
    },
    {
      show: true,
      Icon: CalendarHeart,
      title: "Fecha de nacimiento",
      caption: `${birthdate} (${age} años)`,
    },
    {
      show: true,
      type: "divider",
    },
    {
      show: verified,
      Icon: VerifiedIcon,
      title: "Verificado",
      caption: verified,
      path: "/upgrade?ref=profile_info",
    },
    {
      show: true,
      type: "divider",
    },
  ];

  return (
    <>
      <PageHeader title="Información del perfil" />
      <PageBox active className="p-0! gap-0!">
        {tabs
          .filter((tab) => tab.show)
          .map((tab, index) =>
            tab.type === "divider" ? (
              <PageLine key={index} />
            ) : (
              <Tab key={index} {...tab} />
            ),
          )}
      </PageBox>
    </>
  );
}

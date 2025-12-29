import {
  AtSign,
  Cake,
  CalendarHeart,
  FolderArchive,
  Ghost,
  LockKeyhole,
  Mail,
  MapPin,
  Shapes,
  Smartphone,
  Trash2,
  User,
  VerifiedIcon,
} from "lucide-react";
import { PageBox, PageHeader, PageLine, Tab } from "../components";
import { getAuth } from "firebase/auth";
import { db, useUsers } from "../hooks";
import { formatLocation } from "../utils";
import { useNavigate } from "react-router-dom";

export default function SettingsAccount(props) {
  const auth = getAuth();
  const users = useUsers(db);
  const user = users.find((user) => user?.uid === auth.currentUser?.uid);
  const { navigate } = useNavigate();

  const { code = "34", phone = "000 000 000" } = props;

  const verified = user?.verified
    ? `Verificado desde ${new Date(
        user?.verified_at?.seconds * 1000
      ).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}`
    : "No verificado";

  const gender =
    user?.gender === "male"
      ? "Masculino"
      : user?.gender === "female"
      ? "Femenino"
      : "No especificado";

  const birthdate = new Date(user?.birthdate.seconds * 1000).toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const age =
    new Date().getFullYear() -
    new Date(user?.birthdate.seconds * 1000).getFullYear();

  const tabs = [
    {
      Icon: AtSign,
      title: "Nombre de usuario",
      caption: `@${user?.username || "username"}`,
      path: "/settings/account/username",
    },
    {
      Icon: Smartphone,
      title: "Teléfono",
      caption: `+${code} ${phone}`,
      // path: "/settings/account/phone",
    },
    {
      Icon: Mail,
      title: "Correo electrónico",
      caption: user?.email,
      // path: "/settings/account/email",
    },
    {
      Icon: LockKeyhole,
      title: "Contraseña",
      caption: "Manten segura tu cuenta.",
      // path: "/settings/account/password",
    },
    { type: "divider" },
    {
      Icon: VerifiedIcon,
      title: "Verificado",
      caption: verified,
      path: "/upgrade?ref=settings_account",
    },
    { type: "divider" },
    {
      Icon: MapPin,
      title: "Ubicación",
      caption: formatLocation(user?.location?.country, user?.location?.state),
      path: "/settings/account/location",
    },
    {
      Icon: Shapes,
      title: "Género",
      caption: gender,
      // path: "/settings/account/gender",
    },
    {
      Icon: CalendarHeart,
      title: "Fecha de nacimiento",
      caption: birthdate,
      // path: "/settings/account/birthdate",
    },
    {
      Icon: Cake,
      title: "Edad",
      caption: `${age} años`,
    },
    { type: "divider" },
    {
      Icon: FolderArchive,
      title: "Exportar mis datos",
      caption: "Obtén una copia de seguridad de tu información.",
      // path: "/settings/account/export-data",
    },
    {
      Icon: Ghost,
      title: "Desactivar mi cuenta",
      caption: "Desactiva tu cuenta temporalmente.",
      // path: "/settings/account/deactivate",
      flag: "warning",
    },
    {
      Icon: Trash2,
      title: "Eliminar mi cuenta",
      caption: "Elimina tu cuenta de forma permanente.",
      // path: "/settings/account/delete",
      flag: "danger",
    },
    { type: "divider" },
  ];

  return (
    <>
      <PageHeader
        title="Tu cuenta"
        Icon={User}
        iconTitle="Ir al perfil"
        iconOnClick={() => navigate(`/@${user?.username}`)}
      />
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

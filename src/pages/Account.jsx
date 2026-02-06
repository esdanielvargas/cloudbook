import {
  AtSign,
  CalendarHeart,
  CircleUser,
  FolderArchive,
  Ghost,
  LockKeyhole,
  Mail,
  MapPin,
  Shapes,
  Smartphone,
  Trash2,
  User,
} from "lucide-react";
import { PageBox, PageHeader, PageLine, Tab } from "../components";
import { getAuth } from "firebase/auth";
import { db, useUsers } from "../hooks";
import { formatLocation, formatPhoneNumber } from "../utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Account(props) {
  const auth = getAuth();
  const users = useUsers(db);
  const user = users.find((user) => user?.uid === auth.currentUser?.uid);
  const { navigate } = useNavigate();

  const [countryCode, setCountryCode] = useState(props.code || "503");
  const getPlaceholder = (code) => {
  if (code === "503") return "0000 0000"; // Formato El Salvador
  if (code === "34" || code === "1") return "000 000 000"; // España o USA
  return "000 000 000"; // Valor por defecto general
};

// Si props.phone no existe, usamos el placeholder dinámico
const displayPhone = props.phone || getPlaceholder(countryCode);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.country_calling_code) {
          setCountryCode(data.country_calling_code.replace("+", ""));
        }
      } catch (error) {
        console.error("Error obteniendo la IP:", error);
      }
    };

    fetchCountryCode();
  }, []);

  const genderLabels = {
    male: "Masculino",
    female: "Femenino",
    non_binary: "No binario",
    other: "Otro",
    hidden: "Prefiero no decirlo",
  };

  const orientationLabels = {
    heterosexual: "Heterosexual",
    gay: "Gay",
    lesbian: "Lesbiana",
    bisexual: "Bisexual",
    queer: "Queer",
    asexual: "Asexual",
    pansexual: "Pansexual",
  };

  const genderText = genderLabels[user?.gender] || "No especificado";

  const orientationText =
    orientationLabels[user?.orientation] || "No especificado";

  const birthdate = new Date(user?.birthdate).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const calculateAge = (dateString) => {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);

    let age = today.getFullYear() - birthDate.getUTCFullYear();
    const m = today.getMonth() - birthDate.getUTCMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getUTCDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(user?.birthdate);

  const tabs = [
    {
      show: true,
      Icon: CircleUser,
      title: "Nombre visible",
      caption: `${user?.name || "Nombre visible"}`,
      // path: "/settings/account/name",
    },
    {
      show: true,
      Icon: AtSign,
      title: "Nombre de usuario",
      caption: `@${user?.username || "username"}`,
      path: "/settings/account/username",
    },
    {
      show: true,
      Icon: Smartphone,
      title: "Teléfono",
      caption: `+${countryCode} ${formatPhoneNumber(displayPhone, countryCode)}`,
      // path: "/settings/account/phone",
    },
    {
      show: true,
      Icon: Mail,
      title: "Correo electrónico",
      caption: user?.email,
      path: "/settings/account/email",
    },
    {
      show: true,
      Icon: LockKeyhole,
      title: "Contraseña",
      caption: "Manten segura tu cuenta.",
      // path: "/settings/account/password",
    },
    {
      show: true,
      type: "divider",
    },
    {
      show: true,
      Icon: MapPin,
      title: "Ubicación",
      caption: formatLocation(
        user?.location?.country,
        user?.location?.state,
        user?.location?.city,
      ),
      path: "/settings/account/location",
    },
    {
      show: true,
      Icon: Shapes,
      title: "Género y orientación",
      caption: `${genderText}, ${orientationText}`,
      path: "/settings/account/gender",
    },
    {
      show: true,
      Icon: CalendarHeart,
      title: "Fecha de nacimiento",
      caption: `${birthdate} (${age} años)`,
      path: "/settings/account/birthdate",
    },
    {
      show: true,
      type: "divider",
    },
    {
      show: true,
      Icon: FolderArchive,
      title: "Exportar mis datos",
      caption: "Obtén una copia de seguridad de tu información.",
      // path: "/settings/account/export-data",
    },
    {
      show: true,
      Icon: Ghost,
      title: "Desactivar mi cuenta",
      caption: "Desactiva tu cuenta temporalmente.",
      // path: "/settings/account/deactivate",
    },
    {
      show: true,
      Icon: Trash2,
      title: "Eliminar cuenta",
      caption: "Elimina tu cuenta de forma permanente.",
      path: "/settings/account/delete",
      flag: "danger",
    },
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

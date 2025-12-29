import {
  Accessibility,
  Bell,
  Info,
  Languages,
  LockKeyhole,
  Palette,
  User,
} from "lucide-react";
import { PageBox, PageHeader, PageLine, Tab } from "../components";

export default function Settings() {
  const tabs = [
    {
      Icon: User,
      title: "Tu cuenta",
      caption: "Gestiona la información de tu cuenta.",
      path: "/settings/account",
    },
    {
      Icon: LockKeyhole,
      title: "Privacidad y seguridad",
      caption: "Configura tus opciones de privacidad.",
      path: "/settings/privacy-and-security",
    },
    { type: "divider" },
    {
      Icon: Languages,
      title: "Idiomas",
      caption: "Selecciona tu idioma preferido.",
      path: "/settings/languages",
    },
    {
      Icon: Palette,
      title: "Apariencia",
      caption: "Personaliza el aspecto de la aplicación.",
      path: "/settings/appearance",
    },
    {
      Icon: Accessibility,
      title: "Accessibilidad",
      caption: "Ajusta las opciones de accesibilidad.",
      path: "/settings/accessibility",
    },
    {
      Icon: Bell,
      title: "Notificaciones",
      caption: "Administra tus preferencias de notificación.",
      path: "/settings/notifications",
    },
    { type: "divider" },
    {
      Icon: Info,
      title: "Acerca de CloudBook",
      caption: "Información sobre la aplicación.",
      path: "/settings/about",
    },
    { type: "divider" },
  ];

  return (
    <>
      <PageHeader title={"Configuración"} />
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

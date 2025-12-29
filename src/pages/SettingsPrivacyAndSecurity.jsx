import {
  Activity,
  AtSign,
  History,
  ShieldCheck,
  UserLock,
  Users,
  UserX,
  VolumeOff,
} from "lucide-react";
import { PageBox, PageHeader, PageLine, Tab } from "../components";

export default function SettingsPrivacyAndSecurity() {
  const tabs = [
    {
      Icon: ShieldCheck,
      title: "Autenticación de doble factor (2FA)",
      caption: "Añade una capa extra de seguridad a tu cuenta.",
      path: "/settings/2fa",
    },
    {
      Icon: Users,
      title: "Gestión de accesos (Roles)",
      caption: "Da acceso a tu cuenta a usuarios de confianza.",
      path: "/settings/manage-accesses",
    },
    {
      Icon: History,
      title: "Historial de acceso a la cuenta",
      caption: "Revisa el historial de accesos a tu cuenta.",
      path: "/settings/login-history",
    },
    { type: "divider" },
    {
      Icon: UserLock,
      title: "Perfil privado",
      caption:
        "Haz que solo tus seguidores puedan interactuar con tu contenido.",
      path: "/settings/account-privacy",
    },
    {
      Icon: AtSign,
      title: "Menciones y etiquetas",
      caption:
        "Controla quién puede mencionarte o etiquetarte en publicaciones.",
      path: "/settings/mentions-and-tags",
    },
    { type: "divider" },
    {
      Icon: VolumeOff,
      title: "Cuentas silenciadas",
      caption: "Gestiona las cuentas que has silenciado.",
      path: "/settings/muted-accounts",
    },
    {
      Icon: UserX,
      title: "Cuentas bloqueadas",
      caption: "Gestiona las cuentas que has bloqueado.",
      path: "/settings/blocked-accounts",
    },
    { type: "divider" },
  ];
  return (
    <>
      <PageHeader title="Privacidad y seguridad" />
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

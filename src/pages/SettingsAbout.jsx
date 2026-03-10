import { Code, Copy, FileText, History } from "lucide-react";
import { PageBox, PageHeader, PageLine, Tab } from "../components";
import { useThemeColor } from "@/context";

export default function SettingsAbout() {
  let { txtClass, bgTransluce20, borderTransluce } = useThemeColor();

  const tabs = [
    { show: true, type: "divider" },
    {
      show: true,
      Icon: History,
      title: "Versión",
      caption: "v2.0.0 (En desarrollo)",
      secondaryAction: {
        icon: Copy,
        onClick: () => navigator.clipboard.writeText("CloudBook v2.0.0-dev"),
      },
    },
    {
      show: true,
      Icon: Code,
      title: "Código abierto",
      caption: "Ir al repositorio en GitHub.",
      href: "https://github.com/esdanielvargas/cloudbook",
    },
    {
      show: true,
      Icon: Code,
      title: "Desarrollador",
      caption: "Diseñado y construido por @danielvargas.",
      href: "https://danielvargas.dev?utm_source=cloudbook_app&utm_medium=settings_about&utm_campaign=cloudbook&utm_content=developer_link&utm_term=danielvargas&utm_id=cloudbook_app",
    },
    { show: true, type: "divider" },
    {
      show: true,
      Icon: FileText,
      title: "Políticas",
      caption: "Aquí encuentras todas nuestras políticas.",
      path: "/legal",
    },
    {
      show: true,
      Icon: FileText,
      title: "Términos y condiciones de uso",
      caption: "Lee nuestros términos de servicio.",
      path: "/legal/terms",
    },
    {
      show: true,
      Icon: FileText,
      title: "Política de privacidad",
      caption: "Lee nuestra política de privacidad.",
      path: "/legal/privacy",
    },
    {
      show: true,
      Icon: FileText,
      title: "Normas de la comunidad",
      caption: "Lee nuestras normas de la comunidad.",
      path: "/legal/community-guidelines",
    },
  ];

  return (
    <>
      <PageHeader title="Acerca de CloudBook" />
      <PageBox active className="p-0! gap-0!">
        <div className="w-full h-60 flex flex-col items-center justify-center gap-1">
          <div className="flex flex-col items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="90px"
              height="60.9px"
              viewBox="0 0 640 446"
              fill="none"
            >
              <path
                d="M20 288.357C20 365.622 86.7068 426 166 426H488C559.593 426 620 371.504 620 301.429C620 247.504 584.026 202.627 534.909 184.986C535.625 180.328 536 175.561 536 170.714C536 115.099 488.106 72.2857 432 72.2857C417.795 72.2857 404.167 75.0133 391.749 79.9573C362.358 43.2838 315.887 20 264 20C179.372 20 108.12 82.5023 104.172 163.615C55.0292 185.324 20 232.512 20 288.357Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="25"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="font-bold text-2xl">CloudBook</h1>
              <span
                className={`${txtClass} ${bgTransluce20} border ${borderTransluce} px-2 py-1 rounded-full font-medium text-xs`}
              >
                v2.0.0-dev
              </span>
            </div>
          </div>
        </div>
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

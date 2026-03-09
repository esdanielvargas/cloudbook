import { PageBox, PageHeader, PageLine, Tab } from "@/components";
import { FileText } from "lucide-react";

export default function Legal() {
  const tabs = [
    {
      show: true,
      Icon: FileText,
      title: "Términos y condiciones de uso",
      caption: "Lee nuestros términos y condiciones de uso.",
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
    { show: true, type: "divider" },
  ];

  return (
    <>
      <PageHeader title={"Políticas"} />
      <PageBox className="p-0!" active>
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

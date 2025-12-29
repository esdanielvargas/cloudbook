import { Settings } from "lucide-react";
import { PageBox, PageHeader } from "../components";

export default function Chats() {
  return (
    <>
      <PageHeader
        title="Mensajes"
        icon={<Settings className="size-[18px]" strokeWidth={1.5} />}
      />
      <PageBox active>Chats</PageBox>
    </>
  );
}

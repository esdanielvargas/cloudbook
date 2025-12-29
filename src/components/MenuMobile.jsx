import { featherPlus } from "@lucide/lab";
import { Bubbly } from "./buttons";
import { Icon } from "lucide-react";
import {
  BellIcon,
  EnvelopeIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { db, useAuth, useUsers } from "../hooks";

export default function MenuMobile() {
  const auth = useAuth(db);
  const users = useUsers(db);

  const user = users.find((u) => u.email === auth?.email);

  const ComposeIcon = (props) => (
    <Icon iconNode={featherPlus} {...props} strokeWidth={1.5} />
  );

  return (
    <div className="w-full h-20 flex md:hidden items-center justify-center fixed z-100 bottom-0 bg-neutral-50/75 dark:bg-neutral-950/75 backdrop-blur-lg border-t border-neutral-100/75 dark:border-neutral-900/75">
      <div className="w-full x.max-w-150 px-4 md:px-0 flex items-center justify-between gap-0.5">
        <Bubbly Icon={HomeIcon} title="Inicio" path="/" />
        <Bubbly Icon={MagnifyingGlassIcon} title="Buscar" path="/search" />
        {/* <Bubbly Icon={ShoppingBagIcon} title="Tienda" path="/news" /> */}
        <Bubbly
          Icon={ComposeIcon}
          title="Crear"
          path="/compose"
          active={true}
          // bgColor="bg-sky-500"
        />
        {/* <Bubbly Icon={EnvelopeIcon} title="Chats" path="/notify" /> */}
        <Bubbly Icon={BellIcon} title="Avisos" path="/notify" />
        <Bubbly Icon={UserIcon} title="Perfil" path={`/${user ? user?.username : "login"}`} />
      </div>
    </div>
  );
}

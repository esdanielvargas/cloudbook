import { db, useUsers } from "../hooks";
import { Button, PageBox, PageHeader, PageLine } from "../components";
import { BadgeCheck } from "lucide-react";

export default function PreferencesUsers() {
  const users = useUsers(db);

  const filtered = users.filter(
    (user) => user.verified || user.avatar || user.premium
  );

  return (
    <>
      <PageHeader title="Perfiles" />
      <PageBox active>
        <div className="size-full">
          <div className="w-full pb-2 grid grid-cols-3 gap-1">
            {filtered.map((user) => (
              <div
                key={user?.id}
                className="z-1 hover:z-2 relative rounded-4xl overflow-hidden border border-neutral-800 cursor-pointer transition-all duration-300 ease-out active:transform active:scale-106 active:-rotate-6 hover:transform hover:scale-106 hover:-rotate-6"
              >
                <img
                  src={user?.avatar || "/images/avatar.png"}
                  alt=""
                  className="object-cover object-center select-none pointer-events-none"
                />
                <div className="w-full flex items-center justify-center absolute z-2 bottom-0 ">
                  <div className="flex items-center gap-0.5 px-1 py-0.5 mb-1.5 rounded-sm bg-neutral-950 border border-neutral-800 text-xs font-mono lowercase">
                    {`@${user?.username}`}
                    {user.verified && <BadgeCheck size={14} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PageLine />
        <div className="w-full flex items-center justify-between gap-2">
          <Button full to="/preferences">
            Omitir
          </Button>
          <Button full variant="follow" to="/preferences/topics">
            Siguiente
          </Button>
        </div>
      </PageBox>
    </>
  );
}

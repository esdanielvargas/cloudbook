import { useParams } from "react-router-dom";
import { PageBox, PageHeader, UserCard } from "../components";
import { getAuth } from "firebase/auth";
import { db, useUsers } from "../hooks";
import { Lock } from "lucide-react";

export default function ProfileFollowing() {
   const auth = getAuth();
  const users = useUsers(db);
  const { username } = useParams();

  const user = users.find((user) => user?.username === username);
  const following = users.filter((u) => user?.following?.includes(u?.id));
  const currentUser = user?.uid === auth?.currentUser?.uid;

  return (
    <>
      <PageHeader title={`Seguidos de @${username}`} />
      <PageBox active>
        {currentUser ? (
          <div className="w-full space-y-1">
            {following?.map((user) => (
              <div
                key={user?.id}
                className="w-full cursor-pointer flex items-center justify-between rounded-lg border border-neutral-200/50 dark:border-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-out"
              >
                <UserCard {...user} show_followers={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4 text-center select-none">
              <Lock size={120} strokeWidth={1.5} className="text-neutral-500" />
              <h2 className="text-lg font-semibold">
                Esta página está restringida
              </h2>
              <p className="text-sm text-neutral-500">
                @{username} ha decidido mantener su lista de seguidos privada.
              </p>
            </div>
          </div>
        )}
      </PageBox>
    </>
  );
}

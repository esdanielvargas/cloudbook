import { useParams } from "react-router-dom";
import { PageBox, PageHeader, UserCard } from "../components";
import { db, useUsers } from "../hooks";
import { getAuth } from "firebase/auth";
import { Lock } from "lucide-react";
import { formatText } from "../utils";

export default function ProfileFollowers() {
  const auth = getAuth();
  const users = useUsers(db);
  const { username } = useParams();

  const user = users.find((user) => user?.username === username);
  const followers = users.filter((u) => user?.followers?.includes(u?.id));
  const currentUser = user?.uid === auth?.currentUser?.uid;

  const text = `@${username} ha decidido mantener su lista de seguidores privada.`;

  return (
    <>
      <PageHeader title={`Seguidores de @${username}`} />
      <PageBox active>
        {currentUser ? (
          <div className="w-full space-y-1">
            {followers?.map((user) => (
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
                Estos seguidores están ocultos
              </h2>
              <p className="text-sm text-neutral-500">
                {formatText(text, users)}
              </p>
            </div>
          </div>
        )}
      </PageBox>
    </>
  );
}

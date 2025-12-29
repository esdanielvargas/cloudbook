import { Timestamp } from "firebase/firestore";
import { Button, PageBox, PageHeader, PageLine, UserCard, PageTitle } from "../components";
import { accentHexMap, } from "../utils";
// import { db, useUsers } from "../hooks";
import {
  CheckIcon,
  MoonIcon,
  SunIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";
import { useThemeColor } from "../context";
import Post from "../components/Post";
import { AppWindow, AppWindowMac, Check, Moon, Sun } from "lucide-react";

export default function Appearance() {
  // const users = useUsers(db);
  const author = {
    avatar: "/images/cloudbook.png",
    name: "CloudBook",
    username: "cloudbook",
    premium: true,
  };
  const post = {
    posted: Timestamp.fromDate(new Date("2001-08-02T00:00:00Z")),
    text: "En CloudBook, las publicaciones flotan entre nubes.\n\nPodés incluir texto, emojis ☁️, hashtags como #nubes, menciones como @cloudbook y enlaces como https://cloudbook.danielvargas.dev?utm_source=cloudbook&utm_medium=social&utm_campaign=appearance-settings También podés subir fotos (cuadradas, verticales u horizontales), compartir videos de @youtube, y mostrar tu música si sos artista.\n\nCada publicación refleja tu cielo personal. ✨",
  };

  const { accent, setAccent } = useThemeColor();

  return (
    <>
      <PageHeader title={"Apariencia"} />
      <PageBox>
        <Post
          avatar={author?.avatar}
          name={author?.name}
          username={author?.username}
          posted={post?.posted}
          premium={true}
          {...post}
          likes={Array.from({ length: 10000 }, (_, i) => i)}
          comments={Array.from({ length: 180 }, (_, i) => i)}
          reposts={Array.from({ length: 40 }, (_, i) => i)}
          shared={Array.from({ length: 24 }, (_, i) => i)}
          saved={Array.from({ length: 1000 }, (_, i) => i)}
        />
        <PageBox active>
          <PageTitle title="Temas" />
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-0.5">
            <Button className="h-11! col-span-2 md:col-span-1">
              <AppWindowMac className="size-5" />
              Automatico
            </Button>
            <Button className="h-11!" disabled>
              <Sun className="size-5" />
              Modo Claro
            </Button>
            <Button className="h-11!" disabled>
              <Moon className="size-5" />
              Modo Oscuro
            </Button>
          </div>
          <PageLine />
          <PageTitle title="Color de énfasis" />
          <div className="w-full grid grid-cols-4 md:grid-cols-8 grid-rows-3 md:grid-rows-2 gap-0.5">
            {Object.entries(accentHexMap).map(([key, value]) => (
              <button
                key={key}
                type="button"
                title={`Color de énfasis: ${value.displayName} (${value.hex})`}
                onClick={() => setAccent(key)}
                className={`col-span-1 row-span-1 size-full aspect-square cursor-pointer rounded-xl md:border border-neutral-200 dark:border-neutral-800 flex items-center justify-center ${value.bgClass} ${value.hoverClass} transition-all duration-300 ease-out`}
              >
                {accent === key && <Check className="size-6 text-white" />}
              </button>
            ))}
          </div>
          <PageLine />
        </PageBox>
      </PageBox>
    </>
  );
}

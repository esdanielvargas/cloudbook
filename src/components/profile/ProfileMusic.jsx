import { useParams } from "react-router-dom";
import { db, useMusic, useUsers } from "../../hooks";
import MusicBox from "../MusicBox";
import EmptyState from "../EmptyState";
import { Music2 } from "lucide-react";

export default function ProfileMusic() {
  const music = useMusic(db);
  const users = useUsers(db);
  const { username } = useParams();
  const user = users.find((u) => u.username === username);

  if (!user) return null;

  // Filtramos solo los lanzamientos de este usuario
  const userMusic = music.filter((music) => music.userId === user.id);

  // Filtramos solo los lanzamiento publicos
  const musicPublic = userMusic.filter(
    (music) => music.show || music.status === "public",
  );

  // Ordenamos los lanzamientos por la fecha de publicación
  const sortedMusic = musicPublic.sort((a, b) => b.date - a.date);

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-0.5">
      {sortedMusic.length > 0 ? (
        sortedMusic.map((post) => <MusicBox key={post.id} {...post} />)
      ) : (
        <EmptyState
          Icon={Music2}
          title={"Sin lanzamientos"}
          caption={"Aun no hay lanzamientos disponibles."}
          className="col-span-2 md:col-span-3"
        />
      )}
    </div>
  );
}

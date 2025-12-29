import { useParams } from "react-router-dom";
import { db, useMusic, useUsers } from "../../hooks";
import MusicBox from "../MusicBox";

export default function ProfileMusic() {
  const music = useMusic(db);
  const users = useUsers(db);

  const { username } = useParams();

  const user = users.find((u) => u.username === username);

  if (!user) return null;

  // 1. Filtramos solo posts de este usuario
  const userPost = music.filter((post) => post.userId === user.id);

  // 2. Ordenamos del más nuevo al más viejo (asumimos que hay una propiedad post.createdAt)
  const sortedMusic = userPost.sort((a, b) => b.date - a.date);

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-0.5">
      {sortedMusic.map((post) => (
        <MusicBox key={post.id} {...post} />
      ))}
    </div>
  );
}

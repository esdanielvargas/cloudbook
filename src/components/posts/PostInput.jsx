import { useParams } from "react-router-dom";
import { db, useAuth, useUsers } from "../../hooks";
import Avatar from "../Avatar";
import { useForm } from "react-hook-form";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { v4 } from "uuid";

export default function PostInput() {
  const auth = useAuth(db);
  const users = useUsers(db);
  const { postId } = useParams();

  const user = users.find((user) => user?.uid === auth?.uid);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        console.error("El post no existe");
        return;
      }

      const comment = {
        id: v4(),
        text: data.text,
        userId: user.id,
        createdAt: Timestamp.now(),
        likes: [],
      };

      // Aseguramos que existe el array "comments", o lo creamos si no.
      const postData = postSnap.data();
      const currentComments = postData.comments || [];

      await updateDoc(postRef, {
        comments: [...currentComments, comment],
      });

      console.log("Comentario enviado:", comment);
      reset();
    } catch (error) {
      console.error("Error al guardar el comentario:", error);
    }
  };

  if (!postId || !user) return <div className="-mt-px" />;

  return (
    <div className="w-full p-2 md:p-4 flex items-center gap-1 md:gap-2" id="comments">
      <Avatar {...user} avatar={user?.avatar || user?.picture} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="size-full flex items-center gap-1 md:gap-2"
      >
        <input
          type="text"
          id="comment"
          name="comment"
          placeholder="Añadir un comentario..."
          className="w-full h-9 px-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 text-[10.5px] md:text-sm font-sans focus:outline"
          {...register("text", { required: true })}
          required
        />
        <button
          type="submit"
          className="h-9 px-3.5 cursor-pointer rounded-xl bg-neutral-200 dark:bg-neutral-800 md:border border-neutral-300 dark:border-neutral-700 font-bold text-[11.5px] md:text-sm font-sans"
        >
          Publicar
        </button>
      </form>
    </div>
  );
}

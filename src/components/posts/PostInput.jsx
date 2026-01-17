import { getAuth } from "firebase/auth";
import { db, useUsers } from "../../hooks";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { v4 } from "uuid";
import Avatar from "../Avatar";
import FormField from "../form/FormField";
import { Button } from "../buttons";

export default function PostInput() {
  const auth = getAuth();
  const users = useUsers(db);
  const { postId } = useParams();

  const user = users.find((user) => user?.uid === auth?.currentUser?.uid);

  const { register, watch, handleSubmit, reset } = useForm();

  const text = watch("text");

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (loading) return;

    if (!data.text) {
      alert("No puedes publicar un comentario sin texto.");
      return;
    }

    setLoading(true);

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
      
      reset();
    } catch (error) {
      console.error("Error al guardar el comentario:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!postId || !auth) return <div className="w-full" />;

  return (
    <div
      className="w-full px-2 py-2.5 md:px-4 flex items-center gap-1 md:gap-2"
      id="comments"
    >
      <div className="relative flex items-center justify-center">
        <Avatar
          size={40}
          {...user}
          className="z-1"
          avatar={user?.avatar}
        />
        <div
          className={`inset-0 absolute z-2 flex items-center justify-center bg-neutral-50/50 dark:bg-neutral-950/50 transition-all duration-300 ease-out ${text?.length > 0 ? "visible opacity-100" : "invisible opacity-0"}`}
        >
          <span className="text-xs font-mono">
            {text?.length > 0 ? text?.length : null}
          </span>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="size-full flex items-center justify-between gap-1 md:gap-2"
      >
        <FormField
          id="comment"
          name="comment"
          placeholder="Añadir un comentario..."
          {...register("text", { required: true, maxLength: 280 })}
          maxLength={280}
          required
        />
        <Button
          type="submit"
          variant="follow"
          disabled={loading}
          className={`min-w-28! h-10! ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Publicando..." : "Publicar"}
        </Button>
      </form>
    </div>
  );
}

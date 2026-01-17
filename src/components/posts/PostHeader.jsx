import { useEffect, useRef, useState } from "react";
import { Button, Nudge } from "../buttons";
import MenuAlt from "../MenuAlt";
import UserCard from "../UserCard";
import {
  Archive,
  Edit,
  Ellipsis,
  Eye,
  EyeOff,
  Link2,
  OctagonAlert,
  Pin,
  Trash2 as Trash,
} from "lucide-react";
import { copyPostLink } from "../../utils";
import PageLine from "../PageLine";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../hooks";

export default function PostHeader(props) {
  const { postId, action, username, author, repost } = props;

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const changeStatus = async (status) => {
    // Validar que el ID de la publicación exista
    if (!props?.postId) return;
    const postRef = doc(db, "posts", props.postId);

    // Definir estados permitidos (seguridad extra)
    const validStatuses = ["public", "archived", "hidden", "deleted"];

    if (!validStatuses.includes(status)) {
      console.error("Estado no válido:", status);
      return;
    }

    try {
      await updateDoc(postRef, { status: status });
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
    }
  };

  return (
    <div className="w-full flex items-center justify-between">
      <UserCard
        {...props}
        status={props?.status}
        authorId={props?.id}
        postId={postId}
        action={action}
      />
      {action ? (
        <div className="w-full p-2 md:p-4 flex items-center justify-end relative">
          <Button variant="icon" onClick={() => setIsOpen((prev) => !prev)}>
            <Ellipsis size={18} strokeWidth={1.5} />
          </Button>
          <MenuAlt ref={menuRef} isOpen={isOpen} className="z-10 top-4 right-4">
            {author ? (
              <>
                <Nudge
                  Icon={Pin}
                  title="Fijar en el perfil"
                  className="text-neutral-500! cursor-no-drop!"
                />
                <PageLine />
                <Nudge
                  Icon={Edit}
                  title="Editar publicación"
                  to={repost ? `/compose?post=${postId}&repost=${repost}` : `/compose?post=${postId}`}
                />
                <Nudge
                  Icon={Archive}
                  title={
                    props?.status === "public"
                      ? "Archivar publicación"
                      : "Desarchivar publicación"
                  }
                  onClick={() =>
                    changeStatus(
                      props?.status === "public" ? "archived" : "public"
                    )
                  }
                />
                {props?.status !== "hidden" && props?.status !== "deleted" && (
                  <Nudge
                    Icon={Trash}
                    title="Mover a la papelera"
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Deseas mover a la papelera esta publicación? Tendrás 30 días para restaurar está publicación."
                        )
                      ) {
                        changeStatus("deleted");
                      }
                    }}
                    alert
                  />
                )}
              </>
            ) : (
              <>
                <Nudge
                  Icon={Eye}
                  title="Me interesa"
                  className="text-neutral-500! cursor-no-drop!"
                />
                <Nudge
                  Icon={EyeOff}
                  title="No me interesa"
                  className="text-neutral-500! cursor-no-drop!"
                />
                <PageLine />
                <Nudge
                  Icon={OctagonAlert}
                  title="Reportar publicación"
                  alert
                />
              </>
            )}
            <PageLine />
            <Nudge
              Icon={Link2}
              title="Copiar enlace"
              rotate={-45}
              onClick={() => copyPostLink(username, postId) + setIsOpen(false)}
            />
          </MenuAlt>
        </div>
      ) : null}
    </div>
  );
}

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
import { ToastContainer, toast } from "react-toastify";

export default function PostHeader(props) {
  const { postId, action = true, username, author } = props;

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
    const postRef = doc(db, "photos", props.postId);

    // Mapeo de mensajes para personalizar la notificación
    const messages = {
      public: "¡La publicación ahora es pública! 🌍",
      archived: "Publicación archivada correctamente 🗄️",
      deleted: "Se movió a la papelera 🗑️",
      hidden: "Publicación ocultada 👁️‍🗨️",
    };

    // Definir estados permitidos (seguridad extra)
    const validStatuses = ["public", "archived", "hidden", "deleted"];

    if (!validStatuses.includes(status)) {
      console.error("Estado no válido:", status);
      return;
    }

    try {
      // Una sola llamada para actualizar
      await updateDoc(postRef, { status: status });

      toast.info(messages[status], {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      toast.error("Error al actualizar. Intenta de nuevo.");
    }
  };

  return (
    <div className="w-full flex items-center justify-between">
      <UserCard
        {...props}
        status={props?.status}
        authorId={props?.id}
        postId={postId}
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
                  to={`/compose?post=${postId}`}
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
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      ) : null}
    </div>
  );
}

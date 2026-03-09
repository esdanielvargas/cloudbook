import {
  Button,
  EmptyState,
  Form,
  FormField,
  PageBox,
  PageHeader,
  PageLine,
} from "@/components";
import { db, useUsers } from "@/hooks";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Edit, Loader, Loader2, Share, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export default function LinkForm() {
  const auth = getAuth();
  const users = useUsers(db);
  const navigate = useNavigate();
  const { username, linkId } = useParams();

  const isEdit = Boolean(linkId);
  const currentUserUID = auth.currentUser?.uid;

  // Estado para el control de carga
  const [saving, setSaving] = useState(false);

  // Encontrar al usuario y su enlace específico
  const user = users.find((user) => user.uid === currentUserUID);
  const linkSelected = user?.links?.find((link) => link.id === linkId);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isEdit && linkSelected) {
      reset({
        title: linkSelected.title,
        link: linkSelected.link,
      });
    }
  }, [isEdit, linkSelected, reset]);

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 16);
  };

  const onSubmit = async (data) => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(db, "users", user.id);
      let updatedLinks = user.links || [];

      if (isEdit) {
        // Mapeamos el array para actualizar solo el que coincide con el ID
        updatedLinks = updatedLinks.map((link) =>
          link.id === linkId
            ? {
                ...link,
                title: data.title,
                link: data.link,
              }
            : link,
        );
      } else {
        // Añadimos el nuevo objeto al array
        const newLink = {
          id: generateUniqueId(),
          title: data.title,
          link: data.link,
          index: user?.links?.length,
        };
        updatedLinks = [...updatedLinks, newLink];
      }

      // Actualizamos el campo 'links' en el documento del usuario
      await updateDoc(userDocRef, {
        links: updatedLinks,
      });

      navigate(`/${username}/links`);
    } catch (error) {
      console.error("Error al guardar el enlace:", error);
      alert("No se pudo guardar el enlace.");
    }
  };

  const handleDelete = async () => {
  if (window.confirm("¿Estás seguro de que quieres eliminar este enlace?")) {
    try {
      setSaving(true);

      const currentUser = users.find((u) => u.uid === auth.currentUser?.uid);
      
      if (!currentUser) throw new Error("Usuario no encontrado");

      // Filtramos usando el ID del link que viene de la URL (useParams)
      const updatedLinks = currentUser.links.filter((link) => link.id !== linkId);

      const userRef = doc(db, "users", currentUser.id);
      
      await updateDoc(userRef, {
        links: updatedLinks
      });

      navigate(`/${username}/links`);
    } catch (error) {
      console.error("Error al eliminar el link:", error);
    } finally {
      setSaving(false);
    }
  }
};

  if (isEdit && (!user?.links || user?.links?.length === 0)) {
    return (
      <div className="m-2.5 md:m-4">
        <EmptyState
          Icon={Loader}
          title={"Cargando datos..."}
          caption={"Los datos están cargando"}
        />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={isEdit ? "Editando enlace" : "Nuevo enlace"}
        header={`${isEdit ? "Editando enlace" : "Nuevo enlace"} ~ CloudBook`}
        hideUpgrade={true}
      />
      <PageBox className="p-0! gap-0!" active>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-2.5 md:p-4 flex flex-col gap-2.5 md:gap-4">
            <FormField
              label="Título del enlace"
              caption="Agrega un título para tu enlace"
              placeholder="Título del enlace"
              {...register("title", { required: "El título es obligatorio" })}
              error={errors.title?.message}
            />
            <FormField
              type="url"
              label="URL del enlace"
              caption="Agrega la URL de tu enlace"
              placeholder="https://ejemplo.com"
              {...register("link", {
                required: "La URL es obligatoria",
                pattern: {
                  value: /^(https?:\/\/[^\s]+)$/,
                  message: "Ingresa una URL válida",
                },
              })}
              error={errors.link?.message}
            />
          </div>
          <PageLine />
          <div className="w-full p-2.5 md:p-4 flex items-center justify-between gap-2">
            <Button type="reset" variant="inactive" full onClick={handleDelete}>
              {saving ? "Eliminando..." : "Eliminar enlace"}
            </Button>
            <Button type="submit" variant="submit" full>
              {isEdit ? "Guardar cambios" : "Añadir enlace"}
            </Button>
          </div>
        </Form>
      </PageBox>
    </>
  );
}

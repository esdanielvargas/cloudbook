import { getAuth } from "firebase/auth";
import {
  Avatar,
  EmptyState,
  PageBox,
  PageHeader,
  PageLine,
  Tab,
} from "@/components";
import { FormField } from "@/components/form";
import { db, useUsers } from "@/hooks";
import { Link, useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/buttons";
import { ChevronLeft, KeyRound, LockKeyhole, Mail, Save } from "lucide-react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/firebase/config";
import { v4 } from "uuid";

export default function ProfileEdit() {
  const auth = getAuth();
  const users = useUsers(db);
  const navigate = useNavigate();
  const { username } = useParams();

  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [uploadingField, setUploadingField] = useState(null);

  const { register, handleSubmit, watch, setValue } = useForm();
  const currentUser = users.find((user) => user.uid === auth?.currentUser?.uid);

  const [isVerified, setIsVerified] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const categoriesString = Array.isArray(currentUser.categories)
        ? currentUser.categories.join(", ")
        : "";

      setValue("banner", currentUser?.banner || "");
      setValue("avatar", currentUser?.avatar || "");
      setValue("username", currentUser?.username || "");
      setValue("categories", categoriesString);
      setValue("bio", currentUser?.bio || "");

      setIsVerified(
        typeof currentUser.verified === "object"
          ? currentUser.verified.status
          : currentUser.verified || false,
      );
      setIsPrivate(currentUser.private || false);
    }
  }, [currentUser, setValue]);

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(fieldName);

    const folderName = fieldName === "avatar" ? "profile" : "banner";

    try {
      const oldUrl = currentUser[fieldName];

      if (oldUrl && oldUrl.includes("firebasestorage.googleapis.com")) {
        try {
          const oldFileRef = ref(storage, oldUrl);
          await deleteObject(oldFileRef);
        } catch (err) {
          console.warn("No se pudo borrar la imagen anterior:", err);
        }
      }

      const fileExtension = file.name.split(".").pop();
      const newFileName = `${v4()}.${fileExtension}`;
      const storagePath = `users/${currentUser.username}/${folderName}/${newFileName}`;

      const fileRef = ref(storage, storagePath);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);

      // --- ACTUALIZAR FORMULARIO ---
      setValue(fieldName, downloadUrl);
    } catch (error) {
      console.error("Error crítico al gestionar la imagen:", error);
      alert("Hubo un error al subir la imagen.");
    } finally {
      setUploadingField(null);
    }
  };

  const onRemoveImage = async (fieldName) => {
    const oldUrl = watch(fieldName) || currentUser[fieldName];

    // Borrado físico en Firebase Storage
    if (oldUrl && oldUrl.includes("firebasestorage.googleapis.com")) {
      try {
        const oldFileRef = ref(storage, oldUrl);
        await deleteObject(oldFileRef);
      } catch (err) {
        console.warn("No se pudo borrar el archivo de Storage:", err);
      }
    }

    // Borrado lógico en el formulario
    setValue(fieldName, "");
  };

  const onSubmit = async (data) => {
    try {
      const userDocRef = doc(db, "users", currentUser?.id);

      const categoriesArray = data.categories
        ? data.categories
            .split(",")
            .map((cat) => cat.trim())
            .filter((cat) => cat !== "")
        : [];

      const verifiedObject = {
        status: isVerified,
        since: currentUser.verified?.since || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userDocRef, {
        banner: data.banner,
        avatar: data.avatar,
        categories: categoriesArray,
        bio: data.bio,
        verified: verifiedObject,
        private: isPrivate,
      });

      navigate(`/${username}`);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Hubo un error al actualizar el perfil");
    }
  };

  const triggerSubmit = () => {
    const form = document.getElementById("profile-edit-form");
    if (form) form.requestSubmit();
  };

  if (!users || !auth) {
    return <p>Cargando...</p>;
  }

  if (!currentUser) {
    <p>No se pudo encontrar tu perfil</p>;
  }

  return (
    <>
      <PageHeader
        title="Editar perfil"
        header={"Actualiza la información de tu perfil"}
        buttonLeft={{
          icon: ChevronLeft,
          title: "Volver atrás",
          onClick: () => navigate(`/${username}`),
        }}
        buttonRight={{
          icon: Save,
          title: "Guardar cambios",
          onClick: triggerSubmit,
        }}
      />
      <PageBox className="p-0!" active>
        {currentUser?.username === username ? (
          <form
            id="profile-edit-form"
            onSubmit={handleSubmit(onSubmit)}
            className="size-full flex flex-col justify-between"
          >
            <div className="sr-only hidden opacity-0 invisible">
              <input
                type="file"
                className="hidden"
                ref={bannerInputRef}
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "banner")}
              />
              <input
                type="file"
                className="hidden"
                ref={avatarInputRef}
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "avatar")}
              />
            </div>
            <div className="w-flex flex flex-col">
              {/* Banner, or Avatar */}
              <div className="p-2.5 md:p-4 flex flex-col gap-4">
                <FormField
                  label="Imagen de banner"
                  caption="La imagen de banner representa tu perfil y aparece en la parte superior de tu página de perfil."
                  text="Te recomendamos que subas una imagen de 600x200 píxeles y 6 MB como máximo para que pueda verse bien en todas las pantallas."
                  image
                  banner
                  src={watch("banner")}
                  name={currentUser?.name}
                  username={username}
                  onImageChange={() => bannerInputRef.current.click()}
                  onImageRemove={() => onRemoveImage("banner")}
                  uploading={uploadingField === "banner"}
                />
                <FormField
                  label="Imagen de perfil"
                  caption="La imagen de perfil representa tu perfil y aparece en cualquier acción que realices."
                  text="Te recomendamos que utilices una imagen de 120x120 píxeles y 4 MB como máximo. Usa un archivo PNG o GIF (no animado). Asegúrate de que la imagen cumple las Normas de la Comunidad de CloudBook."
                  image
                  avatar
                  src={watch("avatar")}
                  name={currentUser?.name}
                  username={username}
                  onImageChange={() => avatarInputRef.current.click()}
                  onImageRemove={() => onRemoveImage("avatar")}
                  uploading={uploadingField === "avatar"}
                />
              </div>
              <PageLine />
              {/* Información personal */}
              <div className="p-2.5 md:p-4 flex flex-col gap-4">
                <FormField
                  label="Nombre"
                  caption="Este nombre aparecerá en tu perfil."
                  value={currentUser?.name}
                  path="/settings/account/name"
                  readOnly
                  required
                />
                <FormField
                  label="Nombre de usuario"
                  caption="Este nombre de usuario aparecerá en tu perfil."
                  value={`@${currentUser?.username}`}
                  path="/settings/account/username"
                  info={`${window.location.origin}/${currentUser?.username}`}
                  readOnly
                  required
                />
                <FormField
                  label="Categorías"
                  caption="Estas categorías aparecerán debajo de tu nombre de usuario. Añade categorías separadas por comas."
                  placeholder="Ej: Artista, Programador, Gamer, etc."
                  textarea
                  rows={4}
                  {...register("categories")}
                  info="Solo las primeras 2 categorías se mostrarán públicamente en tu perfil, pero puedes añadir hasta 5 para mejorar la búsqueda de tu perfil."
                />
                <FormField
                  label="Presentación"
                  caption="Esta presentación aparecerá en tu perfil."
                  placeholder="Cuéntanos un poco sobre ti..."
                  textarea
                  rows={4}
                  {...register("bio")}
                  maxLength={150}
                  info={`${watch("bio")?.length || 0}/150 caracteres`}
                />
              </div>
              <PageLine />
              {/* Enlaces */}
              <Tab title="Enlaces" path={`/${username}/links`} />
              <PageLine />
              {/* Configuración de perfil */}
              <div className="p-2.5 md:p-4 space-y-4">
                {currentUser?.premium && (
                  <>
                    <FormField
                      label="Mostrar insignia de verificación"
                      caption="Si esta opción está activada, se mostrará una insignia de verificación junto a tu nombre."
                      boolean
                      value={isVerified}
                      onClick={() => setIsVerified(!isVerified)}
                    />
                  </>
                )}
                <FormField
                  label="Perfil privado"
                  caption="Si esta opción está activada, se ocultará todo tu contenido a los usuarios que no te sigan."
                  boolean
                  value={isPrivate}
                  onClick={() => setIsPrivate(!isPrivate)}
                />
              </div>
              <PageLine />
              {/* Información técnica */}
              <div className="p-2.5 md:p-4 space-y-4">
                <FormField
                  label="Correo electrónico"
                  caption="Este es tu correo electrónico registrado. No se mostrará públicamente."
                  readOnly
                  Icon={Mail}
                  value={currentUser?.email}
                />
                <FormField
                  label="ID de usuario"
                  caption="Este es tu ID de usuario único en nuestro sistema. No se mostrará públicamente."
                  readOnly
                  Icon={KeyRound}
                  value={currentUser?.id}
                />
                <FormField
                  label="UID de usuario"
                  caption="Este es tu UID de usuario único en Authentication. No se mostrará públicamente."
                  readOnly
                  Icon={KeyRound}
                  value={currentUser?.uid}
                />
              </div>
              <PageLine />
            </div>
            <div className="w-full p-2.5 md:p-4 flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="inactive"
                full
                onClick={() => window.history.back()}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="submit"
                full
                disabled={uploadingField !== null}
              >
                {uploadingField ? "Subiendo..." : "Actualizar"}
              </Button>
            </div>
          </form>
        ) : (
          <EmptyState
            Icon={LockKeyhole}
            title="Acceso denegado"
            caption="No tienes permiso para editar el perfil de otro usuario."
            path={`/${username}`}
            actionText="Volver al perfil"
          />
        )}
      </PageBox>
    </>
  );
}

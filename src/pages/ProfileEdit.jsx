import { getAuth } from "firebase/auth";
import { PageBox, PageHeader, PageLine } from "../components";
import { FormField, FormInput } from "../components/form";
import { db, useUsers } from "../hooks";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "../components/buttons";
import { CloudUpload, Loader2, Mail, Save } from "lucide-react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase/config";
import { v4 } from "uuid";

export default function ProfileEdit() {
  const auth = getAuth();
  const users = useUsers(db);
  const navigate = useNavigate();
  const { username } = useParams();

  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [uploadingField, setUploadingField] = useState(null);

  const { register, handleSubmit, setValue } = useForm();
  const currentUser = users.find((user) => user.uid === auth?.currentUser?.uid);

  const [isVerified, setIsVerified] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setValue("banner", currentUser?.banner || "");
      setValue("avatar", currentUser?.avatar || "");
      setValue("bio", currentUser?.bio || "");
      setValue("email", currentUser?.email || "");

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

      // --- PASO 3: ACTUALIZAR FORMULARIO ---
      setValue(fieldName, downloadUrl);
    } catch (error) {
      console.error("Error crítico al gestionar la imagen:", error);
      alert("Hubo un error al subir la imagen.");
    } finally {
      setUploadingField(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      const userDocRef = doc(db, "users", currentUser?.id);

      const verifiedObject = {
        status: isVerified,
        since: currentUser.verified?.since || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userDocRef, {
        banner: data.banner,
        avatar: data.avatar,
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
        Icon={Save}
        iconOnClick={triggerSubmit}
      />
      <PageBox active>
        {currentUser?.username === username ? (
          <form
            id="profile-edit-form"
            onSubmit={handleSubmit(onSubmit)}
            className="size-full flex flex-col justify-between gap-4"
          >
            <div className="w-flex flex flex-col gap-4">
              <div className="w-full flex items-end gap-2">
                <FormField
                  label="Portada del perfil"
                  text="Enlace de la portada del perfil"
                  placeholder={`https://storage.${username}.com/images/banner.png`}
                  {...register("banner")}
                />
                <input
                  type="file"
                  className="hidden"
                  ref={bannerInputRef}
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "banner")}
                />
                <Button
                  variant="inactive"
                  title="Subir imagen"
                  className="px-2! min-w-10! min-h-10!"
                  onClick={() => bannerInputRef.current.click()}
                  disabled={uploadingField !== null}
                >
                  {uploadingField === "banner" ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <CloudUpload size={20} strokeWidth={1.5} />
                  )}
                </Button>
              </div>
              <div className="w-full flex items-end gap-2">
                <FormField
                  label="Foto de perfil"
                  text="Enlace de la foto del perfil"
                  placeholder={`https://storage.${username}.com/images/profile.png`}
                  {...register("avatar")}
                />
                <input
                  type="file"
                  className="hidden"
                  ref={avatarInputRef}
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "avatar")}
                />
                <Button
                  variant="inactive"
                  title="Subir imagen"
                  className="px-2! min-w-10! min-h-10!"
                  onClick={() => avatarInputRef.current.click()}
                  disabled={uploadingField !== null}
                >
                  {uploadingField === "avatar" ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <CloudUpload size={20} strokeWidth={1.5} />
                  )}
                </Button>
              </div>
              <FormField
                label="Descripción corta"
                text="Esta descripción corta aparecerá en tu perfil."
                placeholder="Cuentanos de que trata este perfil."
                textarea
                rows={4}
                {...register("bio")}
                max={180}
              />
              <PageLine />
              {currentUser?.premium && (
                <>
                  <FormField
                    label="Mostrar insignia de verificación"
                    text="Si esta opción está activada, se mostrará una insignia de verificación junto a tu nombre."
                    boolean
                    value={isVerified}
                    onClick={() => setIsVerified(!isVerified)}
                  />
                </>
              )}
              <FormField
                label="Perfil privado"
                text="Si esta opción está activada, se ocultará todo tu contenido a los usuarios que no te sigan."
                boolean
                value={isPrivate}
                onClick={() => setIsPrivate(!isPrivate)}
              />
              {/* <PageLine /> */}
              {/* <FormInput
              label="Correo electrónico"
              readOnly
              icon={<Mail size={20} strokeWidth={1.5} />}
              placeholder={currentUser?.email}
            /> */}
            <PageLine />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
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
          <div className="m-auto font-normal text-xs font-sans text-neutral-500 select-none pointer-events-none">
            No tienes permiso para editar el perfil de otro usuario.
          </div>
        )}
      </PageBox>
    </>
  );
}

import { getAuth } from "firebase/auth";
import { PageBox, PageHeader, PageLine } from "../components";
import { FormField } from "../components/form";
import { db, useUsers } from "../hooks";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "../components/buttons";
import { Bolt, Settings2 } from "lucide-react";

export default function ProfileEdit() {
  const auth = getAuth();
  const users = useUsers(db);
  const navigate = useNavigate();
  const { username } = useParams();

  const { register, handleSubmit, setValue } = useForm();

  const currentUser = users.find((user) => user.uid === auth?.currentUser?.uid);

  const [isVerified, setIsVerified] = useState(currentUser?.verified);
  const [isActive, setIsActive] = useState(currentUser?.menu);
  const [isPublic, setIsPublic] = useState(currentUser?.public);

  useEffect(() => {
    if (currentUser) {
      setValue("banner", currentUser?.banner || "");
      setValue("avatar", currentUser?.avatar || "");
      setValue("name", currentUser?.name || "");
      setValue("username", currentUser?.username || "");
      setValue("bio", currentUser?.bio || "");
      setValue("website", currentUser?.website || "");
      setValue("spotify", currentUser?.spotify || "");
      setValue("youtube", currentUser?.youtube || "");
      setValue("gender", currentUser?.gender || "");
      setValue("birthdate", currentUser?.birthdate || "");
      setValue("country", currentUser?.country || "");
      setValue("email", currentUser?.email || "");
      setValue("id", currentUser?.id || "");
      setValue("uid", currentUser?.uid || "");
    }
  }, [currentUser, setValue]);

  if (!users || !auth) {
    return <p>Cargando...</p>;
  }

  if (!currentUser) {
    <p>No se pudo encontrar tu perfil</p>;
  }

  const onSubmit = async (data) => {
    try {
      const userDocRef = doc(db, "users", currentUser.id);
      await updateDoc(userDocRef, {
        banner: data.banner || currentUser.banner,
        avatar: data.avatar || currentUser.avatar,
        name: data.name || currentUser.name,
        username: data.username || currentUser.username,
        bio: data.bio === "" ? "" : data.bio || currentUser.bio,
        website: data.website === "" ? "" : data.website || currentUser.website,
        spotify: data.spotify === "" ? "" : data.spotify || currentUser.spotify,
        youtube: data.youtube === "" ? "" : data.youtube || currentUser.youtube,
        gender: data.gender || currentUser.gender,
        birthdate: data.birthdate || currentUser.birthdate,
        country: data.country || currentUser.country,
        menu: isActive === false ? false : isActive || currentUser.menu,
        verified:
          isVerified === false ? false : isVerified || currentUser.verified,
      });
      navigate(`/${currentUser?.username}`)
      // alert("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Hubo un error al actualizar el perfil");
    }
  };

  return (
    <>
      <PageHeader title="Editar perfil" Icon={Settings2} />
      <PageBox active>
        {currentUser?.username === username ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4"
          >
            <FormField
              label="Portada del perfil"
              // value={currentUser?.banner}
              {...register("banner")}
            />
            <FormField
              label="Foto de perfil"
              // value={currentUser?.avatar}
              {...register("avatar")}
            />
            <FormField label="Nombre visible" {...register("name")} />
            <FormField
              label="Nombre de usuario"
              readOnly
              placeholder={`@${currentUser?.username}`}
            />
            <FormField
              label="Descripción corta"
              text=""
              textarea
              rows={4}
              {...register("bio")}
              max={180}
            />
            {/* <PageLine /> */}
            {/* <FormField label="Sitio Web" {...register("website")} /> */}
            {/* <FormField label="Spotify" {...register("spotify")} /> */}
            {/* <FormField label="YouTube" {...register("youtube")} /> */}
            <PageLine />
            <FormField
              label="Mostrar insignia de verificación"
              text="Si está activado, se mostrará una insignia de verificación junto a tu nombre de usuario."
              boolean
              value={isVerified}
              onClick={() => setIsVerified(!isVerified)}
            />
            <FormField
              label="Mostrar avatar en el menú de navegación"
              text="Si está activado, tu avatar se mostrará en el menú de navegación en lugar del icono de usuario predeterminado."
              boolean
              value={isActive}
              onClick={() => setIsActive(!isActive)}
            />
            <FormField
              label="Perfil público"
              text="Si está activado, tu perfil será visible para otros usuarios y visitantes. Si está desactivado, solo tú y tus seguidores actuales podrán ver tu perfil."
              boolean
              value={isPublic}
              onClick={() => setIsPublic(!isPublic)}
            />
            <PageLine />
            <FormField
              label="Correo electrónico"
              readOnly
              placeholder={currentUser?.email}
            />
            <FormField
              label="ID de usuario"
              readOnly
              placeholder={currentUser?.id}
            />
            <FormField
              label="UID de usuario"
              readOnly
              placeholder={currentUser?.uid}
            />
            <PageLine />
            <div className="w-full flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="inactive"
                full
                onClick={() => window.history.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="active" full>
                Actualizar
              </Button>
            </div>
          </form>
        ) : (
          <div className="size-full"></div>
        )}
      </PageBox>
    </>
  );
}

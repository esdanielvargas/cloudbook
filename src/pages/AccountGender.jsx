import { Button, Form, FormField, PageBox, PageHeader } from "../components";
import { useForm } from "react-hook-form";
import { getAuth } from "firebase/auth";
import { db, useUsers } from "../hooks";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AccountGender() {
  const auth = getAuth();
  const users = useUsers(db);
  const navigate = useNavigate();

  const currentUser = users.find((user) => user?.uid === auth.currentUser?.uid);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    if (currentUser?.birthdate) {
      setValue("gender", currentUser?.gender || "");
      setValue("orientation", currentUser.orientation || "");
    }
  }, [currentUser, setValue]);

  const onSubmit = async (data) => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, "users", currentUser.id);

      await updateDoc(userDocRef, {
        gender: data.gender,
        orientation: data.orientation,
      });

      navigate("/settings/account");
    } catch (error) {
      console.error("Error al actualizar género:", error);
    }
  };

  return (
    <>
      <PageHeader title="Género y orientación" />
      <PageBox active>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Género"
            text="Tu identidad de género pública."
            select
            options={[
              { label: "Selecciona tu género", value: "" },
              { label: "Masculino", value: "male" },
              { label: "Femenino", value: "female" },
              { label: "No binario", value: "non_binary" },
              { label: "Otro", value: "other" },
              { label: "Prefiero no decirlo", value: "hidden" },
            ]}
            {...register("gender")}
          />
          <FormField
            label="Orientación sexual"
            text="Información opcional para tu perfil. No se mostrará en tu perfil."
            select
            options={[
              { label: "Selecciona tu orientación", value: "" },
              { label: "Heterosexual", value: "heterosexual" },
              { label: "Gay", value: "gay" },
              { label: "Lesbiana", value: "lesbian" },
              { label: "Bisexual", value: "bisexual" },
              { label: "Queer", value: "queer" },
              { label: "Asexual", value: "asexual" },
              { label: "Pansexual", value: "pansexual" },
            ]}
            {...register("orientation")}
          />
          <Button type="submit" variant="submit" full disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Form>
      </PageBox>
    </>
  );
}

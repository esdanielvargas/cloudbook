import { Button, Form, FormField, PageBox, PageHeader } from "../components";
import { useForm } from "react-hook-form";
import { getAuth } from "firebase/auth";
import { db, useUsers } from "../hooks";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AccountBirthdate() {
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
      setValue("birthdate", currentUser?.birthdate);
    }
  }, [currentUser, setValue]);

  const onSubmit = async (data) => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, "users", currentUser?.id);

      await updateDoc(userDocRef, {
        birthdate: data.birthdate,
      });
      navigate("/settings/account");
    } catch (error) {
      console.error("Error al actualizar el nombre de usuario:", error);
    }
  };

  return (
    <>
      <PageHeader title="Fecha de nacimiento" />
      <PageBox active>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Fecha de nacimiento"
            text="Selecciona tu fecha de nacimiento."
            placeholder="01 de agosto de 2001"
            type="date"
            {...register("birthdate", {
              required: true,
              validate: (value) =>
                new Date(value) < new Date() || "Fecha inválida",
            })}
          />
          <Button type="submit" variant="submit" full disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Form>
      </PageBox>
    </>
  );
}

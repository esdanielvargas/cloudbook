import { getAuth } from "firebase/auth";
import { db, useUsers } from "../hooks";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import {
  Button,
  Form,
  FormField,
  PageBox,
  PageHeader,
  PageLine,
} from "../components";

export default function SettingsAccountLocation() {
  const auth = getAuth();
  const users = useUsers(db);
  const currentUser = users.find((user) => user?.uid === auth.currentUser?.uid);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (currentUser) {
      setValue("country", currentUser?.location?.country || "");
      setValue("state", currentUser?.location?.state || "");
    }
  }, [currentUser, setValue]);

  const onSubmit = async (data) => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, "users", currentUser.id);

      await updateDoc(userDocRef, {
        location: {
          country: data.country || currentUser.country,
          state: data.state || currentUser.state,
        },
        // country: data.country || currentUser.country,
        // state: data.state || currentUser.state,
      });
      alert("Ubicación actualizada con éxito");
    } catch (error) {
      console.error("Error al actualizar la ubicación:", error);
      alert("Hubo un error al actualizar la ubicación");
    }
  };

  return (
    <>
      <PageHeader title="Ubicación" />
      <PageBox active className="">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="País"
            text="Selecciona tu país de residencia."
            type="text"
            placeholder="Selecciona un país"
            {...register("country")}
            name="country"
            select
            options={[
              { value: "", label: "Selecciona un país" },
              { value: "ES", label: "España" },
              { value: "SV", label: "El Salvador" },
              { value: "US", label: "Estados Unidos" },
              { value: "MX", label: "México" },
              { value: "AR", label: "Argentina" },
              { value: "CO", label: "Colombia" },
              { value: "CL", label: "Chile" },
              { value: "PE", label: "Perú" },
              { value: "VE", label: "Venezuela" },
              { value: "FR", label: "Francia" },
              { value: "DE", label: "Alemania" },
              { value: "IT", label: "Italia" },
              { value: "BR", label: "Brasil" },
              { value: "JP", label: "Japón" },
              { value: "CN", label: "China" },
              { value: "IN", label: "India" },
            ]}
          />
          <FormField
            label="Estado o Provincia"
            text="Selecciona tu estado o provincia de residencia."
            type="text"
            placeholder="Selecciona un estado o provincia"
            {...register("state")}
            name="state"
            select
            options={[
              { value: "", label: "Selecciona un estado o provincia" },
              { value: "CA", label: "California" },
              { value: "TX", label: "Texas" },
              { value: "FL", label: "Florida" },
              { value: "NY", label: "Nueva York" },
              { value: "ON", label: "Ontario" },
              { value: "QC", label: "Quebec" },
              { value: "BC", label: "Columbia Británica" },
              { value: "MAD", label: "Madrid" },
              { value: "CAT", label: "Cataluña" },
              { value: "AND", label: "Andalucía" },
              { value: "BCN", label: "Barcelona" },
              { value: "VAL", label: "Comunidad Valenciana" },
              { value: "PUN", label: "Punjab" },
              { value: "MH", label: "Maharashtra" },
              { value: "DL", label: "Delhi" },
              { value: "SS", label: "San Salvador" }
            ]}
          />
          <Button full type="submit" variant="submit">
            Guardar cambios
          </Button>
        </Form>
        <PageLine />
      </PageBox>
    </>
  );
}

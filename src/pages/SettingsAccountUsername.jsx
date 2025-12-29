import { getAuth } from "firebase/auth";
import {
  Button,
  Form,
  FormField,
  PageBox,
  PageHeader,
  PageLine,
} from "../components";
import { db, useUsers } from "../hooks";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { doc, Timestamp, updateDoc } from "firebase/firestore";

export default function SettingsAccountUsername() {
  const auth = getAuth();
  const users = useUsers(db);
  const currentUser = users.find((user) => user?.uid === auth.currentUser?.uid);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (currentUser) {
      setValue("username", currentUser?.username || "");
    }
  }, [currentUser, setValue]);

  const onSubmit = async (data) => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, "users", currentUser.id);

      await updateDoc(userDocRef, {
        username: data.username || currentUser.username,
        username_history: [
          ...(currentUser.username_history || []),
          {
            username: data.username,
            set_at: Timestamp.now(),
          },
        ],
      });
      alert("Nombre de usuario actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar el nombre de usuario:", error);
      alert("Hubo un error al actualizar el nombre de usuario");
    }
  };

  return (
    <>
      <PageHeader title="Nombre de usuario" />
      <PageBox active>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Nombre de usuario"
            text="Elige un nombre de usuario único añadiendo letras y números. Puedes volver al nombre de usuario que tenías antes de que transcurran 14 días. Los nombres de usuario se pueden cambiar dos veces cada 14 días."
            type="text"
            placeholder="Nuevo nombre de usuario"
            {...register("username")}
            name="username"
            prefix="@"
          />
          <Button full type="submit" variant="submit">
            Guardar cambios
          </Button>
        </Form>
        <PageLine />
        <div className="w-full">
          <div className="w-full text-sm text-neutral-500 dark:text-neutral-400">
            Historial de nombres de usuario.
          </div>
          <div className="w-full mt-2 flex flex-col items-start justify-start gap-1">
            {currentUser?.username_history?.length > 0 ? (
              currentUser?.username_history
                .slice()
                .reverse()
                .map((item, index) => (
                  <div
                    key={index}
                    className="w-full px-4 py-2 flex flex-col items-start justify-center rounded-md border border-neutral-800 bg-neutral-900"
                  >
                    <div className="w-full text-left font-normal text-md text-neutral-200">
                      @{item?.username}
                    </div>
                    <div className="w-full text-left font-normal text-sm text-neutral-500 dark:text-neutral-400">
                      {item?.set_at
                        ? new Date(
                            item?.set_at?.seconds * 1000
                          ).toLocaleDateString("es", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Fecha desconocida"}
                    </div>
                  </div>
                ))
            ) : (
              <div className="w-full flex items-center justify-start gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md">
                <div className="text-sm text-neutral-200">
                  No hay nombres de usuario anteriores.
                </div>
              </div>
            )}
          </div>
        </div>
      </PageBox>
    </>
  );
}

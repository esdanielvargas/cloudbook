import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  getAuth, 
  reauthenticateWithCredential, 
  EmailAuthProvider, 
  verifyBeforeUpdateEmail
} from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { Button, Form, FormField, PageBox, PageHeader } from "../components";

export default function AccountEmail() {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    if (!user) return;

    try {
      const credential = EmailAuthProvider.credential(user.email, data.password);
      await reauthenticateWithCredential(user, credential);

      await verifyBeforeUpdateEmail(user, data.newEmail);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { 
        email: data.newEmail 
      });
      
      alert(`Hemos enviado un correo de verificación a ${data.newEmail}. Tu correo de acceso cambiará permanentemente una vez hagas clic en el enlace recibido.`);
      
      reset(); 

    } catch (error) {
      console.error("Error:", error);
      if (error.code === "auth/wrong-password") {
        alert("La contraseña actual es incorrecta.");
      } else if (error.code === "auth/email-already-in-use") {
        alert("Ese correo ya está registrado en otra cuenta.");
      } else if (error.code === "auth/operation-not-allowed") {
        alert("Operación no permitida. Revisa la configuración de Firebase.");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Cambiar correo electrónico" />
      <PageBox active>
        <Form onSubmit={handleSubmit(onSubmit)}>
          
          <FormField
            label="Correo electrónico actual"
            text="Tu correo actual en el sistema."
            type="email"
            value={user?.email || ''}
            readOnly
          />

          <FormField
            label="Nuevo Correo electrónico"
            text="Se enviará un enlace de confirmación a esta dirección."
            placeholder="nuevo@ejemplo.com"
            type="email"
            {...register("newEmail", { 
              required: "El nuevo correo es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Dirección de correo inválida"
              }
            })}
            error={errors.newEmail?.message} 
          />

          <FormField
            label="Contraseña Actual"
            text="Por seguridad, ingresa tu contraseña para autorizar el cambio."
            placeholder="********"
            type="password"
            {...register("password", { 
              required: "La contraseña es obligatoria" 
            })}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            variant="submit"
            full
            disabled={loading}
          >
            {loading ? "Procesando..." : "Enviar enlace de verificación"}
          </Button>
        </Form>
      </PageBox>
    </>
  );
}
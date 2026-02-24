import { Button } from "../components";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAuth, applyActionCode, checkActionCode } from "firebase/auth";

export default function AuthAction() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const mode = searchParams.get("mode");
  const actionCode = searchParams.get("oobCode");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verificando tu solicitud...");

  useEffect(() => {
    if (!actionCode) {
      navigate("/");
      return;
    }

    handleAction();
  }, [actionCode, handleAction, navigate]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAction = async () => {
    try {
      const info = await checkActionCode(auth, actionCode);
      console.log("Action Info:", info);

      await applyActionCode(auth, actionCode);

      setStatus("success");
      if (mode === "verifyAndChangeEmail") {
        setMessage("¡Tu correo ha sido actualizado correctamente!");
      } else if (mode === "resetPassword") {
        setMessage("Tu contraseña ha sido restablecida.");
      } else if (mode === "verifyEmail") {
        setMessage("¡Tu correo ha sido verificado!");
      } else {
        setMessage("Operación exitosa.");
      }

      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      if (error.code === "auth/expired-action-code") {
        setMessage("El enlace ha expirado. Por favor solicita uno nuevo.");
      } else if (error.code === "auth/invalid-action-code") {
        setMessage("El enlace es inválido o ya fue usado.");
      } else {
        setMessage("Ocurrió un error al procesar tu solicitud.");
      }
    }
  };

  return (
    <div className="w-full min-h-dvh flex items-start justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-90 p-6 m-6 flex flex-col items-center justify-start gap-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <h2 className="w-full font-bold text-xl">
            <span className="mr-1.5 text-base">
              {status === "loading" && "⏳"}
              {status === "success" && "✅"}
              {status === "error" && "❌"}
            </span>
            {status === "loading" && "Procesando..."}
            {status === "success" && "¡Listo!"}
            {status === "error" && "Error"}
          </h2>
          <p className="w-full font-normal text-base text-neutral-600 dark:text-neutral-400">
            {message}
          </p>
        </div>
        {status !== "loading" && (
          <Button onClick={() => navigate("/")} variant="submit" full>
            Ir al Inicio
          </Button>
        )}
      </div>
    </div>
  );
}

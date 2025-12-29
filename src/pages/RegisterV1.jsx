import { CalendarRange, Folder, LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Link,
  useNavigate,
  // useNavigate
} from "react-router-dom";
import { FormInput } from "../components/ui/form/FormInput";
import { useThemeColor } from "../context";
import { Button } from "../components";
import { createUserWithEmailAndPassword, getAuth, ProviderId, sendEmailVerification, signInWithPopup, signOut } from "firebase/auth";

export default function Register() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { txtClass } = useThemeColor();
  const { register, handleSubmit } = useForm();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, ProviderId);
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken; // Si necesitas el token de Google
      const user = result.user;
      console.log("Usuario con Google:", user);
      navigate("/login"); // redirigir al home
    } catch (error) {
      console.error("Error con Google Sign-In", error.code, error.message);
    }
  };


const onSubmit = async (data) => {
  const { displayName, email, password, date } = data;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Actualiza perfil opcionalmente
    // await updateProfile(userCredential.user, { displayName });

    // Enviar verificación de correo
    await sendEmailVerification(userCredential.user);

    // Cerrar sesión para que no entre sin verificar
    await signOut(auth);

    alert("Te enviamos un correo de verificación. Por favor confírmalo para continuar.");
    navigate("/login");
  } catch (error) {
    console.error("Error en registro:", error.code, error.message);
  }
};

  return (
    <div className="w-full md:w-120 mx-auto p-6 rounded-xl bg-neutral-100 dark:bg-neutral-900 md:border border-neutral-200 dark:border-neutral-800">
      <div className="w-full text-center font-bold text-2xl md:text-3xl font-sans">
        <title>Registrarse ~ CloudBook</title>
        Bienvenido a CloudBook
      </div>
      <div className="w-full text-center font-normal text-[12px] font-mono my-2.5 text-neutral-400">
        Paso 1 de 3. Creación de cuenta
      </div>
      <br />
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className="w-full flex flex-col gap-5"
      >
        <FormInput
          label="Nombre visible"
          icon={<Folder size={20} />}
          placeholder="Ingresa tu nombre visible"
          {...register("displayName")}
          required
        />
        <FormInput
          label="Correo electrónico"
          icon={<Mail size={20} />}
          type="email"
          placeholder="Ingresa tu correo electrónico"
          {...register("email", {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
          })}
          required
        />
        <FormInput
          label="Contraseña"
          icon={<LockKeyhole size={20} />}
          type="password"
          placeholder="Ingresa tu contraseña"
          {...register("password")}
          required
        />
        <FormInput
          label="Fecha de nacimiento"
          icon={<CalendarRange />}
          type="date"
          placeholder="Ingresa tu fecha de nacimiento"
          {...register("date")}
          required
        />
        <div className="w-full flex items-center justify-center">
          <div className="w-full text-center text-xs/6 text-balance">
            Al crear una cuenta, aceptas los{" "}
            <Link
              to="/policies/terms"
              className={`${txtClass} active:underline hover:underline`}
            >
              Términos y Condiciones
            </Link>{" "}
            y la{" "}
            <Link
              to="/policies/privacy"
              className={`${txtClass} active:underline hover:underline`}
            >
              Política de Privacidad
            </Link>{" "}
            de ClouodBook.
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Button
              full
              variant="secondary"
              onClick={() => window.history.back()}
            >
              Atrás
            </Button>
            <Button full type="submit" variant="follow">
              Siguiente
            </Button>
          </div>
          <div className="w-full flex items-center gap-2 my-2">
            <span className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700" />
            <span className="text-xs text-neutral-500">o</span>
            <span className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700" />
          </div>
          {/* Google Button */}
          <Button full variant="secondary" onClick={handleGoogleLogin}>
            <img src="/images/google.svg" alt="Google" className="size-4" />
            Registrarse con Google
          </Button>
        </div>

        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex items-center justify-center">
            <span className="font-normal text-[12px] font-sans">
              {"¿Ya tienes una cuenta? "}
              <Link
                to="/login"
                className={`w-full text-center ${txtClass} active:underline hover:underline`}
              >
                Iniciar sesión
              </Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

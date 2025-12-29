import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LockKeyhole, Mail } from "lucide-react";
import { FormInput } from "../components/ui/form/FormInput";
import { Button } from "../components";
import { useThemeColor } from "../context";

export default function Login() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { txtClass } = useThemeColor();
  const { register, handleSubmit } = useForm();

  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken; // Si necesitas el token de Google
      const user = result.user;
      console.log("Usuario con Google:", user);
      navigate("/"); // redirigir al home
    } catch (error) {
      console.error("Error con Google Sign-In", error.code, error.message);
    }
  };

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/");
    } catch (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Error al iniciar sesión", errorCode, errorMessage, error);
    }
  };

  return (
    <div className="w-full sm:w-120 mx-auto p-6 rounded-xl bg-neutral-100 dark:bg-neutral-900 md:border border-neutral-200 dark:border-neutral-800">
      <div className="w-full text-center font-bold text-2xl md:text-3xl font-sans">
        <title>Iniciar sesión ~ CloudBook</title>
        Bienvenido a CloudBook
      </div>
      <div className="w-full text-center font-normal text-[12px] font-mono my-2.5 text-neutral-500 dark:text-neutral-400">
        Paso 1 de 1
      </div>
      <br />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-5"
      >
        <FormInput
          label="Correo electrónico"
          type="email"
          icon={<Mail size={20} />}
          placeholder="Ingresa tu correo electrónico"
          required
          {...register("email", {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
          })}
        />
        <FormInput
          label="Contraseña"
          type="password"
          icon={<LockKeyhole size={20} />}
          placeholder="Ingresa tu contrasela"
          {...register("password", { required: true, minLength: 8 })}
          required
        />
        <div className="w-full flex flex-col gap-2">
          <Button full variant="follow" type="submit">
            Inciar sesión
          </Button>
          {/* Divider */}
          <div className="flex items-center gap-2 my-2">
            <span className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700" />
            <span className="text-xs text-neutral-500">o</span>
            <span className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700" />
          </div>

          {/* Google Button */}
          <Button variant="secondary" onClick={handleGoogleLogin}>
            <img
              src="/images/google.svg"
              width={16}
              height={16}
              alt="Logotipo de Google"
              title="Logotipo de Google"
              loading="eager"
              className="size-4"
            />
            Continuar con Google
          </Button>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex items-center justify-center">
            <span className="font-normal text-xs font-sans">
              {"¿No tienes una cuenta? "}
              <Link
                to="/register"
                className={`w-full text-center ${txtClass} active:underline hover:underline`}
              >
                Regístrate
              </Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

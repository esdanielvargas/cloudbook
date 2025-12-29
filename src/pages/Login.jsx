import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LockKeyhole, Mail } from "lucide-react";
import { FormInput } from "../components/ui/form/FormInput";
import { Button } from "../components";
import { useThemeColor } from "../context";
import supabase from "../utils/supabase";

export default function Login() {
  const navigate = useNavigate();
  const { txtClass } = useThemeColor();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  // --- Lógica para Google ---
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // A dónde vuelve el usuario después de loguearse en Google
        //   redirectTo: window.location.origin,
        redirectTo: `https://kujqnvheiszavhzeamkd.supabase.co/auth/v1/callback/google`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error con Google Sign-In:", error.message);
    }
  };

  // --- Lógica para Email/Password ---
  const onSubmit = async (formData) => {
    setLoading(true);
    const { email, password } = formData;

    try {
      // 1. Intentamos iniciar sesión
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Sesión iniciada:", data.user);
      navigate("/"); // Redirigir al home
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
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
          placeholder="Ingresa tu contraseña"
          {...register("password", { required: true, minLength: 6 })}
          required
        />
        <div className="w-full flex flex-col gap-2">
          <Button full variant="follow" type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar sesión"}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-2">
            <span className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700" />
            <span className="text-xs text-neutral-500">o</span>
            <span className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700" />
          </div>

          {/* Google Button */}
          <Button type="button" variant="secondary" onClick={handleGoogleLogin}>
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

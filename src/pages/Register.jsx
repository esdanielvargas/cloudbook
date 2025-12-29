import { useState } from "react";
import { CalendarRange, Folder, LockKeyhole, Mail, User, AtSign, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FormInput } from "../components/ui/form/FormInput";
import { useThemeColor } from "../context";
import { Button } from "../components";
import supabase from "../utils/supabase";

export default function Register() {
  const navigate = useNavigate();
  const { txtClass, bgClass } = useThemeColor();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  const { register, handleSubmit, watch, trigger, setError, clearErrors, formState: { errors } } = useForm({
    mode: "onChange"
  });

  const formData = watch();

  // --- VALIDACIONES ---
  const validateAge = (dateString) => {
    if (!dateString) return true; // Dejamos que 'required' lo maneje si está vacío
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    
    if (age < 14) {
      setError("date", { type: "manual", message: "Debes tener al menos 14 años." });
      return false;
    }
    clearErrors("date");
    return true;
  };

  const checkUsername = async (username) => {
    if (!username || username.length < 3) return;
    const { data } = await supabase.from("users").select("username").eq("username", username).single();
    if (data) {
      setUsernameAvailable(false);
      setError("username", { type: "manual", message: "Usuario ocupado" });
    } else {
      setUsernameAvailable(true);
      clearErrors("username");
    }
  };

  // --- NAVEGACIÓN ---
  const handleNext = async () => {
    let valid = false;
    if (step === 1) {
      valid = await trigger(["email", "password"]);
    } else if (step === 2) {
      const fieldsValid = await trigger(["displayName", "username", "date"]);
      const ageValid = validateAge(formData.date);
      // Solo avanzamos si el usuario está disponible o no se ha chequeado aún (pero no da error)
      const userValid = !errors.username; 
      valid = fieldsValid && ageValid && userValid;
    }

    if (valid) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
    else window.history.back();
  };

  // --- EVITAR ENTER PARA ENVIAR ---
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evita el submit automático
      if (step < 3) handleNext(); // Si estamos en paso 1 o 2, intenta avanzar
    }
  };

  // --- ENVÍO FINAL ---
  const onSubmit = async (data) => {
    setLoading(true);
    console.log("Enviando datos...", data); // Para debug

    try {
      const { email, password, displayName, username, date, bio } = data;

      // Importante: Asegúrate de haber corrido el SQL para agregar 'birth_date' y 'bio' a la tabla users
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
            username: username,
            birth_date: date, // Esto requiere que exista la columna birth_date en public.users
            bio: bio || "Hola, soy nuevo aquí.",
          },
        },
      });

      if (error) throw error;

      // alert("¡Cuenta creada exitosamente!");
      navigate("/"); 

    } catch (error) {
      console.error("Error detallado:", error);
      alert("Error al crear usuario: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-120 mx-auto p-6 rounded-xl bg-neutral-100 dark:bg-neutral-900 md:border border-neutral-200 dark:border-neutral-800">
      
      <div className="w-full text-center font-bold text-2xl md:text-3xl font-sans">
        Bienvenido a CloudBook
      </div>
      <div className="w-full text-center font-normal text-[12px] font-mono my-2.5 text-neutral-400">
        Paso {step} de 3
      </div>

      <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full mb-6 overflow-hidden">
        <div className={`h-full ${bgClass} transition-all duration-300 ease-out`} style={{ width: `${(step / 3) * 100}%` }} />
      </div>

      {/* Agregamos onKeyDown al form para controlar el Enter */}
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="w-full flex flex-col gap-5">
        
        {step === 1 && (
          <>
            <FormInput
              label="Correo electrónico"
              icon={<Mail size={20} />}
              type="email"
              autoFocus // Ayuda a la UX
              {...register("email", { required: "Correo requerido", pattern: { value: /^\S+@\S+$/i, message: "Inválido" } })}
              error={errors.email?.message}
            />
            <FormInput
              label="Contraseña"
              icon={<LockKeyhole size={20} />}
              type="password"
              {...register("password", { required: "Contraseña requerida", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
              error={errors.password?.message}
            />
          </>
        )}

        {step === 2 && (
          <>
            <FormInput
              label="Nombre completo"
              icon={<Folder size={20} />}
              autoFocus
              {...register("displayName", { required: "Nombre requerido" })}
              error={errors.displayName?.message}
            />
            <div className="relative">
                <FormInput
                label="Usuario"
                icon={<AtSign size={20} />}
                placeholder="sin espacios"
                {...register("username", { 
                    required: "Usuario requerido",
                    pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Solo letras, números y _" },
                    onBlur: (e) => checkUsername(e.target.value)
                })}
                error={errors.username?.message}
                />
                {usernameAvailable === true && !errors.username && (
                    <span className="text-xs text-green-500 absolute top-2 right-2 font-bold">✓</span>
                )}
            </div>
            <FormInput
              label="Nacimiento"
              icon={<CalendarRange size={20} />}
              type="date"
              {...register("date", { required: "Fecha requerida" })}
              error={errors.date?.message}
            />
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center mb-4">
                <div className="w-24 h-24 bg-neutral-200 dark:bg-neutral-800 rounded-full mx-auto flex items-center justify-center mb-2">
                    <User size={40} className="text-neutral-400"/>
                </div>
            </div>
            
            <FormInput
              label="Biografía (Opcional)"
              icon={<FileText size={20} />}
              placeholder="Escribe algo..."
              autoFocus
              {...register("bio")}
            />
          </>
        )}

        <div className="flex gap-3 mt-4">
          <Button full variant="secondary" onClick={handleBack} type="button">
            {step === 1 ? "Cancelar" : "Atrás"}
          </Button>

          {step < 3 ? (
            <Button full variant="follow" onClick={handleNext} type="button">
              Siguiente
            </Button>
          ) : (
            <Button full variant="follow" type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear cuenta"}
            </Button>
          )}
        </div>

      </form>
    </div>
  );
}
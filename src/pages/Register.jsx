import { useState } from "react";
import {
  CalendarRange,
  LockKeyhole,
  Mail,
  User,
  AtSign,
  FileText,
  Camera,
  Check,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormInput } from "../components/ui/form/FormInput";
import { useThemeColor } from "../context";
import { Button } from "../components";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../hooks";
import { auth, storage } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

// Lista de intereses predefinidos
const INTERESTS_LIST = [
  // Tecnología y Carrera
  "Programación",
  "Tecnología",
  "Diseño y UI",
  "Negocios y Finanzas",
  "Marketing",

  // Entretenimiento
  "Videojuegos",
  "Anime y Manga",
  "Cine y Series",
  "Música",
  "Libros",
  "Humor y Memes",

  // Estilo de Vida
  "Comida y Bebida",
  "Viajes",
  "Moda y Belleza",
  "Fitness y Salud",
  "Deportes",

  // Cultura y Sociedad
  "Arte y Creatividad",
  "Ciencia",
  "Historia",
  "Noticias",
  "Mascotas",
  "Fotografía",
];

export default function Register() {
  const navigate = useNavigate();
  const { bgClass } = useThemeColor();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  // Estados para Paso 3 (Avatar) y Paso 4 (Intereses)
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const formData = watch();

  // --- VALIDACIONES ---
  const validateAge = (dateString) => {
    if (!dateString) return true;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age < 14) {
      setError("date", {
        type: "manual",
        message: "Debes tener al menos 14 años.",
      });
      return false;
    }
    clearErrors("date");
    return true;
  };

  // Chequeo de usuario en FIREBASE FIRESTORE
  const checkUsername = async (username) => {
    if (!username || username.length < 3) return;

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUsernameAvailable(false);
        setError("username", {
          type: "manual",
          message: "Este nombre de usuario ya está ocupado.",
        });
      } else {
        setUsernameAvailable(true);
        clearErrors("username");
      }
    } catch (error) {
      console.error("Error verificando usuario:", error);
    }
  };

  // Manejo de Intereses
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((i) => i !== interest));
    } else {
      if (selectedInterests.length < 6) {
        // Límite opcional
        setSelectedInterests((prev) => [...prev, interest]);
      }
    }
  };

  // Manejo de Archivo de Imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- NAVEGACIÓN ---
  const handleNext = async () => {
    let valid = false;

    if (step === 1) {
      // Paso 1: Email, Password, Fecha
      const fieldsValid = await trigger(["email", "password", "date"]);
      const ageValid = validateAge(formData.date);
      valid = fieldsValid && ageValid;
    } else if (step === 2) {
      // Paso 2: Nombres, Usuario, Bio
      const fieldsValid = await trigger(["displayName", "username", "bio"]);
      const userValid = !errors.username;
      valid = fieldsValid && userValid;
    } else if (step === 3) {
      // Paso 3: Avatar (No es obligatorio, pero validamos si queremos)
      valid = true;
    } else if (step === 4) {
      valid = true;
    }

    if (valid) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
    else navigate(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.type !== "textarea") {
      e.preventDefault();
      if (step < 4) handleNext();
    }
  };

  const getInitialsAvatar = (name) => {
    // Crea una URL: Fondo aleatorio, negrita, tamaño decente
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User",
    )}&background=random&bold=false&size=180`;
  };

  // --- ENVÍO DEL FORMULARIO ---
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { email, password, displayName, username, date, bio } = data;

      // 1. Crear usuario en Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 2. Definir URL de foto (Mock o Lógica de Storage)
      let photoURL = "";

      if (selectedFile) {
        try {
          const storageRef = ref(storage, `/users/${username}/profile/${v4()}`);
          await uploadBytes(storageRef, selectedFile);
          photoURL = await getDownloadURL(storageRef);
        } catch (uploadError) {
          console.error("Error subiendo imagen:", uploadError);
          photoURL = getInitialsAvatar(displayName);
        }
      } else {
        photoURL = getInitialsAvatar(displayName);
      }

      // 3. Actualizar perfil de Auth
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });

      // 4. Guardar datos adicionales en la base de datos
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        name: displayName,
        username,
        birthdate: date,
        bio: bio || "",
        interests: selectedInterests,
        avatar: photoURL,
        created_at: new Date().toISOString(),
      });

      navigate("/");
    } catch (error) {
      console.error("Error registro:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-120 mx-auto p-6 rounded-xl bg-neutral-100 dark:bg-neutral-900 md:border border-neutral-200 dark:border-neutral-800">
      <div className="w-full text-center font-bold text-2xl md:text-3xl font-sans text-neutral-800 dark:text-white">
        Únete a CloudBook
      </div>
      <div className="w-full text-center font-normal text-[12px] font-mono my-2.5 text-neutral-400">
        Paso {step} de 4
      </div>

      <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full mb-6 overflow-hidden">
        <div
          className={`h-full ${bgClass} transition-all duration-300 ease-out`}
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        className="w-full flex flex-col gap-5"
      >
        {/* --- PASO 1: Credenciales y Edad --- */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
            <FormInput
              type="email"
              label="Correo electrónico"
              placeholder="Ingresa tu correo electrónico"
              icon={<Mail size={20} />}
              autoFocus
              {...register("email", {
                required: "Correo requerido",
                pattern: { value: /^\S+@\S+$/i, message: "Inválido" },
              })}
              error={errors.email?.message}
              required={true}
            />
            <FormInput
              type="password"
              label="Contraseña"
              placeholder="Elige tu contraseña"
              icon={<LockKeyhole size={20} />}
              {...register("password", {
                required: "Contraseña requerida",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/,
                  message: "Requiere mayúscula, minúscula y símbolo",
                },
              })}
              error={errors.password?.message}
              required={true}
            />
            <FormInput
              type="date"
              label="Fecha de nacimiento"
              placeholder="Seleccioná tu fecha de nacimiento"
              icon={<CalendarRange size={20} />}
              {...register("date", {
                required: "La fecha de nacimiento es obligatoria.",
              })}
              error={errors.date?.message}
              required={true}
            />
          </div>
        )}

        {/* --- PASO 2: Identidad Pública --- */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
            <FormInput
              label="Nombre visible"
              icon={<User size={20} />}
              autoFocus
              placeholder="Ingresa tu nombre o marca"
              {...register("displayName", {
                required: "El nombre es obligatorio.",
              })}
              error={errors.displayName?.message}
              required={true}
            />
            <div className="relative">
              <FormInput
                label="Nombre de usuario"
                icon={<AtSign size={20} />}
                placeholder="Ingresa tu nombre de usuario"
                {...register("username", {
                  required: "El nombre de usuario es obligatorio.",
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Solo letras, números y _",
                  },
                  onBlur: (e) => checkUsername(e.target.value),
                })}
                error={errors.username?.message}
                required={true}
              />
              {usernameAvailable === true && !errors.username && (
                <span className="text-xs text-green-500 absolute top-0.5 right-0 font-bold bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded-md">
                  Disponible
                </span>
              )}
            </div>
            <FormInput
              label="Descripción corta"
              icon={<FileText size={20} />}
              placeholder="Escribe una breve descripción de tu perfil"
              {...register("bio", {
                maxLength: { value: 160, message: "Máximo 160 caracteres" },
              })}
              error={errors.bio?.message}
            />
          </div>
        )}

        {/* --- PASO 3: Avatar o Foto --- */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">
              Tu foto de perfil
            </h3>
            <p className="text-sm text-neutral-500 mb-6 text-center max-w-xs">
              Sube una foto o usaremos tus iniciales automáticamente.
            </p>
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-neutral-100 dark:border-neutral-800 shadow-xl group">
              <img
                src={previewUrl || getInitialsAvatar(formData.displayName)}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
              {/* Overlay para subir foto */}
              <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                <Camera size={24} className="mb-1" />
                <span className="text-xs font-medium">Cambiar</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {/* Botón para quitar la foto subida (si se arrepiente) */}
            {previewUrl && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="px-2 py-1 rounded-lg font-medium text-sm text-rose-600 hover:text-rose-700 border border-rose-600 hover:border-rose-700 transition-all duration-300 ease-out hover:scale-102 cursor-pointer"
              >
                Eliminar foto seleccionada
              </button>
            )}
          </div>
        )}

        {/* --- PASO 4: Intereses --- */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold mb-2 text-center dark:text-white">
              ¿Qué te interesa?
            </h3>
            <p className="text-sm text-neutral-500 text-center mb-6">
              Selecciona tus favoritos ({selectedInterests.length}/6)
            </p>

            <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-2">
              {INTERESTS_LIST.map((topic) => {
                const isSelected = selectedInterests.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleInterest(topic)}
                    className={`px-4 py-2 cursor-pointer rounded-full text-xs md:text-sm border flex items-center justify-center gap-2 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400 transition-all duration-300 ease-out
                                    ${
                                      isSelected
                                        ? `${bgClass} text-white border-transparent! shadow-md`
                                        : selectedInterests.length > 5
                                          ? "text-neutral-500! cursor-no-drop!"
                                          : "bg-transparent"
                                    }
                                `}
                    disabled={selectedInterests?.length > 5 ? true : false}
                  >
                    {topic}
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button full type="button" variant="secondary" onClick={handleBack}>
            {step === 1 ? "Cancelar" : "Atrás"}
          </Button>

          {step < 4 ? (
            <Button full type="button" variant="follow" onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button full type="submit" variant="follow" disabled={loading}>
              {loading ? "Creando cuenta..." : "Finalizar"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

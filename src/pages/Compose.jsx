import {
  ClockPlus,
  File,
  Images,
  Link2,
  Loader2,
  Plus,
  Video,
  X,
} from "lucide-react";
import {
  Form,
  FormField,
  MenuAlt,
  PageBox,
  PageHeader,
} from "../components";
import { PostHeader } from "../components/posts";
import { getAuth } from "firebase/auth";
import { db, useUsers } from "../hooks";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { Button } from "../components/buttons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/config";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
// import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
// import { storage } from "../firebase/config";
// import { v4 } from "uuid";

export default function Compose() {
  const auth = getAuth();
  const users = useUsers(db);
  const navigate = useNavigate();
  const { register, watch, handleSubmit, reset } = useForm();

  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid
  );

  const [rows, setRows] = useState(1);
  const limit = 12;

  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [video, setVideo] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    setPhotos((prevFiles) => {
      // Limitar a 10 imágenes en total
      if (prevFiles.length + selectedFiles.length > 6) {
        alert("Solo puedes subir hasta 6 imágenes.");
        return prevFiles; // No añadir más imágenes
      }

      const newFileURLs = selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        // url: URL.createObjectURL(file),
      }));
      return [...prevFiles, ...newFileURLs];
    });

    // setPhotos(selectedFiles);
  };

  const handleRemoveFile = (indexToRemove) => {
    setPhotos((prevFiles) => {
      const fileToRemove = prevFiles[indexToRemove];
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }

      const newFiles = prevFiles.filter((_, index) => index !== indexToRemove);

      // Ajustar el índice de la foto actual
      if (indexToRemove === currentIndex && newFiles.length > 0) {
        setCurrentIndex((prevIndex) =>
          prevIndex >= newFiles.length ? newFiles.length - 1 : prevIndex
        );
      } else if (indexToRemove < currentIndex) {
        setCurrentIndex((prevIndex) => prevIndex - 1);
      }

      return newFiles;
    });
  };

  const uploadFile = async (file) => {
    const username = currentUser.username;
    const storageRef = ref(storage, `users/${username}/photos/${v4()}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const [url, setUrl] = useState(false);
  const [link, setLink] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Si el input está vacío, limpiamos la data y no hacemos nada
    if (!link) {
      setData(null);
      setError(null);
      return;
    }

    // 2. Iniciamos el TEMPORIZADOR (Debounce)
    // Esperará 1000ms (1 segundo) después de que dejes de escribir
    const timer = setTimeout(() => {
      fetchPreviewData(link);
    }, 1000);

    // 3. Función de LIMPIEZA
    // Esto es magia de React: Si el usuario escribe antes de que pase el segundo,
    // esta línea se ejecuta primero, mata el timer anterior y crea uno nuevo.
    return () => clearTimeout(timer);
  }, [link]); // Se ejecuta cada vez que 'link' cambia

const fetchPreviewData = async (linkUrl) => {
    // 1. BLINDAJE: Validaciones básicas
    if (!linkUrl || typeof linkUrl !== "string") return;

    setLoading(true);
    setError(null);

    const cleanText = linkUrl.trim();
    // Quitamos el protocolo para limpiarlo, pero luego lo agregaremos al llamar a la API
    const linkWithoutProtocol = cleanText.replace(/^https?:\/\//, "");
    const finalUrl = `https://${linkWithoutProtocol}`; // Reconstruimos URL segura

    // --- DETECCIÓN DE YOUTUBE ---
    // Buscamos si el link contiene "youtube.com" o "youtu.be"
    const isYouTube = /(youtube\.com|youtu\.be)/.test(linkWithoutProtocol);

    try {
      let resultData = null;

      if (isYouTube) {
        // === CAMINO A: ES YOUTUBE (Usamos noembed) ===
        // Esta API nunca falla con títulos ni miniaturas de YT
        const response = await fetch(
          `https://noembed.com/embed?url=${encodeURIComponent(finalUrl)}`
        );
        const json = await response.json();

        // Si noembed devuelve error, lanzamos excepción
        if (json.error) throw new Error("Video no disponible");

        // TRANSFORMACIÓN DE DATOS:
        // Convertimos la respuesta de noembed al formato que tu tarjeta ya entiende (Microlink)
        resultData = {
          title: json.title,
          description: "Ver video en YouTube", // YouTube rara vez da descripción limpia
          image: { url: json.thumbnail_url_hq || json.thumbnail_url }, // Preferimos alta calidad
          url: json.url || finalUrl,
          logo: { url: "https://www.youtube.com/s/desktop/favicon.ico" },
          publisher: "YouTube",
        };

      } else {
        // === CAMINO B: CUALQUIER OTRA WEB (Usamos Microlink) ===
        const response = await fetch(
          `https://api.microlink.io/?url=${encodeURIComponent(finalUrl)}`
        );
        const result = await response.json();

        if (result.status === "success") {
          resultData = result.data;
        } else {
          throw new Error("Microlink no pudo leer el enlace");
        }
      }

      // Guardamos la data (sea de YouTube o de Microlink)
      if (resultData) {
        setData(resultData);
      }

    } catch (err) {
      console.log("Error obteniendo preview:", err);
      // No seteamos error visual para no molestar al usuario, 
      // simplemente se quedará sin tarjeta o mostrará el link básico.
      setError("No pudimos obtener información.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    // Evitar doble clic si ya se está enviando
    if (isSubmitting) return;

    // Validaciones: Asegurar que hay texto, imágenes, o ambos
    if (!data.caption && photos.length === 0 && !video && !link) {
      alert("No puedes publicar un post vacío.");
      return;
    }

    // 1. ACTIVAR LOADING
    setIsSubmitting(true);

    try {
      // Subir las imágenes (si existen) y obtener las URLs
      const photoURLs =
        photos.length > 0
          ? await Promise.all(photos.map((photo) => uploadFile(photo.file)))
          : [];

      const userId = currentUser?.id;

      // Crear el objeto de datos para la publicación
      const posts = collection(db, "photos");
      const post = await addDoc(posts, {
        userId: userId,
        caption: data.caption || "",
        photos: photoURLs || [],
        video: data.video || "",
        link: link || "",
        posted: Timestamp.now(),
        show: true,
      });

      console.log("post: ", post);

      // Resetear el formulario y estado
      reset();
      setPhotos(false);
      setVideo(false);
      setLink("");
      setUrl(false);
      navigate(`/${currentUser?.username}`);
    } catch (error) {
      console.error("Error al crear la publicación:", error);
      alert("Hubo un error al crear la publicación. Inténtalo de nuevo.");
    } finally {
      // 2. DESACTIVAR LOADING (Se ejecuta siempre, haya error o no)
      setIsSubmitting(false);
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <PageHeader
        title="Nueva publicación"
        Icon={File}
        iconTitle="Borradores"
      />
      <PageBox active className="relative p-0! gap-0!">
        <PostHeader {...currentUser} posted={Timestamp.now()} action={false} />
        <Button
          variant="icon"
          className="absolute top-2 right-2 md:top-4 md:right-4 flex md:hidden"
          onClick={() => setRows(rows < limit ? rows + 1 : 1)}
        >
          <Plus size={20} strokeWidth={1.5} />
        </Button>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full px-2 md:px-4 mb-2 md:mb-4 flex flex-col">
            <textarea
              rows={rows}
              {...register("caption")}
              placeholder="¿En qué estás pensando?"
              className={`w-full min-h-5 max-h-25 resize-none md:resize-y text-xs md:text-sm focus:outline-none`}
            />
          </div>
          {/* Carrusel de fotos */}
          {photos.length > 0 && (
            <div className="w-full max-h-85.5 md:max-h-141.5 relative flex items-center justify-start gap-0.5 -md:gap-2 overflow-x-scroll custom-scrollbar">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className="min-w-85.5 md:min-w-141.5 h-full relative flex items-center justify-center cursor-grab active:cursor-grabbing"
                >
                  <div className="absolute top-2 left-2 text-xs font-mono">{`${
                    index + 1
                  }/${photos?.length}`}</div>
                  <Button
                    variant="icon"
                    className="size-7! absolute top-2 right-2 rounded-full!"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X size={18} className="size-4.5" strokeWidth={1.5} />
                  </Button>
                  <img
                    src={photos[index]?.url}
                    alt="Preview"
                    className="size-full object-cover object-center select-none pointer-events-none bg-neutral-800 box-border"
                  />
                </div>
              ))}
            </div>
          )}
          {/* Video */}
          {video && (
            <div className="mb-2 md:mb-4 space-y-2 md:space-y-4">
              {watch("video") && (
                <div className="w-full h-[192px] md:h-[336px] flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
                  <ReactPlayer
                    playing
                    url={`https://www.youtube.com/watch?v=${
                      watch("video") ? watch("video") : "T_bXeiYr7b0"
                    }`}
                    light={`https://i.ytimg.com/vi/${
                      watch("video") ? watch("video") : "T_bXeiYr7b0"
                    }/maxresdefault.jpg`}
                    width="100%"
                    height="100%"
                  />
                </div>
              )}
              <div className="mx-2 md:mx-4">
                <FormField
                  label="ID del video de YouTube"
                  text={`https://www.youtube.com/watch?v=${
                    watch("video") ? watch("video") : "videoID"
                  }`}
                  placeholder="Ingresa el ID del video de YouTube"
                  {...register("video")}
                />
              </div>
            </div>
          )}
          {/* Enlace */}
          {url && (
            <div className="w-full space-y-2 md:space-y-4">
              {/* INPUT */}
              <div className="w-full mb-2 md:mb-4 px-2 md:px-4">
                <FormField
                  type="search"
                  placeholder="Ingresa el enlace que deseas compartir"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              {/* ESTADO DE CARGA */}
              {loading && (
                <p className="px-2 md:px-4 text-xs" style={{ color: "#666" }}>
                  Buscando info del enlace...
                </p>
              )}

              {/* MENSAJE DE ERROR */}
              {error && (
                <p className="px-2 md:px-4 text-xs text-rose-600">{error}</p>
              )}

              {/* VISUALIZACIÓN DE LA TARJETA (Solo si hay data y no está cargando) */}
              {!loading && data && (
                <a
                  href={data.url || link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full relative flex flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950/50 border-y border-neutral-200/75 dark:border-neutral-800/75"
                >
                  {/* Imagen de portada */}
                  {data?.image && (
                    <img
                      src={data?.image?.url}
                      alt="Preview"
                      className="size-full max-h-85 md:max-h-141.5 object-cover object-center pointer-events-none select-none bg-neutral-50 dark:bg-neutral-950"
                    />
                  )}

                  <div className="w-full p-2 md:p-4 space-y-2 border-t border-neutral-200/75 dark:border-neutral-800/75">
                    {/* Título */}
                    <h3
                      className="line-clamp-1 text-md"
                      title={data?.title || "Sin título"}
                    >
                      {data?.title || "Sin título"}
                    </h3>

                    {/* Descripción */}
                    <p
                      className="line-clamp-2 text-xs text-neutral-500"
                      title={data?.description || "Sin descripción disponible."}
                    >
                      {data?.description || "Sin descripción disponible."}
                    </p>

                    {/* Pequeño Favicon + Dominio (Toque extra) */}
                    <div className="w-full mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
                      {data.logo && (
                        <img
                          src={
                            data?.logo?.url
                              ? `https://www.google.com/s2/favicons?domain=${link}&sz=64`
                              : data?.logo?.url
                          }
                          width="16"
                          height="16"
                          alt=""
                          className="object-cover object-center pointer-events-none select-none rounded-xs"
                        />
                      )}
                      <span>
                        {data?.publisher || new URL(data?.url).hostname}
                      </span>
                    </div>
                  </div>
                </a>
              )}
            </div>
          )}
          {/* Acciones */}
          <div className="w-full p-2 md:p-4 flex items-center justify-between border-y border-neutral-200/75 dark:border-neutral-800/75">
            <div className="w-full flex items-center justify-start gap-2">
              <Button
                variant="icon"
                title="Añadir fotos"
                className="relative disabled:text-neutral-500!"
                disabled={watch("video") || video || url ? true : false}
              >
                <label
                  htmlFor="photos"
                  className={`size-full absolute z-2 flex items-center justify-center ${
                    watch("video") || video
                      ? "cursor-no-drop"
                      : "cursor-pointer"
                  }`}
                >
                  <Images size={20} strokeWidth={1.5} />
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpg, image/jpeg, image/gif, image/webp, image/svg"
                  {...register("photos")}
                  onChange={handleFileChange}
                  disabled={watch("video") || video ? true : false}
                  className="size-full absolute z-1"
                  multiple
                  hidden
                  id="photos"
                />
              </Button>
              <Button
                variant="icon"
                title="Añadir video de YouTube"
                onClick={() => setVideo(!video)}
                disabled={photos.length > 0 || url ? true : false}
                className="disabled:cursor-no-drop! disabled:text-neutral-500!"
              >
                <Video size={20} strokeWidth={1.5} />
              </Button>
              <Button
                variant="icon"
                title="Añadir enlace"
                className="disabled:cursor-no-drop! disabled:text-neutral-500!"
                disabled={photos.length > 0 || video ? true : false}
                onClick={() => setUrl(!url)}
              >
                <Link2 size={20} className="-rotate-45" />
              </Button>
            </div>
            <div className="w-full flex items-center justify-end gap-1 md:gap-2">
              <div className="relative">
                <Button
                  variant="icon"
                  title="Programar publicación"
                  className="disabled:cursor-no-drop! disabled:text-neutral-500!"
                  disabled
                >
                  <ClockPlus size={20} strokeWidth={1.5} />
                </Button>
                <MenuAlt className="bottom-0 right-0"></MenuAlt>
              </div>
              <Button
                type="submit"
                variant="follow"
                disabled={isSubmitting} // Deshabilita el botón mientras carga
                className={
                  isSubmitting ? "opacity-70 cursor-not-allowed gap-2" : ""
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />{" "}
                    {/* Icono girando */}
                    Publicando...
                  </>
                ) : (
                  "Publicar"
                )}
              </Button>
            </div>
          </div>
        </Form>
      </PageBox>
    </>
  );
}

import {
  File,
  Images,
  Link2,
  Plus,
  Video,
  X,
  Pencil,
} from "lucide-react";
import { Form, FormField, MenuAlt, PageBox, PageHeader } from "../components";
import { PostHeader } from "../components/posts";
import { getAuth } from "firebase/auth";
import { db, usePosts, useUsers } from "../hooks";
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { Button } from "../components/buttons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/config";
import { v4 } from "uuid";
import { useNavigate, useSearchParams } from "react-router-dom";
import PostRepost from "../components/posts/PostRepost";
import PostTitle from "../components/posts/PostTitle";

export default function Compose() {
  const auth = getAuth();
  const users = useUsers(db);
  const posts = usePosts(db);
  const navigate = useNavigate();

  // 1. CAMBIO: Usamos searchParams para leer ?post=ID
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("post");
  const repostId = searchParams.get("repost");

  // Buscamos el post si existe el ID
  const postSelected = postId
    ? posts.find((post) => post?.id === postId)
    : null;

  const repostSelected = repostId
    ? posts.find((post) => post?.id === repostId)
    : null;

  const { register, watch, handleSubmit, setValue, reset } = useForm();

  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid
  );

  const title = watch("title");

  const [rows, setRows] = useState(1);
  const limit = 12;

  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [video, setVideo] = useState(false);
  const videoId = watch("video");

  const [url, setUrl] = useState(false);
  const [link, setLink] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. CAMBIO: Efecto para cargar datos si estamos editando
  useEffect(() => {
    if (postSelected) {
      // Cargar Caption
      setValue("title", postSelected.title || "");
      setValue("caption", postSelected.caption || "");

      // Cargar Fotos existentes
      if (postSelected.photos && postSelected.photos.length > 0) {
        const existingPhotos = postSelected.photos.map((photoUrl) => ({
          file: null, // No hay archivo físico porque ya está en la nube
          url: photoUrl,
          isExisting: true, // Bandera para saber que no hay que resubirla
        }));
        setPhotos(existingPhotos);
      }

      // Cargar Video
      if (postSelected.video) {
        setVideo(true);
        setValue("video", postSelected.video);
      }

      // Cargar Link
      // === CAMBIO PARA LINK ===
      // Verificamos si el post guardado tiene la estructura nueva (linkPreview)
      // o la vieja (link string) para mantener compatibilidad
      if (postSelected.linkPreview) {
        // Estructura NUEVA y OPTIMIZADA
        setUrl(true);
        setLink(postSelected.linkPreview.url);

        // Importante: Seteamos la 'data' directamente desde lo guardado
        // ¡Ya no hace falta hacer fetch de nuevo al editar!
        setData({
          title: postSelected.linkPreview.title,
          description: postSelected.linkPreview.description,
          image: { url: postSelected.linkPreview.image },
          url: postSelected.linkPreview.url,
          publisher: postSelected.linkPreview.publisher,
          logo: { url: postSelected.linkPreview.logo },
        });
      } else if (postSelected.link) {
        // Estructura VIEJA (solo string)
        // Aquí sí dejamos que el otro useEffect haga el fetch
        setUrl(true);
        setLink(postSelected.link);
      }
    }
  }, [postSelected, setValue]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    setPhotos((prevFiles) => {
      if (prevFiles.length + selectedFiles.length > 6) {
        alert("Solo puedes subir hasta 6 imágenes.");
        return prevFiles;
      }

      const newFileURLs = selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        isExisting: false,
      }));
      return [...prevFiles, ...newFileURLs];
    });
  };

  const handleRemoveFile = (indexToRemove) => {
    setPhotos((prevFiles) => {
      const fileToRemove = prevFiles[indexToRemove];
      // Solo revocamos URL si es un archivo local nuevo
      if (fileToRemove?.url && !fileToRemove.isExisting) {
        URL.revokeObjectURL(fileToRemove.url);
      }

      const newFiles = prevFiles.filter((_, index) => index !== indexToRemove);

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

  useEffect(() => {
    if (!link) {
      setData(null);
      setError(null);
      return;
    }
    const timer = setTimeout(() => {
      fetchPreviewData(link);
    }, 1000);
    return () => clearTimeout(timer);
  }, [link]);

  const fetchPreviewData = async (linkUrl) => {
    // ... (Tu código actual de fetchPreviewData) ...
    // Nota: Copia tu función fetchPreviewData aquí, la he omitido para no hacer la respuesta gigante,
    // pero la lógica es la misma.
    if (!linkUrl || typeof linkUrl !== "string") return;
    setLoading(true);
    setError(null);
    const cleanText = linkUrl.trim();
    const linkWithoutProtocol = cleanText.replace(/^https?:\/\//, "");
    const finalUrl = `https://${linkWithoutProtocol}`;
    const isYouTube = /(youtube\.com|youtu\.be)/.test(linkWithoutProtocol);

    try {
      let resultData = null;
      if (isYouTube) {
        const response = await fetch(
          `https://noembed.com/embed?url=${encodeURIComponent(finalUrl)}`
        );
        const json = await response.json();
        if (json.error) throw new Error("Video no disponible");
        resultData = {
          title: json.title,
          description: "Ver video en YouTube",
          image: { url: json.thumbnail_url_hq || json.thumbnail_url },
          url: json.url || finalUrl,
          logo: { url: "https://www.youtube.com/s/desktop/favicon.ico" },
          publisher: "YouTube",
        };
      } else {
        const response = await fetch(
          `https://api.microlink.io/?url=${encodeURIComponent(finalUrl)}`
        );
        const result = await response.json();
        if (result.status === "success") resultData = result.data;
        else throw new Error("Microlink no pudo leer el enlace");
      }
      if (resultData) setData(resultData);
    } catch (err) {
      console.log("Error preview:", err);
      setError("No pudimos obtener información.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    if (isSubmitting) return;

    if (
      !data?.caption &&
      photos?.length === 0 &&
      !videoId?.length === 0 &&
      !link
    ) {
      alert("No puedes publicar un post vacío.");
      return;
    }

    setIsSubmitting(true);

    try {
      const photoURLs =
        photos.length > 0
          ? await Promise.all(
              photos.map(async (photo) => {
                if (photo.isExisting) return photo.url;
                return await uploadFile(photo.file);
              })
            )
          : [];

      const userId = currentUser?.id;

      // Preparamos el objeto de metadata del enlace
      let linkData = null;

      // Si hay un enlace escrito Y tenemos la data de la previsualización cargada
      if (link && data) {
        linkData = {
          url: link, // La url original
          title: data.title || "",
          description: data.description || "",
          image: data.image?.url || "", // Guardamos la URL de la imagen directamente
          publisher: data.publisher || "",
          logo: data.logo?.url || "",
        };
      } else if (link && !data) {
        // Fallback: Si el usuario puso un link pero la API falló o no cargó,
        // guardamos al menos la URL pura.
        linkData = {
          url: link,
          title: link, // Usamos la URL como título temporal
          description: "",
          image: "",
          publisher: "",
        };
      }

      const postPayload = {
        userId: userId,
        repost: repostId,
        caption: formData.caption || "",
        photos: photoURLs || [],
        title: formData.title || "",
        video: formData.video || "",
        link: linkData || [],
        status: "public",
      };

      if (postId) {
        // === MODO EDICIÓN ===
        const postRef = doc(db, "posts", postId);

        // Validar seguridad: verificar que el post sea del usuario actual
        if (postSelected.userId !== userId) {
          alert("No tienes permiso para editar esto");
          return;
        }

        await updateDoc(postRef, {
          ...postPayload,
          updatedAt: Timestamp.now(),
        });
      } else {
        // === MODO CREACIÓN ===
        const postsRef = collection(db, "posts");

        await addDoc(postsRef, {
          ...postPayload,
          posted: Timestamp.now(),
        });
      }

      reset();
      setPhotos([]);
      setVideo(false);
      setLink("");
      setUrl(false);
      navigate(`/${currentUser?.username}`);
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
      alert("Hubo un error. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title={postId ? "Editar publicación" : "Nueva publicación"}
        Icon={postId ? Pencil : File}
        iconTitle={postId ? "Editando" : "Borradores"}
      />
      <PageBox active className="relative p-0! gap-0!">
        <PostHeader
          {...currentUser}
          posted={postSelected?.posted || Timestamp.now()}
          action={false}
        />
        <Button
          variant="icon"
          className="absolute top-2 right-2 md:top-4 md:right-4 flex md:hidden"
          onClick={() => setRows(rows < limit ? rows + 1 : 1)}
        >
          <Plus size={20} strokeWidth={1.5} />
        </Button>
        <div className="absolute top-2 right-2 md:top-4 md:right-4 text-xs">{watch("caption")?.length}/560</div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full px-2 md:px-4 mb-2 md:mb-4 flex flex-col items-center">
            {title && <PostTitle title={title} />}
            <textarea
              rows={rows}
              {...register("caption")}
              placeholder={
                postId ? "Edita tu publicación..." : "¿En qué estás pensando?"
              }
              maxLength={560}
              className={`w-full min-h-5 max-h-25 resize-none md:resize-y text-xs md:text-sm focus:outline-none`}
            />
          </div>

          {/* Carrusel de fotos */}
          {photos.length > 0 && (
            <div className="w-full max-h-85.5 md:max-h-141.5 relative flex items-center justify-start gap-0.5 -md:gap-2 overflow-x-scroll custom-scrollbar">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className="min-w-85.5 md:min-w-141.5 h-full relative flex items-center justify-center"
                >
                  <div className="absolute top-2 left-2 text-xs font-mono text-white bg-black/50 px-1 rounded">{`${
                    index + 1
                  }/${photos?.length}`}</div>
                  <Button
                    variant="icon"
                    className="size-7! absolute top-2 right-2 rounded-full! bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X size={18} className="size-4.5" strokeWidth={1.5} />
                  </Button>
                  <img
                    src={photos[index]?.url}
                    alt="Preview"
                    className="size-full object-cover object-center bg-neutral-800"
                  />
                </div>
              ))}
            </div>
          )}
          {/* Video */}
          {video && (
            <div className="w-full mb-2 md:mb-4 flex flex-col items-center justify-center gap-2 md:gap-4">
              {watch("video") && (
                <div className="w-full h-[192px] md:h-[336px] flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
                  <ReactPlayer
                    playing={false}
                    url={`https://www.youtube.com/watch?v=${
                      watch("video") || ""
                    }`}
                    light={`https://i.ytimg.com/vi/${watch(
                      "video"
                    )}/maxresdefault.jpg`}
                    width="100%"
                    height="100%"
                  />
                </div>
              )}
              <div className="w-full px-2 md:px-4 flex flex-col items-center justify-center gap-4">
                <FormField
                  label="ID del video de YouTube"
                  text={`https://www.youtube.com/watch?v=${
                    watch("video") ? watch("video") : "videoID"
                  }`}
                  placeholder="Ej: UiW9-Q9z5LU"
                  id="video"
                  name="video"
                  {...register("video", { required: true })}
                  required
                />
                <FormField
                  label="Título del video"
                  placeholder="Ej: Piano Lofi + Lluvia"
                  id="title"
                  name="title"
                  {...register("title", { required: true })}
                  required
                />
              </div>
            </div>
          )}

          {url && (
            <div className="w-full space-y-2 md:space-y-4">
              <div className="w-full mb-2 md:mb-4 px-2 md:px-4">
                <FormField
                  type="search"
                  placeholder="Ingresa el enlace"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              {/* Estado de carga */}
              {loading && (
                <p className="px-2 md:px-4 text-xs" style={{ color: "#666" }}>
                  Buscando información del enlace...
                </p>
              )}
              {/* Mensaje de error */}
              {error && (
                <p className="px-2 md:px-4 text-xs text-rose-600">{error}</p>
              )}
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

                    {/* Pequeño favicon + dominio */}
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
                      {data?.publisher ||
                        (data.url && (
                          <span>
                            {data?.publisher || new URL(data?.url).hostname}
                          </span>
                        ))}
                    </div>
                  </div>
                </a>
              )}
            </div>
          )}

          {repostSelected && <PostRepost repost={repostId} />}

          {/* Acciones */}
          <div className="w-full px-2 py-2 md:px-4 flex items-center justify-between border-y border-neutral-200/75 dark:border-neutral-800/75">
            <div className="w-full flex items-center justify-start gap-2">
              <Button variant="icon" className="relative">
                <label
                  htmlFor="photos"
                  className="cursor-pointer flex items-center"
                >
                  <Images size={20} />
                </label>
                <input
                  type="file"
                  id="photos"
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              <Button variant="icon" onClick={() => setVideo(!video)}>
                <Video size={20} />
              </Button>
              <Button variant="icon" onClick={() => setUrl(!url)}>
                <Link2 size={20} className="-rotate-45" />
              </Button>
            </div>

            <div className="w-full flex items-center justify-end gap-1 md:gap-2">
              <Button
                type="submit"
                variant="follow"
                disabled={isSubmitting}
                className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
              >
                {isSubmitting
                  ? "Guardando..."
                  : postId
                  ? "Actualizar"
                  : "Publicar"}
              </Button>
            </div>
          </div>
        </Form>
      </PageBox>
    </>
  );
}

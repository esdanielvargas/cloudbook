import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db, useFeeds, useUsers } from "@/hooks";
import { getAuth } from "firebase/auth";
import { Loader, X } from "lucide-react";
import {
  Button,
  EmptyState,
  Form,
  FormField,
  PageBox,
  PageHeader,
  PageLine,
  SearchBar,
  UserCard,
} from "@/components";
import { useThemeColor } from "@/context";

export default function FeedForm() {
  const { feedId } = useParams();
  const isEdit = Boolean(feedId);

  const auth = getAuth();
  const navigate = useNavigate();
  const users = useUsers(db);
  const feeds = useFeeds(db);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const titleWatch = watch("title");
  const feedSelected = feeds?.find((feed) => feed.id === feedId);

  const { bgTransluce20, borderTransluce, txtClass } = useThemeColor();

  // Cargar datos si es edición
  useEffect(() => {
    if (isEdit && feedSelected && users?.length > 0) {
      if (auth.currentUser && feedSelected.ownerId !== auth.currentUser.uid) {
        navigate("/feeds");
        return;
      }
      reset({ title: feedSelected.title, caption: feedSelected.caption });
      const members = users.filter((u) =>
        feedSelected.members?.includes(u.id || u.email),
      );
      setSelectedUsers(members);
    }
  }, [isEdit, feedSelected, users, reset, auth.currentUser, navigate]);

  // Lógica de búsqueda y selección
  const filteredUsers = users?.filter(
    (u) =>
      search &&
      (u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase())),
  );

  const toggleUser = (user) => {
    const id = user.id || user.email;
    setSelectedUsers((prev) =>
      prev.some((u) => (u.id || u.email) === id)
        ? prev.filter((u) => (u.id || u.email) !== id)
        : [...prev, user],
    );
  };

  const feedsFiltered = feeds.filter(
    (feed) => feed.ownerId === auth?.currentUser?.uid,
  );

  // Guardar (Crear o Editar)
  const onSubmit = async (data) => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        caption: data.caption,
        members: selectedUsers.map((u) => u.id || u.email),
        membersCount: selectedUsers.length,
        updatedAt: serverTimestamp(),
      };

      if (isEdit) {
        await updateDoc(doc(db, "feeds", feedId), payload);
      } else {
        await addDoc(collection(db, "feeds"), {
          ...payload,
          index: feedsFiltered.length,
          ownerId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          pinned: false,
        });
      }
      navigate("/lists");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Eliminar esta lista?")) {
      await deleteDoc(doc(db, "feeds", feedId));
      navigate("/lists");
    }
  };

  if (isEdit && (!feeds || feeds.length === 0)) {
    return (
      <div className="m-2 md:m-4">
        <EmptyState
          Icon={Loader}
          title={"Cargando datos..."}
          caption={"Los datos están cargando"}
        />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={titleWatch || (isEdit ? "Editar lista" : "Nueva lista")}
      />
      <PageBox active>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Título"
            text="Se mostrará en la navegación superior del inicio."
            placeholder="Ej: Amigos cercanos"
            {...register("title", { required: "Obligatorio" })}
            error={errors.title?.message}
          />
          <FormField
            label="Descripción"
            text="¿De qué trata esta lista?"
            textarea
            placeholder="Opcional..."
            {...register("caption")}
          />

          <PageLine />

          {/* Chips de Usuarios */}
          {selectedUsers && (
            <div className="w-full mb-4">
              <label className="text-xs text-neutral-500 mb-2 block uppercase font-bold">
                Miembros ({selectedUsers.length})
              </label>
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id || user.email}
                      className={`h-7 pl-2 pr-1 flex items-center gap-1 ${bgTransluce20} border ${borderTransluce} rounded-full ${txtClass} -text-sky-500 text-xs`}
                    >
                      @{user.username}
                      <button
                        type="button"
                        onClick={() => toggleUser(user)}
                        className="size-5 flex items-center justify-center cursor-pointer rounded-full transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <SearchBar
            placeholder="Buscar usuarios para añadir..."
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="w-full flex flex-col gap-2 mt-2 max-h-60 overflow-y-auto">
            {filteredUsers?.map((user) => {
              const isSelected = selectedUsers.some(
                (u) => (u.id || u.email) === (user.id || user.email),
              );
              return (
                <div
                  key={user.id || user.email}
                  className="w-full py-2 px-3 flex items-center justify-between hover:bg-neutral-800/30 rounded-xl transition-all"
                >
                  <UserCard className="p-0!" {...user} />
                  <Button
                    type="button"
                    variant={isSelected ? "followed" : "follow"}
                    onClick={() => toggleUser(user)}
                    size="sm"
                  >
                    {isSelected ? "Quitar" : "Agregar"}
                  </Button>
                </div>
              );
            })}
          </div>

          <PageLine />

          <div className="flex gap-2">
            {isEdit && (
              <Button
                type="button"
                variant="secondary"
                full
                onClick={handleDelete}
              >
                Eliminar
              </Button>
            )}
            <Button type="submit" variant="follow" full disabled={loading}>
              {loading
                ? "Guardando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Crear lista"}
            </Button>
          </div>
        </Form>
      </PageBox>
    </>
  );
}

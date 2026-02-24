import {
  deleteUser,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
} from "firebase/auth";
import { Button, Form, FormField, PageBox, PageHeader } from "../components";
import { useUsers } from "../hooks";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteObject, listAll, ref } from "firebase/storage";
import { db, storage } from "../firebase/config";

export default function AccountDelete() {
  const auth = getAuth();
  const users = useUsers(db);
  const user = users.find((user) => user.uid === auth?.currentUser?.uid);

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const deleteUserStorage = async (username) => {
    if (!username) return;
    const folderRef = ref(storage, `users/${username}`);

    try {
      const listResult = await listAll(folderRef);
      const deletePromises = listResult.items.map((fileRef) =>
        deleteObject(fileRef),
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.warn(
        "No se pudo borrar la carpeta de Storage (quizás ya estaba vacía o no existía):",
        error,
      );
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) return;

    try {
      const credential = EmailAuthProvider.credential(user?.email, password);
      await reauthenticateWithCredential(auth?.currentUser, credential);
      await deleteUserStorage(user?.username);
      await deleteDoc(doc(db, "users", user?.id));
      await deleteUser(auth?.currentUser);
      navigate("/login");
    } catch (err) {
      console.error("Error al eliminar cuenta:", err);
      if (err.code === "auth/wrong-password") {
        setError("La contraseña es incorrecta.");
      } else {
        setError("Ocurrió un error. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Eliminar cuenta" />
      <PageBox active>
        <div className="w-full space-y-2">
          <p className="text-sm text-neutral-400">
            Lamentamos que quieras irte de CloudBook.
          </p>
          <div className="p-3 rounded-lg dark:bg-neutral-800/50 border dark:border-neutral-800">
            <p className="text-sm text-rose-600/75 text-justify">
              <b>Advertencia: </b>
              Esta acción es irreversible. Se eliminará todo tu contenido,
              incluyendo publicaciones, conexiones y todo rastro que hayas
              creado.
            </p>
          </div>
        </div>
        <Form onSubmit={handleDeleteAccount}>
          <FormField
            label="Confirma tu contraseña"
            text="Para continuar, ingresa tu contraseña actual."
            placeholder="Ingresa tu contraseña..."
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="-mt-2 mb-4 text-xs text-red-500">{error}</p>}
          <Button
            type="submit"
            variant="submit"
            className="bg-rose-700! hover:bg-rose-800! text-white"
            disabled={loading || !password}
            full
          >
            {loading ? "Eliminando..." : "Eliminar mi cuenta permanentemente"}
          </Button>
        </Form>
      </PageBox>
    </>
  );
}

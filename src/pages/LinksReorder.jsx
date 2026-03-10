import { PageBox, PageHeader, Tab } from "@/components";
import { db, useUsers } from "@/hooks";
import { cleanUrlParams } from "@/utils";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Check, GripVertical, Link2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function LinksReorder() {
  const auth = getAuth();
  const users = useUsers(db);
  const navigate = useNavigate();
  const { username } = useParams();

 // Buscamos al usuario dueño del perfil y al usuario actual
  const userProfile = users.find((u) => u.username === username);
  const currentUser = users.find((u) => u?.uid === auth?.currentUser?.uid);

  const [saving, setSaving] = useState(false);
  const [localLinks, setLocalLinks] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const containerRef = useRef(null);

  // Inicializar links locales
  useEffect(() => {
    if (userProfile?.links && currentUser && userProfile.uid === currentUser.uid) {
      // Clonamos y ordenamos por el índice guardado
      const sortedLinks = [...userProfile.links].sort(
        (a, b) => (a.index ?? 0) - (b.index ?? 0)
      );
      setLocalLinks(sortedLinks);
    }
  }, [userProfile, currentUser]);

  const handleMove = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const newList = [...localLinks];
    const item = newList.splice(fromIndex, 1)[0];
    newList.splice(toIndex, 0, item);
    setLocalLinks(newList);
    setDraggedIndex(toIndex);
  };

  const onTouchMove = (e) => {
    if (draggedIndex === null) return;
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const row = targetElement?.closest("[data-index]");

    if (row) {
      const newIndex = parseInt(row.getAttribute("data-index"), 10);
      handleMove(draggedIndex, newIndex);
    }
  };

  const saveOrder = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      // Mapeamos los links locales para asignarles su nuevo índice oficial
      const updatedLinks = localLinks.map((link, idx) => ({
        ...link,
        index: idx,
      }));

      // IMPORTANTE: Como es un sub-objeto, actualizamos el documento del usuario completo
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, {
        links: updatedLinks
      });
      
      navigate(`/${username}/links`);
    } catch (error) {
      console.error("Error al guardar el orden:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Reordenar enlaces"
        buttonRight={{
          icon: saving ? Loader2 : Check,
          title: saving ? "Guardando..." : "Listo",
          onClick: saveOrder,
          className: saving ? "animate-spin" : "",
        }}
      />
      <PageBox className="p-0! gap-0!" active>
        <div
          ref={containerRef}
          className="w-full flex flex-col"
          onTouchMove={onTouchMove}
          onTouchEnd={() => setDraggedIndex(null)}
        >
          {localLinks.map((link, index) => (
            <div
              key={link.id || index}
              data-index={index}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                handleMove(draggedIndex, index);
              }}
              onDragEnd={() => setDraggedIndex(null)}
              onTouchStart={() => setDraggedIndex(index)}
              className={`select-none touch-none ${
                draggedIndex === index
                  ? "bg-neutral-200/50 dark:bg-neutral-800/50 scale-[1.02] z-50 shadow-xl"
                  : ""
              } transition-transform duration-200`}
            >
              <Tab
                Icon={Link2}
                title={link.title}
                caption={cleanUrlParams(link.link)}
                secondaryAction={{
                  icon: GripVertical,
                  active: false,
                }}
              />
            </div>
          ))}
        </div>
        
        {localLinks.length === 0 && (
          <div className="p-8 text-center text-neutral-500 text-sm">
            No hay enlaces para organizar.
          </div>
        )}
      </PageBox>
    </>
  );
}

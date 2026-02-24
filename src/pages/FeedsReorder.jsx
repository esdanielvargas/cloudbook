import { useState, useEffect, useRef } from "react";
import { PageBox, PageHeader, Tab } from "@/components";
import { db, useFeeds, useUsers } from "@/hooks";
import { doc, writeBatch } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  GripVertical,
  Newspaper,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeedsReorder() {
  const auth = getAuth();
  const feeds = useFeeds(db);
  const users = useUsers(db);
  const navigate = useNavigate();

  const [localFeeds, setLocalFeeds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Usamos una referencia para medir las posiciones de los elementos en pantalla
  const containerRef = useRef(null);

  useEffect(() => {
    if (feeds.length > 0 && users.length > 0) {
      const currentUser = users.find((u) => u?.uid === auth?.currentUser?.uid);
      if (currentUser) {
        const userFeeds = feeds
          .filter((f) => f.ownerId === currentUser.uid)
          .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
        setLocalFeeds(userFeeds);
      }
    }
  }, [feeds, users, auth.currentUser]);

  // --- LÓGICA DE REORDENAMIENTO ---
  const handleMove = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const newList = [...localFeeds];
    const item = newList.splice(fromIndex, 1)[0];
    newList.splice(toIndex, 0, item);
    setLocalFeeds(newList);
    setDraggedIndex(toIndex); // Actualizamos el índice que se está moviendo
  };

  // --- EVENTOS TÁCTILES (MÓVIL) ---
  const onTouchMove = (e) => {
    if (draggedIndex === null) return;

    // Bloqueamos el scroll de la página para que no interfiera con el arrastre
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    // Buscamos sobre qué elemento está el dedo actualmente
    const targetElement = document.elementFromPoint(
      touch.clientX,
      touch.clientY,
    );
    const row = targetElement?.closest("[data-index]");

    if (row) {
      const newIndex = parseInt(row.getAttribute("data-index"), 10);
      handleMove(draggedIndex, newIndex);
    }
  };

  // --- GUARDAR ---
  const saveOrder = async () => {
    setSaving(true);
    try {
      const batch = writeBatch(db);
      localFeeds.forEach((feed, idx) => {
        batch.update(doc(db, "feeds", feed.id), { index: idx });
      });
      await batch.commit();
      navigate("/lists");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Reordenar"
        Icon={Check}
        iconTitle={saving ? "Guardando..." : "Listo"}
        iconOnClick={saveOrder}
      />
      <PageBox active className="p-0! gap-0!">
        <div 
          ref={containerRef}
          className="w-full flex flex-col"
          onTouchMove={onTouchMove}
          onTouchEnd={() => setDraggedIndex(null)}
        >
          {localFeeds.map((feed, index) => (
            <div
              key={feed.id}
              data-index={index}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                handleMove(draggedIndex, index);
              }}
              onDragEnd={() => setDraggedIndex(null)}
              // Iniciamos el arrastre en móvil al tocar
              onTouchStart={() => setDraggedIndex(index)}
              className={`select-none touch-none ${
                draggedIndex === index ? "bg-neutral-200/50 dark:bg-neutral-800/50 scale-[1.02] z-50 shadow-xl" : ""
              } transition-transform duration-200`}
            >
              <Tab
                Icon={Newspaper}
                title={feed.title}
                caption="Arrastra para cambiar el orden."
                secondaryAction={{
                  icon: GripVertical,
                  active: false,
                }}
              />
            </div>
          ))}
        </div>
      </PageBox>
    </>
  );
}

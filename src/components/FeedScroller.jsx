import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeedScroller({ children }) {
  const containerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    
    // Mostramos la izquierda si ya no estamos al inicio
    setShowLeft(scrollLeft > 0);
    
    // Le restamos 2 píxeles al scrollWidth para evitar el problema de los decimales
    // Esto asegura que la flecha derecha desaparezca justo al llegar al final
    setShowRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  useEffect(() => {
    handleScroll();
    // Añadimos un event listener por si el usuario redimensiona la ventana
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [children]);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const scrollAmount = 250;
    
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth", 
    });
  };

  return (
    <div className="w-full relative flex items-center">
      
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="size-8 absolute -left-4 z-10 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950/95 rounded-full border border-neutral-200/75 dark:border-neutral-800/75 cursor-pointer transition-transform hover:scale-106 active:scale-95"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full py-2 flex items-center justify-start overflow-x-scroll no-scrollbar"
      >
        <div className="mx-auto flex items-center gap-1.5">
        {children}
        </div>
      </div>

      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="size-8 absolute -right-4 z-10 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950/95 rounded-full border border-neutral-200/75 dark:border-neutral-800/75 cursor-pointer transition-transform hover:scale-106 active:scale-95"
        >
          <ChevronRight size={18} />
        </button>
      )}
      
    </div>
  );
}
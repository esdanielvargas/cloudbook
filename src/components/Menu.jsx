import {
  AppWindow,
  Icon,
  Info,
  Languages,
  LogIn,
  LogOut,
  Palette,
  Rss,
  Settings,
  TriangleAlert,
} from "lucide-react";
import { featherPlus } from "@lucide/lab";
import {
  Bars3Icon,
  BellIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleBottomCenterTextIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { Bubbly, Nudge } from "./buttons";
import { db, useUsers } from "../hooks";
import { getAuth, signOut, } from "firebase/auth";
import MenuAlt from "./MenuAlt";
import { useEffect, useRef, useState } from "react";
// import supabase from "../utils/supabase";

export default function Menu() {
  const auth = getAuth();
  const users = useUsers(db);
  const navigate = useNavigate();

  const user = users.find((user) => user.email === auth.currentUser?.email);

  // const [session, setSession] = useState(null);

  // useEffect(() => {
  //   // 1. Verificamos si ya hay sesión activa al cargar la página
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //   });

  //   // 2. "Escuchamos" cambios (Login, Logout, etc.) automáticamente
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });

  //   // Limpieza al desmontar
  //   return () => subscription.unsubscribe();
  // }, []);

  const ComposeIcon = (props) => (
    <Icon iconNode={featherPlus} {...props} strokeWidth={1.5} />
  );

  // const handleSignOut = async () => {
  //   try {
  //     const { error } = await supabase.auth.signOut();

  //     if (error) throw error;

  //     console.log("Cierre de sesión exitoso");
      
  //     navigate("/login");
      
  //   } catch (error) {
  //     console.error("Error al cerrar la sesión:", error.message);
  //   }
  // };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Cierre de sesión exitoso");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar la sesión", error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="w-20 h-[calc(100vh_-_32px)] z-2 top-4 left-4 bottom-4 rounded-xl bg-neutral-100/75 dark:bg-neutral-900/75 shadow-sm border border-neutral-200/75 dark:border-neutral-800/75 hidden md:flex fixed flex-col items-center justify-between">
      <div className="w-full flex flex-col items-center justify-start mt-2.5">
        <div className="size-15 flex items-center justify-center">
          <Link to="/" className="text-neutral-700 dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40px"
              height="40px"
              viewBox="0 0 640 446"
              fill="none"
            >
              <path
                d="M20 288.357C20 365.622 86.7068 426 166 426H488C559.593 426 620 371.504 620 301.429C620 247.504 584.026 202.627 534.909 184.986C535.625 180.328 536 175.561 536 170.714C536 115.099 488.106 72.2857 432 72.2857C417.795 72.2857 404.167 75.0133 391.749 79.9573C362.358 43.2838 315.887 20 264 20C179.372 20 108.12 82.5023 104.172 163.615C55.0292 185.324 20 232.512 20 288.357Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="25"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className="w-full h-[50%] flex flex-col items-center justify-start">
        <nav className="flex flex-col gap-1">
          <Bubbly Icon={HomeIcon} title="Inicio" path="/" />
          <Bubbly Icon={MagnifyingGlassIcon} title="Búsqueda" path="/search" />
          <Bubbly
            Icon={ComposeIcon}
            title="Componer"
            path="/compose"
            active={true}
            // bgColor={`${bgClass} ${hoverClass}`}
          />
          {/* <Bubbly
            Icon={ChatBubbleBottomCenterIcon}
            title="Mensajes"
            path="/messages"
          /> */}
          <Bubbly Icon={BellIcon} title="Notificaciones" path="/notify" />
          <Bubbly
            Icon={UserIcon}
            title="Perfil"
            avatar={user?.avatar}
            isAvatar={user?.menu}
            path={`/${user ? user?.username : "login"}`}
          />
          {/* <Bubbly /> */}
        </nav>
      </div>
      {/*  */}
      <div className="w-full flex flex-col items-center justify-end mb-2.5">
        <Bubbly
          Icon={Bars3Icon}
          title="Más"
          onClick={() => setIsOpen((prev) => !prev)}
        />
        <MenuAlt
          ref={menuRef}
          isOpen={isOpen}
          className="left-full ml-4 bottom-0"
        >
          <Nudge
            Icon={Rss}
            title="Feeds"
            to="/feeds"
            onClick={() => setIsOpen(false)}
          />
          <Nudge
            Icon={Languages}
            title="Idiomas"
            to="/settings/languages"
            onClick={() => setIsOpen(false)}
          />
          <Nudge
            Icon={Palette}
            title="Apariencia"
            to="/settings/appearance"
            onClick={() => setIsOpen(false)}
          />
          <Nudge
            Icon={Info}
            title="Información"
            to="/settings/about"
            onClick={() => setIsOpen(false)}
          />
          <Nudge
            Icon={Settings}
            title="Configuración"
            to="/settings"
            onClick={() => setIsOpen(false)}
          />
          <hr className="my-1.5  border-neutral-200/50 dark:border-neutral-800/50" />
          {/* <Nudge
            Icon={TriangleAlert}
            title="Reportar errores"
            onClick={() => setIsOpen(false)}
          /> */}
          {user ? (
            <Nudge
              Icon={LogOut}
              title="Cerrar sesión"
              onClick={handleSignOut}
              alert
            />
          ) : (
            <Nudge
              Icon={LogIn}
              title="Iniciar sesión"
              to="/login"
              onClick={() => setIsOpen(false)}
            />
          )}
        </MenuAlt>
      </div>
    </div>
  );
}

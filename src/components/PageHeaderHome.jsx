import { getAuth, signOut } from "firebase/auth";
import Fussy from "./buttons/Fussy";
import { db, useUsers } from "../hooks";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Info,
  Languages,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Palette,
  Plus,
  Rss,
  Send,
  Settings,
  Star,
  X,
} from "lucide-react";
import { Button, IconButton, Nudge } from "./buttons";
import { useEffect, useRef, useState } from "react";
import MenuAlt from "./MenuAlt";
import PageLine from "./PageLine";

export default function PageHeaderHome() {
  const auth = getAuth();
  const users = useUsers(db);
  const navigate = useNavigate();

  const user = users.find((user) => user.email === auth.currentUser?.email);

  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid
  );

  const following = currentUser?.following || [];
  const followers = currentUser?.followers || [];
  const favorites = currentUser?.favorites || [];

  const mutuals = users.filter(
    (user) => following.includes(user.uid) === followers.includes(user.uid)
  );

  const feeds = [
    {
      show: true,
      id: "Mh5JSrlkRUuQ5Y",
      title: "Para ti",
      path: "/",
    },
    {
      show: following?.length > 0 ? true : false,
      id: "bQLoaUyc7YsnQ0",
      title: "Siguiendo",
      path: "/following",
    },
    {
      show: favorites?.length > 0 ? true : false,
      id: "FwcMpdzRgIqQEG",
      title: "Favoritos",
      path: "/favorites",
    },
    {
      show: mutuals?.length > 0 ? true : false,
      id: "OLgsesWPXheyNg",
      title: "Mutuos",
      path: "/mutuals",
    },
  ];

  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("none");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      setScrollDirection(currentPosition > scrollPosition ? "down" : "up");
      setScrollPosition(currentPosition);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);

  const headerStyle = {
    // -46px, -54px
    top: scrollDirection === "down" ? "-46px" : "0px",
  };

  const menuStyle = {
    top: scrollDirection === "down" ? "71px" : "71px",
  };

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Cierre de sesión exitoso");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar la sesión", error);
    }
  };

  return (
    <>
      <div
        className="w-full md:w-142 flex flex-col fixed md:hidden left-0 md:left-auto x-top-13.5 z-50 bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-xl transition-all duration-300 ease-out"
        style={headerStyle}
      >
        <div className="w-full px-2 md:px-4 pt-2 md:pt-4 flex -md:hidden items-center justify-center">
          <div className="size-full flex items-center justify-start gap-1.5">
            <h1 className="sr-only">¡Bienvenidos a CloudBook!</h1>
            <h2 className="font-black text-xl font-sans tracking-wide">
              CloudBook
            </h2>
          </div>
          <div className="size-full flex items-center justify-end gap-1.5">
            {/* <IconButton Icon={Bell} /> */}
            {/* <IconButton Icon={Star} /> */}
            <IconButton Icon={Mail} />
            <IconButton
              Icon={isOpen ? X : Menu}
              ref={buttonRef}
              onClick={() => setIsOpen(() => setIsOpen(!isOpen))}
            />
            <MenuAlt
              ref={menuRef}
              isOpen={isOpen}
              className="top-18 right-0"
              style={menuStyle}
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
              <PageLine />
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
        <div className="w-full md:w-auto px-2 md:px-4 py-2 md:py-4 flex items-center justify-center">
          <div className="w-full md:w-auto flex items-center justify-start gap-1 overflow-x-scroll md:overflow-y-auto custom-scrollbar">
            {feeds
              .filter((feed) => feed.show)
              .map((feed) => (
                <Fussy key={feed.id} {...feed} />
              ))}
            {currentUser?.feeds &&
              currentUser?.feeds.map((feed) => (
                <Fussy
                  key={feed.id}
                  title={feed.title}
                  path={`feeds/${feed.id}`}
                />
              ))}
            {currentUser?.feeds?.length < 2 ? (
              <Link
                to="/feeds"
                className="size-9 px-3 cursor-pointer text-sm flex items-center rounded-xl bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75 transition-all duration-300 ease-out active:underline active:transform active:scale-106 active:-rotate-6 hover:underline hover:transform hover:scale-106 hover:-rotate-6"
              >
                X
              </Link>
            ) : (
              <Link
                to="/feeds/create"
                className="min-w-9 size-9 cursor-pointer text-sm flex items-center justify-center rounded-xl bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75 transition-all duration-300 ease-out active:underline active:transform active:scale-106 active:-rotate-6 hover:underline hover:transform hover:scale-106 hover:-rotate-6"
              >
                <Plus size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-26 flex md:hidden"></div>
      <div className="w-full p-4 sticky top-0 z-50 hidden md:flex items-center justify-center bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-xl transition-all duration-300 ease-out">
        <div className="w-auto flex items-center justify-start gap-1.5 overflow-x-scroll md:overflow-y-auto custom-scrollbar">
          {feeds
            .filter((feed) => feed.show)
            .map((feed) => (
              <Fussy key={feed.id} {...feed} />
            ))}
          {currentUser?.feeds &&
            currentUser?.feeds.map((feed) => (
              <Fussy
                key={feed.id}
                title={feed.title}
                path={`feeds/${feed.id}`}
              />
            ))}
          {currentUser?.feeds?.length < 2 ? (
            <Link
              to="/feeds"
              className="size-9 px-3 cursor-pointer text-sm flex items-center rounded-xl bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75 transition-all duration-300 ease-out active:underline active:transform active:scale-106 active:-rotate-6 hover:underline hover:transform hover:scale-106 hover:-rotate-6"
            >
              X
            </Link>
          ) : (
            <Link
              to="/feeds/create"
              className="min-w-9 size-9 cursor-pointer text-sm flex items-center justify-center rounded-xl bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75 transition-all duration-300 ease-out active:underline active:transform active:scale-106 active:-rotate-6 hover:underline hover:transform hover:scale-106 hover:-rotate-6"
            >
              <Plus size={16} />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

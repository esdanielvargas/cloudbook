import { getAuth, signOut } from "firebase/auth";
import { db, useFeeds, useScrollDirection, useUsers } from "@/hooks";
import { Link, useNavigate } from "react-router-dom";
import {
  Bookmark,
  LifeBuoy,
  LogIn,
  LogOut,
  Mail,
  Menu,
  MessageSquareWarning,
  Newspaper,
  Palette,
  Plus,
  Settings,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";
import { Button, Fussy, IconButton, Nudge } from "./buttons";
import { useEffect, useRef, useState } from "react";
import MenuAlt from "./MenuAlt";
import PageLine from "./PageLine";
import FeedScroller from "./FeedScroller";

export default function PageHeaderHome() {
  const auth = getAuth();
  const feeds = useFeeds(db);
  const users = useUsers(db);
  const navigate = useNavigate();
  const direction = useScrollDirection();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const currentUser = users.find(
    (user) => user?.uid === auth?.currentUser?.uid,
  );

  const following = currentUser?.following || [];
  const followers = currentUser?.followers || [];
  const favorites = currentUser?.favorites || [];

  const mutuals = users.filter(
    (user) => following.includes(user?.id) && followers.includes(user?.id),
  );

  const lists = [
    {
      show: true,
      id: "Mh5JSrlkRUuQ5Y",
      title: "Para ti",
      path: "/",
    },
    {
      show: following?.length > 0,
      id: "bQLoaUyc7YsnQ0",
      title: "Siguiendo",
      path: "/following",
    },
    {
      show: favorites?.length > 0,
      id: "FwcMpdzRgIqQEG",
      title: "Favoritos",
      path: "/favorites",
    },
    {
      show: mutuals?.length > 0,
      id: "OLgsesWPXheyNg",
      title: "Mutuos",
      path: "/mutuals",
    },
  ];

  const feedsFiltered = feeds.filter(
    (feed) => feed.pinned && feed.ownerId === currentUser?.uid,
  );

  const headerStyle = {
    top: direction === "down" ? "-46px" : "0px",
  };

  const menuStyle = {
    top: "71px",
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
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
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar la sesión", error);
    }
  };

  return (
    <>
      {/* Mobile */}
      <div
        className="w-full md:w-142 flex md:hidden flex-col fixed left-0 md:left-auto x-top-13.5 z-50 bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-xl transition-all duration-300 ease-out"
        style={headerStyle}
      >
        <div className="w-full px-2 md:px-4 pt-2 md:pt-4 flex items-center justify-center">
          <div className="size-full flex items-center justify-start gap-1.5">
            <h1 className="sr-only">¡Bienvenidos a CloudBook!</h1>
            <h2 className="font-black text-xl font-sans tracking-wide">
              CloudBook
            </h2>
          </div>
          <div className="size-full flex items-center justify-end gap-1.5">
            <IconButton Icon={Sparkles} />
            <IconButton Icon={Mail} />
            <IconButton
              Icon={isOpen ? X : Menu}
              ref={buttonRef}
              onClick={() => setIsOpen(() => setIsOpen(!isOpen))}
            />
            <MenuAlt
              ref={menuRef}
              isOpen={isOpen}
              className="top-13.5! right-2"
              style={menuStyle}
            >
              <Nudge
                Icon={Newspaper}
                title="Listas"
                to="/lists"
                onClick={() => setIsOpen(false)}
              />
              <Nudge
                Icon={Bookmark}
                title="Guardados"
                to="/saved"
                onClick={() => setIsOpen(false)}
              />
              <PageLine />
              <Nudge
                Icon={Palette}
                title="Apariencia"
                to="/settings/appearance"
                onClick={() => setIsOpen(false)}
              />
              <Nudge
                Icon={Settings}
                title="Configuración"
                to="/settings"
                onClick={() => setIsOpen(false)}
              />
              <PageLine />
              <Nudge
                Icon={LifeBuoy}
                title="Centro de ayuda"
                // to="/settings/help"
                onClick={() => setIsOpen(false)}
              />
              <Nudge
                Icon={MessageSquareWarning}
                title="Informar un problema"
                // to="/"
                onClick={() => setIsOpen(false)}
              />
              <PageLine />
              {currentUser ? (
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
          <div className="w-full md:w-auto flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
            {lists
              .filter((feed) => feed.show)
              .map((feed) => (
                <Fussy key={feed.id} {...feed} />
              ))}
            {feedsFiltered
              .sort((a, b) => a.index - b.index)
              .map((feed) => (
                <Fussy
                  key={feed.id}
                  title={feed.title}
                  path={`lists/${feed.id}`}
                />
              ))}
            <Link
              to={feedsFiltered?.length > 7 ? "/lists" : "/lists/new"}
              className="min-w-9 size-9 flex items-center justify-center rounded-xl bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75 transition-all duration-300 ease-out hover:scale-110 hover:-rotate-6 active:scale-95 cursor-pointer"
            >
              {feedsFiltered?.length > 7 ? (
                <Settings2 size={18} />
              ) : (
                <Plus size={18} />
              )}
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full h-25 flex md:hidden"></div>
      {/* Desktop */}
      <div className="w-full sticky top-0 z-50 hidden md:flex items-center justify-center bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-xl transition-all duration-300 ease-out">
        <div className="size-full py-2 flex items-center justify-start">
          <FeedScroller>
            {lists
              .filter((feed) => feed.show)
              .map((feed) => (
                <Fussy key={feed.id} {...feed} />
              ))}
            {feedsFiltered
              .sort((a, b) => a.index - b.index)
              .slice(0, 8)
              .map((feed) => (
                <Fussy
                  key={feed.id}
                  title={feed.title}
                  path={`lists/${feed.id}`}
                />
              ))}
            <Link
              to={feedsFiltered?.length > 7 ? "/lists" : "/lists/new"}
              className="min-w-9 size-9 flex items-center justify-center rounded-xl bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75 transition-all duration-300 ease-out hover:scale-110 hover:-rotate-6 active:scale-95 cursor-pointer"
            >
              {feedsFiltered?.length > 7 ? (
                <Settings2 size={18} />
              ) : (
                <Plus size={18} />
              )}
            </Link>
          </FeedScroller>
        </div>
      </div>
    </>
  );
}

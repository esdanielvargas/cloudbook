// import { Button, PageBox, PageHeader } from "../components";
import {
  Button,
  PageBox,
  PageHeader,
  PostAction,
  PostComments,
  PostContent,
  PostHeader,
  PostInput,
  PostLine,
  PostMeta,
} from "../components";
import { useParams } from "react-router-dom";
import { db, useAuth, usePosts, useUsers } from "../hooks";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stripParamsAndWWW } from "../utils";

export default function PagePost() {
  const users = useUsers(db);
  const posts = usePosts(db);
  const auth = useAuth(db);

  const { username, postId } = useParams();

  // Obtener el autor del post.
  const author = users.find((user) => user.username === username);

  // Obtener el post específico.
  const postSelected = posts.find(
    (post) => post.id === postId && post.userId === author?.id
  );

  // Ver si el usuario autenticado es el autor del post.
  const isAuthor = auth?.uid === author?.uid;

  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
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
    <>
      <PageHeader title="Publicación" Icon={EllipsisVertical} />
      <PageBox className="p-0! gap-0!" active>
        <PostHeader {...author} {...postSelected} postId={postId} action={false} />
        <PostContent setIsOpen={setIsOpen} author={author} {...postSelected} />
        <PostMeta {...postSelected} isAuthor={isAuthor} />
        <PostLine />
        <PostAction {...author} {...postSelected} postId={postId} />
        <PostLine />
        <PostInput {...postSelected} />
        <PostLine />
        <PostComments {...postSelected} />
      </PageBox>
      <div
        className={`w-full h-screen flex items-start absolute left-0 z-50 bg-neutral-950/75 transition-all duration-300 ease-out ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          ref={modalRef}
          className={`w-full mx-4 md:mx-auto mt-60 p-4 space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 transition-all duration-300 ease-out ${
            isOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <div className="text-center md:text-left font-bold text-lg/6.5 text-balance text-neutral-50">
            ¿Estás seguro de que quieres salir de CloudBook?
          </div>
          <div className="text-center md:text-justify text-sm font-sans text-neutral-400">
            Estás a punto de acceder a un enlace externo. CloudBook no se hace
            responsable del contenido ni de la seguridad del sitio que
            visitarás. Te recomendamos verificar la dirección antes de continuar
            y navegar siempre con precaución. Al dar clic en{" "}
            <strong>“Seguir enlace”</strong>, aceptas las políticas del sitio de
            destino y asumes la responsabilidad sobre tu información y
            seguridad.
            <br />
            <code className="hidden">
              {stripParamsAndWWW(
                postSelected?.link?.link || postSelected?.link?.url
              )}
            </code>
          </div>
          <div className="w-full flex items-center justify-end gap-2">
            <Button variant="filter" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="active"
              href={postSelected?.link?.url}
              onClick={() => setIsOpen(false)}
            >
              Seguir enlace
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

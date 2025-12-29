import { useEffect, useRef, useState } from "react";
import { Button, Nudge } from "../buttons";
import MenuAlt from "../MenuAlt";
import UserCard from "../UserCard";
import {
  Activity,
  Archive,
  Edit,
  Ellipsis,
  EllipsisVertical,
  Eye,
  EyeOff,
  KeyRound,
  Link2,
  OctagonAlert,
  Pin,
  SquareArrowOutUpRight,
  Star,
  Trash2 as Trash,
  UserMinus,
  UserPlus,
  UserX,
} from "lucide-react";
import { copyPostLink } from "../../utils";
import PageLine from "../PageLine";

export default function PostHeader(props) {
  const { postId, action = true, username, author } = props;

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
    <div className="w-full flex items-center justify-between">
      <UserCard {...props} authorId={props?.id} postId={postId} />
      {action ? (
        <div className="h-full -ml-2 pr-2 md:pr-4 flex items-center justify-end gap-2 relative">
          <Button variant="icon" onClick={() => setIsOpen((prev) => !prev)}>
            <EllipsisVertical size={20} strokeWidth={1.5} />
          </Button>
          <MenuAlt isOpen={isOpen} ref={menuRef} className="z-10 top-4 right-4">
            {author ? (
              <>
                <Nudge Icon={Pin} title="Fijar en el perfil" />
                <PageLine />
                <Nudge Icon={Edit} title="Editar publicación" />
                <Nudge Icon={Archive} title="Archivar publicación" />
                <Nudge Icon={Trash} title="Eliminar publicación" alert />
              </>
            ) : (
              <>
                <Nudge Icon={Eye} title="Me interesa" />
                <Nudge Icon={EyeOff} title="No me interesa" />
                <PageLine />
                <Nudge Icon={Star} title="Añadir a favoritos" />
                <Nudge Icon={UserPlus} title={`Seguir a @${username}`} />
                <Nudge
                  Icon={UserMinus}
                  title={`Dejar de seguir a @${username}`}
                />
                <Nudge Icon={UserX} title={`Bloquear a @${username}`} />
                <Nudge Icon={OctagonAlert} title="Reportar publicación" alert />
              </>
            )}
            <PageLine />
            <Nudge
              Icon={Link2}
              title="Copiar enlace"
              rotate={-45}
              onClick={() => copyPostLink(username, postId) + setIsOpen(false)}
            />
          </MenuAlt>
        </div>
      ) : null}
    </div>
  );
}

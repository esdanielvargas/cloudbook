import { Link } from "react-router-dom";

export default function Avatar({
  avatar = "/images/avatar.png",
  name = "Display Name",
  username = "username",
  action = true,
  className = "",
  size = 36,
  postId,
  refId,
}) {
  // Construir query params dinámicos
  const params = new URLSearchParams();
  if (postId) params.set("post", postId);
  if (refId) params.set("ref", refId);

  const url = `/${username}${params.toString() ? `?${params.toString()}` : ""}`;

  // Estilos comunes
  const baseClass = `overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-out ${className}`;
  const interactiveClass =
    "active:transform active:scale-106 active:-rotate-6 hover:transform hover:scale-106 hover:-rotate-6";

  const commonStyle = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
  };

  const content = (
    <img
      src={avatar}
      width={size}
      height={size}
      loading="eager"
      alt={`Foto de perfil de ${name} (@${username})`}
      title={`Foto de perfil de ${name} (@${username})`}
      className="size-full object-cover object-center select-none pointer-events-none"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/images/avatar.png";
      }}
    />
  );

  if (action) {
    return (
      <Link to={url} className={`${baseClass} ${interactiveClass}`} style={commonStyle}>
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClass} style={commonStyle}>
      {content}
    </div>
  );
}

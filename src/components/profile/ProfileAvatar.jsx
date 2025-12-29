export default function ProfileAvatar({
  avatar = "/images/avatar.png",
  name = "Display Name",
  username = "username",
}) {
  return (
    <div className="size-20 md:size-30 aspect-square rounded-4xl overflow-hidden border-2 border-neutral-200 dark:border-neutral-800">
      <img
        src={avatar}
        width={36}
        height={36}
        loading="eager"
        alt={`Foto de perfil de ${name} (@${username})`}
        title={`Foto de perfil de ${name} (@${username})`}
        className="size-full object-cover object-center select-none pointer-events-none"
        onError={(e) => {
          e.currentTarget.src = "/images/avatar.png";
        }}
      />
    </div>
  );
}

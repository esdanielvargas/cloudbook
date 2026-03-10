export default function MusicBox(props) {
  const { link, cover, title, format, date } = props;

  return (
    <a href={link} target="_blank" className="w-full mb-4 flex flex-col gap-1">
      <div className="group aspect-square relative cursor-pointer rounded-xl dark:bg-neutral-900 md:border dark:border-neutral-800">
        <img
          src={cover ?? "/images/photo.png"}
          alt={`Portada de ${title}`}
          title={`Portada de ${title}`}
          loading="eager"
          width={188}
          height={188}
          className="size-full object-cover object-center rounded-xl select-none pointer-events-none"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/photo.png";
          }}
        />
      </div>
      <div className="w-full flex flex-col gap-0.5">
        <span
          className="font-medium text-base line-clamp-1 hover:underline"
          title={title ?? "Título"}
        >
          {title ?? "Título"}
        </span>
        <div className="flex items-center justify-start gap-1">
          <span className="font-normal text-xs text-neutral-400">
            {format ?? "Formato"}
          </span>
          <span className="font-black text-xs text-neutral-400">·</span>
          <span className="font-normal text-xs text-neutral-400">
            {new Date(date.seconds * 1000).toLocaleDateString("es", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </a>
  );
}

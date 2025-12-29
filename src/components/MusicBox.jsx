export default function MusicBox(props) {
  return (
    <a
      href={props?.link}
      target="_blank"
      rel="noopener noreferrer"
      className="aspect-square relative cursor-pointer rounded-xl dark:bg-neutral-900 md:border dark:border-neutral-800"
    >
      <img
        src={props.covers ? props?.covers[0] : "/images/photo.png"}
        alt={props?.title}
        className="w-full h-full object-cover rounded-xl select-none pointer-events-none"
        onError={(e) => {
          e.currentTarget.src = "/images/photo.png";
        }}
      />
      {props.title && (
        <div className="px-1.5 absolute left-2 bottom-2 z-2 rounded-md bg-neutral-950/50 text-[12px]">
          {props.title ? props?.title : "Título"}
        </div>
      )}
    </a>
  );
}

export default function PostLink(props) {
  const { url, image, title } = props;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex flex-col items-center"
    >
      <div
        onClick={() => props.setIsOpen(true)}
        className="w-full relative overflow-hidden border-y border-neutral-200/75 dark:border-neutral-800/75 bg-neutral-50/75 dark:bg-neutral-950/75 cursor-pointer"
      >
        <img
          src={image}
          alt={title}
          title={title}
          width={566}
          height={566}
          loading="eager"
          className="size-full max-h-85 md:max-h-141 object-cover object-center select-none pointer-events-none"
          onError={(e) => {
            e.currentTarget.src = "/images/1080x642.png";
          }}
        />
        <div className="px-2 pb-px absolute left-1 bottom-1 rounded-md bg-neutral-50/75 dark:bg-neutral-950/75">
          <span className="font-normal text-xs font-sans">{title}</span>
        </div>
      </div>
    </a>
  );
}

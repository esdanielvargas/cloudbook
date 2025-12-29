import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";

export default function PostGallery(props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevPhoto = useCallback(() => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + props?.photos?.length) % props?.photos?.length
    );
  }, [props?.photos?.length]);

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % props?.photos?.length);
  }, [props?.photos?.length]);

  return (
    <div className="w-full group flex items-center justify-center relative bg-neutral-50/75 dark:bg-neutral-950/75">
      <>
        <div className="z-2 absolute top-4 right-4 transition-all duration-300 ease-out opacity-0 invisible group-hover:opacity-100 group-hover:visible">
          <div className="text-[11.5px] font-mono select-none pointer-events-none">
            {`${currentIndex + 1}/${props?.photos?.length}`}
          </div>
        </div>
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={() => prevPhoto()}
            className="size-7.5 z-2 cursor-pointer flex items-center justify-center rounded-full bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75 absolute left-4 transition-all duration-300 ease-out opacity-0 invisible group-active:opacity-100 group-hover:opacity-100 group-active:visible group-hover:visible active:scale-106 hover:scale-106"
          >
            <ArrowLeftIcon className="size-4.5" />
          </button>
        )}
        {currentIndex < props?.photos?.length - 1 && (
          <button
            type="button"
            onClick={() => nextPhoto()}
            className="size-7.5 z-2 cursor-pointer flex items-center justify-center rounded-full bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75 absolute right-4 transition-all duration-300 ease-out opacity-0 invisible group-active:opacity-100 group-hover:opacity-100 group-active:visible group-hover:visible active:scale-106 hover:scale-106"
          >
            <ArrowRightIcon className="size-4.5" />
          </button>
        )}
      </>
      <div className="size-full max-h-85.5 md:max-h-141.5 z-1 flex items-center justify-center relative overflow-hidden">
        <img
          src={props?.photos?.[currentIndex]}
          alt={props?.text ? props?.text : `Publicación de ${props.author?.name} @(${props.author?.username}), sin texto descriptivo del contenido.`}
          title={props?.text ? props?.text : `Publicación de ${props.author?.name} @(${props.author?.username}), sin texto descriptivo del contenido.`}
          width={596}
          height={596}
          loading="eager"
          className="size-full z-1 object-cover object-center select-none pointer-events-none blur-2xl"
        />
        <img
          src={props?.photos?.[currentIndex]}
          alt={props?.text ? props?.text : `Publicación de ${props.author?.name} @(${props.author?.username}), sin texto descriptivo del contenido.`}
          title={props?.text ? props?.text : `Publicación de ${props.author?.name} @(${props.author?.username}), sin texto descriptivo del contenido.`}
          width={596}
          height={596}
          loading="eager"
          className="size-full absolute z-2 object-contain object-center select-none pointer-events-none"
        />
      </div>
    </div>
  );
}

import {
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useMediaModal } from "../context/MediaModalContext";
import { useCallback, useState } from "react";
import YouTubePlayer from "react-player/youtube";
import { X } from "lucide-react";

export default function MediaModal() {
  const { modalData, closeModal } = useMediaModal();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = useCallback(() => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + modalData?.photos?.length) % modalData?.photos?.length
    );
  }, [modalData?.photos?.length]);

  const next = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % modalData?.photos?.length);
  }, [modalData?.photos?.length]);

  if (!modalData) return null;

  return (
    <div
      className={`fixed inset-0 z-100 cursor-pointer flex items-center justify-center bg-neutral-950/75 ${
        modalData ? "" : "bg-sky-950"
      }`}
    >
      <div className="w-full p-4 flex items-center justify-between gap-2 absolute z-50 top-0">
        <div className="flex items-center justify-start gap-2">
          {modalData?.photos
            ? `${currentIndex + 1}/${modalData?.photos?.length}`
            : ""}
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={closeModal}
            className="size-9 flex items-center justify-center cursor-pointer text-white rounded-xl bg-neutral-900 md:border dark:border-neutral-800 transition-all duration-300 ease-out active:transform active:scale-106 active:-rotate-6 hover:transform hover:scale-106 hover:-rotate-6"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="w-full h-screen z-5 flex items-center justify-center bg-neutral-950/50 backdrop-blur-xl">
        <img
          src={
            modalData.photos
              ? modalData.photos[currentIndex]
              : `https://i.ytimg.com/vi/${
                  modalData?.video ? modalData?.video : modalData?.videoId
                }/maxresdefault.jpg`
          }
          alt=""
          className="w-full blur-3xl"
        />
      </div>
      <div className="w-full h-screen z-10 flex items-center justify-center absolute">
        {Array.isArray(modalData.photos) && modalData.photos.length > 0 ? (
          <img
            src={modalData.photos[currentIndex]}
            alt=""
            className="w-full max-h-screen object-contain object-center select-none pointer-events-none"
          />
        ) : modalData.video || modalData.videoId ? (
          <YouTubePlayer
            controls
            url={`https://www.youtube.com/watch?v=${
              modalData?.video ? modalData?.video : modalData?.videoId
            }`}
          />
        ) : null}

        <div className="hidden text-white">
          <p>{modalData?.caption}</p>
          <p className="text-sm text-neutral-400">Comentarios aquí...</p>
        </div>
      </div>
      {modalData?.photos?.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => prev()}
            className="size-9 absolute z-200 left-4 cursor-pointer flex items-center justify-center rounded-xl dark:bg-neutral-900 md:border dark:border-neutral-800 hover:bg-neutral-800 transition-all duration-300 ease-out active:transform active:scale-106 active:-rotate-6 hover:transform hover:scale-106 hover:-rotate-6"
          >
            <ArrowLeftIcon className="size-5 text-white" />
          </button>
          <button
            type="button"
            onClick={() => next()}
            className="size-9 absolute z-200 right-4 cursor-pointer flex items-center justify-center rounded-xl dark:bg-neutral-900 md:border dark:border-neutral-800 hover:bg-neutral-800 transition-all duration-300 ease-out active:transform active:scale-106 active:-rotate-6 hover:transform hover:scale-106 hover:-rotate-6"
          >
            <ArrowRightIcon className="size-5 text-white" />
          </button>
        </>
      )}
    </div>
  );
}

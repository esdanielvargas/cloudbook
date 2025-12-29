import { ImagesIcon } from "lucide-react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useMediaModal } from "../../context/MediaModalContext";
// import { useMediaModal } from "../../contexts/MediaModalContext";

export default function MediaItem({ post }) {
  const { openModal } = useMediaModal();

  const handleClick = () => {
    openModal(post);
  };

  const isPhoto = Array.isArray(post.photos) && post.photos.length > 0;
  const isVideo = Boolean(post?.video ? post?.video : post?.videoId);

  return (
    <div
      onClick={handleClick}
      className="w-full aspect-square relative overflow-hidden flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900 cursor-pointer"
    >
      {isPhoto ? (
        <img
          src={post.photos[0] || "/images/photos.png"}
          alt={post.alt ? post.alt[0] : ""}
          title={post.alt ? post.alt[0] : ""}
          width={198.66}
          height={198.66}
          className="w-full h-full z-1 object-cover select-none pointer-events-none"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/photos.png";
          }}
        />
      ) : isVideo ? (
        <img
          src={`https://i.ytimg.com/vi/${
            post?.video ? post?.video : post?.videoId
          }/maxresdefault.jpg`}
          alt="Video thumbnail"
          className="w-full h-full z-1 object-cover select-none pointer-events-none"
        />
      ) : null}

      {isPhoto && post.photos.length > 1 && (
        <ImagesIcon className="size-4.5 absolute z-2 top-2 right-2" />
      )}
      {isVideo && <PlayIcon className="size-4.5 absolute z-2 top-2 right-2" />}
    </div>
  );
}
// This component is used to display a media item (photo or video) in the profile media grid.
// It handles the click event to open a modal with the media details.
// It also conditionally renders icons for multiple photos or video thumbnails.

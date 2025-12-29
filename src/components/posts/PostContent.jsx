import PostTitle from "./PostTitle";
import PostText from "./PostText";
import PostGallery from "./PostGallery";
import PostVideo from "./PostVideo";
import PostLink from "./PostLink";
import PostRepost from "./PostRepost";
import { LinkPreview } from "../LinkPreview";

export default function PostContent({
  title,
  text,
  caption,
  photos,
  videoId,
  video,
  link,
  repost,
  author,
  premium,
  poster,
  // setIsOpen,
}) {
  return (
    <div className="w-full flex flex-col">
      {title && <PostTitle title={title} text={text} />}
      {(text || caption) && (
        <PostText
          text={text}
          caption={caption}
          premium={premium}
          photos={photos?.length > 0 ? true : false}
          video={video?.length > 0 ? true : false}
          videoId={videoId?.length > 0 ? true : false}
          repost={repost?.length > 0 ? true : false}
          link={link}
        />
      )}
      {photos && photos?.length > 0 && (
        <PostGallery text={text} author={author} photos={photos} />
      )}
      {video && <PostVideo video={video ? video : videoId} />}
      {link && (
        <LinkPreview link={link?.url ? link?.url : link} poster={poster} />
      )}
      {repost && <PostRepost repost={repost} author={author} />}
    </div>
  );
}

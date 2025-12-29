import YouTubePlayer from "react-player/youtube";

export default function PostVideo({video}) {
  return (
    <div className="w-full h-[192px] md:h-[336px] flex items-center justify-center bg-neutral-950/50 overflow-hidden">
      <YouTubePlayer
        url={`https://www.youtube.com/watch?v=${video}`}
        playing
        controls
        width="100%"
        height="100%"
        light={`https://i.ytimg.com/vi/${video}/maxresdefault.jpg`}
        className="w-full"
      />
    </div>
  );
}

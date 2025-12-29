import { db, useUsers } from "../../hooks";
import { formatText } from "../../utils";

export default function PostText({
  text,
  caption,
  photos,
  videoId,
  video,
  repost,
  link,
  premium,
}) {
  const users = useUsers(db);
  const xy = text ? text : caption;

  return (
    <div
      className={`w-full px-2 md:px-4${
        photos || videoId || video || repost || link?.url ? " mb-2 md:mb-4" : ""
      }`}
    >
      <div className="text-xs whitespace-pre-wrap">
        {formatText(xy, users, premium)}
      </div>
    </div>
  );
}

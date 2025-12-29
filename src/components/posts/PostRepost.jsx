import { db, usePosts, useUsers } from "../../hooks";
import PostContent from "./PostContent";
import PostHeader from "./PostHeader";

export default function PostRepost(props) {
  const posts = usePosts(db);
  const users = useUsers(db);

  const repost = posts.find((p) => p.id === props?.repost);
  const user = users.find((u) => u.id === repost?.userId);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full mx-2 md:mx-4 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <PostHeader {...user} {...repost} postId={repost?.id} action={false} />
        <PostContent {...repost} />
      </div>
    </div>
  );
}

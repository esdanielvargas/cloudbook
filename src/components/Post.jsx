import PostAction from "./posts/PostAction";
import PostContent from "./posts/PostContent";
import PostHeader from "./posts/PostHeader";

export default function Post(props) {
  const { postId, author, premium } = props;
  return (
    <article className="w-full flex flex-col rounded-xl bg-neutral-100/75 dark:bg-neutral-900/75 border border-neutral-200/75 dark:border-neutral-800/75">
      <PostHeader {...props} postId={postId} author={author} action={true} />
      <PostContent
        {...props}
        postId={postId}
        premium={premium}
      />
      <PostAction
        {...props}
        postId={postId}
        author={author}
        saved={props?.saved}
      />
    </article>
  );
}

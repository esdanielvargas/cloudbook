// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "../../firebase"; // o como tengas tu instancia

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../hooks";

export async function toggleCommentLike(postId, commentId, userId) {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) return;

  const post = postSnap.data();
  const updatedComments = (post.comments || []).map((comment) => {
    if (comment.id !== commentId) return comment;

    const alreadyLiked = comment.likes.includes(userId);

    return {
      ...comment,
      likes: alreadyLiked
        ? comment.likes.filter((id) => id !== userId)
        : [...comment.likes, userId],
    };
  });

  await updateDoc(postRef, { comments: updatedComments });
}

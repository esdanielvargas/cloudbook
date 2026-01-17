import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../hooks";

export async function likeComment(postId, commentId, userId) {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) return;

  const post = postSnap.data();

  const updatedComments = (post.comments || []).map((comment) => {
    if (comment.id !== commentId) return comment;

    const currentLikes = Array.isArray(comment.likes) ? comment.likes : [];
    
    const alreadyLiked = currentLikes.includes(userId);

    const newLikes = alreadyLiked
      ? currentLikes.filter((id) => id !== userId)
      : [...currentLikes, userId];

    return {
      ...comment,
      likes: newLikes,
    };
  });

  await updateDoc(postRef, { comments: updatedComments });
}
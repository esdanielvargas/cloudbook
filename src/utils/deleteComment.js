import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../hooks";

export async function deleteComment(postId, commentId) {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) return;

  const post = postSnap.data();

  const updatedComments = (post.comments || []).filter(
    (comment) => comment.id !== commentId
  );

  await updateDoc(postRef, { comments: updatedComments });
}
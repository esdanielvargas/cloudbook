import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  collection,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../hooks";

export const toggleLike = async ({
  postId,
  targetUserId,
  currentUserId,
  currentLikesArray,
  notificationId,
}) => {
  if (!currentUserId) return;

  const postRef = doc(db, "posts", postId);
  const notificationsRef = collection(db, "notifications");

  const existingLike = currentLikesArray?.find(
    (like) => like.userId === currentUserId
  );
  const isLiked = !!existingLike;

  try {
    if (isLiked) {
      const newLikesArray = currentLikesArray.filter(
        (like) => like.userId !== currentUserId
      );

      await updateDoc(postRef, {
        likes: newLikesArray,
      });

      if (notificationId) {
        const notificationRef = doc(db, "notifications", notificationId);
        await deleteDoc(notificationRef);
      }

      return false;
    } else {
      const newLikeObject = {
        userId: currentUserId,
        likedAt: Timestamp.now(),
      };

      await updateDoc(postRef, {
        likes: arrayUnion(newLikeObject),
      });

      if (targetUserId !== currentUserId) {
        await addDoc(notificationsRef, {
          targetUserId,
          currentUserId,
          postId,
          type: "like",
          time: Timestamp.now(),
        });
      }

      return true;
    }
  } catch (error) {
    console.error("Error en toggleLike:", error);
    throw error;
  }
};

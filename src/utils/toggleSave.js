import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "../hooks";

export const toggleSave = async ({
  postId,
  currentUserId,
  currentSavedArray,
}) => {
  if (!currentUserId) return;

  const postRef = doc(db, "posts", postId);

  const existingLike = currentSavedArray?.find(
    (like) => like.userId === currentUserId
  );
  const isSaved = !!existingLike;

  try {
    if (isSaved) {
      const newSavedArray = currentSavedArray.filter(
        (like) => like.userId !== currentUserId
      );

      await updateDoc(postRef, { saved: newSavedArray });

      return false;
    } else {
      const newSaveObject = {
        userId: currentUserId,
        savedAt: Timestamp.now(),
      };

      await updateDoc(postRef, { saved: arrayUnion(newSaveObject) });

      return true;
    }
  } catch (error) {
    console.error("Error en toggleSave:", error);
    throw error;
  }
};

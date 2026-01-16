import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function usePosts(db) {
    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      const ref = collection(db, "posts");
  
      const unsubscribe = onSnapshot(ref, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setPosts(data);
      });
  
      return () => unsubscribe();
    }, [db]);
  
    return posts;
  }
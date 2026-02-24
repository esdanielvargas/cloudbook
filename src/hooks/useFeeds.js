import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useFeeds(db) {
    const [feeds, setFeeds] = useState([]);
  
    useEffect(() => {
      const feedsRef = collection(db, "feeds");
  
      const unsubscribe = onSnapshot(feedsRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setFeeds(data);
      });
  
      return () => unsubscribe();
    }, [db]);
  
    return feeds;
  }
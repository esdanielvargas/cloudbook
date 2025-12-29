import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useMusic(db) {
    const [music, setMusic] = useState([]);
  
    useEffect(() => {
      const ref = collection(db, "music");
  
      const unsubscribe = onSnapshot(ref, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setMusic(data);
      });
  
      return () => unsubscribe();
    }, [db]);
  
    return music;
  }
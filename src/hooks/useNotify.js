import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useNotify(db) {
    const [notify, setNotify] = useState([]);
  
    useEffect(() => {
      const ref = collection(db, "notifications");
  
      const unsubscribe = onSnapshot(ref, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setNotify(data);
      });
  
      return () => unsubscribe();
    }, [db]);
  
    return notify;
  }
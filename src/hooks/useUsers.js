import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useUsers(db) {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      const ref = collection(db, "users");
  
      const unsubscribe = onSnapshot(ref, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setUsers(data);
      });
  
      return () => unsubscribe();
    }, [db]);
  
    return users;
  }
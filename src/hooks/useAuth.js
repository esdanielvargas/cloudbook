import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuth(db) {
  const [auth, setAuth] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setAuth(user);
      } else {
        setAuth(null);
      }
    });

    return () => unsubscribe();
  }, [db]);

  return auth;
}
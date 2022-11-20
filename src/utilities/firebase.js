import { useEffect, useState, useCallback } from "react";
// eslint-disable-next-line
import { getDatabase, onValue, ref, update, connectDatabaseEmulator } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  // eslint-disable-next-line
  connectAuthEmulator,
  // eslint-disable-next-line
  signInWithCredential
} from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBKQkh0ZXTaEpmxutNqBcLMycAtGAqh6v8",
  authDomain: "split-abdf6.firebaseapp.com",
  projectId: "split-abdf6",
  storageBucket: "split-abdf6.appspot.com",
  messagingSenderId: "770170660703",
  appId: "1:770170660703:web:13d5bdf85d6ee19facf8ea",
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

// if (import.meta.env.VITE_EMULATE){
//   firebaseConfig.databaseURL = "http://localhost:9000?ns=split-abdf6";
// }

// if (!window.EMULATION && import.meta.env.VITE_EMULATE) {
//   const authLocal = getAuth(firebase);
//   connectAuthEmulator(authLocal, "http://127.0.0.1:9099");
//   connectDatabaseEmulator(database, "127.0.0.1", 9000);

//   signInWithCredential(authLocal, GoogleAuthProvider.credential(
//     '{"sub": "	gS3OezlcsXuydxbalssanZix3pu5", "email": "Tester@gmail.com", "displayName":"Tester", "email_verified": true}'
//   ));

//   window.EMULATION = true;
// }

export const useDbData = (path) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  // Keep track of whether data from the database is being loaded or not
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    onValue(
      ref(database, path),
      (snapshot) => {
        setData(snapshot.val());
        setIsLoading(false);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
      }
    );
  }, [path]);

  return [data, error, isLoading];
};

const makeResult = (error) => {
  const timestamp = Date.now();
  const message =
    error?.message || `Updated: ${new Date(timestamp).toLocaleString()}`;
  return { timestamp, error, message };
};

export const useDbUpdate = (path) => {
  const [result, setResult] = useState();
  const updateData = useCallback(
    (value) => {
      update(ref(database, path), value)
        .then(() => setResult(makeResult()))
        .catch((error) => setResult(makeResult(error)));
    },
    [path]
  );
  return [updateData, result];
};

export const useAuthState = () => {
  const [user, setUser] = useState();

  useEffect(() => onAuthStateChanged(getAuth(firebase), setUser), []);

  return [user];
};

export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));
export { firebaseSignOut as signOut };

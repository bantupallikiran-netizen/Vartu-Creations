import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

let app;
let db: any = null;
let auth: any = null;
let useFirebase = false;

try {
  if (firebaseConfig && firebaseConfig.projectId && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    useFirebase = true;
    console.log("🔥 Firebase initialized successfully with Project ID:", firebaseConfig.projectId);
  } else {
    console.warn("⚠️ Firebase configuration is partial. The application will run in simulated mode, which persists data locally.");
  }
} catch (error) {
  console.error("⚠️ Failed to initialize Firebase:", error);
}

export { db, auth, useFirebase };

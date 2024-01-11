<<<<<<< HEAD
import {getApp, initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {Firestore, getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
=======
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {Firestore, getFirestore} from 'firebase/firestore';
import {getApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
>>>>>>> 527eb3c3b7469f99aea75ddd46d1de338b4a07ea

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
<<<<<<< HEAD
=======

>>>>>>> 527eb3c3b7469f99aea75ddd46d1de338b4a07ea
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const firebaseApp = getApp();
export const storage = getStorage(firebaseApp, 'gs://whatsurv-f25bc.appspot.com');

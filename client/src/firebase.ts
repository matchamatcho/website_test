// /src/firebase/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebaseの設定
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    
};

// Firebase初期化
const app = initializeApp(firebaseConfig);

// 認証とデータベースのインスタンス取得
const auth = getAuth(app);
const db = getFirestore(app);

// 必要なものをエクスポート
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
};

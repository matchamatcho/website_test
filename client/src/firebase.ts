import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// デバッグ用: APIキーが正しく読み込まれているか確認
console.log("API KEY:", import.meta.env.VITE_FIREBASE_API_KEY);

// Firebaseの設定
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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

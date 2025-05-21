// server/firebaseConfig.mjs
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const firebaseConfig = {
  credential: 'your-credential',
  databaseURL: 'your-database-url'
};

initializeApp(firebaseConfig);
const auth = getAuth();

export { auth };

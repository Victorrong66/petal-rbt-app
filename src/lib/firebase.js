import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace these with your Firebase project values.
// Get them at: https://console.firebase.google.com → Project Settings → Your apps
const firebaseConfig = {
  apiKey:            'AIzaSyBukvrmOojUHn3jt3A_dEWCWBrM72KHJ8A',
  authDomain:        'petal-robot.firebaseapp.com',
  projectId:         'petal-robot',
  storageBucket:     'petal-robot.firebasestorage.app',
  messagingSenderId: '319444354459',
  appId:             '1:319444354459:web:94fdf94bda84fc75ea0d3e',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

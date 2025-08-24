// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC2IMoKVBSJPHjZzNbgRXGd2vY1spLYevw',
  authDomain: 'glowy-1fce3.firebaseapp.com',
  projectId: 'glowy-1fce3',
  storageBucket: 'glowy-1fce3.appspot.com',
  messagingSenderId: '336906899478',
  appId: '1:336906899478:web:2659afea8d2cfd0f9f2537',
  measurementId: 'G-3KF5XQBHR9',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// export const analytics = getAnalytics(app);

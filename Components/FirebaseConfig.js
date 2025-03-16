import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAGbG82-NDA1rIurhXxO0Wuo3XSO_2B2Kk",
  authDomain: "pocketquill-34a0e.firebaseapp.com",
  projectId: "pocketquill-34a0e",
  storageBucket: "pocketquill-34a0e.appspot.com",
  messagingSenderId: "1085965804289",
  appId: "1:1085965804289:android:ccfc27675b19c2d0b1b100",
  measurementId: "G-4QD5S94734",
};

const firebaseApp = initializeApp(firebaseConfig);
console.log('Firebase initialized.');
export default firebaseApp;
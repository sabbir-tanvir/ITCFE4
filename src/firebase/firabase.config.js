// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBQikPuqEimH0CvCYUdo5KIGQpv2JKvBF8",
//   authDomain: "amader-shikkha-b725b.firebaseapp.com",
//   projectId: "amader-shikkha-b725b",
//   storageBucket: "amader-shikkha-b725b.firebasestorage.app",
//   messagingSenderId: "453372279508",
//   appId: "1:453372279508:web:ca7b2800966d4db5fb1941"
// };

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
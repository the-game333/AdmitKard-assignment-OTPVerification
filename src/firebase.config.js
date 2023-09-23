// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOwYMRRpdkolXG6OAcUs4uWM8W5DLMn_M",
  authDomain: "phoneauth-298e1.firebaseapp.com",
  projectId: "phoneauth-298e1",
  storageBucket: "phoneauth-298e1.appspot.com",
  messagingSenderId: "134360337762",
  appId: "1:134360337762:web:4154502be211496197b03b",
  measurementId: "G-DB122M83XV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

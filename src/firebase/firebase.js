import firebase from 'firebase';


// Init firebase with its config values to use in components
const firebaseConfig = {
  apiKey: "AIzaSyCrfpDgwgyytjZgmumksezryZk9dOl8xqY",
  authDomain: "timeu-b364a.firebaseapp.com",
  projectId: "timeu-b364a",
  storageBucket: "timeu-b364a.appspot.com",
  messagingSenderId: "750290647860",
  appId: "1:750290647860:web:16164e082adf6c84c00361",
  measurementId: "G-TN9TJW88SY"
};

const app = firebase.initializeApp(firebaseConfig);
export const db = app.firestore();
export const auth = app.auth();

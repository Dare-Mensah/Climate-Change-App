import firebase from "firebase/compat";
import {getDatabase} from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyDoGC35tPgtEOZNVCVnEJbN7kvtmWCxaB8",
    authDomain: "climatesenseapp.firebaseapp.com",
    databaseURL: "https://climatesenseapp-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "climatesenseapp",
    storageBucket: "climatesenseapp.appspot.com",
    messagingSenderId: "143888449873",
    appId: "1:143888449873:web:b8b260422227116171d370"
  };

  if (firebase.apps.length === 0)
  {
    firebase.initializeAppApp(firebaseConfig);
  }

  const db = getDatabase();


  export {db}
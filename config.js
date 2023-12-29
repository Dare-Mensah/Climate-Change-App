//firebase config key setup

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDoGC35tPgtEOZNVCVnEJbN7kvtmWCxaB8",
    authDomain: "climatesenseapp.firebaseapp.com",
    projectId: "climatesenseapp",
    storageBucket: "climatesenseapp.appspot.com",
    messagingSenderId: "143888449873",
    appId: "1:143888449873:web:b8b260422227116171d370"
  };
if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export {firebase};
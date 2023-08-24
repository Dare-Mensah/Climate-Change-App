//firebase config key setup

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig ={
    apiKey: "AIzaSyB5btue1mUuzSLy27OikIYcd5NmDqioT9s",
    authDomain: "climatesense-4328a.firebaseapp.com",
    projectId: "climatesense-4328a",
    storageBucket: "climatesense-4328a.appspot.com",
    messagingSenderId: "784192539470",
    appId: "1:784192539470:web:99181ee5a6ec17c605ec1f",
    measurementId: "G-W8ZW9WXN00"
}

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export {firebase};
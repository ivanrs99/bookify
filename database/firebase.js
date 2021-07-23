import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/firestore";
//import "firebase/database";
//import "firebase/functions";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC-X9oimb3vcO8aPDPKvsPvUOXKguEi_vM",
    authDomain: "bookify-3a1ae.firebaseapp.com",
    projectId: "bookify-3a1ae",
    storageBucket: "bookify-3a1ae.appspot.com",
    messagingSenderId: "964890520511",
    appId: "1:964890520511:web:914206003a01035865cf0a"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
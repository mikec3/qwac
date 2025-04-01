'use client'
import styles from "./page.module.css";
import { initializeApp } from "firebase/app";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";



export default function FirebaseLogin(props) {

    // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyDWQlpkmK9NOivqXBYLG4mk9RZ355y6MlI",
//     authDomain: "qwac-596f4.firebaseapp.com",
//     projectId: "qwac-596f4",
//     storageBucket: "qwac-596f4.firebasestorage.app",
//     messagingSenderId: "699247098366",
//     appId: "1:699247098366:web:f6b1aa41329064071f68af"
//   };
  
//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);

//   const auth = getAuth();

    // send email and password to server for Firebase Auth login
    const handleSubmit = (event) => {
        event.preventDefault();
        //console.log(event.target.email.value);
        //console.log(event.target.password.value);

        let email = event.target.email.value;
        let password = event.target.password.value;

        signInWithEmailAndPassword(props.auth, email, password)
        .then((response)=>{
            console.log('response from firebase')
            console.log(response);
        }).catch((error)=> {
            console.log(error);
        })

        
    }

  return (
    <div>
    <form className={styles.answerForm} onSubmit={handleSubmit}>
        <h3>Username</h3>
        <textarea className={styles.answerInput} type="text" name="email"></textarea>
        <h3>Password</h3>
        <textarea className={styles.answerInput} type="text" name="password"></textarea>
        <button className={styles.answerButton} type="submit"> Login </button>
    </form>
    </div>
  );
}
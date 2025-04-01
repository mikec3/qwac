'use client'
import styles from "./page.module.css";
import axios from 'axios'
import {emailSignIn, createUser} from './FirebaseDB'


export default function LoginCard(props) {

    // send email and password to server for Firebase Auth login
    const handleSubmit = async (event) => {
        event.preventDefault();
        //console.log(event.target.email.value);
        //console.log(event.target.password.value);
        let username = event.target.username.value;
        let email = event.target.email.value;
        let password = event.target.password.value;

        console.log(event.nativeEvent.submitter.name)

        if (event.nativeEvent.submitter.name == 'login') {
        let userResponse = await emailSignIn(email, password);
        //console.log(userResponse);
        props.loggedIn(userResponse);
        } else if (event.nativeEvent.submitter.name == 'signup') {
          console.log('do signup here!!!!!');
          let userResponse = await createUser(username, email, password);
          console.log('send userResponse back to page.js')
          console.log(userResponse);
          props.loggedIn(userResponse);
        }
    }

  return (
    <div>
    <form className={styles.answerForm} onSubmit={handleSubmit}>
        <h3>Username</h3>
        <textarea className={styles.answerInput} type="text" placeholder="Only needed during signup" name="username"></textarea>
        <h3>E-Mail</h3>
        <textarea className={styles.answerInput} type="text" placeholder="Required" name="email"></textarea>
        <h3>Password</h3>
        <textarea className={styles.answerInput} type="text" placeholder="Required" name="password"></textarea>
        <button className={styles.answerButton} type="submit" name="login"> Login </button>
        <button className={styles.answerButton} type="submit" name="signup"> Sign Up </button>
    </form>
    </div>
  );
}
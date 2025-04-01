'use client'
import {useState, useEffect} from 'react'
import styles from "./page.module.css";
import { addUIDToPendingConnections } from './FirebaseDB';


export default function AddConnection(props) {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target.email.value);
        // send currentUser's UID to the pending connections DB under desired friend's email
        addUIDToPendingConnections(props.currentUser.uid, e.target.email.value)
        props.toggleOff();
    }


  return (
    <div>
        <p>Enter the E-mail of your friend.</p>
        <p>Connection pending approval of other party.</p>
        <form className={styles.answerForm} onSubmit={handleSubmit}>
            <textarea className={styles.answerInput} type="text" name="email"></textarea>
            <button className={styles.answerButton} type="submit"> Add </button>
        </form>
    </div>
  );
}
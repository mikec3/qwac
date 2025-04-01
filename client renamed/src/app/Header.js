'use client'
import {useState, useEffect} from 'react'
import styles from "./page.module.css";
import { getQuestionOfTheDay, logOutAuth } from './FirebaseDB';
import LoginCard from './LoginCard';


export default function Header(props) {

    const ShowLoginButtonPressed = (e) => {
        e.preventDefault();
        props.triggerLogin(null);
    }

    const logoutButtonPressed = (e) => {
        e.preventDefault();
        logOutAuth();
        props.logout();
    }

    const AddConnectionButtonPressed = (e) => {
        e.preventDefault();
        //props.triggerLogin(null);
        props.addConnection();
    }


  return (
    <div className={styles.headerBar}>
        {props.user ? <button className={styles.loginButton} onClick={logoutButtonPressed} 
                                        type="submit" name="logout"> Logout </button>
                                        :
                                        <button className={styles.loginButton} onClick={ShowLoginButtonPressed} 
                                        type="submit" name="login"> Login </button>}
                {props.user && <button className={styles.loginButton} onClick={AddConnectionButtonPressed}
                                        name="addConnection"> Add Connection</button>}
    </div>
  );
}
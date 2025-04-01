'use client'
import {useState, useEffect} from 'react'
import styles from "./page.module.css";
import {getCurrentUsersConnections} from './FirebaseDB'


export default function Friends(props) {

    useEffect(()=> {
        getCurrentUsersConnections(props.currentUser);
    }, []);

    return (
      <div className={styles.page}>
        <div className={styles.main}>
        <p> feed </p>
        {props.currentUser.email}
        </div>
      </div>
    );
  
}
'use client'
import {useState, useEffect} from 'react'
import styles from "./page.module.css";
import axios from 'axios'
import { getQuestionOfTheDay } from './FirebaseDB';


export default function Questions() {

    const [question, setQuestion] = useState(null);

    useEffect(()=> {
    getQuestionOfTheDay()  
    .then((response) => {
        //console.log(JSON.stringify(response.data))
        //console.log(response.data)
        if (response.data != 'error') {
            // float parcel list up to parent component
            //props.floatParcelListUp(response.data);
            console.log(response);
            setQuestion(response.Question);
        }
    })
    .catch((error) => {
      console.log(error);
    });
}, []);

  return (
        <p className={styles.qText}> {question} </p>
  );
}
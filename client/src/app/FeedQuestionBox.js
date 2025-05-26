'use client'
import {useState, useEffect} from 'react'
import styles from "./page.module.css";
import { getQuestionByDate } from './FirebaseDB';

// build list of questionKeyDates then map FeedBoxes for each date
export default function FeedQuestionBox(props) {

    const [questionText, setQuestionText] = useState();

    // go get questionText from firebase and set QuestionText with result
    useEffect(()=> {
        getQuestionByDate(props.date).then(result=> {
            setQuestionText(result);
        })
    }, [])

    // once questionText has been set, display the question
    return ( 
        <div>
            {questionText && <h3>{questionText}</h3>}
        </div>
    )
}
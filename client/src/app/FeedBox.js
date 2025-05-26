'use client'
import {useState, useEffect} from 'react'
import styles from "./page.module.css";
import FeedQuestionBox from './FeedQuestionBox'
import { getCurrentUsersConnections } from './FirebaseDB';
import AnswersCard from './AnswersCard';


// displays question and answers starting with current user
export default function FeedBox(props) {

console.log(props.uidList)
    return ( 
        <div>
            <FeedQuestionBox date={props.date}/>
            {props.uidList.map(friendInfo=> {
                return (<AnswersCard key={friendInfo.UID.concat(props.date)} userInfo={friendInfo} date={props.date}/>)
            })}
        </div>
    )
}
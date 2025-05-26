'use client'
import {useState, useEffect} from 'react'
import styles from "./page.module.css";
import {getQuestionKeyDate, getCurrentUsersConnections} from './FirebaseDB'
import { listOfPastDates } from './Utils';
import FeedBox from './FeedBox';

// build list of questionKeyDates then map FeedBoxes for each date
export default function FeedCard(props) {

    const [questionKeyDateList, setQuestionKeyDateList] = useState(listOfPastDates(getQuestionKeyDate()));

    const [uidList, setUidList] = useState();

    useEffect(()=> {
        getCurrentUsersConnections(props.currentUser).then((result)=> {
            setUidList(result);
        })
    }, [])

    return ( <div>
        {uidList && questionKeyDateList.map(date=> {
            return (<FeedBox key={date} date={date} currentUser={props.currentUser} uidList={uidList}/>)
        })}
    </div>
    )
}

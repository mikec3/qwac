'use client'
import {useState, useEffect} from 'react'
import styles from "./page.module.css";
import { getFriendsResponses } from './FirebaseDB';


// recieve a single user info and date to get the user's answer to the question key
export default function AnswersCard(props) {

    const [userResponse, setUserResponse] = useState();

    // get user's answer to the date key
    useEffect(()=> {
        getFriendsResponses(props.userInfo.UID, props.date).then((result)=>{
            //console.log(result);
            if (typeof result != "undefined") {
                setUserResponse(result.Answer);
            }
        });
    }, [])

    return ( 
        <div>
            {userResponse && <p>{props.userInfo.Username}: {userResponse}</p>}
        </div>
    )
}
'use client'
import {useState, useEffect} from 'react'
import styles from "./page.module.css";
import {getCurrentUsersConnections, getCurrentUsersPendingConnections
        , getFriends, getQuestionKeyDate, getQuestionsFromDateList, acceptConnection} from './FirebaseDB'
import Questions from './Questions'
import { listOfPastDates } from './Utils';


export default function Feed(props) {

    const [connectionsList, setConnectionsList] = useState([]);
    const [feedList, setFeedList] = useState([]);
    const [questionKeyDate, setQuestionKeyDate] = useState();
    const [questionKeyDateList, setQuestionKeyDateList] = useState();
    const [questionList, setQuestionList] = useState();
    const [pendingRequests, setPendingRequests] = useState();

    useEffect(()=> {

        let dateList = listOfPastDates(getQuestionKeyDate());
        setQuestionKeyDateList(dateList);
        setQuestionKeyDate(getQuestionKeyDate());

        getQuestionsFromDateList(dateList).then((result)=>{
          setQuestionList(result);
        })

        // currently getCurrentUsersConnections returns a list of objects [{UID:234, Username: 'MikeCouch', Answers:20253101:'answer'}]
        // loop through date list and add each list into another array.
        let prelimFeedList = []       // initialize feedList
        for (let date of dateList) {
          //console.log(date);        // ex. '20253101'
          getCurrentUsersConnections(props.currentUser, [date]).then((result)=>{
            //console.log(result);
            prelimFeedList.push(result);
            setFeedList(prelimFeedList);
          })
        }


        // returns a list of objects [{UID:234, Username: 'MikeCouch', Answers:20253101:'answer'}]
        getCurrentUsersConnections(props.currentUser, dateList).then((result)=>{
          //console.log(result);
          setConnectionsList(result);
        })

        getCurrentUsersPendingConnections(props.currentUser).then((result)=>{
          //console.log(result);
          setPendingRequests(result);
        })

        // build a list of objects each key is a year from questionkeydatelist [{20250101: Question Text}]
    }, []);

    const addConnection = (e) => {
      e.preventDefault();
      // get id of accepted connection
      //console.log(e.nativeEvent.submitter.name);
      let acceptedUID = e.nativeEvent.submitter.name;
      // add acceptedUID to currentUser's connections array in db. Also will add currentUsers UID to requester's connections array.
      // and delete acceptedUID from currentUser's pending connections.
      acceptConnection(props.currentUser, acceptedUID)

      // remove acceptedUID from this component's pendingRequests list
      let newPendingRequests = pendingRequests.filter(friends => friends.UID !== acceptedUID);
      setPendingRequests(newPendingRequests);

    }

    console.log(connectionsList);
    console.log(feedList);
    console.log(questionList);
    let loopCounter = 0;
    return (
      <div className={styles.page}>
        <div className={styles.main}>
          {pendingRequests && pendingRequests.map((potential_friend) => {
            return (
              <form key={potential_friend.UID} onSubmit={addConnection}>
              <p name="Username" value={potential_friend.Username}>{potential_friend.Username}</p>
              <button type="submit" name={potential_friend.UID}>Add Friend</button>
              </form>
            )
          })}
        <h2> feed </h2>
        <p> Today's Question </p>
        <Questions/>
        
      {connectionsList.map((friend)=>{
        if (friend.Answers != null) {
          return (
            <p key={friend.UID}>{friend.Username}: {friend.Answers[questionKeyDate].Answer}</p>
          )}
      })}

      {feedList.map((date)=> {
        loopCounter = loopCounter + 1
       return [
        <p> {questionKeyDateList[loopCounter-1]}</p>,
        <p> {questionList[questionKeyDateList[loopCounter-1]]}</p>,
        date.map((friend)=>{
          if(friend.Answers != null && friend.Answers[questionKeyDateList[loopCounter-1]] != null) {
            return ([
              <p key={friend.UID}>{friend.Username}: {friend.Answers[questionKeyDateList[loopCounter-1]].Answer}</p>
            ]
            )
          }
        })]
      })}
        </div>
      </div>
    );
  
}

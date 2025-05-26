'use client'
import {useState, useEffect} from 'react'
import styles from "./page.module.css";
import axios from 'axios'
import {getCurrentUsersPendingConnections, acceptConnection} from './FirebaseDB'


export default function PendingConnections(props) {

    const [pendingRequests, setPendingRequests] = useState();

    useEffect(()=> {
        getCurrentUsersPendingConnections(props.currentUser).then((result)=>{
          console.log(result);
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

  return (
    <div>
    {pendingRequests && <h3> Connection Requests</h3>}
    {pendingRequests && pendingRequests.map((potential_friend) => {
        return (
          <form key={potential_friend.UID} onSubmit={addConnection}>
          <p name="Username" value={potential_friend.Username}>{potential_friend.Username}</p>
          <button type="submit" name={potential_friend.UID}>Add Friend</button>
          </form>
        )
      })}
      </div>
  );
}
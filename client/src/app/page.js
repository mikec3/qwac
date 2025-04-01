'use client'
import {useReducer, useState, useEffect} from 'react'
import Image from "next/image";
import styles from "./page.module.css";
import MyForm from './MyForm'
import Login from './Login'
import FirebaseLogin from './FirebaseLogin'
import LoginCard from './LoginCard'
import Questions from './Questions'
import Feed from './Feed'
import AddConnection from './AddConnection'
import { useSearchParams } from "next/navigation";
import {sendQuestionResponsetoDB, getCurrentUser } from './FirebaseDB';
import Header from './Header'

export default function Home() {
  //console.log('hello from page.js');

  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [questionResponse, setQuestionResponse] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showConnectionAdd, setShowConnectionAdd] = useState(false);

  useEffect(()=> {
    getCurrentUser().then((user)=> {
      console.log('current user: ' + user)
      setCurrentUser(user);
    });

  }, []);

  const loggedIn = (userResponse) => {
   //console.log(userResponse);
    setCurrentUser(userResponse);
    // if user answers the question, then there's a response, otherwise they hit the login button directly.
    // only send a response to the question if it's been set. TODO prevent overwriting an already sent response.
    if(questionResponse != null) {sendQuestionResponsetoDB(userResponse, questionResponse)};
    setIsQuestionAnswered(false);
  }


  const logout = ()=> {
    //auth.signOut();
    console.log('logout button pressed')
    setCurrentUser(null);
  }

  const addConnection = () => {
    console.log('add a connection!');
    setShowConnectionAdd(true);
  }

  const toggleOffAddConnection = () => {
    setShowConnectionAdd(false);
  }

  const qAnswered = (response) => {
    console.log(response);
    setIsQuestionAnswered(true);
    setQuestionResponse(response);
  }
  
console.log(currentUser);
  if (currentUser == null) {
    return (
      <div className={styles.page}>
        <Header user={currentUser} logout={logout} triggerLogin={qAnswered} addConnection={addConnection}/>
        <div className={styles.main}>
          {!isQuestionAnswered && <Questions/>}
          {!isQuestionAnswered &&<MyForm onSubmit={qAnswered}/>}
          {isQuestionAnswered && <LoginCard loggedIn={loggedIn}/>}
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.page}>
                        {showConnectionAdd && <AddConnection toggleOff={toggleOffAddConnection} currentUser={currentUser}/>}
                <Header user={currentUser} logout={logout} triggerLogin={qAnswered} addConnection={addConnection}/>
        <div className={styles.main}>
          <Feed currentUser={currentUser}/>
        </div>
      </div>
    );
  }

 
}

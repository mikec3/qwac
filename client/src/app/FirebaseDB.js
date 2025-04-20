import { initializeApp } from 'firebase/app';
import {getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, connectFirestoreEmulator} from 'firebase/firestore'
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, connectAuthEmulator} from 'firebase/auth'
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDWQlpkmK9NOivqXBYLG4mk9RZ355y6MlI",
        authDomain: "qwac-596f4.firebaseapp.com",
        projectId: "qwac-596f4",
        storageBucket: "qwac-596f4.firebasestorage.app",
        messagingSenderId: "699247098366",
        appId: "1:699247098366:web:f6b1aa41329064071f68af"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore(app);

    if (window.location.hostname.includes('localhost')) {
        console.log("currently running on localhost");
       // auth.useEmulator("http://127.0.0.1:9099");
       // db.useEmulator("127.0.0.1", 8080);
       connectAuthEmulator(auth, 'http://localhost:9099/')
       connectFirestoreEmulator(db, 'localhost', 8080);
      }

    const createUser = async (username, email, password) => {
        const createUserResult = await createUserWithEmailAndPassword(auth, email, password)
        console.log(createUserResult)
        const setUserNameResult = await setUsernameByUID(createUserResult.user.uid, username);
        console.log(setUserNameResult);
        return createUserResult.user;
    }

    const getCurrentUser = async () => {
        return auth.currentUser;
    }

    const logOutAuth = async () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            return null;
          }).catch((error) => {
            // An error happened.
          });
    }

    // get current user's connection's UID
    const getCurrentUsersConnections = async (currentUser, questionKeyDateList) => {
        console.log(currentUser.uid);

        // store the UID and usernames of all connections/friends
        let returnList = [];

        const docRef = doc(db, "Users", currentUser.uid);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            let results = docSnap.data();
            console.log("Document data:", docSnap.data());
            // work with connections
            if (results.Connections.length >= 1) {
                console.log(results.Connections);
                // add currentUser to array so that we see our responses too
                let allUIDs = results.Connections;
                allUIDs.unshift(currentUser.uid); // adds UID to front of array
                for (let friendUID of allUIDs) {
                    console.log(friendUID);
                    // get friend's username
                    let connectionUsername = await getUserNameByUID(friendUID);
                    let questionKey = questionKeyDateList[0];
                    let connectionResponses = await getFriendsResponses(friendUID, questionKey);
                    returnList.push({"UID": friendUID, 
                        "Username": connectionUsername, 
                        "Answers": connectionResponses
                    })
                }
            }
        
        } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        }

        return returnList;
    }

    const getFeedList = async (currentUser, questionKeyDateList) => {
        console.log(currentUser.uid);

        // store the UID and usernames of all connections/friends
        let returnList = [];

        const docRef = doc(db, "Users", currentUser.uid);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            let results = docSnap.data();
            console.log("Document data:", docSnap.data());
            // work with connections
            if (results.Connections.length >= 1) {
                console.log(results.Connections);
                // add currentUser to array so that we see our responses too
                let allUIDs = results.Connections;
                allUIDs.unshift(currentUser.uid); // adds UID to front of array
                for (let friendUID of allUIDs) {
                    console.log(friendUID);
                    // get friend's username
                    let connectionUsername = await getUserNameByUID(friendUID);
                    let questionKey = questionKeyDateList[0];
                    let connectionResponses = await getFriendsResponses(friendUID, questionKey);
                    returnList.push({"UID": friendUID, 
                        "Username": connectionUsername, 
                        "Answers": connectionResponses
                    })
                }
            }
        
        } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        }

        return returnList;
    }

    const addUIDToPendingConnections = async (currentUserUID, desiredFriendEmail) => {
        const docRef = doc(db, "Pending Connection Requests", desiredFriendEmail);
        // Atomically add a new UID to the currentUser's connections array field.
        await updateDoc(docRef, {
            Requester_ID: arrayUnion(currentUserUID)
        });
    }

    // get current user's pending connection requests
    const getCurrentUsersPendingConnections = async (currentUser) => {
        // lookup pending requests on email currentUser.email
        const docRef = doc(db, "Pending Connection Requests", currentUser.email);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {
            console.log(docSnap.data());
            // build an array to hold usernames and UIDs of pending connections
            let returnArrayOfPendingCon = [];
            for (let uid of docSnap.data().Requester_ID) {
                // loop through UIDs of pending requests
                let username = await getUserNameByUID(uid);
                returnArrayOfPendingCon.push({
                    Username: username,
                    UID: uid
                    })
            }
            return returnArrayOfPendingCon;
        } else {
            //console.log(currentUser.email + " has no pending connection requests");
        }
    }

    // add acceptedUID to currentUser's connections array in db. Also will add currentUsers UID to requester's connections array.
    // and delete acceptedUID from currentUser's pending connections.
    const acceptConnection = async (currentUser, acceptedUID) => {
        addUIDToConnections(currentUser.uid, acceptedUID);
        addUIDToConnections(acceptedUID, currentUser.uid);  // do the inverse (add currUser to requester's list)
        removeUIDfromPendingRequests(currentUser.email, acceptedUID);
    }

    const addUIDToConnections = async (currentUserUID, acceptedUID) => {
        console.log(currentUserUID);
        const docRef = doc(db, "Users", currentUserUID);
        // Atomically add a new UID to the currentUser's connections array field.
        await updateDoc(docRef, {
            Connections: arrayUnion(acceptedUID)
        });
    }

    const removeUIDfromPendingRequests = async (currentUserEmail, acceptedUID) => {
        const docRef = doc(db, "Pending Connection Requests", currentUserEmail);

        await updateDoc(docRef, {
            Requester_ID: arrayRemove(acceptedUID)
        })
    }


    // return an object {20250202: "response_text"}
    const getFriendsResponses = async (friendUID, questionKey) => {
        
        const docRef = doc(db, "Users", friendUID, "Answers", questionKey)
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            // work with answers
            let response = docSnap.data();
            return {[questionKey]: response}
        } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        }
    }

    const setUsernameByUID = async (UID, username) => {
        const docRef = doc(db, "Users", UID);
        const result = await setDoc(docRef, {Connections: [], Username: username})
       // console.log(result);
       // console.log('did username get set???'); // I'm not getting any kind of message, but it's working
        return result;
    }

    // pass in a users UID, get back their username
    const getUserNameByUID = async (UID) => {
        const docRef = doc(db, "Users", UID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let results = docSnap.data();
            //console.log(results.Username);
            return results.Username;
        }
    }

    const emailSignIn = async (email, password) => {
        //console.log(email);
        let userResponse = await signInWithEmailAndPassword(auth, email, password);
        //console.log(userResponse);
        return userResponse.user;

    }

    const getQuestionOfTheDay = async () => {

        // create the question key from today's date.
        let questionKey = getQuestionKeyDate();

        const docRef = doc(db, "QUESTIONS", questionKey);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return {"questionKey": questionKey, "Question":docSnap.data().Question};
        } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        }
    }

    // return a list of questions from a datelist array [20253003:{Question: 'Mar 30th questionayy'}, 202...]
    const getQuestionsFromDateList = async (dateList) => {
        let returnObject = {};
        for (let questionKey of dateList) {
            const docRef = doc(db, "QUESTIONS", questionKey);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
           // return {"questionKey": questionKey, "Question":docSnap.data().Question};
            //returnObject.push({[questionKey]: docSnap.data().Question})
            returnObject[questionKey] = docSnap.data().Question;
            } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            }
        }
        return returnObject;
    }
        

    const sendQuestionResponsetoDB = async (user, answer) => {
        console.log(user);
        // get questionKey
        let questionKey = getQuestionKeyDate();

        // Add a new document in collection "cities"
        await setDoc(doc(db, "Users", user.uid, "Answers", questionKey), {
            Answer: answer
        }).then((response) => {
            console.log(response);
        }).catch((error)=> {
            console.log(error);
        })
    }

    const getQuestionKeyDate = () => {
            // get today's date for the question Key
            let todayDate = new Date();
            let dayOfMonth = todayDate.getDate();
            if (dayOfMonth<10) {dayOfMonth = "0".concat(dayOfMonth)}
            let month = todayDate.getMonth()+1; // increment because Jan = 0
            if (month < 10) {month = "0".concat(month)}
            let questionKey = todayDate.getFullYear().toString().concat(dayOfMonth, month);
            //console.log(questionKey);
            return questionKey;
    }

    export {
        addUIDToPendingConnections
        , getCurrentUsersConnections
        , getCurrentUsersPendingConnections
        , getFriendsResponses
        , emailSignIn
        , getQuestionOfTheDay
        , getQuestionsFromDateList
        , sendQuestionResponsetoDB
        , getQuestionKeyDate
        , createUser
        , getCurrentUser
        , logOutAuth
        , acceptConnection
    }
// server/index.js

const express = require("express");
const path = require('path');
const bodyParser = require("body-parser")
require('dotenv').config();
const http = require('http');


// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
// const { getAuth, createUser, updateProfile, verifyIdToken } = require("firebase-admin/auth");


const PORT = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);

// using this for reading webhook and api posts
app.use(bodyParser.json())

// Have Node serve the files for our built React app
//app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


  // Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const {getFirestore, doc, getDoc} = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// get credentials from FireBase, place in .env file without whitespace.
const firebaseConfig = JSON.parse(process.env.fireBaseCredentials);

// Initialize Firebase
const fb = initializeApp(firebaseConfig);


app.post("/api/loginWithEmail", async function(req, res) {
    const auth = getAuth();
    console.log(req.body);
    signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((response)=>{
        console.log('response from firebase .user')
        console.log(response);
        res.json(response);
    }).catch((error)=> {
        console.log(error);
    })
});

app.get("/api/getQuestionOfTheDay", async function(req, res) {
    const db = getFirestore(fb);
    console.log('todays date' + ' ' + new Date());
    const docRef = doc(db, "QUESTIONS", "20250125");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    res.json(docSnap.data());
    } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    }
})


// firebase admin key is saved in .env file all whitespace line breaks was erased so that the .env reads it as one continuous string
//const serviceAccount = JSON.parse(process.env.fireBaseAdminKey);

// initializeApp({
//   credential: cert(serviceAccount)
// });



// Initialize Firebase Authentication and get a reference to the service
//const auth = getAuth();

// Initialize Firebase Firestore and get a reference to the service
//const db = getFirestore();

// // api for creating an account, send email & password to firebase, returns user
// app.post("/api/createAccount", async function(req, res){
// 	console.log('api/createAccount has been called');

// let firebaseResponse = await sendAccountToFirebase(req.body.email, req.body.password);
// console.log(firebaseResponse);
// res.json(firebaseResponse);
// });

// app.post("/api/loginWithEmail", async function(req, res) {
//     console.log(req.body);
// })

// const sendAccountToFirebase = (email, password) => {
// 	console.log('sending created email/password account to Firebase');

// 	console.log([email, password]);

// 	return auth.createUser({email: email, password: password})
// 	  .then((userCredential) => {
// 	    // Signed in 
// 	    console.log(userCredential);
// 	    return userCredential;
// 	    // ...
// 	  })
// 	  .catch((error) => {
// 	  	// TODO return something so the front end can handle errors
// 	  	console.log(error);
// 	    const errorCode = error.code;
// 	    const errorMessage = error.message;
// 	    // ..
// 	  });
// }

// // api for updating user theme
// app.post("/api/updateUserTheme", async function(req, res) {
// 	console.log('api/updateUserTheme called');

// 	// validate token
// 	auth.verifyIdToken(req.body.user.stsTokenManager.accessToken)
// 	.then((decodedToken)=> {
// 		//console.log(decodedToken.uid);

// 		// set db users/{uid}/theme
// 		uploadUserTheme(decodedToken.uid, req.body.theme)
// 		.then((response)=> {
// 			res.json(response);
// 		});
// 	})
// 	.catch((error)=> {
// 		console.log(error);
// 		res.json(error);
// 	})

// 	// return new theme or success message
// });

// const uploadUserTheme = async function (uid, theme) {

// 	const docRef = db.collection('users').doc(uid);

// 	docRef.set({theme: theme})
// 	.then(result => {
// 		console.log(result);
// 		// return the theme if write was successful
// 		return theme;
// 	}).catch(error => {
// 		console.log(error);
// 		return error;
// 	})
// };

// // api for getting user theme
// app.post("/api/getUserTheme", async function(req, res) {
// 	console.log('api/getUserTheme called');
// 	auth.verifyIdToken(req.body.user.stsTokenManager.accessToken)
// 	.then((decodedToken)=> {
// 		// get and return theme
// 		const docRef = db.collection('users').doc(decodedToken.uid);
// 		docRef.get()
// 		.then(result=>{
// 			// if there's a result, pass it back to client, otherwise pass null
// 			if (result.data()) {
// 				console.log(result);
// 				console.log(result.data().theme);
// 				res.json(result.data().theme);
// 			} else {
// 				res.json();
// 			}
// 		})
// 		.catch(error=>{
// 			console.log(error);
// 			res.json(error)
// 		})
// 	})
// 	.catch(error => {
// 		console.log(error);
// 		res.json(error);
// 	})
// })

// All other GET requests not handled before will return our React app
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
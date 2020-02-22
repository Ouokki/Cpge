const functions = require('firebase-functions');
const {getALLscreams , postOneScream}=require('./handlers/scream');
const {FBAuth}=require('./util/FBAuth');
const {signUp}=require('./handlers/signup');
const {login}=require('./handlers/login');
const {admin,db}=require('./util/admin');

const app=require('express')();
const firebaseConfig = {
  apiKey: "AIzaSyCURMxlNoDObmnMMOlsAAjY3pSrNxjEpB0",
  authDomain: "cpge-app.firebaseapp.com",
  databaseURL: "https://cpge-app.firebaseio.com",
  projectId: "cpge-app",
  storageBucket: "cpge-app.appspot.com",
  messagingSenderId: "291077683094",
  appId: "1:291077683094:web:d56b07afeb3775be444fb7",
  measurementId: "G-RMNR7HP0GE"
};
const firebase=require('firebase');
firebase.initializeApp(firebaseConfig);
// Scream routes
app.get('/screams',getALLscreams);
app.post('/scream',FBAuth,postOneScream);
// POST a scream
// Login and registration routes 
app.post('/SignUp',signUp);
app.post('/login',login);
exports.api=functions.region('europe-west1').https.onRequest(app);
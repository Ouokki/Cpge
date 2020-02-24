const functions = require('firebase-functions');
const {getALLscreams , postOneScream}=require('./handlers/scream');
const {FBAuth}=require('./util/FBAuth');
const {signUp,login,uploadImage}=require('./handlers/users');
const {admin,db}=require('./util/admin');
const {firebaseConfig}=require('./util/config');
const app=require('express')();
const firebase=require('firebase');


firebase.initializeApp(firebaseConfig);
// Scream routes
app.get('/screams',getALLscreams);
app.post('/scream',FBAuth,postOneScream);
// Login and registration routes 
app.post('/SignUp',signUp);
app.post('/login',login);
app.post('/user/image',FBAuth,uploadImage)

exports.api=functions.region('europe-west1').https.onRequest(app);
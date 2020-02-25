const functions = require('firebase-functions');
const {getALLscreams,postOneScream,getScream,commentOnscream,likeScream,unlikeScream,deleteScream}=require('./handlers/scream');
const {FBAuth}=require('./util/FBAuth');
const {signUp,login,uploadImage,addUserdetails,getAuthenticatedUser}=require('./handlers/users');

const {firebaseConfig}=require('./util/config');
const app=require('express')();
const firebase=require('firebase');
firebase.initializeApp(firebaseConfig);

// A Scream is a Post 
// Get all screams
app.get('/screams',getALLscreams);
// Post a scream 
app.post('/scream',FBAuth,postOneScream);
// Get a scream 
app.get('/scream/:screamId',getScream);
// Delete a scream
app.delete('/scream/:screamId',FBAuth,deleteScream);
// Commenting on a scream
app.post('/scream/:screamId/comment',FBAuth,commentOnscream);
//Like a scream 
app.get('/scream/:screamId/like',FBAuth,likeScream);
//Unlike a scream
app.get('/scream/:screamId/unlike',FBAuth,unlikeScream);

//Users
app.post('/user/image',FBAuth,uploadImage);
app.post('/user',FBAuth,addUserdetails);
app.get('/user',FBAuth,getAuthenticatedUser);
// Login and registration routes 
app.post('/SignUp',signUp);
app.post('/login',login);



exports.api=functions.region('europe-west1').https.onRequest(app);
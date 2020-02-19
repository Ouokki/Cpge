const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

admin.initializeApp({
  credential: admin.credential.cert(require('./keys/admin.json'))
});
const express=require('express');
const app = express();

app.get('/screams',(req,res)=>{
  admin.firestore().collection('screams').orderBy('createdAt','desc').get()
       .then(data => {
         let screams=[];
         data.forEach(doc=>{
           screams.push({
             screamId : doc.id,
             body:doc.data().body,
             userHandle:doc.data().userHandle,
             createdAt:doc.data().createdAt,
           });
         });
         return res.json(screams);
       })
       .catch(err=>{console.error(err)});
})

app.post('/scream',(req,res)=>{
  const newScream={
    body : req.body.body,
    userHandle : req.body.userHandle,
    createdAt:new Date().toISOString()};
  admin.firestore().collection('screams')
       .add(newScream)
       .then(doc=>{
         res.json({message : 'The scream was created Successufly'});
       })
       .catch(err=>{
         res.status(500).json({error:'something went wrong'});
         console.log(err);
       });
});
//https://apidatabase/api/....
exports.api=functions.region('europe-west1').https.onRequest(app);
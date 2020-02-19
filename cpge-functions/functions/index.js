const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

admin.initializeApp({
  credential: admin.credential.cert(require('./keys/admin.json'))
});
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello World");
 });
exports.getScreams=functions.https.onRequest((req,res)=>{
  admin.firestore().collection('screams').get()
       .then(data => {
         let screams=[];
         data.forEach(doc=>{
           screams.push(doc.data());
         });
         return res.json(screams);
       })
       .catch(err=>{console.error(err)});
});
exports.createScreams=functions.https.onRequest((req,res)=>{
  const newScream={
    body : req.body.body,
    userHandle : req.body.userHandle,
    createdAt:admin.firestore.Timestamp.fromDate(new Date())};
  admin.firestore().collection('screams')
       .add(newScream)
       .then(doc=>{
         res.json({message : 'document ${doc.id} created Successufly'});
       })
       .catch(err=>{
         res.status(500).json({error:'something went wrong'});
         console.log(err);
       });
});
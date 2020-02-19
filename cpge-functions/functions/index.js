const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(require('./keys/admin.json'))
});
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
// SIGNUP 
app.post('/SignUp',(req,res)=>{
  const newUser={
    email:req.body.email,
    password:req.body.password,
    confirmPassword:req.body.confirmPassword,
    handle:req.body.handle,
  };
  //TODO
  firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
  .then((data)=>{
    return res
    .status(201)
    .json({message:'User created successfuly'});
  })
  .catch((err)=>{
    console.log(err);
    return res.status(500).json({error:err.code});
  });
});
exports.api=functions.region('europe-west1').https.onRequest(app);
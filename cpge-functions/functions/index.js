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
const db = admin.firestore();

app.get('/screams',(req,res)=>{
  db.collection('screams').orderBy('createdAt','desc').get()
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
    db.collection('screams')
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
  //TODO Validate Data
  let token , userId;
  db.doc('/users/'+newUser.handle).get()
    .then(doc=>{
      if(doc.exists){
        return res.status(400).json({message:'User handler already taken'})
      }else{
        return firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password);
      }
    })
    .then(data=>{
      userId=data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken)=>{
      token =idToken;
      const userCredentials ={
        handle : newUser.handle,
        email : newUser.email,
        createdAt : new Date().toISOString(),
        userId
      };
      return db.doc('/users/'+newUser.handle).set(userCredentials);
    })
    .then(()=>{
      return res.status(201).json({token});
    })
    .catch(err=>{
      console.log(err);
      if(err.code==='auth/email-already-in-use'){
        return res.status(400).json({message:'The email is already in use'})
      }else{
        return res.status(500).json({error:err.code});
      }
      
    })
  
});
exports.api=functions.region('europe-west1').https.onRequest(app);
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
});
// POST a scream
const FBAuth =(req,res,next)=>{
  let idToken;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
      idToken=req.headers.authorization.split('Bearer ')[1];
  }else {
    console.error("no token found");
    return res.status(403).json({error:'Unauthorized'});
  }
  admin.auth().verifyIdToken(idToken)
  .then((decodedToken)=>{
    req.user=decodedToken;
    console.log(decodedToken);
    return db.collection('users')
    .where('userId','==',req.user.uid)
    .limit(1)
    .get();
  })
  .then((data)=>{
    req.user.handle=data.docs[0].data().handle;
    return next();
  })
  .catch((err)=>{
    console.error("Error while verifying token",err);
    return res.status(400).json(err);
  })
};
app.post('/scream',FBAuth,(req,res)=>{
  const newScream={
    body : req.body.body,
    userHandle : req.user.handle,
    createdAt:new Date().toISOString()};
    db.collection('screams')
       .add(newScream)
       .then(doc=>{
         res.json({message : 'The scream was created Successufly'});
       })
       .catch(err=>{
          console.log(err);
          return res.status(500).json({error:'something went wrong'});
         
       });
});
const isEmpty =  (string)=>{
  if(string.trim()==='') return true;
  else return false ;
}
const isEmail = (email)=>{
  const regEx=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true ;
  else return false ;
}
// SIGNUP Route 
app.post('/SignUp',(req,res)=>{
  const newUser={
    email:req.body.email,
    password:req.body.password,
    confirmPassword:req.body.confirmPassword,
    handle:req.body.handle,
  };
  let errors ={};
  if(isEmpty(newUser.email)){
    errors.email='Must not be empty';
  }else if(!isEmail(newUser.email)){
    errors.email='It must be a validate email';
  }
  if(isEmpty(newUser.password)) errors.password='Must be not empty';
  if(newUser.password!==newUser.confirmPassword) errors.password='Password and Confrim password must match';
  if(isEmpty(newUser.handle)) errors.handle='Must be not empty';
  if(Object.keys(errors).length>0) return res.status(400).json(errors);
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
//LOGIN Route 
app.post('/login',(req,res)=>{
  const userCredentials={
    email:req.body.email,
    password:req.body.password,
  };
  let errors={};
  if(isEmpty(userCredentials.password)) errors.password='Must be not empty';
  if(isEmpty(userCredentials.email)) errors.email='Must be not empty';
  if(Object.keys(errors).length>0) return res.status(400).json(errors);
  firebase
  .auth()
  .signInWithEmailAndPassword(userCredentials.email,userCredentials.password)
  .then((data)=>{
    return data.user.getIdToken();
  })
  .then((token)=>{
    return res.json({token});
  })
  .catch((err)=>{
    console.log(err);
      if(err.code==='auth/wrong-password' || err.code==='auth/user-not-found'){
        return res.status(400).json({message:'Wrong credentials , please sign up'})
      }else{
        return res.status(500).json({error:err.code});
      }
  });
});
exports.api=functions.region('europe-west1').https.onRequest(app);
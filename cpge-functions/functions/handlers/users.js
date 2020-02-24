const {admin,db}=require('../util/admin');
const {firebaseConfig}=require('../util/config');
const firebase=require('firebase');
const isEmpty =  (string)=>{
    if(string.trim()==='') return true;
    else return false ;
  }
const isEmail = (email)=>{
    const regEx=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true ;
    else return false ;
  }

exports.signUp=(req,res)=>{
    const newUser={
      email:req.body.email,
      password:req.body.password,
      confirmPassword:req.body.confirmPassword,
      handle:req.body.handle,
    };
    const noImg='no-img.png';
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
          imageUrl:'https://firebasestorage.googleapis.com/v0/b/'+firebaseConfig.storageBucket+'/o/'+noImg+'?alt=media',
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
  }
exports.login=(req,res)=>{
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
  }

exports.uploadImage=(req,res)=>{
    const BusBoy=require('busboy');
    const path =require('path');
    const os = require('os');
    const fs =require('fs');
    const busboy=new BusBoy({headers:req.headers});
    let imageFileName;
    let imageToBeUploaded={};
    busboy.on('file',(fieldname,file,filename,encoding,mimetype)=>{
        //my.image.png
        const imageExtension= filename.split('.')[filename.split('.').length - 1];
        //123123123123123123.png
        imageFileName=Math.round(Math.random()*10000000000000)+'.'+imageExtension;
        const filepath=path.join(os.tmpdir(),imageFileName);
        imageToBeUploaded={filepath,mimetype};
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish',()=>{
        admin.storage()
        .bucket(firebaseConfig.storageBucket).upload(imageToBeUploaded.filepath,{
            resumable:false,
            metadata:{
                metadata:{
                    contentType:imageToBeUploaded.mimetype
                }
            }
        })
        .then(()=>{
          const imageUrl='https://firebasestorage.googleapis.com/v0/b/'+firebaseConfig.storageBucket+'/o/'+imageFileName+'?alt=media';
          return db.doc('/users/'+req.user.handle).update({imageUrl});
        })
        .then(()=>{
            return res.json({message:'Image uploaded successfuly'});
        })
        .catch(err=>{
            console.log(err);
            return res.status(500).json({error:err.code});
        })
    })
    busboy.end(req.rawBody);
    
}
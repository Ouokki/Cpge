const {db}=require('../util/admin');
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
  }
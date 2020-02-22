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
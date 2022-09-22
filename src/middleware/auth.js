const jwt=require("jsonwebtoken");
const Register=require('../models/registers');


const auth=async(req,res, next)=>{
    try{
        const token=req.cookies.jwt;   //token which are present in pc 
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY);
        console.log(verifyUser);
        
        const user= await Register.findOne({_id:verifyUser.id});
        console.log(user);// document
        
        
        // for logout purpose
        req.token=token; // token in store cookeins
        req.user=user;  //document

        next(); //its go back ....if we not use next never go back
    }catch(error){
        res.status(401).send(error);
    } 

}

module.exports=auth;
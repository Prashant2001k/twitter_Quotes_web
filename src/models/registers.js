const mongoose =require("mongoose");
const bcrypt=require("bcryptjs");
const jwt =require('jsonwebtoken')
// console.log("i am in register js");
const employeeSchema= new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


//generating tokens
employeeSchema.methods.generateAuthToken=async function(){
    try{
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(error){
        res.send("The error part"+ error);
        console.log("the error part "+error);
    }
}


// middle way before save
employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
     
        this.password=await bcrypt.hash(this.password,10);
        this.confirmpassword=this.password;
        
        next();
    }
})

const Register= new mongoose.model("Register",employeeSchema);
module.exports=Register;
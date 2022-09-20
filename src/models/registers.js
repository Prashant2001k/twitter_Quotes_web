const mongoose =require("mongoose");
const bcrypt=require("bcryptjs");
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
    }
})


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
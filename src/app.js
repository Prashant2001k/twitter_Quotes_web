require('dotenv').config();//
const express =require("express");
const app =express();
const path=require("path");
const hbs=require("hbs");
const bcrypt=require("bcryptjs");
const cookieParser=require("cookie-parser"); //
require("./db/conn");
const Register=require('./models/registers')
const jwt=require("jsonwebtoken");
const auth=require("./middleware/auth");
const port=process.env.PORT || 3001;

const static_path=path.join(__dirname,"../public");
const templates_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");
app.use(express.json());
app.use(express.urlencoded({extended:false})); 


app.use(express.static(static_path));

app.set("view engine","hbs");
app.set("views",templates_path);

hbs.registerPartials(partials_path); 
app.get("/index",auth,(req,res)=>{
    // res.send("<h1>hello this is our Home Page</h1>");
    res.render("index");
}) 

app.get("/",(req,res)=>{
    // res.send("<h1>hello this is our Home Page</h1>");
    res.render("login");
}) 
 
app.get("/login",(req,res)=>{
    // res.send("<h1>hello this is our Home Page</h1>");
    res.render("login");
}) 

app.get("/register",(req,res)=>{
    // res.send("<h1>hello this is our Home Page</h1>");
    res.render("register");
}) 

//create a new user in our database
app.post("/register",async(req,res)=>{
   try{
        // console.log(req.body.fullname); 
        // res.send(req.body.fullname); 
        const password=req.body.password;
        const cpassword=req.body.Confirmpassword;
        // re.send(`${password}  ${cpassword} `);
        
        if(password== cpassword){
            // res.send(cpassword); 
            const registerEmployee = new Register({
                
                fullname :req.body.fullname,
                email:req.body.email,
                password:password,
                confirmpassword:cpassword,
                // fullname :"Prashant",
                // email:"pkg@gmail.com",
                // password:"1234",
                // confirmpassword:"1234",
            })


            const token=await registerEmployee.generateAuthToken();
            res.cookie("jwt",token,{
                expires:new Date(Date.now()+300000),
                httpOnly:true, 
                secure:true 
            })

            const registered= await registerEmployee.save();
            console.log(registered);
            res.status(201).render("index");
        }
        else{
            res.send("passwords are not matching");
        }

   }catch(error){  
        res.send(400).send("error");
   }
}) 
 


// login check
app.post("/login",async(req,res)=>{
    try {
        const email=req.body.emailaddress;
        const password=req.body.password;
        // console.log(`${email} + ${password}`);
        
        const useremail= await Register.findOne({email:email});
        const ismatch= await bcrypt.compare(password,useremail.password);

        const token=await useremail.generateAuthToken();
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+300000),
            httpOnly:true,
            secure:true 
        })


        if(ismatch){
            // res.send(useremail); 
            res.status(201).render("index");
        }else{
            res.send("invalid login Detials ");
        }
    } catch (error) {
        res.status(400).send("invalid login Details");
    } 
})

  
app.listen(port,()=>{
    console.log(`successfully Work! on Port : ${port}`);
})     
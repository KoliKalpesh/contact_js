import express from "express";
import path from "path";

import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


//mongo db
mongoose
    .connect("mongodb://127.0.0.1:27017", {
        dbName: "backend",
    })
    .then(() => console.log("db connected"));
//schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password:String,
});

//document create
const User = mongoose.model("User", userSchema);

// /creating server/
const app = express();
//array users

//using middlewares
//static folder serve publickly
app.use(express.static(path.join(path.resolve(), "public")));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//setting engine as it is
app.set("view engine", "ejs");


//made  middleware to check token exist or not for login and logout
const isAuthenticated = async(req,res,next)=>{
    //dedtructure
    const { token } = req.cookies;
    if (token) {
        const decoded = jwt.verify(token,"fhdsklgfknbl");

        req.user =await User.findById(decoded._id)
        next();
    } else {
        res.redirect("/login")
    }

}

//creating routes
app.get("/",isAuthenticated, (req, res) => {
    
    res.render("logout",{name:req.user.name});
    
});

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/register", (req, res) => {
    
    res.render("register");
    
});



//cookie store
app.post("/login",async(req,res)=>{
    const {email,password} = req.body;

    let user =await User.findOne({email});
    if(!user) return res.redirect("/register");

    const isPasswordMatch = await bcrypt.compare(password,user.password);
    if(!isPasswordMatch) return res.render("login",{email,message :"Incorrect password"});

    const token = jwt.sign({_id:user._id},"fhdsklgfknbl")


    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");


    
})

app.post("/register",async (req, res) => {
    const {name, email,password}= req.body;

    let user = await User.findOne({email})
    if(user){
        return res.redirect("/login")

    }

    const hashedPassword =await bcrypt.hash(password,10);



    user = await User.create({
        name,
        email,
        password:hashedPassword,
    });

    const token = jwt.sign({_id:user._id},"fhdsklgfknbl")


    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");
});

app.get("/logout", (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.redirect("/");
});

// app.get("/success", (req, res) => {
//     res.render("success");
// });

// app.get("/users", (req, res) => {
//     res.json({
//         users,
//     });
// });

// //this is API & route
// app.post("/contact", async (req, res) => {
//     const { name, email } = req.body;

//     await Messge.create({ name, email });
//     res.redirect("/success");
// });

app.listen(5000, () => {
    console.log("express server");
});

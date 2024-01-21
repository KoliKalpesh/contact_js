import express from "express";
import path from 'path';

import mongoose from "mongoose";
//mongo db
mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName: "backend",
}).then(()=>(
    console.log("db connected")));
//schema
const messageSchema = new mongoose.Schema({
    name:String,
    email:String
});

//document create
const Messge = mongoose.model("Message",messageSchema);


// /creating server/
const app = express();
 //array users
const users= [];

//using middlewares
//static folder serve publickly
app.use(express.static(path.join(path.resolve(),"public")))

app.use(express.urlencoded({extended:true}))

//setting engine as it is
app.set("view engine","ejs");

//creating routes
app.get("/",(req,res)=>{
    res.render("index",{name:"kalpesh"})//dynamically
    // res.sendFile("index"); no need of this abolute value
})

//adding data to db
app.get("/add",async(req,res)=>{
   await Messge.create({name:"Kalpi2",email:"kk@gmail.com"})
        res.send("nice")


    
    
})

app.get("/success",(req,res)=>{
    res.render("success")
})

app.get("/users",(req,res)=>{
    res.json({
        users,
    })
})


//this is API & route
app.post("/contact",(req,res)=>{
    // console.log(req.body.email);
    users.push({username : req.body.name,email : req.body.email})
    res.redirect("/success")
})

app.listen(5000,()=>{
    console.log("express server")
})
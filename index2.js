import http from "http";
import {loverCalc} from './feature.js';
// const http= require("http");

import  fs from "fs";

import path from "path";

console.log(path.extname("/home/kalpesh/t1.js"))

const home = fs.readFileSync("./index.html");/file read first then other execute sync way/
console.log("hi")

const server = http.createServer((req,res)=>{
    console.log(req.method)

    if(req.url==="/about"){
        res.end(`<h1>lober is ${loverCalc()}</h1>`);
    }else if(req.url==="/contact"){
        res.end("<h1>contact page</h1>");
    }else if(req.url === "/"){
        // fs.readFile("./index.html",(err,home)=>{
        //     res.end("home")

        // })
        // asychrons way
            res.end("home")
        
        
        // res.end("<h1>Home page</h1>");
    }else{
        res.end("<h1>page not found</h1>");

    }
    
});

server.listen(5000,()=>{
    console.log("hello from server");
});
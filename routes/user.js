const express = require("express");
const connection = require("../connection"); 
const router = express.Router();


const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/signup",(req,res) =>{
    let user = req.body;
    query = "select email,password,role,status from user where email=?"
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
            if(results.length <=0){
                query = "insert into user(name,contactnumber,email,password,status,role) values(?,?,?,?,'false','user')";
                connection.query(query,[user.name,user.contactnumber,user.email,user.password],(err,results) =>{
                    if(!err){
                        return res.status(200).json({message:"Successfully Registered!"});
                    }
                    else{
                        return res.status(200).json(err);
                    }
                })
            }
            else{
                return res.status(400).json({message: "This email id already exists!"});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})



router.post("/login",(req,res) =>{
    const user = req.body;
    query = "select email,password,role,status from user where email=?"
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
            if(results.length <=0 || results[0].password !=user.password){
                return res.status(401).json({message:"Incorrect username or password!"});
            }
            else if(results[0].status=="false"){
                return res.status(401).json({message:"Account not activated yet, please wait!"});
            }
            else if(results[0].status=="false"){
                const response = { email: results[0].email,role: results[0].role}
                const accessToken = jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn:"8h"})
                res.status(200).json({token:accessToken});
                
            }
            else{
                return res.status(400).json({message:"Something went wrong!"});
            }
        }

        else{
            return res.status(500).json(err);
        }
    })
})

router.get("/hello",(req,res) =>{

    res.json({
        msg:"done"
    })
    
})

module.exports = router;

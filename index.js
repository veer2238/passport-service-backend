import express from "express";

const app = express()

app.get('/',(req,res) =>{
    res.json({message:"hello express"})
})


const port =9000

app.listen(port,() =>{
    console.log("server connected")
})
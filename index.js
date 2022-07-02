const express = require('express')
const dotenv = require('dotenv')
const app = express()
dotenv.config()

const port = process.env.PORT || 3001
app.get('/',(req,res)=>{
    res.json({
        message:'Welecome to self-manager rest api'
    })
})
app.listen(port,()=>{
    console.log("Server started at port : " +port)
})
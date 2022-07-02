const express = require('express')
const dotenv = require('dotenv')
const app = express()
dotenv.config()

const port = process.env.PORT || 3001

app.listen(port,()=>{
    console.log("Server started at port : " +port)
})
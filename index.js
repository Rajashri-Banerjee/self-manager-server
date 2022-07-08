const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const app = express()
const userRouter = require('./routes/user')
dotenv.config()
require('./config/db')
const port = process.env.PORT || 3001
app.use(cors())
app.use(express.json())
app.use('/user',userRouter)

app.get('/',(req,res)=>{
    res.json({
        message:'Welcome to self-manager rest api'
    })
})
app.listen(port,()=>{
    console.log("Server started at port : " +port)
})
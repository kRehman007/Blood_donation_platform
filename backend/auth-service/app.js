require('dotenv').config();
const express = require('express');
const app=express()
const cors=require('cors');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors("*"));
app.use(cookieParser());
const userRoute = require('./routes/user-route');
const checkAuthUser = require('../shared/middlewares/authUser');
require('./db/mongoose-connection');
const RabbitMQ=require("../shared/rabbitMQ/rabbit-connection")
RabbitMQ.connect()
const {EvenListener}=require("./services/rabbit-listener");
EvenListener()



app.get("/auth/validate-user",checkAuthUser,(req,res)=>{
  return res.status(200).json({user:req.user})
})

app.use("/",userRoute)


const PORT=process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log(`Auth service is running on port ${PORT}`)})
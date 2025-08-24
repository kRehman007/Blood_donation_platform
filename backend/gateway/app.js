require("dotenv").config()
const express=require("express")
const expressProxy=require("express-http-proxy")
const app=express()
const cors=require("cors")
app.use(express.json())


const corsOptions = {
  origin: process.env.FRONT_END_URL,
  credentials: true,              
};

app.use(cors(corsOptions));

app.get("/",(req,res)=>{
    res.send("hello from gateway")
})
app.use("/user",expressProxy(process.env.AUTH_SERVICE_URL))
app.use("/donar",expressProxy(process.env.DONAR_SERVICE_URL))
app.use("/receiver",expressProxy(process.env.receiver_SERVICE_URL))
app.use("/admin",expressProxy(process.env.ADMIN_SERVICE_URL))
app.use("/request",expressProxy(process.env.REQUEST_SERVICE_URL))



const PORT=process.env.PORT | 3000
app.listen(PORT,()=>{
    console.log(`Gateway is running on PORT: ${PORT}`)
})


module.exports=app
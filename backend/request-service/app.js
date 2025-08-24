require("dotenv").config()
require("./db/mongoose-connection")
const express=require("express")
const app=express()
const cors=require("cors")
const cookieParser=require("cookie-parser")
const RabbitMQ=require("../shared/rabbitMQ/rabbit-connection")
const RequestRoute=require("./routes/request-route")
const checkAuthUser = require("../shared/middlewares/authUser")
RabbitMQ.connect()
// const {EvenListener}=require("./services/rabbit-listener")
// EvenListener()


app.use(cors("*"))
app.use(cookieParser())
app.use(express.json())


app.use("/",checkAuthUser,RequestRoute)

const PORT=process.env.PORT || 3005
app.listen(PORT,()=>{
    console.log(`Request Service is running on PORT: ${PORT}`)
})
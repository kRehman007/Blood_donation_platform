require("dotenv").config()
require("./db/mongoose_db")
const express=require("express")
const app=express()
const cookieParser=require("cookie-parser")
const cors=require("cors")
const DonarRoute=require("./routes/donar-route")
const checkAuthUser = require("../shared/middlewares/authUser")
const RabbitMQ=require("../shared/rabbitMQ/rabbit-connection")
RabbitMQ.connect()
const {EventListener}=require("./services/rabbit-listener")
EventListener()


app.use(express.json())
app.use(cookieParser())
app.use(cors("*"))


app.use("/",checkAuthUser,DonarRoute)

const PORT=process.env.PORT | 3002


app.listen(PORT,()=>{
    console.log(`Donar service is running on PORT: ${PORT}`)
})
require("dotenv").config()
const express=require("express")
const app=express()
const cors=require("cors")
const cookieParser=require("cookie-parser")
const RabbitMQ=require("../shared/rabbitMQ/rabbit-connection")
const AdminRoute=require("./routes/admin-route")
RabbitMQ.connect()


app.use(cors("*"))
app.use(cookieParser())
app.use(express.json())


app.use("/",AdminRoute)


const PORT=process.env.PORT || 3004
app.listen(PORT,()=>{
    console.log(`Admin Service is running on PORT: ${PORT}`)
})
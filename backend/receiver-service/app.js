require("dotenv").config()
require("./db/mongoose_db")
const express=require("express")
const app=express()
const cookieParser=require("cookie-parser")
const cors=require("cors")
const ReceiverRoute=require("./routes/receiver-route")
const checkAuthUser = require("../shared/middlewares/authUser")

app.use(express.json())
app.use(cookieParser())
app.use(cors("*"))


app.use("/",checkAuthUser,ReceiverRoute)

const PORT=process.env.PORT | 3003


app.listen(PORT,()=>{
    console.log(`receiver service is running on PORT: ${PORT}`)
})
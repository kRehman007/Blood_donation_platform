const mongoose=require("mongoose");

(()=>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected")
    } catch (error) {
        console.log("error in mongoDB Connection", error)
    }
})()
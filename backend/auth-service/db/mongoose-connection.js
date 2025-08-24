const mongoose = require('mongoose');

(()=>{
    try {
    mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected successfully");
} catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
})()
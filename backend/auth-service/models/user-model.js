require('dotenv').config();
const mongoose=require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false,
        minLength:6
    },
     phone:{
        type:String,
        unique:true,
        required:true,
        minLength:10
    },
    role:{
        type:[String],
        enum:["donar","receiver","admin"],
        default:["donar"]
    }
},{
    timestamps:true
})

userSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10)
}

userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET)
    return token;
}


userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(
        password,this.password)
}


const userModel=mongoose.model("user",userSchema)
module.exports=userModel
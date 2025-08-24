require('dotenv').config();
const userModel = require("../models/user-model");

async function RegisterUser(req,res){
 const { fullname, username, email, password,role,phone } = req.body;
 const existingUserName=await userModel.findOne({username})
    if(existingUserName){
        return res.status(400).json({message:"Username already taken"})
    }
 const existingUser = await userModel.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already registered" });
    }
 if(!fullname || !username || !email || !password ||!phone) {
    return res.status(400).json({ message: "All fields are required" });
 }
 try {
    const hashedPassword=await userModel.hashPassword(password)
 const createdUser=await userModel.create({
    fullname,
    username,
    email,
    phone,
    password: hashedPassword,
    role:[role]
 }) 
 const token=createdUser.generateAuthToken();
 res.cookie("token",token,{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"strict"
 });
  const userDetails={
        _id: createdUser._id,
        fullname: createdUser.fullname,
        username: createdUser.username,
        email: createdUser.email,
        phone: createdUser.phone,
        role: createdUser.role,
        token:token
    }
 res.status(201).json({
    message: "User registered successfully",
    user:userDetails
 })
 } catch (error) {
    console.log("Error in RegisterUser:", error);
    if (error.code === 11000) {
        return res.status(409).json({ message: "User with this email already exists" });
    }
    res.status(500).json({ message: `Internal server error: ${error}` });
 }


}



async function LoginUser(req,res){
const { email, password } = req.body;
if(!email || !password) {
return res.status(400).json({ message: "Email and password are required" });
}
try {
    const user=await userModel.findOne({email}).select("+password");
    if(!user) {
        return res.status(404).json({ message: "User with this email not found, Please create your account" });
    }
    const isPasswordValid=await user.comparePassword(password);
    if(!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect password" });
    }
    const token=user.generateAuthToken();
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict"
    })
    const userDetails={
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token:token
    }
    res.status(200).json({
        message: "Login successful",
        user: userDetails
    });
} catch (error) {
    console.log("Error in LoginUser:", error);
    res.status(500).json({ message: `Internal server error: ${error}` });
}

}


async function LogoutUser(req,res){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
 res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
 });
    res.status(200).json({ message: "Logout successful",token });
}


module.exports={
    RegisterUser,
    LoginUser,
    LogoutUser
}
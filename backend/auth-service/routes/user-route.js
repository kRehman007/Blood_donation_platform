const express = require('express');
const { RegisterUser, LoginUser, LogoutUser } = require('../controllers/user-controller');
const checkAuthUser = require('../../shared/middlewares/authUser');
const router=express.Router()



router.post("/register",RegisterUser)
router.post("/login",LoginUser)
router.get("/logout",checkAuthUser,LogoutUser)


module.exports=router
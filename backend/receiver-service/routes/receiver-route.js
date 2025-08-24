const express=require("express")
const { CreateReceiverProfile, UpdateReceiverProfile, GetReceiverProfile } = require("../controllers/receiver-controller")
const checkAuthUser = require("../../shared/middlewares/authUser")
const router=express.Router()



router.post("/create-profile",checkAuthUser,CreateReceiverProfile)
router.post("/update-profile/:id",checkAuthUser,UpdateReceiverProfile)
router.get('/get-profile/:id',checkAuthUser,GetReceiverProfile)


module.exports=router
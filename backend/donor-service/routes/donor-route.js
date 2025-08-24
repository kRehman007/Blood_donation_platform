const express=require("express")
const { CreateDonarProfile, UpdateDonarProfile, GetDonarProfile } = require("../controllers/donar-controller")
const checkAuthUser = require("../../shared/middlewares/authUser")
const router=express.Router()



router.post("/create-profile",checkAuthUser,CreateDonarProfile)
router.post("/update-profile/:id",checkAuthUser,UpdateDonarProfile)
router.get('/get-profile/:id',checkAuthUser,GetDonarProfile)


module.exports=router
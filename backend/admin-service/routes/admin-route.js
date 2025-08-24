const express=require("express")
const checkAuthUser = require("../../shared/middlewares/authUser")
const { getAllUsers, getAllDonors, getAllReceivers } = require("../controllers/admin-controller")
const router=express.Router()


router.get("/get-all-users",checkAuthUser,getAllUsers)
router.get("/get-all-donors",checkAuthUser,getAllDonors)
router.get("/get-all-receivers",checkAuthUser,getAllReceivers)


module.exports=router
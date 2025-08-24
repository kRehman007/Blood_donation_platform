const { sendRPCMessage } = require("../../shared/rabbitMQ/rabbit-connection");
const DonarModel = require("../models/donor-model");

async function CreateDonarProfile(req, res) {
    console.log("requested user",req.user)
    const { age,  bloodGroup, location, lastDonatedAt, isAvailable } = req.body;
    console.log("body",req.body)

    if (!age  || !bloodGroup || !location || !lastDonatedAt) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const createdProfile = await DonarModel.create({
            userId:req.user._id,
            age,
            bloodGroup,
            location:{
                type: "Point",
        coordinates: [location.lon, location.lat]
            },
            lastDonatedAt,
            isAvailable
        });

        res.status(201).json({
            message: "Profile created successfully",
            profile: createdProfile
        });

    } catch (error) {
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}

async function UpdateDonarProfile(req, res) {
    console.log("params",req.params)
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedProfile = await DonarModel.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedProfile) {
            return res.status(404).json({ message: "Donor profile not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            profile: updatedProfile
        });

    } catch (error) {
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}

async function GetDonarProfile(req, res) {
    const { id } = req.params;

    try {
        const profile = await DonarModel.findById(id);
        const user=await sendRPCMessage("get-user-details",JSON.stringify({id:profile.userId}))
        const userData=JSON.parse(user)

        if (!profile) {
            return res.status(404).json({ message: "Donor profile not found" });
        }
        if(!userData.success){
            return res.status(400).json({message:"Error in getting response from RPC handler"})
        }

        res.status(200).json({ ...profile.toObject(),userData });

    } catch (error) {
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}

module.exports = {
    CreateDonarProfile,
    UpdateDonarProfile,
    GetDonarProfile
};

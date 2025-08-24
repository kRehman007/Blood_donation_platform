const { sendRPCMessage } = require("../../shared/rabbitMQ/rabbit-connection");
const ReceiverModel = require("../models/receiver-model");

async function CreateReceiverProfile(req, res) {
  const { bloodGroup, location, requiredAt, isUrgent } = req.body;

  if (!bloodGroup || !location || !requiredAt) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const createdProfile = await ReceiverModel.create({
      userId: req.user._id,
      bloodGroup,
      location:{
                type: "Point",
        coordinates: [location.lon, location.lat]
            },
      requiredAt,
      isUrgent
    });

    res.status(201).json({ message: "Receiver profile created", profile: createdProfile });

  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}

async function GetReceiverProfile(req, res) {
  const { id } = req.params;
  try {
    const profile = await ReceiverModel.findById(id);
    const user=await sendRPCMessage("get-user-details",JSON.stringify({id:profile.userId}))
    const userData=JSON.parse(user)
    console.log("userdata",userData)

    if (!profile) {
      return res.status(404).json({ message: "Receiver profile not found" });
    }
     if(!userData.success){
            return res.status(400).json({message:"Error in getting response from RPC handler"})
        }

    res.status(200).json({ ...profile.toObject(),userData });

  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}

async function UpdateReceiverProfile(req, res) {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedProfile = await ReceiverModel.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedProfile) {
      return res.status(404).json({ message: "Receiver profile not found" });
    }

    res.status(200).json({ message: "Profile updated", profile: updatedProfile });

  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}

module.exports = {
  CreateReceiverProfile,
  GetReceiverProfile,
  UpdateReceiverProfile
};

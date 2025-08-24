const {RequestModel} = require("../models/request-model");
const { sendBloodRequestNotificationService } = require("../utils/notification");

// Create a new blood request
async function createRequest(req, res) {
    const { receiverId, bloodGroup, location, reason } = req.body;
      if(!req.user?._doc?.role?.includes("receiver")){
    return res.status(401).json({message:"You must have receiver role to create request"})
   }
   if(!receiverId || !bloodGroup || !location || !reason){
    return res.status(400).json({ message: "All fields are required" });
   }
 
  try {
    const newRequest = await RequestModel.create({
      receiverId,
      bloodGroup,
      location:{
                type: "Point",
        coordinates: [location.lon, location.lat]
            },
      reason,
      status: "pending"
    });

   const resp=await sendBloodRequestNotificationService({
    requestId:newRequest._id,
    bloodGroup,
    coordinates:[location.lon,location.lat]
   })
   console.log("respo",resp)
    res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: newRequest
    });
  } catch (err) {
    console.error("Create Request Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

// Get requests made by a specific receiver
async function getreceiverRequests(req, res) {
  try {
    console.log("params",req.params)
    const receiverId = req.params.receiverId;
    
    const requests = await RequestModel.find({ receiverId });

    res.json({
      success: true,
      data: requests
    });
  } catch (err) {
    console.error("Get receiver Requests Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

// Get nearby requests for a donor
async function getNearbyRequestsForDonor(req, res) {
  try {
    const { donorId} = req.body; // default 10km

const donorResponse = await sendRPCMessage("get-donor-by-id", JSON.stringify({ id: donorId }));
const { success, data: donor } = JSON.parse(donorResponse);
console.log("donardetails",donor)
if (!success || !donor) {
  return res.status(404).json({ success: false, message: "Requests not found" });
}

    const nearbyRequests = await RequestModel.find({
      location: {
        $near: {
             $geometry: {
        type: "Point",
        coordinates: donor.location.coordinates
      },
          $maxDistance: 20000 // in meters
        }
      },
      bloodGroup: donor.bloodGroup,
      status: "pending"
    });
  


    res.json({
      success: true,
      data: nearbyRequests
    });
  } catch (err) {
    console.error("Get Nearby Requests Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

// Claim a request by donor
async function claimRequest(req, res) {
  const {requestId}=req.params
  const donorId=req.user._id
  try {
    const request = await RequestModel.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: "Request already claimed or fulfilled" });
    }

    request.claimedBy = donorId;
    request.status = "claimed";
    await request.save();

    res.json({
      success: true,
      message: "Request successfully claimed",
      data: request
    });
  } catch (err) {
    console.error("Claim Request Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

// Get all requests (admin or analytics)
async function getAllRequests(req, res) {
  try {
    const requests = await RequestModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests
    });
  } catch (err) {
    console.error("Get All Requests Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

module.exports = {
  createRequest,
  getreceiverRequests,
  getNearbyRequestsForDonor,
  claimRequest,
  getAllRequests
};

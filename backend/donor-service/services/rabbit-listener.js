const { setupRPCConsumer, sendRPCMessage } = require("../../shared/rabbitMQ/rabbit-connection");
const DonarModel = require("../models/donor-model");

async function EventListener() {
  await setupRPCConsumer("get-donor-by-id", async (msg) => {
    try {
      const { id } = JSON.parse(msg);

      const donor = await DonarModel.findById(id); // optional populate if needed
      console.log("donar details",donor)
      if (!donor) {
        return JSON.stringify({ success: false, message: "Donor not found" });
      }

      return JSON.stringify({ success: true, data: donor });
    } catch (error) {
      console.error("Error in get-donor-by-id RPC handler:", error);
      return JSON.stringify({ success: false, message: "Server error" });
    }
  });

 await setupRPCConsumer("get-donors-in-radius", async (msg) => {
    try {
      const { bloodGroup, coordinates } = JSON.parse(msg);
        console.log(bloodGroup,coordinates)
      const donors = await DonarModel.find({
        bloodGroup,
        isAvailable: true,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates // [lon, lat]
            },
            $maxDistance: 20000
          }
        }
      });
      const donorDetails=[]
      for(const donar of donors){
        try {
          const userResponse=await sendRPCMessage("get-user-details-by-id",JSON.stringify({userId:donar.userId}))
          const user=JSON.parse(userResponse)
          console.log("user",user)
             if (user.success) {
          donorDetails.push({
            ...donar.toObject(), // donor data from donor service
            user: user.data,     // user data from user-service
          });
        }
        } catch (error) {
           console.error("Error fetching user details for donor:", donar._id, err);
        }
      }

      return JSON.stringify({ success: true, data: donorDetails });
    } catch (error) {
      console.error("Error in get-donors-in-radius RPC handler:", error);
      return JSON.stringify({ success: false, message: "Server error" });
    }
  });
}

module.exports = {EventListener};

const { setupRPCConsumer } = require("../../shared/rabbitMQ/rabbit-connection")
const userModel = require("../models/user-model")

async function EvenListener(){
await setupRPCConsumer("get-users",async()=>{
    const users=await userModel.find({role:{$ne:"admin"}})
    return JSON.stringify(users)
})
await setupRPCConsumer("get-user-details-by-id", async (msg) => {
  try {
    const { userId } = JSON.parse(msg);
    console.log("userId",userId)
    const user = await userModel.findById(userId).select("-password"); // don’t expose password

    if (!user) {
      return JSON.stringify({ success: false, message: "User not found" });
    }

    return JSON.stringify({ success: true, data: user });
  } catch (error) {
    console.error("Error in get-user-details RPC handler:", error);
    return JSON.stringify({ success: false, message: "Server error" });
  }
});

await setupRPCConsumer("get-donors",async()=>{
    const donors=await userModel.find({role:"donar"})
    return JSON.stringify(donors)
})
await setupRPCConsumer("get-receivers",async()=>{
    const receivers=await userModel.find({role:"receiver"})
    return JSON.stringify(receivers)
})

await setupRPCConsumer("get-user-details",async(msg)=>{
  const {id}=JSON.parse(msg)
  if(!id){
    return JSON.stringify({success:false,message:"ID is required"})
  }
 try {
     const user=await userModel.findById(id)
  if(!user){
    return JSON.stringify({success:false,message:"User not found"})
  }
  return JSON.stringify({success:true,data:user})
 } catch (error) {
    console.error("Error in get-user-details RPC handler:", error);
      return JSON.stringify({ success: false, message: "Server error" });
 }
})
}

module.exports={EvenListener}
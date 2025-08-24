const { sendRPCMessage } = require("../../shared/rabbitMQ/rabbit-connection");

async function getAllUsers(req, res) {
  try {
    const users = await sendRPCMessage("get-users", JSON.stringify({}));
    res.status(200).json({ users: JSON.parse(users) });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to get users" });
  }
}

async function getAllDonors(req, res) {
  try {
    const donors = await sendRPCMessage("get-donors", JSON.stringify({}));
    res.status(200).json({ donors: JSON.parse(donors) });
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ message: "Failed to get donors" });
  }
}

async function getAllReceivers(req, res) {
  try {
    const receivers = await sendRPCMessage("get-receivers", JSON.stringify({}));
    res.status(200).json({ receivers: JSON.parse(receivers) });
  } catch (error) {
    console.error("Error fetching receivers:", error);
    res.status(500).json({ message: "Failed to get receivers" });
  }
}

module.exports = {
  getAllUsers,
  getAllDonors,
  getAllReceivers,
};

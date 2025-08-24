const jwt = require('jsonwebtoken');
require('../../auth-service/db/mongoose-connection')
const userModel = require('../../auth-service/models/user-model');

async function checkAuthUser(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    try {
        const decoded = jwt.verify(token, "blood@!2439~R$^*donation");
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const userId = decoded._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const userDetails=await userModel.findById(userId);
        req.user = {
            ...userDetails,
            _id:userId,

        };
        next();
    } catch (error) {
        console.error("Error in checkAuthUser:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
}


module.exports = checkAuthUser;
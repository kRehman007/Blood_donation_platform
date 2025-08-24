const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "receivers", // or "receiver" if you created a separate model
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // Must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  reason: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "claimed", "fulfilled", "cancelled"],
    default: "pending",
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "donar",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


RequestSchema.index({location:"2dsphere"})
const RequestModel = mongoose.model("requests", RequestSchema);
module.exports = { RequestModel };

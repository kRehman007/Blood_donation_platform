const { Schema, model, Types } = require("mongoose");

const ReceiverSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "users",
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
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
  requiredAt: {
    type: String,
    required: true
  },
  isUrgent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


ReceiverSchema.index({location:"2dsphere"})
const ReceiverModel = model("receivers", ReceiverSchema);
module.exports = ReceiverModel;

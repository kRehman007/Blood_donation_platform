const { Schema, model, Types } = require("mongoose");

const DonarSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "users",
    required: true
  },
  age: {
    type: Number,
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
  lastDonatedAt: {
    type:String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create a 2dsphere index for location
DonarSchema.index({ location: "2dsphere" });

const DonarModel = model("donors", DonarSchema);
module.exports = DonarModel;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      require: true,
    },
    mobile: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["user", "owner", "deliveryBoy"],
      require: true,
    },
    resetOtp: {
      type: String,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    otpExpires: {
      type: Date,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { timestamps: true },
);
userSchema.index({ location: "2dsphere" });

export default mongoose.models.User || mongoose.model("User", userSchema);

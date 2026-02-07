import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

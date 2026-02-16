import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    shopOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    brodcastedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["brodcasted", "assigned", "completed"],
      default: "brodcasted",
    },
    acceptedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.models.DeliveryAssignment ||
  mongoose.model("DeliveryAssignment", deliveryAssignmentSchema);

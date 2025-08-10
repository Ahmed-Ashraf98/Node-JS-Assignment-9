import mongoose from "mongoose";

const banSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
    unique: true,
  },
  reason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

export const BanModel = mongoose.model("Ban", banSchema);

import mongoose from "mongoose";
import { decryptValue, encryptValue } from "../../Utils/Common/common.utils.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      get: (phone) => decryptValue(phone),
      set: (phone) => encryptValue(phone),
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      set: (otp) => encryptValue(otp),
    },
    otpExpireAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModal = mongoose.model("User", userSchema);

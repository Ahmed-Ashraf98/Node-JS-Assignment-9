import mongoose from "mongoose";
import { decryptValue, encryptValue } from "../../Utils/Common/common.utils.js";

export const otpTypes = {
  email: "email",
  passwordReset: "passwordReset",
};

Object.freeze(otpTypes);

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: Object.values(otpTypes),
    required: true,
  },
  otp: {
    type: String,
    required: true,
    set: (otp) => encryptValue(otp),
    get: (otp) => decryptValue(otp),
  },
  failedOtpAttempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120,
  },
});

export const OTPModel = mongoose.model("OTP", otpSchema);

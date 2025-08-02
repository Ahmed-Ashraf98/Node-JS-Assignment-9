import mongoose from "mongoose";
import { decryptPhone, encryptPhone } from "../../Utils/User/user.utils.js";

const userSchema = new mongoose.Schema({
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
    get: (phone) => decryptPhone(phone),
    set: (phone) => encryptPhone(phone),
  },
  age: {
    type: Number,
    min: 18,
    max: 60,
  },
});

export const UserModal = mongoose.model("User", userSchema);

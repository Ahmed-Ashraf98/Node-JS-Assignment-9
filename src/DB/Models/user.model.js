import mongoose, { get } from "mongoose";
import { decryptPhone } from "../../Utils/User/user.utils";

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
  },
  age: {
    type: Number,
    min: 18,
    max: 60,
  },
});

export const UserModal = mongoose.model("User", userSchema);

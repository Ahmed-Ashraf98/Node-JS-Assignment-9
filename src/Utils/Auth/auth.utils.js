import { customAlphabet } from "nanoid";
import {
  emailEmitter,
  emailEvents,
} from "../Notification/events/mail.events.js";

/**
 * @param {string} email to address
 * @param {string} name user name <to address user name>
 * @param {string} otp OTP value
 * @param {number} otpDuration OTP validity in minutes
 */
export const sendEmailConfirmation = (email, name, otp, otpDuration = 10) => {
  emailEmitter.emit(emailEvents.confirmEmail, {
    email,
    name,
    otp,
    otpDuration,
  });
};

export const generateOTP = (otpLength = 6) => {
  const otp = customAlphabet("0123456789", otpLength)();
  return otp;
};

export const generateToken = (userId) => {
  const options = { expiresIn: "1h" };
  const token = jwt.sign(userId, process.env.Token_Sign, options);
  return token;
};

export const generateRefreshToken = (userId) => {
  const options = { expiresIn: "7d" };
  const token = jwt.sign(userId, process.env.Refresh_Token_Sign, options);
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.Token_Sign);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.Refresh_Token_Sign);
    return decoded;
  } catch (error) {
    return null;
  }
};

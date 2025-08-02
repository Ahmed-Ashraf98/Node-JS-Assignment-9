import { EventEmitter, on } from "events";
import { sendMail } from "../mailer.utils.js";
import { OTP_Template } from "../templates/otp.temp.js";

export const emailEmitter = new EventEmitter();

export const emailEvents = {
  confirmEmail: "confirmEmail",
};

Object.freeze(emailEvents);

emailEmitter.on(
  "confirmEmail",
  async ({ email, userName, otp, otpDuration = 10 }) => {
    const template = OTP_Template(
      otp,
      otpDuration,
      userName,
      "Please use the OTP below to verify your email"
    );
    let result = await sendMail("Email Verification", template, [email]);
    console.log(result);
  }
);

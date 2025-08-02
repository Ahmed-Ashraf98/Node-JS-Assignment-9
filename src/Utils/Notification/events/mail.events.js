import { EventEmitter, on } from "events";
import { sendMail } from "../mailer.utils.js";
import { OTP_Template } from "../templates/otp.temp.js";

export const emailEmitter = new EventEmitter();

emailEmitter.on("confirmEmail", async ({ email, userName, otp }) => {
  const template = OTP_Template(
    otp,
    10,
    userName,
    "Please use the OTP below to verify your email"
  );
  await sendMail("Email Verification", template, [email]);
});

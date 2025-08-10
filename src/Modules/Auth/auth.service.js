import { responseHandler } from "../../Utils/Common/responseHandler.js";
import httpStatus from "../../Utils/Common/httpStatus.js";
import * as authUtils from "../../Utils/Auth/auth.utils.js";
import { UserModal } from "../../DB/Models/user.model.js";
import { OTPModel, otpTypes } from "../../DB/Models/otp.model.js";
import { BanModel } from "../../DB/Models/ban.model.js";

export const refreshToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return responseHandler(res, "Token is required", httpStatus.BAD_REQUEST);
  }

  const decoded = authUtils.verifyRefreshToken(token);

  if (!decoded) {
    return responseHandler(res, "Invalid token", httpStatus.UNAUTHORIZED);
  }

  const newToken = authUtils.generateToken(decoded.userId);

  return responseHandler(res, "Token refreshed successfully", httpStatus.OK, {
    accessToken: newToken,
  });
};

export const verifyCode = async (req, res, next) => {
  const { otp, email } = req.body;

  const userDoc = await UserModal.findOne({ email });

  if (!userDoc) {
    return responseHandler(res, "User Not Found", httpStatus.NOT_FOUND);
  }

  const otpDoc = await OTPModel.findOne({ userId: userDoc._id });

  if (!otpDoc) {
    return responseHandler(
      res,
      "No OTP Code Sent For This User",
      httpStatus.NOT_FOUND
    );
  }

  if (otpDoc.type == otpTypes.email && userDoc.confirmed) {
    return responseHandler(
      res,
      "Email already confirmed",
      httpStatus.BAD_REQUEST
    );
  }

  const bannedAcc = await BanModel.findOne({ userId: userDoc._id });

  if (bannedAcc) {
    return responseHandler(
      res,
      "Account temporarily banned due to multiple failed OTP attempts. Please try again later.",
      httpStatus.FORBIDDEN
    );
  }

  if (otp !== otpDoc.otp) {
    otpDoc.failedOtpAttempts += 1;
    await otpDoc.save();

    if (otpDoc.failedOtpAttempts > 5) {
      await BanModel.create({
        userId: userDoc._id,
        reason: "Multiple failed OTP attempts",
      });
      return responseHandler(
        res,
        "Account temporarily banned due to multiple failed OTP attempts. Please try again later.",
        httpStatus.FORBIDDEN
      );
    }

    const remainingAttempts = 5 - otpDoc.failedOtpAttempts;
    return responseHandler(
      res,
      `Invalid OTP Code. ${remainingAttempts} attempts remaining.`,
      httpStatus.BAD_REQUEST
    );
  }

  await OTPModel.deleteOne({ _id: otpDoc._id });

  if (otpDoc.type == otpTypes.email) {
    userDoc.confirmed = true;
    await userDoc.save();
  }

  return responseHandler(res, "Code verified successfully", httpStatus.OK);
};

export const resendOTP = async (req, res, next) => {
  const { email } = req.body;

  const userDoc = await UserModal.findOne({ email });

  if (!userDoc) {
    return responseHandler(res, "User Not Found", httpStatus.NOT_FOUND);
  }

  const banRecord = await BanModel.findOne({ userId: userDoc._id });
  if (banRecord) {
    return responseHandler(
      res,
      "Account is temporarily banned. Please try again later.",
      httpStatus.FORBIDDEN
    );
  }

  const existingOtp = await OTPModel.findOne({ userId: userDoc._id });

  const newOtpCode = authUtils.generateOTP();

  try {
    if (existingOtp) {
      await OTPModel.deleteOne({ _id: existingOtp._id });
    }

    const otpType = userDoc.confirmed ? otpTypes.passwordReset : otpTypes.email;

    await OTPModel.create({
      userId: userDoc._id,
      type: otpType,
      otp: newOtpCode,
    });

    authUtils.sendEmailConfirmation(userDoc.email, userDoc.name, newOtpCode, 2);

    return responseHandler(res, "OTP resent successfully", httpStatus.OK);
  } catch (error) {
    next("Error resending OTP: " + error.message);
  }
};

import { UserModal } from "../../DB/Models/user.model.js";
import * as commonUtils from "../../Utils/Common/common.utils.js";
import * as authUtils from "../../Utils/Auth/auth.utils.js";
import { responseHandler } from "../../Utils/Common/responseHandler.js";
import httpStatus from "../../Utils/Common/httpStatus.js";
import * as authUtils from "../../Utils/Auth/auth.utils.js";

export const signUp = async (req, res, next) => {
  const { name, email, password, age, phone } = req.body;

  // 1- check if email already exists
  const userRecord = await UserModal.findOne({ email });

  if (userRecord) {
    return responseHandler(res, "Email already exists", httpStatus.BAD_REQUEST);
  }

  // 2- create a new user
  const hashedPassword = await commonUtils.hashValue(password);
  const otp = authUtils.generateOTP();

  const data = {
    name,
    email,
    password: hashedPassword,
    phone,
    age,
    otp,
  };

  try {
    const newUser = new UserModal(data);
    await newUser.save();

    authUtils.sendEmailConfirmation(email, name, otp, 10);

    return responseHandler(res, "User created successfully", httpStatus.OK, {
      user: newUser,
    });
  } catch (error) {
    next("Error creating user: " + error.message);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1- check if user exists
  const userRecord = await UserModal.findOne({ email });

  if (!userRecord) {
    return responseHandler(
      res,
      "Invalid email or password",
      httpStatus.NOT_FOUND
    );
  }

  // 2- compare password
  const isPasswordValid = await commonUtils.compareWithHashed(
    password,
    userRecord.password
  );

  if (!isPasswordValid) {
    return responseHandler(
      res,
      "Invalid email or password",
      httpStatus.NOT_FOUND
    );
  }

  // 3- generate access token and refresh token
  const accessToken = authUtils.generateToken({ id: userRecord._id });
  const refreshToken = authUtils.generateRefreshToken({ id: userRecord._id });
  return responseHandler(res, "Login successful", httpStatus.OK, {
    accessToken,
    refreshToken,
  });
};

export const updateUser = async (req, res, next) => {
  const { name, email, age, phone } = req.body;
  const userId = req.tokenObj.id;
  const userRecord = await UserModal.findById(userId);

  if (!userRecord) {
    return responseHandler(res, "User not found", httpStatus.NOT_FOUND);
  }

  if (email) {
    const checkEmail = await UserModal.findOne({ email });
    if (checkEmail && checkEmail._id.toString() !== userId) {
      return responseHandler(
        res,
        "Email already exists",
        httpStatus.BAD_REQUEST
      );
    }
  }

  try {
    name ? (userRecord.name = name) : userRecord.name;
    email ? (userRecord.email = email) : userRecord.email;
    age ? (userRecord.age = age) : userRecord.age;
    phone ? (userRecord.phone = phone) : userRecord.phone;

    await userRecord.save();

    return responseHandler(res, "User updated successfully", httpStatus.OK, {
      user: userRecord,
    });
  } catch (error) {
    return next("Error updating user: " + error.message);
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.tokenObj.id;
  const action = await UserModal.findByIdAndDelete(userId);
  if (action == null || action.deletedCount === 0) {
    return responseHandler(res, "User not found", httpStatus.NOT_FOUND);
  } else {
    return responseHandler(res, "User deleted successfully", httpStatus.OK);
  }
};

export const getUserDetails = async (req, res, next) => {
  const userId = req.tokenObj.id;
  const userObj = await UserModal.findById(userId);
  if (!userObj) {
    return responseHandler(res, "User not found", httpStatus.NOT_FOUND);
  }
  const userDetails = {
    _id: userObj._id,
    name: userObj.name,
    email: userObj.email,
    age: userObj.age,
    phone: userObj.phone,
    password: userObj.password,
  };

  return responseHandler(
    res,
    "User details fetched successfully",
    httpStatus.OK,
    {
      user: userDetails,
    }
  );
};

export const forgotPass = async (req, res, next) => {
  const userObj = req.userRecord;

  const otp = authUtils.generateOTP();

  const currentDate = new Date();
  const after_N_Days = 10;
  const expireDate = new Date(
    currentDate.getTime() + after_N_Days * 24 * 60 * 60 * 1000
  ); // Fix: Add days properly

  userObj.otp = otp;
  userObj.otpExpireAt = expireDate;

  await userObj.save(); // Fix: Save the user with OTP

  authUtils.sendEmailConfirmation(userObj.email, userObj.name, otp, 10);

  return responseHandler(res, "OTP Sent successfully", httpStatus.OK);
};

export const changePass = async (req, res, next) => {
  const { otp, password } = req.body;

  const userObj = req.userRecord;

  // Fix: Check if OTP exists and hasn't expired
  if (!userObj.otp || !userObj.otpExpireAt) {
    return responseHandler(res, "No OTP requested", httpStatus.BAD_REQUEST);
  }

  // Fix: Check if OTP has expired
  if (new Date() > userObj.otpExpireAt) {
    return responseHandler(res, "OTP has expired", httpStatus.BAD_REQUEST);
  }

  const decryptedOTP = commonUtils.decryptValue(userObj.otp);

  if (decryptedOTP === "") {
    return responseHandler(res, "Invalid OTP", httpStatus.BAD_REQUEST);
  }

  if (decryptedOTP !== otp) {
    return responseHandler(res, "Invalid OTP", httpStatus.BAD_REQUEST);
  }

  // Fix: Hash the new password
  userObj.password = await commonUtils.hashValue(password);

  // Fix: Clear OTP after successful password change
  userObj.otp = undefined;
  userObj.otpExpireAt = undefined;

  await userObj.save();

  // Fix: Return the response
  return responseHandler(res, "Password Changed Successfully", httpStatus.OK);
};

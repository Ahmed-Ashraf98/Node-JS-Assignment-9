import { UserModal } from "../../DB/Models/user.model.js";
import * as userUtils from "../../Utils/User/user.utils.js";
import { responseHandler } from "../../Utils/Common/responseHandler.js";
import httpStatus from "../../Utils/Common/httpStatus.js";

export const signUp = async (req, res, next) => {
  const { name, email, password, age, phone } = req.body;

  // 1- check if email already exists
  const userRecord = await UserModal.findOne({ email });

  if (userRecord) {
    return responseHandler(res, "Email already exists", httpStatus.BAD_REQUEST);
  }
  // 2- create a new user

  const hashedPassword = await userUtils.hashPassword(password);

  const data = {
    name,
    email,
    password: hashedPassword,
    phone,
    age,
  };

  try {
    const newUser = new UserModal(data);
    await newUser.save();
    responseHandler(res, "User created successfully", httpStatus.OK, {
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
  const isPasswordValid = await userUtils.comparePassword(
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
  const accessToken = userUtils.generateToken({ id: userRecord._id });
  const refreshToken = userUtils.generateRefreshToken({ id: userRecord._id });
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

import { UserModal } from "../../DB/Models/user.model.js";
import { responseHandler } from "../../Utils/Common/responseHandler.js";
import httpStatus from "../../Utils/Common/httpStatus.js";

export const isUserExist = async (req, res, next) => {
  try {
    const userID = req.tokenObj.userId;
    const userRecord = await UserModal.findById(userID);
    if (!userRecord) {
      return responseHandler(res, "User not found", httpStatus.NOT_FOUND);
    }
    req.userRecord = userRecord;
    next();
  } catch (error) {
    console.error("Error in isUserExist middleware:", error);
    return responseHandler(
      res,
      "Internal server error",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const validateUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userRecord = await UserModal.findOne({ email });
    if (!userRecord) {
      return responseHandler(res, "User email not found", httpStatus.NOT_FOUND);
    }
    req.userRecord = userRecord;
    next();
  } catch (error) {
    console.error("Error in validateUserByEmail middleware:", error);
    return responseHandler(
      res,
      "Internal server error",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const validateEmail = async (req, res, next) => {
  try {
    const email = req.body?.email;
    const requestType = req.method;

    if (!email && requestType === "POST") {
      return responseHandler(
        res,
        "Email is required for signup",
        httpStatus.BAD_REQUEST
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailPattern.test(email)) {
      return responseHandler(
        res,
        "Invalid email format",
        httpStatus.BAD_REQUEST
      );
    }

    next();
  } catch (error) {
    console.error("Error in validateEmail middleware:", error);
    return responseHandler(
      res,
      "Internal server error",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

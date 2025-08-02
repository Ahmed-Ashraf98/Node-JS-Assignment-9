import { UserModal } from "../../DB/Models/user.model.js";
import { responseHandler } from "../../Utils/Common/responseHandler.js";
import httpStatus from "../../Utils/Common/httpStatus.js";

export const isUserExist = async (req, res, next) => {
  const userID = req.tokenObj.id;
  const userRecord = await UserModal.findById(userID);
  if (!userRecord) {
    // responseHandler(res, "User not found", httpStatus.NOT_FOUND);
    next("User not found");
  }
  req.userRecord = userRecord;
  next();
};

export const validateEmail = async (req, res, next) => {
  const email = req.body?.email;
  const requestType = req.method;

  if (!email && requestType === "POST") {
    next("Email is required for signup");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailPattern.test(email)) {
    next("Invalid email format");
  }

  next();
};

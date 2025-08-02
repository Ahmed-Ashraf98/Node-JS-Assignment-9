import * as userUtils from "../../Utils/User/user.utils.js";
import { responseHandler } from "../../Utils/Common/responseHandler.js";
import httpStatus from "../../Utils/Common/httpStatus.js";

export const refreshToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return responseHandler(res, "Token is required", httpStatus.BAD_REQUEST);
  }

  const decoded = userUtils.verifyRefreshToken(token);

  if (!decoded) {
    return responseHandler(res, "Invalid token", httpStatus.UNAUTHORIZED);
  }

  const newToken = userUtils.generateToken(decoded.userId);

  return responseHandler(res, "Token refreshed successfully", httpStatus.OK, {
    accessToken: newToken,
  });
};

export const verifyCode = async (req, res, next) => {};

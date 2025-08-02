import * as userUtils from "../../Utils/User/user.utils.js";
import { responseHandler } from "../../Utils/Common/responseHandler.js";
import httpStatus from "../../Utils/Common/httpStatus.js";

export const validateToken = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return responseHandler(res, "Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const decoded = userUtils.verifyToken(token);

  if (!decoded) {
    return responseHandler(res, "Invalid token", httpStatus.UNAUTHORIZED);
  }

  req.tokenObj = decoded;
  next();
};

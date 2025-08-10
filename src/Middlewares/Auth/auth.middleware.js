import * as authUtils from "../../Utils/Auth/auth.utils.js";
import { responseHandler } from "../../Utils/Common/responseHandler.js";
import httpStatus from "../../Utils/Common/httpStatus.js";
import { BanModel } from "../../DB/Models/ban.model.js";
import { UserModal } from "../../DB/Models/user.model.js";

export const validateToken = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return responseHandler(res, "Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const decoded = authUtils.verifyToken(token);

  if (!decoded) {
    return responseHandler(res, "Invalid token", httpStatus.UNAUTHORIZED);
  }

  req.tokenObj = decoded;
  next();
};

export const validateBanned = async (req, res, next) => {
  try {
    // Validate if user banned using Token Or Email (based on request)
    const token = req.headers.token;
    const email = req?.body?.email ? req.body.email : null;
    let userId = "";

    if (token) {
      const decodedToken = authUtils.verifyToken(token);
      if (!decodedToken) {
        return responseHandler(res, "Invalid token", httpStatus.UNAUTHORIZED);
      }
      userId = decodedToken.userId;
    } else if (email) {
      const user = await UserModal.findOne({ email });
      if (user) {
        userId = user._id;
      }
    }

    if (!userId) {
      return responseHandler(res, "User not found", httpStatus.UNAUTHORIZED);
    }

    const banRecord = await BanModel.findOne({ userId });
    if (banRecord) {
      return responseHandler(
        res,
        `Account temporarily banned: ${banRecord.reason}. Please try again later.`,
        httpStatus.FORBIDDEN
      );
    }

    next();
  } catch (error) {
    console.error("Error in validateBanned middleware:", error);
    return responseHandler(
      res,
      "Internal server error",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

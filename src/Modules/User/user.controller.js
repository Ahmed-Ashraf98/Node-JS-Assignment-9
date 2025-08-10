import express from "express";
import * as userServices from "./user.service.js";
import * as authMiddlewares from "../../Middlewares/Auth/auth.middleware.js";
import * as userMiddlewares from "../../Middlewares/User/user.middleware.js";

const userRouter = express.Router();

userRouter.post("/signup", userMiddlewares.validateEmail, userServices.signUp);

userRouter.post("/login", authMiddlewares.validateBanned, userServices.login);

userRouter.post(
  "/forgot-pass",
  authMiddlewares.validateBanned,
  userMiddlewares.validateUserByEmail,
  userServices.forgotPass
);

userRouter.patch(
  "/change-pass",
  authMiddlewares.validateBanned,
  userMiddlewares.validateUserByEmail,
  userServices.changePass
);

userRouter.patch(
  "/",
  authMiddlewares.validateBanned,
  authMiddlewares.validateToken,
  userMiddlewares.validateEmail,
  userServices.updateUser
);

userRouter.delete("/", authMiddlewares.validateToken, userServices.deleteUser);

userRouter.get(
  "/",
  authMiddlewares.validateBanned,
  authMiddlewares.validateToken,
  userServices.getUserDetails
);

export default userRouter;

import express from "express";
import * as authServices from "./auth.service.js";

const authRouter = express.Router();

authRouter.post("/refresh-token", authServices.refreshToken);
authRouter.post("/verify-code", authServices.verifyCode);

export default authRouter;

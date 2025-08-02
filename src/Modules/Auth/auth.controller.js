import express from "express";
import * as authServices from "./auth.service.js";

const authRouter = express.Router();

authRouter.post("/refresh-token", authServices.refreshToken);

export default authRouter;

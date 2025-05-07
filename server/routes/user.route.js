import { Router } from "express";
import { loginOtpSend, loginOtpVerify } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/loginOtpSend").post(loginOtpSend);
userRouter.route("/loginOtpVerify").post(loginOtpVerify);

export default userRouter;

import express from "express";
import {
  googleAuth,
  resetPassword,
  sendOTP,
  signIn,
  signOut,
  signUp,
  verifyOTP,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signin", signIn);
authRouter.post("/signup", signUp);
authRouter.get("/singout", signOut);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/password-reset", resetPassword);
authRouter.post("/google-auth", googleAuth);

export default authRouter;

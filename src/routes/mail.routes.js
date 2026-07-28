import express from "express";
import { sendOtpMail } from "../controllers/mail.controller.js";
const mailRouter = express.Router();

mailRouter.post("/requestOtp", sendOtpMail);
export { mailRouter };

import crypto from "crypto";

import { transporter } from "../config/mail.config.js";
import { envConfig } from "../config/env.config.js";
import { HTTP_STATUS } from "../constants/httpStatus.constants.js";
import { Admin } from "../models/auth.model.js";
import { otpTemplate } from "../templates/otp.template.js";
import ApiError from "../utils/ApiError.js";
import { generateOTP } from "../utils/generateOTP.js";

const sendOtpMail = async ({ name, email, otp }) => {
  await transporter.sendMail({
    from: `"Shree Gaurishankar Baikunthdham Temple" <${envConfig.MAIL_FROM}>`,
    to: email,
    subject: "OTP Verification - Shree Gaurishankar Baikunthdham Temple",
    html: otpTemplate(name, otp),
  });
};

export const sendOtpService = async ({ email }) => {
  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Admin doesn't exist");
  }

  const otp = generateOTP();

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  admin.loginOtp = hashedOtp;
  admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await admin.save({ validateBeforeSave: false });

  try {
    await sendOtpMail({
      name: admin.fullname,
      email: admin.email,
      otp,
    });
  } catch (error) {
    admin.loginOtp = undefined;
    admin.otpExpiry = undefined;

    await admin.save({ validateBeforeSave: false });

    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Unable to send OTP. Please try again.",
    );
  }

  return true;
};

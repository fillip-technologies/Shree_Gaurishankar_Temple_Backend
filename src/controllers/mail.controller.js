import { HTTP_STATUS } from "../constants/httpStatus.constants.js";
import { sendOtpService } from "../services/mail.service.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const sendOtpMail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const isMailSent = await sendOtpService({ email });

  if (!isMailSent)
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Problem Creating Otp",
    );

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, "Mail successfully sent"));
});

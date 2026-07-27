import { HTTP_STATUS } from "../constants/httpStatus.constants.js";
import { Admin } from "../models/auth.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

export const loginService = async ({ email, password }) => {
  const user = await Admin.findOne({ email }).select("+password");
  if (!user) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect)
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");

  return user;
};

export const updatePasswordService = async (current_password, newpassword, decodedToken) => {
  const user = await Admin.findById(decodedToken._id).select("+password");

  if(!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User doesn't exist");

  const isPasswordCorrect = await user.comparePassword(current_password);

  if(!isPasswordCorrect) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid password");

  user.password = newpassword;
  await  user.save({validateBeforeSave: true})
  return user

}

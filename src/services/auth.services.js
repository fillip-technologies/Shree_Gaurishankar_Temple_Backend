import { HTTP_STATUS } from "../constants/httpStatus.constants.js";
import { Admin } from "../models/auth.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

export const loginService = async ({ email, password }) => {
  const user = await Admin.findOne({ email }).select("+password");
  if (!user)
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect)
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  return user;
};

export const updatePasswordService = async ({
  current_password,
  newpassword,
  decodedToken,
}) => {
  const user = await Admin.findById(decodedToken._id).select("+password");

  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User doesn't exist");

  const isPasswordCorrect = await user.comparePassword(current_password);

  if (!isPasswordCorrect)
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid password");

  user.password = newpassword;
  await user.save({ validateBeforeSave: true });
  return user;
};

export const createAdminService = async ({
  fullname,
  mobile_number,
  email,
  password,
}) => {
  const existingUser = await Admin.findOne({ email }).lean();

  if (existingUser)
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "User with this email already exist",
    );

  const user = await Admin.create({
    fullname: fullname,
    mobile_number: mobile_number,
    email: email,
    password: password,
  });
  return user;
};

export const removeAdminService = async ({
  adminEmail,
  superAdminPassword,
  superAdminId,
}) => {
  const superAdmin = await Admin.findById(superAdminId).select("+password");
  if (!superAdmin) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
  }

  if (superAdmin.role !== "superadmin") {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Request forbidden");
  }

  if (superAdmin.email === adminEmail) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You cannot delete your own account",
    );
  }
  const targetAdmin = await Admin.findOne({ email: adminEmail });
  console.log(targetAdmin);
  if (!targetAdmin) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Admin not found");
  }

  if (targetAdmin.role === "superadmin") {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Super admin cannot be deleted");
  }

  const isPasswordCorrect =
    await superAdmin.comparePassword(superAdminPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Incorrect password");
  }

  await targetAdmin.deleteOne();

  return true;
};

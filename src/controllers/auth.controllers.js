import { httpOptions } from "../constants/httpOptions.constants.js";
import { HTTP_STATUS } from "../constants/httpStatus.constants.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createAdminService,
  loginService,
  removeAdminService,
} from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { updatePasswordService } from "../services/auth.service.js";
import { Admin } from "../models/auth.model.js";

// ################     Login     #############
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => !field || field.trim() === ""))
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "All fields are required");

  const user = await loginService({ email, password });

  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  const userData = user.toObject();
  delete userData.password;

  const token = user.generateAccessToken();
  res
    .status(HTTP_STATUS.OK)
    .cookie("token", token, httpOptions)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        {
          user: userData,
        },
        "Login successful",
      ),
    );
});

// ##############   Update Password        ###############
export const updatePassword = asyncHandler(async (req, res) => {
  const decoded = req.user;

  const { current_password, newpassword } = req.body;

  if (
    [current_password, newpassword].some(
      (field) => !field || field.trim() === "",
    )
  )
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Please enter all the fields");

  const user = await updatePasswordService({
    current_password,
    newpassword,
    decoded,
  });

  const userData = user.toObject();
  delete userData.password;
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, "Password succesfully changed"));
});

// ##############       Create Admin         #############
export const createAdmin = asyncHandler(async (req, res) => {
  const role = req.user.role;

  if (role !== "superadmin")
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Request forbidden");
  const { fullname, mobile_number, email, password } = req.body;

  if (
    [fullname, mobile_number, email, password].some(
      (field) => field.trim() === "",
    )
  )
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "All fields are required");

  const user = await createAdminService({
    fullname,
    mobile_number,
    email,
    password,
  });

  if (!user) throw new ApiError(HTTP_STATUS.CONFLICT, "Problem creating user");

  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, "User created Succesfully"));
});

//  ################   Remove Admin      #############
export const removeAdmin = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== "superadmin") {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Request forbidden");
  }

  const { adminEmail, superAdminPassword } = req.body;

  await removeAdminService({
    adminEmail,
    superAdminPassword,
    superAdminId: user._id,
  });

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Admin deleted successfully",
  });
});

export const listAdmin = asyncHandler(async (req, res) => {
  const role = req.user.role;

  if (role !== "superadmin")
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Request Forbidden");

  const admins = await Admin.find().lean();
  const message =
    admins.length > 0 ? "Admins fetched successfully." : "No admins found.";

  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, admins, message));
});

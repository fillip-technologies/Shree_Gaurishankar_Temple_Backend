import { HTTP_STATUS } from "../constants/httpStatus.constants.js";

import { Content } from "../models/content.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const shringarUpload = asyncHandler(async (req, res) => {
  if (!req.file)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Please upload an image");

  const uploadFile = await uploadToCloudinary(req.file.buffer, "shringar");

  const shringar = await Content.create({
    admin: req.user?._id,
    url_path: uploadFile.secure_url,
    publicId: uploadFile.public_id,
    contentType: uploadFile.resource_type,
    mimeType: req.file.mimetype,
  });

  return res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        shringar,
        "File uploaded successfully",
      ),
    );
});

export const galleryUpload = asyncHandler(async (req, res) => {
  if (!req.file)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Please upload an image");

  const uploadFile = await uploadToCloudinary(req.file.buffer, "gallery");

  const gallery = await Content.create({
    admin: req.user?._id,
    url_path: uploadFile.secure_url,
    publicId: uploadFile.public_id,
    contentType: uploadFile.resource_type,
    mimeType: req.file.mimetype,
  });

  return res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        gallery,
        "File uploaded successfully",
      ),
    );
});

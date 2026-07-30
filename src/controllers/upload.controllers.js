import { HTTP_STATUS } from "../constants/httpStatus.constants.js";

import { Content } from "../models/content.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";

export const shringarUpload = asyncHandler(async (req, res) => {
  const user = req.user;
 if(!user) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Not authorized")
  if (!req.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Please upload an image");
  }

  const existing = await Content.findOne({ folder: "shringar" });

  const uploadFile = await uploadToCloudinary(req.file.buffer, "shringar");

  let shringar;

  if (existing) {
    const oldPublicId = existing.publicId;

    // Update existing document
    existing.admin = req.user?._id;
    existing.url_path = uploadFile.secure_url;
    existing.publicId = uploadFile.public_id;
    existing.contentType = uploadFile.resource_type;
    existing.mimeType = req.file.mimetype;

    shringar = await existing.save();

    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
    }
  } else {
    shringar = await Content.create({
      admin: req.user?._id,
      folder: "shringar",
      url_path: uploadFile.secure_url,
      publicId: uploadFile.public_id,
      contentType: uploadFile.resource_type,
      mimeType: req.file.mimetype,
    });
  }

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        { data: shringar },
        "Shringar image updated successfully",
      ),
    );
});

export const galleryUpload = asyncHandler(async (req, res) => {
  const user = req.user;
 if(!user) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Not authorized")
  if (!req.file)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Please upload an image");

  const uploadFile = await uploadToCloudinary(req.file.buffer, "gallery");

  const gallery = await Content.create({
    admin: req.user?._id,
    url_path: uploadFile.secure_url,
    publicId: uploadFile.public_id,
    contentType: uploadFile.resource_type,
    mimeType: req.file.mimetype,
    folder: "gallery",
  });

  return res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        { data: gallery },
        "File uploaded successfully",
      ),
    );
});

export const fetchShringar = asyncHandler(async (req, res) => {
  const shringar = await Content.find({ folder: "shringar" }).lean();
  if(!shringar) throw new ApiError(HTTP_STATUS.NO_CONTENT, "No shringar exists");

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.NO_CONTENT, {data: shringar}, "shringar fetched succesfully"));
});

export const fetchGallery = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  const [galleryImages, totalItems] = await Promise.all([
    Content.find({ folder: "gallery" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Content.countDocuments({ folder: "gallery" }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      {
        images: galleryImages,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      galleryImages.length
        ? "Images successfully retrieved"
        : "No images found",
    ),
  );
});

export const deleteImageFromGallery = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const image = await Content.findById(id);

  if (!image) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Image not found"
    );
  }

  await deleteFromCloudinary(image.publicId);

  await image.deleteOne();

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      null,
      "Image deleted successfully"
    )
  );
});





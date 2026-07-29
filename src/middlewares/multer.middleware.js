import multer from "multer";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.constants.js";

const storage = multer.memoryStorage();

const allowedTypes = ["image", "video", "audio"];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.some((type) => file.mimetype.startsWith(type))) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
        "Only images and videos are allowed",
      ),
      false,
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

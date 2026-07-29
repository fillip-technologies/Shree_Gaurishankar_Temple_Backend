import multer from "multer";
import { HTTP_STATUS } from "../constants/httpStatus.constants.js";
import ApiError from "../utils/ApiError.js";

// Global error-handling middleware. Must be registered AFTER all routes,
// and must keep all four args so Express recognizes it as an error handler.
export const errorHandler = (err, req, res, next) => {
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errors = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof multer.MulterError) {
    // e.g. LIMIT_FILE_SIZE when the upload exceeds the configured limit
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = err.message;
  } else if (err?.name === "ValidationError") {
    // Mongoose schema validation failure
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    message = err.message;
    errors = Object.values(err.errors || {}).map((e) => e.message);
  } else if (err?.message) {
    message = err.message;
  }

  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors,
  });
};
